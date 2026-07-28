/**
 * Kononenko's two shaders, adapted from the verbatim extraction at
 * /private/tmp/.../scratchpad/kononenko/{media,sketch}.frag.glsl into THREE
 * ShaderMaterial form. The math is untouched — every constant, every line
 * of logic is the same; only the GLSL is reformatted for readability and a
 * standard THREE vertex shader (position/uv passthrough) is added, since the
 * reference only shipped fragment shaders (its own vertex stage is Nuxt/
 * webgl-boilerplate we don't have source for, and a plain orthographic
 * pass-through is all a flat image plane needs).
 */

export const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/* ── cV — MediaImg shader: cover-fit, in-plane scroll parallax, shader
   borders, edge feather. Every real photograph on the page. ───────────── */
export const MEDIA_FRAG = /* glsl */ `
precision highp float;
precision mediump sampler2D;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uParallax;
uniform float uStrength;
uniform float uContain;
uniform float uZoom;
uniform vec3 uBgColor;
uniform float uBgOpacity;
uniform vec3 uBorderColor;
uniform float uBorderPx;
uniform float uPaddingPx;
uniform float uOpacity;

varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 containerSize, vec2 imageSize, float contain) {
  float containerAspect = containerSize.x / containerSize.y;
  float imageAspect = imageSize.x / imageSize.y;
  vec2 scale = vec2(1.0);
  bool wider = containerAspect > imageAspect;
  if (wider != (contain > 0.5)) {
    scale.y = imageAspect / containerAspect;
  } else {
    scale.x = containerAspect / imageAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

float edgeFeather(vec2 vUv) {
  vec2 fw = fwidth(vUv);
  vec2 edge = smoothstep(vec2(0.0), fw, vUv) * smoothstep(vec2(0.0), fw, 1.0 - vUv);
  return edge.x * edge.y;
}

void main() {
  if (uOpacity <= 0.001 && uBgOpacity <= 0.001) discard;

  float edgeAlpha = edgeFeather(vUv);
  float insetPx = uBorderPx + uPaddingPx;
  vec2 insetUv = vec2(insetPx) / uResolution;
  vec2 contentUv = clamp((vUv - insetUv) / (1.0 - 2.0 * insetUv), 0.0, 1.0);
  vec2 contentSize = uResolution * max(1.0 - 2.0 * insetUv, vec2(0.001));

  vec2 uv = coverUv(contentUv, contentSize, uImageSize, uContain);
  uv = (uv - 0.5) / uZoom + 0.5;
  uv = (uv - 0.5) * (1.0 - uStrength) + 0.5;
  uv += (uParallax - 0.5) * uStrength;

  vec4 content;
  if (uContain > 0.5 && (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)) {
    content = vec4(uBgColor, uBgOpacity);
  } else {
    vec4 texColor = texture2D(uTexture, uv);
    content = vec4(texColor.rgb, texColor.a * uOpacity);
  }

  if (insetPx <= 0.0) {
    gl_FragColor = vec4(content.rgb, content.a * edgeAlpha);
    return;
  }

  vec2 distPx = min(vUv, 1.0 - vUv) * uResolution;
  float edgePx = min(distPx.x, distPx.y);
  float aa = max(fwidth(edgePx), 1e-4) * 0.5;
  float bandB = uBorderPx > 0.0 ? 1.0 - smoothstep(uBorderPx - aa, uBorderPx + aa, edgePx) : 0.0;
  float bandC = smoothstep(insetPx - aa, insetPx + aa, edgePx);
  float bandP = max(0.0, 1.0 - bandB - bandC);
  float alpha = uBgOpacity * (bandB + bandP) + content.a * bandC;
  if (alpha <= 0.001) discard;
  vec3 rgb = ((uBorderColor * bandB + uBgColor * bandP) * uBgOpacity + content.rgb * content.a * bandC) / alpha;
  gl_FragColor = vec4(rgb, alpha * edgeAlpha);
}
`

/* ── uV — the ink-sketch develop shader: luminance-ordered, blue-noise
   modulated bottom-up sweep, hover lens with settle gating. Every Tölvumynd
   render on the page. ───────────────────────────────────────────────────── */
export const SKETCH_FRAG = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uTexture;
uniform sampler2D uNoiseTex;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uProgress;
uniform float uSoftness;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uHover;
uniform float uCircleRadius;
uniform float uCircleSoftness;
uniform float uExpandRadius;

varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 containerSize, vec2 imageSize, float contain) {
  float containerAspect = containerSize.x / containerSize.y;
  float imageAspect = imageSize.x / imageSize.y;
  vec2 scale = vec2(1.0);
  bool wider = containerAspect > imageAspect;
  if (wider != (contain > 0.5)) {
    scale.y = imageAspect / containerAspect;
  } else {
    scale.x = containerAspect / imageAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

float edgeFeather(vec2 vUv) {
  vec2 fw = fwidth(vUv);
  vec2 edge = smoothstep(vec2(0.0), fw, vUv) * smoothstep(vec2(0.0), fw, 1.0 - vUv);
  return edge.x * edge.y;
}

void main() {
  float edgeAlpha = edgeFeather(vUv);
  vec2 uv = coverUv(vUv, uResolution, uImageSize, 0.0);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { discard; }

  vec4 texColor = texture2D(uTexture, uv);
  float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  float ink = 1.0 - lum;

  vec3 bn = texture2D(uNoiseTex, vUv).rgb;
  float n = bn.r * 0.5 - 0.25;
  float sweep = (1.0 - uv.y) * 0.55;
  float progress = uProgress * 1.5;
  float threshold = (1.0 - progress) + n + sweep;
  float soft = uSoftness * (0.7 + 0.6 * bn.g);
  float mask = smoothstep(threshold, threshold + soft, ink);
  vec3 sketchColor = mix(vec3(1.0), texColor.rgb, mask);

  float aspect = uResolution.x / uResolution.y;
  vec2 diff = vUv - uMouse;
  diff.x *= aspect;
  float dist = length(diff);
  float edgeNoise = bn.b * 0.02;
  float expand = 1.0 - smoothstep(uExpandRadius - 0.12 + edgeNoise, uExpandRadius + edgeNoise, dist);
  float circle = 1.0 - smoothstep(uCircleRadius - uCircleSoftness + edgeNoise, uCircleRadius + edgeNoise, dist);
  float settled = smoothstep(0.95, 1.0, expand) + smoothstep(0.05, 0.0, expand);
  circle *= uHover * min(settled, 1.0);

  vec3 baseColor = mix(sketchColor, texColor.rgb, expand);
  vec3 peekColor = mix(texColor.rgb, sketchColor, expand);
  vec3 color = mix(baseColor, peekColor, circle);

  gl_FragColor = vec4(color, uOpacity * edgeAlpha);
}
`
