/*
  The particle universe behind the home page.

  One THREE.Points cloud. Every chapter of the page has a target shape (same particle count);
  the vertex shader blends the current pair of shapes (A → B) with a per-particle stagger,
  so scrolling between two sections morphs one structure into the next.

  Shapes (all seeded, so every visit looks the same):
    galaxy    spiral of light, tilted towards the viewer          (hero)
    core      a sphere of connected nodes: "intelligent systems"   (intro)
    helix     a horizontal helix, one knot per career stage         (journey; camera follows progress)
    clusters  8 skill domains with filaments between neighbours     (technical universe; focusable)
    plane     wide, dim star plane                                  (projects, AI: a quiet backdrop)
    career    a Gantt chart of real roles, bar length = tenure      (experience)
    converge  everything collapses into one point                   (contact)

  Uniforms worth knowing:
    uMix      0..1 blend from shape A to shape B (driven by scroll)
    uIntro    0..1 first-load condense from a scattered shell
    uPointer  world-space cursor; uRepel pushes particles away from it
    uFocus    skill-cluster index to highlight (-1 = none), uFocusAmt its strength
    uDim      chapter brightness
*/
import * as THREE from 'three';

export type ShapeName = 'galaxy' | 'core' | 'helix' | 'clusters' | 'plane' | 'career' | 'converge';
export const GROUPS = 8;

export interface UniverseOptions { count: number; small: boolean; reduce: boolean }

const rng = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = (r: () => number) => { const u = Math.max(1e-6, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * v); };

// Real tenure, used by the "career" shape: [start year, end year]
const ROLES: [number, number][] = [[2013.6, 2018.55], [2018.6, 2019.6], [2019.6, 2021.4], [2021.35, 2025.05], [2025.0, 2026.9]];

