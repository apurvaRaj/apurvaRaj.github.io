---
name: immersive-webgl-site
description: Build scroll-driven 3D/WebGL websites in the style of igloo.inc, hatom.com, blueyard.com, unseen.co and mont-fort.com, using Three.js, Lenis and GSAP. Use when asked for an immersive, 3D, WebGL, particle or "Awwwards-style" site or hero.
---

# Immersive WebGL websites

How award-winning immersive sites are built, and a tested starter to build one. Use this for the 3D layer and scroll choreography; use a design skill (frontend-design, taste-skill, apple-design, emil-design-eng) for typography, colour and copy.

## What these sites have in common

| Site | Studio | Stack | Signature technique |
|---|---|---|---|
| igloo.inc | Abeto | Three.js, three-mesh-bvh, Svelte, GSAP, Vite | Volume data and a fluid simulation; scroll moves through one 3D world |
| hatom.com | Immersive Garden | Three.js, Blender, GSAP, Lenis | Five scroll stages telling one story (egg, griffin, planets), voiceover and sound |
| blueyard.com | Unseen | Three.js | A 30,000-particle nebula; clusters stand for investment areas |
| unseen.co | Unseen | Three.js, troika-three-text, KTX2, DRACO | Each page is its own Three.js Scene; transitions between scenes |
| mont-fort.com | — | Astro, Three.js (WebGL2), Lenis | Static site with WebGL canvases behind chaptered content |

The shared recipe:

1. **One fixed, full-screen canvas** behind the page. Real HTML text scrolls over it (readable, selectable, indexable, accessible).
2. **Smooth scroll (Lenis)** turns wheel steps into a continuous scroll value.
3. **Scroll drives the scene.** The page is split into chapters (sections); scroll position becomes a float like `2.4` = 40% of the way from chapter 2 to chapter 3. The scene interpolates camera, shapes and colour on that float.
4. **GSAP** times DOM text reveals (ScrollTrigger) and shares one clock with Lenis and the renderer.
5. **Shaders do the heavy lifting**: particles, morphs, noise, colour. Geometry is cheap; per-pixel work is the budget.
6. **Assets** (when not procedural) are modelled in Blender, exported as glTF with DRACO meshes and KTX2 textures.

## First decide the story, then the scene

Before code, write the chapter table. Each chapter = one section of real content + one state of the scene. The scene must say something about the content; a decorative blob is the generic version.

| Chapter | Content (HTML) | Scene state |
|---|---|---|
| 1 | Who / what | e.g. a price surface |
| 2 | Proof point | e.g. a grid of data |
| … | … | … |

Rules: 3–6 chapters; one idea per chapter; the scene state should be recognisable in a still frame; the last chapter resolves (calm, centred, a call to action).

## Choose the technique by budget

| Technique | Effort | Use when |
|---|---|---|
| Particle morph (starter below) | Hours | Story can be told as shapes: surfaces, grids, networks, globes, numbers, logos sampled from SVG/text |
| Full-screen fragment shader (noise, fields, gradients) | Hours | Atmosphere more than objects |
| glTF models + camera path | Days | A hero object or a place (product, mascot, room). Needs Blender assets |
| GPGPU particles / fluid sim (igloo, BlueYard scale) | Weeks | Studio-level budget; ping-pong render targets, three-mesh-bvh for collisions |

Default to particle morph. Escalate only if the user supplies models or asks for it.

## Starter (tested)

