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
