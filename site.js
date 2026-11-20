/* Apurva Raj — site behaviour
   1. Contour field: a WebGL shader of a moving price surface, with live tuning
   2. Tray: iOS-style bottom sheet with drag, momentum and rubber-banding  */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- field */
  const canvas = document.getElementById('field');
  if (canvas) initField(canvas);

  function initField(cv) {
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { cv.remove(); return; }
    const deriv = gl.getExtension('OES_standard_derivatives');

    const vs = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
    const fs = `${deriv ? '#extension GL_OES_standard_derivatives : enable' : ''}
precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;uniform float S,D,P,F;
uniform vec3 C0,C1,A1,A2,A3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+1.),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;
  vec2 m=(M-.5*R)/R.y;vec2 d=p-m;float k=exp(-dot(d,d)*9.);
  p-=d*k*P;                                   /* pointer pulls the surface */
  float t=T*F;
  vec2 q=p*S+vec2(t*.07,-t*.03);
  float v=fbm(q+fbm(q*.6+t*.05)*.9);          /* domain-warped terrain */
  float c=v*D;float b=floor(c);float fr=fract(c);
  float w=${deriv ? 'fwidth(c)*1.1' : '.02*D'};
  float line=1.-smoothstep(0.,w,min(fr,1.-fr));
  float major=step(.5,fract(b/5.));            /* every fifth band reads heavier */
  vec3 col=C0;
  float mask=smoothstep(.38,.92,uv.x)*smoothstep(-.05,.45,uv.y)*smoothstep(1.,.86,uv.y); /* keep type side quiet */
  float id=mod(b,11.);
  if(id==3.)col=mix(col,A1,mask);
  else if(id==6.)col=mix(col,A2,mask);
  else if(id==9.&&uv.x>.6)col=mix(col,A3,mask*.95);
  col=mix(col,C1,line*(.22+.38*major)*(.45+.55*mask));
  gl_FragColor=vec4(col,1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
    } catch (e) { console.warn(e); cv.remove(); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['R','T','M','S','D','P','F','C0','C1','A1','A2','A3'].forEach(k => U[k] = gl.getUniformLocation(prog, k));

    const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
    const palettes = {
      bauhaus:   { C0:'#ECEEF1', C1:'#141A26', A1:'#1F44D0', A2:'#F2BE22', A3:'#D8341F' },
      ink:       { C0:'#ECEEF1', C1:'#141A26', A1:'#D9DCE2', A2:'#C5CAD3', A3:'#141A26' },
      blueprint: { C0:'#ECEEF1', C1:'#1F44D0', A1:'#C9D3F6', A2:'#9DAEEF', A3:'#1F44D0' },
    };
    const state = { S: 1.6, D: 14, P: .55, F: 1, pal: 'bauhaus' };
    const setPal = name => { state.pal = name; const p = palettes[name];
      Object.keys(p).forEach(k => gl.uniform3fv(U[k], hex(p[k]))); };
    setPal('bauhaus');

    // pointer, eased so the surface follows rather than snaps
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let dpr = Math.min(devicePixelRatio || 1, 1.5);
    const size = () => { const r = cv.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U.R, cv.width, cv.height);
      if (!mouse.x) { mouse.x = mouse.tx = cv.width * .72; mouse.y = mouse.ty = cv.height * .55; } };
    size(); addEventListener('resize', size);
    const hero = cv.parentElement;
    hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * dpr; mouse.ty = (r.bottom - e.clientY) * dpr; });

    let visible = true, start = performance.now(), last = 0, raf;
    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;
      gl.uniform1f(U.T, (now - start) / 1000);
      gl.uniform2f(U.M, mouse.x, mouse.y);
      gl.uniform1f(U.S, state.S); gl.uniform1f(U.D, state.D); gl.uniform1f(U.P, state.P); gl.uniform1f(U.F, state.F);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // drop resolution if the device struggles
      if (last && now - last > 40 && dpr > .75) { dpr -= .25; size(); }
      last = now;
    };
    const still = () => { gl.uniform1f(U.T, 12); gl.uniform2f(U.M, mouse.x, mouse.y);
      gl.uniform1f(U.S, state.S); gl.uniform1f(U.D, state.D); gl.uniform1f(U.P, state.P); gl.uniform1f(U.F, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3); };
    if (reduce) { still(); addEventListener('resize', still); }
    else {
      raf = requestAnimationFrame(frame);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; last = 0; }).observe(cv);
      document.addEventListener('visibilitychange', () => { visible = !document.hidden; last = 0; });
    }

    // live tuning
    const btn = document.querySelector('.tune-btn'), panel = document.getElementById('tune');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open); panel.hidden = !open; });
    panel.querySelectorAll('input[type=range]').forEach(inp => {
      const out = panel.querySelector(`output[for="${inp.id}"]`);
      const apply = () => { state[inp.name] = +inp.value; out.value = (+inp.value).toFixed(inp.step.includes('.') ? 2 : 0); if (reduce) still(); };
      inp.addEventListener('input', apply); apply();
    });
    panel.querySelectorAll('.swatches button').forEach(b => b.addEventListener('click', () => {
      panel.querySelectorAll('.swatches button').forEach(x => x.setAttribute('aria-pressed', x === b));
      setPal(b.dataset.pal); if (reduce) still();
    }));
  }

  /* ----------------------------------------------------------------- tray */
  const tray = document.getElementById('tray');
  if (!tray) return;
  const body = document.body, page = document.querySelector('.page'), scrim = document.querySelector('.scrim');
  const content = tray.querySelector('.tray-body'), slot = tray.querySelector('.tray-slot');
  let opener = null;

  const open = row => {
    opener = row;
    const li = row.closest('li');
    tray.querySelector('.meta').textContent = `${li.dataset.org}, ${li.dataset.yr}`;
    tray.querySelector('h3').textContent = row.querySelector('h3').textContent;
    slot.innerHTML = li.querySelector('.detail').innerHTML;
    content.scrollTop = 0;
    tray.hidden = false; tray.removeAttribute('aria-hidden'); page.setAttribute('inert', '');
    requestAnimationFrame(() => { body.classList.add('tray-open'); tray.querySelector('.tray-close').focus({ preventScroll: true }); });
  };
  const close = () => {
    body.classList.remove('tray-open');
    tray.style.transform = ''; page.style.transform = '';
    page.removeAttribute('inert'); tray.setAttribute('aria-hidden', 'true');
    opener && opener.focus({ preventScroll: true });
  };
  document.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => open(r)));
  tray.querySelector('.tray-close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('tray-open')) close(); });

  // drag with velocity: flick to dismiss, rubber-band past the top
  let y0 = 0, dy = 0, tPrev = 0, yPrev = 0, vel = 0, dragging = false;
  const canDrag = e => e.target.closest('.grabber, .tray-head') || content.scrollTop <= 0;
  tray.addEventListener('pointerdown', e => {
    if (!body.classList.contains('tray-open') || e.button !== 0 || e.target.closest('a,button:not(.grabber)')) return;
    if (!canDrag(e)) return;
    dragging = true; y0 = yPrev = e.clientY; tPrev = e.timeStamp; dy = 0; vel = 0;
  });
  addEventListener('pointermove', e => {
    if (!dragging) return;
    const raw = e.clientY - y0;
    if (!tray.classList.contains('dragging')) {
      if (Math.abs(raw) < 6) return;                       // let taps and scrolls through
      if (raw < 0 && content.scrollTop > 0) { dragging = false; return; }
      tray.classList.add('dragging'); page.style.transition = 'none';
      try { tray.setPointerCapture(e.pointerId); } catch {}
    }
    dy = raw > 0 ? raw : -Math.pow(-raw, .7);              // resistance upward
    const dt = Math.max(1, e.timeStamp - tPrev);
    vel = .8 * ((e.clientY - yPrev) / dt) + .2 * vel; tPrev = e.timeStamp; yPrev = e.clientY;
    tray.style.transform = `translate3d(0,${dy}px,0)`;
    const p = Math.min(1, Math.max(0, dy) / tray.offsetHeight);
    page.style.transform = `scale(${.955 + .045 * p}) translateY(${14 * (1 - p)}px)`;
    scrim.style.opacity = 1 - p;
  });
  const end = () => {
    if (!dragging) return; dragging = false;
    const was = tray.classList.contains('dragging');
    tray.classList.remove('dragging'); page.style.transition = ''; scrim.style.opacity = '';
    if (!was) return;
    const projected = dy + vel * 180;                       // where momentum would carry it
    if (projected > tray.offsetHeight * .35 || vel > .9) close();
    else { tray.style.transform = ''; page.style.transform = ''; }
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
})();