Two files: `index.html` and `scene.js`. In the repo copy of this skill they are in `template/`. Pinned versions: three 0.187.0, lenis 1.3.27, gsap 3.15.1 (jsDelivr ESM). Bump versions deliberately and re-test; never use `@latest`.

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Scroll scene starter</title>
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js",
  "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.mjs",
  "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.15.1/index.js",
  "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.15.1/ScrollTrigger.js"
} }
</script>
<style>
  :root{--bg:#0E1116;--ink:#E9ECF1;--mute:#8C95A3}
  *{box-sizing:border-box;margin:0}
  html.lenis,html.lenis body{height:auto}
  .lenis.lenis-smooth{scroll-behavior:auto!important}
  body{background:var(--bg);color:var(--ink);font:400 18px/1.6 system-ui,sans-serif}
  #scene{position:fixed;inset:0;width:100%;height:100%;display:block;z-index:0}
  main{position:relative;z-index:1}
  .chapter{min-height:100svh;display:grid;align-content:end;padding:12vh 6vw}
  .chapter h2{font:700 clamp(2.4rem,7vw,6rem)/.95 system-ui;letter-spacing:-.03em;max-width:12ch}
  .chapter p{max-width:38ch;color:var(--mute);margin-top:16px}
  .no-webgl #scene{display:none}
  .no-webgl body{background:radial-gradient(60% 60% at 70% 40%,#1b2433,var(--bg))}
  @media (prefers-reduced-motion:no-preference){ .chapter .line{opacity:0;transform:translateY(24px)} }
</style>
</head>
<body>
<canvas id="scene" aria-hidden="true"></canvas>
<main>
  <section class="chapter" data-shape="surface"><h2 class="line">A surface of prices</h2><p class="line">Chapter one.</p></section>
  <section class="chapter" data-shape="grid"><h2 class="line">Thirty years, in rows</h2><p class="line">Chapter two.</p></section>
  <section class="chapter" data-shape="network"><h2 class="line">Agents, connected</h2><p class="line">Chapter three.</p></section>
  <section class="chapter" data-shape="globe"><h2 class="line">One record, 130 countries</h2><p class="line">Chapter four.</p></section>
</main>
<script type="module" src="scene.js"></script>
</body>
</html>
```

`scene.js`:

```js
import * as THREE from 'three';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 760px)').matches;
const COUNT = small ? 9000 : 28000;           // performance tier
const canvas = document.getElementById('scene');

// 1. capability check and fallback
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); }
catch (e) { document.documentElement.classList.add('no-webgl'); }

// 2. smooth scroll on GSAP's clock
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// 3. DOM choreography: text lines rise as each chapter enters
if (!reduce) document.querySelectorAll('.chapter').forEach(sec => {
  gsap.to(sec.querySelectorAll('.line'), { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: sec, start: 'top 70%' } });
});

