# -*- coding: utf-8 -*-
import re, sys, json
P='src/preview/katrinisfeld/projects.ts'

def load():
    return open(P, encoding='utf-8').read()

def blocks(s):
    """yield (start, end, slug) for each object in the PROJECTS array"""
    out = []
    for m in re.finditer(r"^  \{\n    slug: '([^']+)',\n", s, re.M):
        start = m.start()
        depth = 0; i = start
        while True:
            c = s[i]
            if c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = s.index('\n', i) + 1
                    break
            i += 1
        out.append((start, end, m.group(1)))
    return out

def set_field(slug, field, new_text):
    s = load()
    for start, end, sl in blocks(s):
        if sl != slug: continue
        body = s[start:end]
        pat = re.compile(r"^    " + field + r": \[.*?^    \],\n", re.M | re.S)
        m = pat.search(body)
        if not m:
            pat = re.compile(r"^    " + field + r": \[[^\n]*\],\n", re.M)
            m = pat.search(body)
        assert m, 'field %s in %s' % (field, slug)
        body = body[:m.start()] + new_text + body[m.end():]
        open(P, 'w', encoding='utf-8').write(s[:start] + body + s[end:])
        return
    raise AssertionError('no slug ' + slug)

def add_field(slug, line):
    s = load()
    for start, end, sl in blocks(s):
        if sl != slug: continue
        body = s[start:end]
        if line.split(':')[0].strip() + ':' in body: return
        body = body[:body.rindex('  },')] + line + body[body.rindex('  },'):]
        open(P, 'w', encoding='utf-8').write(s[:start] + body + s[end:])
        return
    raise AssertionError('no slug ' + slug)

if __name__ == '__main__':
    data = json.load(open(sys.argv[1], encoding='utf-8'))
    for slug, lines in data.get('photos', {}).items():
        set_field(slug, 'photos', "    photos: [\n" + "".join("      %s\n" % l for l in lines) + "    ],\n")
    for slug, who in data.get('credits', {}).items():
        add_field(slug, "    credit: '%s',\n" % who)
    print('applied photos:%d credits:%d' % (len(data.get('photos', {})), len(data.get('credits', {}))))
