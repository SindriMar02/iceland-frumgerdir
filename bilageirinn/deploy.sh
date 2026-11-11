#!/usr/bin/env bash
# Bílageirinn on True Line → https://sindrimar02.github.io/bilageirinn-preview/ (noindex, robots Disallow).
# Builds the standalone multi-page site with the deploy base, gates it, pushes it as the next gh-pages commit.
# NO_PUSH=1 builds and gates in a temp dir, then stops.
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=bilageirinn-preview
BASE="/$REPO/"
BG_BASE="$BASE" npx vite build -c vite.bilageirinn.config.ts >/dev/null
OUT="$(mktemp -d)/site"; mkdir -p "$OUT"; cp -R dist-bilageirinn/. "$OUT/"
cp "$OUT/404/index.html" "$OUT/404.html"
printf 'User-agent: *\nDisallow: /\n' > "$OUT/robots.txt"; : > "$OUT/.nojekyll"

# GATE 1: every page noindex
while IFS= read -r f; do grep -q 'name="robots" content="noindex' "$f" || { echo "GATE 1 noindex missing: $f"; exit 1; }; done < <(find "$OUT" -name '*.html')

# GATE 2: every local src/href/url() resolves inside the staged tree (paths carry the base)
python3 -I - "$OUT" "$BASE" <<'PY'
import sys,re,pathlib,urllib.parse
out=pathlib.Path(sys.argv[1]);base=sys.argv[2];miss=[]
for f in out.rglob('*'):
    if f.suffix not in ('.html','.css'): continue
    t=f.read_text(errors='ignore')
    for u in re.findall(r'(?:src|href)="([^"]+)"',t)+re.findall(r'url\(["\']?([^)"\']+)',t):
        if re.match(r'^(https?:|mailto:|tel:|data:|#|//|javascript:)',u): continue
        p=urllib.parse.unquote(u).split('#')[0].split('?')[0]
        if not p: continue
        if p.startswith(base): t2=out/p[len(base):]
        elif p.startswith('/'): miss.append(f'{f.relative_to(out)}: {u} (outside base)'); continue
        else: t2=f.parent/p
        t2=t2.resolve()
        if not (t2.exists() or (t2/'index.html').exists()): miss.append(f'{f.relative_to(out)}: {u}')
print('GATE 2 missing:',len(miss)); [print(' ',m) for m in sorted(set(miss))[:30]]
sys.exit(1 if miss else 0)
PY

# GATE 3: favicons on every page
node ../_tools/favicon-guard.mjs --base="$BASE" "$OUT" || { echo "GATE 3 favicon"; exit 1; }

if [ -n "${NO_PUSH:-}" ]; then echo "staged -> $OUT (not pushed)"; exit 0; fi

GD="$(mktemp -d)"; GITDIR="$GD/.git"; REMOTE="https://github.com/SindriMar02/$REPO.git"
git init -q "$GD"
G() { git --git-dir="$GITDIR" --work-tree="$OUT" "$@"; }
if G fetch -q --depth 1 "$REMOTE" gh-pages 2>/dev/null; then G reset -q --soft FETCH_HEAD; fi
G add -A
G -c user.name=SindriMar02 -c user.email=sindrimar02@gmail.com commit -q -m "Deploy True Line build $(git rev-parse --short HEAD) (noindex preview)" || echo "nothing to commit"
G push -q "$REMOTE" HEAD:refs/heads/gh-pages
echo "pushed gh-pages -> https://sindrimar02.github.io/$REPO/"
node ../_tools/favicon-verify-live.mjs "https://sindrimar02.github.io/$REPO/" || true