if (renderer) {
  renderer.setClearColor(getComputedStyle(document.body).backgroundColor);  // match the page, not black
  // 4. shapes: one Float32Array of xyz per chapter, same COUNT, seeded
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  const shapes = {
    surface() { const u = rnd() * 2 - 1, v = rnd() * 2 - 1;
      return [u * 3.2, Math.sin(u * 3.1) * .35 + Math.cos(v * 2.3 + u) * .3, v * 2.2]; },
    grid(i) { const c = 160, x = i % c, y = Math.floor(i / c) % 60;
      return [(x / c - .5) * 6, (y / 60 - .5) * 3.2, (rnd() - .5) * .08]; },
    network(i) { const hubs = 24, h = i % hubs, a = h * 2.39996, r = 1.8 * Math.sqrt((h + .5) / hubs);
      const hx = Math.cos(a) * r, hy = Math.sin(a) * r * .7, t = rnd(), k = (h * 7 + 3) % hubs, b = k * 2.39996, rk = 1.8 * Math.sqrt((k + .5) / hubs);
      return rnd() < .45 ? [hx + (rnd() - .5) * .12, hy + (rnd() - .5) * .12, (rnd() - .5) * .3]
                         : [hx + (Math.cos(b) * rk - hx) * t, hy + (Math.sin(b) * rk * .7 - hy) * t, 0]; },
    globe(i) { const y = 1 - (i / (COUNT - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      return [Math.cos(th) * r * 1.7, y * 1.7, Math.sin(th) * r * 1.7]; },
  };
  const sections = [...document.querySelectorAll('[data-shape]')];
  const targets = sections.map(s => { const f = shapes[s.dataset.shape], a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) a.set(f(i), i * 3); return a; });

  // 5. geometry holds two shapes; the shader blends them with a per-particle stagger
  const geo = new THREE.BufferGeometry();
  const posA = new THREE.BufferAttribute(targets[0].slice(), 3), posB = new THREE.BufferAttribute(targets[Math.min(1, targets.length - 1)].slice(), 3);
  geo.setAttribute('position', posA); geo.setAttribute('aTo', posB);
  const seed = new Float32Array(COUNT); for (let i = 0; i < COUNT; i++) seed[i] = rnd();
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uMix: { value: 0 }, uTime: { value: 0 }, uSize: { value: small ? 2.8 : 2.4 },
      uPR: { value: 1 }, uA: { value: new THREE.Color('#4C7DFF') }, uB: { value: new THREE.Color('#F2BE22') } },
    vertexShader: /* glsl */`
      attribute vec3 aTo; attribute float aSeed;
      uniform float uMix, uTime, uSize, uPR; varying float vS;
      void main(){
        float d = aSeed * .35;
        float m = smoothstep(d, d + .65, uMix);
        vec3 p = mix(position, aTo, m);
        p += .03 * vec3(sin(uTime*.6 + aSeed*40.), cos(uTime*.5 + aSeed*30.), 0.);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = uSize * uPR * (6. / -mv.z);
        gl_Position = projectionMatrix * mv; vS = aSeed;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uA, uB; varying float vS;
      void main(){ vec2 c = gl_PointCoord - .5; float r = length(c);
        if (r > .5) discard;
        gl_FragColor = vec4(mix(uA, uB, step(.93, vS)), (1. - r * 2.) * .95); }`,
  });
  const points = new THREE.Points(geo, mat);
  const scene = new THREE.Scene(); scene.add(points);
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 100); camera.position.set(0, 0, 7);

  const size = () => { const dpr = Math.min(devicePixelRatio, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr); renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); mat.uniforms.uPR.value = dpr; };
  size(); addEventListener('resize', size);

  // 6. scroll -> chapter float (0..n-1), measured at section midpoints
  let pair = 0, mix = 0;
  const chapterAt = () => {
    const mid = (lenis ? lenis.scroll : scrollY) + innerHeight * .5;
    for (let i = 0; i < sections.length - 1; i++) {
      const a = sections[i].offsetTop + sections[i].offsetHeight * .5, b = sections[i + 1].offsetTop + sections[i + 1].offsetHeight * .5;
      if (mid < b) return i + Math.max(0, Math.min(1, (mid - a) / (b - a)));
    }
    return sections.length - 1;
  };
  const setPair = i => { if (i === pair) return; mix -= (i - pair); pair = i;  // keep the blend continuous across the swap
    posA.array.set(targets[i]); posB.array.set(targets[Math.min(i + 1, targets.length - 1)]);
    posA.needsUpdate = posB.needsUpdate = true; };

  // 7. loop: pause when hidden; reduced motion snaps per chapter
  let visible = true;
  document.addEventListener('visibilitychange', () => visible = !document.hidden);
  const pointer = { x: 0, y: 0 };
  addEventListener('pointermove', e => { pointer.x = e.clientX / innerWidth - .5; pointer.y = e.clientY / innerHeight - .5; });
  gsap.ticker.add(t => {
    if (!visible) return;
    const c = chapterAt();
    setPair(Math.max(0, Math.min(Math.floor(c), sections.length - 2)));
    const target = reduce ? Math.round(c - pair) : c - pair;
    mix += (target - mix) * (reduce ? 1 : .12);
    mat.uniforms.uMix.value = mix; mat.uniforms.uTime.value = reduce ? 0 : t;
    points.rotation.y += reduce ? 0 : ((pointer.x * .5) - points.rotation.y) * .04 + .0008;
    points.rotation.x += reduce ? 0 : ((pointer.y * .3) - points.rotation.x) * .04;
    renderer.render(scene, camera);
  });
}
```

To adapt it: add a shape function per chapter (any `(i) => [x, y, z]`; sample text or an SVG logo by drawing it to an offscreen 2D canvas and picking filled pixels), set the colours, and replace the copy. Keep every shape the same `COUNT`.

## Rules that separate good from janky

**Architecture**
- Text stays in HTML, never only in WebGL. The canvas is `aria-hidden="true"`.
- One renderer, one canvas, one clock (`gsap.ticker`). Don't run separate `requestAnimationFrame` loops for Lenis, GSAP and Three.
- Wire Lenis exactly: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
- Precompute shape targets once. Per frame, only update uniforms; swap attribute buffers only at chapter boundaries.
- When swapping the A/B pair, shift the blend value by the same amount so nothing jumps (`mix -= newPair - oldPair`).

**Performance budget**
- Cap device pixel ratio: 2 on desktop, 1.5 on phones. `antialias: false` for particle scenes.
- Particles: ~25–35k desktop, ~8–12k phone. Fragment cost scales with point size × count; keep points small.
- `depthWrite: false` with additive blending; watch for white blow-out where particles overlap (lower alpha or count).
- Pause rendering when the tab is hidden or the canvas is off-screen (IntersectionObserver).
- Drop resolution if frames exceed ~40 ms for a few frames in a row.
- glTF: DRACO for meshes, KTX2/Basis for textures, one hero model under ~2 MB. Lazy-load anything below the first chapter.
- Load three.js as an ES module; in a bundled project, import only what you use.

**Accessibility and fallbacks**
- `prefers-reduced-motion: reduce`: no smooth scroll, no idle drift, shapes snap per chapter (or show one still frame). Text reveals are off.
- No WebGL: add a class, hide the canvas, show a static background. The page must read fully without the scene.
- Keep text contrast at 4.5:1 over the brightest part of the scene; place copy where the scene is quiet, or add a scrim.
- Never hijack scroll direction or speed beyond Lenis's smoothing; never trap the user in a pinned section without visible progress.
- Sound (Hatom-style) is opt-in, off by default, with a visible toggle.

**Design**
- Spend boldness in the scene; keep type, layout and colour restrained around it.
- The scene must change meaningfully per chapter; if two adjacent states look the same in a still frame, merge the chapters.
- Mobile is a different composition, not a shrunken desktop: fewer particles, closer camera, copy below the scene.

## Testing protocol

1. Serve over HTTP (`python3 -m http.server`); ES modules don't load from `file://`.
2. Headless Chromium with software GL: launch flags `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`.
3. If the sandbox can't reach the CDN, install the same pinned versions with npm and route `https://cdn.jsdelivr.net/npm/<pkg>@<ver>/<path>` to `node_modules/<pkg>/<path>` (Playwright `page.route`).
4. Screenshot at scroll fractions 0, ⅓, ½, ⅔, 1 on desktop (1280×800) and at 0 and 1 on a phone (390×844); also once with `reduced_motion='reduce'`. Wait ~1.5 s after each scroll for the blend to settle.
5. Check: no console errors; each chapter's shape is recognisable; text is readable over the scene; nothing jumps between frames; mobile isn't cropped.

## Deploying

Static hosting is enough (GitHub Pages, Netlify, Vercel). For an import-map site, ship `index.html` + `scene.js`; for anything larger, use Vite and bundle. Add a `.nojekyll` file on GitHub Pages.

## Credits

Technique summaries are from the studios' published case studies (Awwwards: Igloo Inc by Abeto, Hatom by Immersive Garden, Unseen Studio by Unseen; Unseen's BlueYard project page) and from inspecting mont-fort.com in a browser. The starter code is original.