function buildShapes(n: number) {
  const s: Record<ShapeName, Float32Array> = {} as any;
  const make = (name: ShapeName, seed: number, f: (i: number, r: () => number) => [number, number, number]) => {
    const r = rng(seed), a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) a.set(f(i, r), i * 3);
    s[name] = a;
  };

  // galaxy: 4 arms, dense core, tilted ~58° so it reads in perspective
  const tilt = -1.0, ct = Math.cos(tilt), st = Math.sin(tilt);
  make('galaxy', 11, (i, r) => {
    let x, y, z;
    if (r() < 0.14) { const rr = Math.pow(r(), 2) * 0.55, th = r() * 6.283, ph = Math.acos(2 * r() - 1);
      x = rr * Math.sin(ph) * Math.cos(th); y = rr * Math.cos(ph) * 0.6; z = rr * Math.sin(ph) * Math.sin(th);
    } else { const arm = i % 4, rr = 0.35 + Math.pow(r(), 1.5) * 4.4, a = arm * 1.5708 + rr * 1.05 + gauss(r) * 0.22 / (0.6 + rr * 0.4);
      x = Math.cos(a) * rr; z = Math.sin(a) * rr; y = gauss(r) * 0.1 * (1.3 - rr / 5); }
    return [x, y * ct - z * st, y * st + z * ct];
  });

  // core: fibonacci sphere shell + arcs between neighbouring nodes + a bright centre
  const V = 48, verts: THREE.Vector3[] = [];
  for (let k = 0; k < V; k++) { const y = 1 - (k / (V - 1)) * 2, rr = Math.sqrt(1 - y * y), th = k * 2.39996; verts.push(new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr)); }
  const nbr = verts.map((v, k) => verts.map((w, j) => [v.distanceTo(w), j] as [number, number]).filter(([, j]) => j !== k).sort((a, b) => a[0] - b[0]).slice(0, 3).map(([, j]) => j));
  make('core', 23, (i, r) => {
    const R = 1.75, t = r();
    if (t < 0.38) { const v = verts[i % V], j = gauss(r) * 0.035; return [v.x * (R + j), v.y * (R + j), v.z * (R + j)]; }
    if (t < 0.85) { const k = i % V, v = verts[k], w = verts[nbr[k][Math.floor(r() * 3)]], u = r(); const p = v.clone().lerp(w, u).normalize().multiplyScalar(R); return [p.x, p.y, p.z]; }
    const rr = Math.pow(r(), 3) * 0.45, th = r() * 6.283, ph = Math.acos(2 * r() - 1);
    return [rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph), rr * Math.sin(ph) * Math.sin(th)];
  });

  // helix: horizontal, 7 turns; 30% of particles gather into 7 knots (career stages)
  make('helix', 37, (i, r) => {
    if (r() < 0.3) { const k = i % 7, t = (k + 0.5) / 7, a = t * 7 * 6.283; const x = -7 + 14 * t;
      return [x + gauss(r) * 0.12, Math.cos(a) * 1.15 + gauss(r) * 0.12, Math.sin(a) * 1.15 + gauss(r) * 0.12]; }
    const t = r(), a = t * 7 * 6.283, rr = 1.15 + gauss(r) * 0.05;
    return [-7 + 14 * t, Math.cos(a) * rr, Math.sin(a) * rr];
  });

  // clusters: 8 domain centres on a tilted ellipse; group = i % 8 (see aGroup)
  const centres = Array.from({ length: GROUPS }, (_, k) => { const a = (k / GROUPS) * 6.283 + 0.35; return [Math.cos(a) * 3.3, Math.sin(a) * 1.85, Math.sin(k * 1.7) * 0.9]; });
  make('clusters', 41, (i, r) => {
    const g = i % GROUPS, c = centres[g];
    if (r() < 0.8) { const sd = 0.32; return [c[0] + gauss(r) * sd, c[1] + gauss(r) * sd, c[2] + gauss(r) * sd]; }
    const d = centres[(g + (r() < 0.5 ? 1 : 3)) % GROUPS], u = r();
    return [c[0] + (d[0] - c[0]) * u + gauss(r) * 0.03, c[1] + (d[1] - c[1]) * u + gauss(r) * 0.03, c[2] + (d[2] - c[2]) * u];
  });

  // plane: wide, shallow starfield
  make('plane', 53, (_, r) => [(r() - 0.5) * 22, (r() - 0.5) * 12, -1.5 - r() * 6]);

  // career: one bar per role, x = calendar time (2013 → 2027), particles shared by tenure
  const total = ROLES.reduce((s, [a, b]) => s + (b - a), 0), X = (yr: number) => -6 + ((yr - 2013.4) / 13.7) * 12;
  make('career', 67, (_, r) => {
    let pick = r() * total, k = 0; while (k < ROLES.length - 1 && pick > ROLES[k][1] - ROLES[k][0]) { pick -= ROLES[k][1] - ROLES[k][0]; k++; }
    const [a, b] = ROLES[k], y = 1.6 - k * 0.8;
    return [X(a + r() * (b - a)), y + gauss(r) * 0.075, gauss(r) * 0.04];
  });

  // converge: one bright point with a faint halo
  make('converge', 79, (_, r) => { const h = r() < 0.12, sd = h ? 0.45 : 0.05; return [gauss(r) * sd, gauss(r) * sd, gauss(r) * sd]; });

  return { shapes: s, centres };
}

