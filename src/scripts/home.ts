/*
  Home page orchestration. One clock (gsap.ticker) drives Lenis, ScrollTrigger and the WebGL render.

  Progressive enhancement:
    - Without JS the page is complete HTML.
    - Without WebGL the canvas is hidden; every interaction still works on the HTML.
    - With prefers-reduced-motion: no smooth scroll, no pinning, no intro, no drift; the scene
      snaps to each chapter's shape instead of morphing.
*/
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { ShapeName } from './universe';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 760px)').matches;
const desktop = matchMedia('(min-width: 961px)').matches;

// per-chapter framing of the field: horizontal offset, vertical offset, camera distance, brightness
type Frame = { x: number; y: number; z: number; dim: number };
const FRAMES: Record<ShapeName, Frame> = small
  ? { galaxy: { x: 0, y: 1.2, z: 13, dim: .8 }, core: { x: 0, y: 1.6, z: 11, dim: .55 }, helix: { x: 0, y: 2.8, z: 12, dim: .55 }, clusters: { x: 0, y: 2.5, z: 14, dim: .6 }, plane: { x: 0, y: 0, z: 8, dim: .3 }, career: { x: 0, y: 0, z: 13, dim: .35 }, converge: { x: 0, y: 1.8, z: 8, dim: 1 } }
  : { galaxy: { x: 2.4, y: .4, z: 8.5, dim: 1 }, core: { x: 2.8, y: 0, z: 8, dim: .85 }, helix: { x: 0, y: 1.9, z: 8, dim: .7 }, clusters: { x: 2.1, y: -.1, z: 10, dim: .95 }, plane: { x: 0, y: 0, z: 8, dim: .35 }, career: { x: .4, y: 2.9, z: 11, dim: .6 }, converge: { x: 0, y: 1.6, z: 8, dim: 1.15 } };

