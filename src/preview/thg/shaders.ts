/**
 * THG Arkitektar — the two Kononenko-reference shaders, THG's own copy.
 *
 * Extracted verbatim (unminified formatting only; every uniform, every
 * line of math, is unchanged) from kononenkogroup.com's own bundle — see
 * `/Users/sindri/Documents/Website redesign mockups/kononenko-teardown.md`
 * §2 and the raw sources this build was checked against at
 * `.../scratchpad/kononenko/media.frag.glsl` and `.../sketch.frag.glsl`.
 * This file is THG's independent copy (KONONENKO-BRIEF.md: "implement your
 * OWN copy inside src/preview/thg/; zero imports across page folders") —
 * do not import this from any other preview page.
 *
 * The only addition to the extracted GLSL is the `#extension` pragma on
 * each fragment shader (both use `fwidth()`, which is a core builtin under
 * WebGL2/GLSL ES 3.00 but an *optional* WebGL1/GLSL ES 1.00 extension —
 * declaring it keeps the shader correct if a visitor's browser only
 * exposes a WebGL1 context). The vertex shader is new: the two extracted
 * fragments are fragment-only, so a minimal pass-through vertex stage
 * (plain `position`/`uv` attributes, THREE's auto-injected
 * `projectionMatrix`/`modelViewMatrix`) was written to drive them from a
 * THREE.PlaneGeometry.
 */

export const THG_PLANE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/** MediaImg shader — cover-fit, in-plane scroll parallax, shader-drawn hairline border. */
export const THG_MEDIA_FRAG = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
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
vec2 coverUv(vec2 uv,vec2 containerSize,vec2 imageSize,float contain){
  float containerAspect=containerSize.x/containerSize.y;
  float imageAspect=imageSize.x/imageSize.y;
  vec2 scale=vec2(1.0);
  bool wider=containerAspect>imageAspect;
  if(wider!=(contain>0.5)){ scale.y=imageAspect/containerAspect; }
  else{ scale.x=containerAspect/imageAspect; }
  return (uv-0.5)*scale+0.5;
}
float edgeFeather(vec2 vUv){
  vec2 fw=fwidth(vUv);
  vec2 edge=smoothstep(vec2(0.0),fw,vUv)*smoothstep(vec2(0.0),fw,1.0-vUv);
  return edge.x*edge.y;
}
void main(){
  if(uOpacity<=0.001&&uBgOpacity<=0.001) discard;
  float edgeAlpha=edgeFeather(vUv);
  float insetPx=uBorderPx+uPaddingPx;
  vec2 insetUv=vec2(insetPx)/uResolution;
  vec2 contentUv=clamp((vUv-insetUv)/(1.0-2.0*insetUv),0.0,1.0);
  vec2 contentSize=uResolution*max(1.0-2.0*insetUv,vec2(0.001));
  vec2 uv=coverUv(contentUv,contentSize,uImageSize,uContain);
  uv=(uv-0.5)/uZoom+0.5;
  uv=(uv-0.5)*(1.0-uStrength)+0.5;
  uv+=(uParallax-0.5)*uStrength;
  vec4 content;
  if(uContain>0.5&&(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0)){
    content=vec4(uBgColor,uBgOpacity);
  } else {
    vec4 texColor=texture2D(uTexture,uv);
    content=vec4(texColor.rgb,texColor.a*uOpacity);
  }
  if(insetPx<=0.0){
    gl_FragColor=vec4(content.rgb,content.a*edgeAlpha);
    return;
  }
  vec2 distPx=min(vUv,1.0-vUv)*uResolution;
  float edgePx=min(distPx.x,distPx.y);
  float aa=max(fwidth(edgePx),1e-4)*0.5;
  float bandB=uBorderPx>0.0 ? 1.0-smoothstep(uBorderPx-aa,uBorderPx+aa,edgePx) : 0.0;
  float bandC=smoothstep(insetPx-aa,insetPx+aa,edgePx);
  float bandP=max(0.0,1.0-bandB-bandC);
  float alpha=uBgOpacity*(bandB+bandP)+content.a*bandC;
  if(alpha<=0.001) discard;
  vec3 rgb=((uBorderColor*bandB+uBgColor*bandP)*uBgOpacity+content.rgb*content.a*bandC)/alpha;
  gl_FragColor=vec4(rgb,alpha*edgeAlpha);
}
`

/** Sketch-develop shader — ink density from luminance, blue-noise sweep, hover lens. */
export const THG_SKETCH_FRAG = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
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
vec2 coverUv(vec2 uv,vec2 containerSize,vec2 imageSize,float contain){
  float containerAspect=containerSize.x/containerSize.y;
  float imageAspect=imageSize.x/imageSize.y;
  vec2 scale=vec2(1.0);
  bool wider=containerAspect>imageAspect;
  if(wider!=(contain>0.5)){ scale.y=imageAspect/containerAspect; }
  else{ scale.x=containerAspect/imageAspect; }
  return (uv-0.5)*scale+0.5;
}
float edgeFeather(vec2 vUv){
  vec2 fw=fwidth(vUv);
  vec2 edge=smoothstep(vec2(0.0),fw,vUv)*smoothstep(vec2(0.0),fw,1.0-vUv);
  return edge.x*edge.y;
}
void main(){
  float edgeAlpha=edgeFeather(vUv);
  vec2 uv=coverUv(vUv,uResolution,uImageSize,0.0);
  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){ discard; }
  vec4 texColor=texture2D(uTexture,uv);
  float lum=dot(texColor.rgb,vec3(0.299,0.587,0.114));
  float ink=1.0-lum;
  vec3 bn=texture2D(uNoiseTex,vUv).rgb;
  float n=bn.r*0.5-0.25;
  float sweep=(1.0-uv.y)*0.55;
  float progress=uProgress*1.5;
  float threshold=(1.0-progress)+n+sweep;
  float soft=uSoftness*(0.7+0.6*bn.g);
  float mask=smoothstep(threshold,threshold+soft,ink);
  vec3 sketchColor=mix(vec3(1.0),texColor.rgb,mask);
  float aspect=uResolution.x/uResolution.y;
  vec2 diff=vUv-uMouse;
  diff.x*=aspect;
  float dist=length(diff);
  float edgeNoise=bn.b*0.02;
  float expand=1.0-smoothstep(uExpandRadius-0.12+edgeNoise,uExpandRadius+edgeNoise,dist);
  float circle=1.0-smoothstep(uCircleRadius-uCircleSoftness+edgeNoise,uCircleRadius+edgeNoise,dist);
  float settled=smoothstep(0.95,1.0,expand)+smoothstep(0.05,0.0,expand);
  circle*=uHover*min(settled,1.0);
  vec3 baseColor=mix(sketchColor,texColor.rgb,expand);
  vec3 peekColor=mix(texColor.rgb,sketchColor,expand);
  vec3 color=mix(baseColor,peekColor,circle);
  gl_FragColor=vec4(color,uOpacity*edgeAlpha);
}
`