export function createUniverse(canvas: HTMLCanvasElement, opts: UniverseOptions) {
  const { count, small, reduce } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor('#06080F');
  const { shapes, centres } = buildShapes(count);

  const geo = new THREE.BufferGeometry();
  const posA = new THREE.BufferAttribute(shapes.galaxy.slice(), 3);
  const posB = new THREE.BufferAttribute(shapes.galaxy.slice(), 3);
  geo.setAttribute('position', posA);
  geo.setAttribute('aTo', posB);
  const seed = new Float32Array(count), group = new Float32Array(count), r = rng(97);
  for (let i = 0; i < count; i++) { seed[i] = r(); group[i] = i % GROUPS; }
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aGroup', new THREE.BufferAttribute(group, 1));

  const uniforms = {
    uMix: { value: 0 }, uIntro: { value: reduce ? 1 : 0 }, uTime: { value: 0 },
    uSize: { value: small ? 2.6 : 2.2 }, uPR: { value: 1 }, uDim: { value: 1 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) }, uRepel: { value: 0 },
    uFocus: { value: -1 }, uFocusAmt: { value: 0 },
    uBlue: { value: new THREE.Color('#5B8CFF') }, uAmber: { value: new THREE.Color('#FFB547') }, uWhite: { value: new THREE.Color('#E8ECF4') },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aTo; attribute float aSeed; attribute float aGroup;
      uniform float uMix, uIntro, uTime, uSize, uPR, uRepel, uFocus, uFocusAmt;
      uniform vec3 uPointer;
      varying float vSeed; varying float vFocus; varying float vDepth;
      vec3 scatter(float s){ float a = s * 91.7, b = s * 47.3; return normalize(vec3(sin(a)*cos(b), cos(a), sin(a)*sin(b))) * (9.0 + 5.0 * fract(s * 13.1)); }
      void main(){
        float d = aSeed * .35;
        float m = smoothstep(d, d + .65, uMix);
        vec3 p = mix(position, aTo, m);
        float intro = smoothstep(aSeed * .5, aSeed * .5 + .5, uIntro);
        p = mix(scatter(aSeed), p, intro);
        p += .025 * vec3(sin(uTime * .5 + aSeed * 40.), cos(uTime * .4 + aSeed * 30.), sin(uTime * .3 + aSeed * 20.));
        vec4 wp = modelMatrix * vec4(p, 1.);
        vec2 dv = wp.xy - uPointer.xy; float f = exp(-dot(dv, dv) * 1.4) * uRepel;
        wp.xy += normalize(dv + 1e-4) * f * .55;
        vec4 mv = viewMatrix * wp;
        vFocus = (abs(aGroup - uFocus) < .5) ? uFocusAmt : 0.;
        gl_PointSize = uSize * uPR * (1. + vFocus * .8) * (6.5 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vSeed = aSeed; vDepth = -mv.z;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBlue, uAmber, uWhite; uniform float uDim;
      varying float vSeed; varying float vFocus; varying float vDepth;
      void main(){
        vec2 c = gl_PointCoord - .5; float r = length(c);
        if (r > .5) discard;
        vec3 col = mix(uBlue, uWhite, step(.985, vSeed));
        col = mix(col, uAmber, max(step(.955, vSeed) * (1. - step(.985, vSeed)), vFocus));
        float a = (1. - r * 2.) * .9 * uDim * (1. + vFocus * .6) * clamp(9. / vDepth, .25, 1.2);
        gl_FragColor = vec4(col, a);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    uniforms.uPR.value = dpr;
  };
  resize();

  // pair swapping keeps the blend continuous (see the immersive-webgl-site skill)
  let pairA: ShapeName = 'galaxy', pairB: ShapeName = 'galaxy';
  const setPair = (a: ShapeName, b: ShapeName) => {
    if (a === pairA && b === pairB) return;
    posA.array.set(shapes[a]); posB.array.set(shapes[b]);
    posA.needsUpdate = posB.needsUpdate = true;
    pairA = a; pairB = b;
  };

  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
  const setPointer = (clientX: number, clientY: number) => {
    const ndc = new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.copy(hit);
  };

  // screen positions of the 8 cluster centres (for HTML labels)
  const v = new THREE.Vector3();
  const projectCentres = () => centres.map((c) => {
    v.set(c[0], c[1], c[2]).applyMatrix4(points.matrixWorld).project(camera);
    return { x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, visible: v.z < 1 };
  });

  // adaptive quality: if frames run long, render fewer pixels
  let slow = 0;
  const render = (dt: number) => {
    if (dt > 34) { if (++slow > 45 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); renderer.setPixelRatio(dpr); uniforms.uPR.value = dpr; slow = 0; } }
    else slow = Math.max(0, slow - 1);
    renderer.render(scene, camera);
  };

  return { renderer, uniforms, points, camera, setPair, setPointer, projectCentres, resize, render, shapes };
}