export function initHome() {
  /* ---------- smooth scroll ---------- */
  let lenis: Lenis | null = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

  /* hero entrance: pure CSS (see index.astro), so the name paints before any JS runs */

  /* ---------- journey: pinned horizontal track on desktop ---------- */
  const journey = document.querySelector<HTMLElement>('#journey');
  const track = journey?.querySelector<HTMLElement>('.journey-track');
  const bar = journey?.querySelector<HTMLElement>('.journey-progress span');
  let journeyProgress = 0;
  if (journey && track && desktop && !reduce) {
    document.documentElement.classList.add('journey-h');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: journey, pin: journey.querySelector('.journey-pin'), start: 'top top', end: () => `+=${distance()}`,
        scrub: true, invalidateOnRefresh: true,
        onUpdate: (st) => { journeyProgress = st.progress; if (bar) bar.style.transform = `scaleX(${st.progress})`; },
      },
    });
  }

  /* ---------- projects: wipe in once ---------- */
  const pio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); pio.unobserve(e.target); } }), { threshold: 0.25 });
  document.querySelectorAll('[data-project]').forEach((el) => pio.observe(el));

  /* ---------- technical universe: domain selection ---------- */
  let focus = 0;
  const domainButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-domain]')];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')];
  const labels = [...document.querySelectorAll<HTMLButtonElement>('[data-label]')];
  const selectDomain = (i: number) => {
    focus = i;
    domainButtons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    cards.forEach((c, k) => (c.hidden = k !== i));
    labels.forEach((l, k) => l.classList.toggle('on', k === i));
  };
  domainButtons.forEach((b, i) => {
    b.addEventListener('click', () => selectDomain(i));
    b.addEventListener('mouseenter', () => selectDomain(i));
    b.addEventListener('focus', () => selectDomain(i));
  });
  labels.forEach((l, i) => l.addEventListener('click', () => { selectDomain(i); domainButtons[i]?.focus({ preventScroll: true }); }));

  /* ---------- AI: step through the agentic workflow ---------- */
  const steps = [...document.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const details = [...document.querySelectorAll<HTMLElement>('[data-detail]')];
  let step = 0;
  const setStep = (i: number) => {
    step = (i + steps.length) % steps.length;
    steps.forEach((s, k) => s.setAttribute('aria-pressed', String(k === step)));
    details.forEach((d, k) => (d.hidden = k !== step));
  };
  steps.forEach((s, i) => s.addEventListener('click', () => setStep(i)));
  document.querySelector('[data-next]')?.addEventListener('click', () => setStep(step + 1));

  /* ---------- the WebGL field ---------- */
  const canvas = document.getElementById('universe') as HTMLCanvasElement | null;
  if (!canvas) return;
  // three.js needs WebGL2; probe on a throwaway canvas so the real one stays unclaimed
  const gl = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
  if (!gl) { document.documentElement.classList.add('no-webgl'); return; }

  // start the field once the page has painted and the main thread is free
  const whenIdle = (fn: () => void) => {
    const go = () => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
    document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
  };
  whenIdle(() => import('./universe').then(({ createUniverse }) => {
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const count = small ? 11000 : lowPower ? 20000 : 32000;
    let u: ReturnType<typeof createUniverse>;
    try { u = createUniverse(canvas, { count, small, reduce }); }
    catch { document.documentElement.classList.add('no-webgl'); return; }

    const sections = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
    const shapesOf = sections.map((s) => s.dataset.scene as ShapeName);
    // Each section holds its shape while it fills the viewport (a pinned or very tall section holds
    // for its whole length), and morphs to the next shape in the gap between holds.
    let holdStart: number[] = [], holdEnd: number[] = [];
    const measure = () => {
      const vh = window.innerHeight;
      holdStart = []; holdEnd = [];
      sections.forEach((s) => {
        const r = s.getBoundingClientRect(), top = r.top + scrollY(), h = r.height;
        const start = top + Math.min(h, vh) / 2 - vh / 2;
        holdStart.push(start);
        holdEnd.push(Math.max(start, top + h - vh / 2 - Math.min(h, vh) / 2));
      });
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    addEventListener('resize', () => { u.resize(); measure(); });
    addEventListener('load', measure);

    const chapterAt = (y: number) => {
      const n = sections.length;
      for (let i = 0; i < n; i++) {
        if (y <= holdEnd[i]) return i === 0 || y >= holdStart[i] ? i : i - 1 + (y - holdEnd[i - 1]) / Math.max(1, holdStart[i] - holdEnd[i - 1]);
      }
      return n - 1;
    };

    // pointer: repel particles and tilt the field slightly
    const ptr = { x: 0, y: 0, active: 0 };
    if (!reduce) addEventListener('pointermove', (e) => { ptr.x = e.clientX / innerWidth - 0.5; ptr.y = e.clientY / innerHeight - 0.5; ptr.active = 1; u.setPointer(e.clientX, e.clientY); }, { passive: true });

    const labelsLayer = document.querySelector<HTMLElement>('.cluster-labels');
    const clustersIdx = shapesOf.indexOf('clusters');
    const helixIdx = shapesOf.indexOf('helix');
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const frameAt = (c: number) => {
      const i = Math.floor(c), t = c - i, a = FRAMES[shapesOf[i]], b = FRAMES[shapesOf[Math.min(i + 1, shapesOf.length - 1)]];
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t), dim: lerp(a.dim, b.dim, t) };
    };

    const state = { mix: 0, x: FRAMES.galaxy.x, y: FRAMES.galaxy.y, z: FRAMES.galaxy.z, dim: FRAMES.galaxy.dim, focusAmt: 0, rotY: 0 };
    let visible = !document.hidden, last = performance.now();
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; last = performance.now(); });

    if (!reduce) gsap.to(u.uniforms.uIntro, { value: 1, duration: 2.2, ease: 'expo.out', delay: 0.1 });

    gsap.ticker.add((time) => {
      if (!visible) return;
      const now = performance.now(), dt = now - last; last = now;
      const c = chapterAt(scrollY());
      const i = Math.min(Math.floor(c), shapesOf.length - 1);
      const j = Math.min(i + 1, shapesOf.length - 1);
      u.setPair(shapesOf[i], shapesOf[j]);
      const frac = i === j ? 0 : c - i;
      const k = reduce ? 1 : 0.14;
      state.mix = reduce ? Math.round(frac) : lerp(state.mix, frac, k);
      // a swap resets the pair; never blend backwards past it
      if (Math.abs(state.mix - frac) > 0.6) state.mix = frac;
      const f = frameAt(c);
      state.x = lerp(state.x, f.x, k); state.y = lerp(state.y, f.y, k); state.z = lerp(state.z, f.z, k); state.dim = lerp(state.dim, f.dim, k);

      // the helix slides so the active career stage sits under the visible card
      const wHelix = helixIdx < 0 ? 0 : Math.max(0, 1 - Math.abs(c - helixIdx));
      const helixShift = desktop && !reduce ? (0.5 - journeyProgress) * 11 * wHelix : 0;

      // focus glow only while the clusters chapter is on screen
      const wClusters = clustersIdx < 0 ? 0 : Math.max(0, 1 - Math.abs(c - clustersIdx) * 1.4);
      state.focusAmt = lerp(state.focusAmt, wClusters > 0.4 ? 1 : 0, 0.08);

      const un = u.uniforms;
      un.uMix.value = state.mix; un.uDim.value = state.dim;
      un.uFocus.value = focus; un.uFocusAmt.value = state.focusAmt;
      un.uTime.value = reduce ? 0 : time;
      un.uRepel.value = reduce ? 0 : lerp(un.uRepel.value, ptr.active * (1 - wClusters * 0.7), 0.06);

      u.points.position.set(state.x + helixShift, state.y, 0);
      if (!reduce) {
        // only the galaxy and core spin; later chapters settle back to face the viewer
        const wSpin = Math.min(1, Math.max(0, 1.6 - c));
        state.rotY += dt * 0.00004 * wSpin;
        const base = state.rotY - Math.round(state.rotY / 6.2832) * 6.2832;
        u.points.rotation.y = lerp(u.points.rotation.y, base * wSpin + ptr.x * 0.35 * (1 - wHelix) * (0.3 + 0.7 * wSpin), 0.05);
        u.points.rotation.x = lerp(u.points.rotation.x, ptr.y * 0.2, 0.05);
      }
      u.camera.position.z = state.z;
      u.points.updateMatrixWorld();

      // floating cluster labels follow the projected cluster centres
      if (labelsLayer && desktop) {
        labelsLayer.style.opacity = String(wClusters > 0.35 ? Math.min(1, (wClusters - 0.35) * 2.5) : 0);
        labelsLayer.style.pointerEvents = 'none';
        labels.forEach((l) => (l.style.pointerEvents = wClusters > 0.8 ? 'auto' : 'none'));
        if (wClusters > 0.2) u.projectCentres().forEach((p, n) => { if (labels[n]) labels[n].style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -150%)`; });
      }
      u.render(dt);
    });
  }));
}
