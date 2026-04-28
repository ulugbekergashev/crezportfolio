// Section components

// ---------- Hooks ----------
const useReveal = () => {
  React.useEffect(()=>{
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    },{ threshold:.12 });
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[]);
};

// Parallax: applies translateY based on scroll relative to element center.
// speed > 0 moves slower than scroll (background feel); negative moves opposite.
const useParallax = (speed = 0.2) => {
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const el = ref.current; if (!el) return;
    let raf = 0;
    const update = ()=>{
      const r = el.getBoundingClientRect();
      const center = r.top + r.height/2;
      const offset = (center - window.innerHeight/2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = ()=>{
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    return ()=>{
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  },[speed]);
  return ref;
};

const useCounter = (target, durationMs = 1800) => {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(()=>{
    const el = ref.current; if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([e])=>{
      if (e.isIntersecting && !started){
        started = true;
        const start = performance.now();
        const tick = (now)=>{
          const t = Math.min(1, (now-start)/durationMs);
          const eased = 1 - Math.pow(1-t, 3);
          setVal(Math.round(eased*target));
          if (t<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },{ threshold:.4 });
    io.observe(el);
    return ()=>io.disconnect();
  },[target, durationMs]);
  return [ref, val];
};

// ---------- Cursor ----------
const Cursor = () => {
  const dotRef = React.useRef(null);
  const ringRef = React.useRef(null);
  React.useEffect(()=>{
    let x=window.innerWidth/2, y=window.innerHeight/2, rx=x, ry=y;
    const onMove = (e)=>{
      x = e.clientX; y = e.clientY;
      if (dotRef.current){ dotRef.current.style.left = x+'px'; dotRef.current.style.top = y+'px'; }
      const t = e.target;
      if (t && t.closest && t.closest('a,button,.reel-card,.tilt,[data-magnet]')) document.body.classList.add('cursor-active');
      else document.body.classList.remove('cursor-active');
    };
    const tick = ()=>{
      rx += (x-rx)*.18; ry += (y-ry)*.18;
      if (ringRef.current){ ringRef.current.style.left = rx+'px'; ringRef.current.style.top = ry+'px'; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return ()=>window.removeEventListener('mousemove', onMove);
  },[]);
  return (<>
    <div ref={ringRef} className="cursor-ring"/>
    <div ref={dotRef} className="cursor-dot"/>
  </>);
};

// ---------- Nav ----------
const Nav = () => (
  <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
    <div className="font-display text-xl tracking-tight">CREZ<span className="accent">/</span></div>
    <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[.18em] ink-dim">
      <a href="#work" className="hover:text-[var(--ink)] transition">Ishlar</a>
      <a href="#about" className="hover:text-[var(--ink)] transition">Men haqimda</a>
      <a href="#pricing" className="hover:text-[var(--ink)] transition">Narxlar</a>
      <a href="#contact" className="hover:text-[var(--ink)] transition">Aloqa</a>
    </div>
    <div className="hidden md:flex items-center gap-2 font-mono text-[11px] ink-dim">
      <span className="w-2 h-2 rounded-full bg-[#3CFF7E] pulse-dot"/>
      <span className="uppercase tracking-[.18em]">Bo'sh vaqt: 2026</span>
    </div>
  </nav>
);

// ---------- Hero ----------
const Hero = () => {
  const [time, setTime] = React.useState('');
  React.useEffect(()=>{
    const t = ()=> setTime(new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Asia/Tashkent'}) + ' TOSHKENT');
    t(); const id = setInterval(t,1000); return ()=>clearInterval(id);
  },[]);
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 px-6 md:px-12 overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="mesh-blob absolute" style={{width:600,height:600,left:'-10%',top:'10%',background:'#C6FF00',opacity:.18,borderRadius:'50%'}}/>
        <div className="mesh-blob absolute" style={{width:500,height:500,right:'-5%',bottom:'-10%',background:'#FF3BCC',opacity:.10,borderRadius:'50%',animationDelay:'-4s'}}/>
        <div className="mesh-blob absolute" style={{width:400,height:400,left:'40%',top:'50%',background:'#00E5FF',opacity:.08,borderRadius:'50%',animationDelay:'-8s'}}/>
      </div>

      {/* 3D-ish floating element */}
      <div className="absolute right-6 md:right-16 top-32 md:top-40 w-[240px] h-[240px] md:w-[480px] md:h-[480px] pointer-events-auto">
        <model-viewer
          src="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb"
          alt="Professional Camera"
          auto-rotate
          rotation-per-second="30deg"
          camera-controls
          disable-zoom
          shadow-intensity="2"
          environment-image="neutral"
          exposure="1.2"
          interaction-prompt="none"
          style={{ width: '100%', height: '100%', background: 'transparent', '--poster-color': 'transparent' }}
        ></model-viewer>
      </div>

      {/* Top meta row */}
      <div className="absolute top-24 left-6 md:left-12 right-6 md:right-12 flex flex-wrap justify-between gap-4 font-mono text-[11px] ink-dim uppercase tracking-[.18em]">
        <div>[ Portfolio ’26 ] — Vol. 04</div>
        <div className="hidden md:block">{time}</div>
      </div>

      {/* Available pill */}
      <div className="reveal">
        <div className="inline-flex items-center gap-2 border border-line rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[.18em] mb-8 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-[#3CFF7E] pulse-dot"/>
          Tanlangan loyihalar uchun bo'sh — 2026-yil 2-chorak
        </div>
      </div>

      {/* Massive wordmark */}
      <h1 className="font-display leading-[.82] reveal reveal-delay-1" style={{fontSize:'clamp(120px, 26vw, 480px)'}}>
        <span className="glitch" data-text="CREZ">CREZ</span>
      </h1>

      {/* Tagline */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 items-end reveal reveal-delay-2">
        <div className="md:col-span-2">
          <div className="text-2xl md:text-4xl font-display leading-tight">
            Motion Designer <span className="accent">×</span> 3D Artist <span className="accent">×</span> Video Editor
          </div>
          <div className="ink-dim mt-3 max-w-xl">
            Muhammadamin — 21 yoshli motion animator
          </div>
        </div>
        <div className="flex md:justify-end">
          <a href="#work" className="cta-btn group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.18em] border border-[var(--ink)] rounded-full px-5 py-3 hover:bg-[var(--ink)] hover:text-black transition">
            Reelni ko'rish <span className="cta-arrow inline-block">↗</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] ink-dim">
        <span className="uppercase tracking-[.22em]">Pastga</span>
        <div className="w-[1px] h-10 bg-[var(--line)] relative overflow-hidden">
          <div className="scroll-dot w-[1px] h-3 bg-accent absolute left-0 top-0"/>
        </div>
      </div>
    </section>
  );
};

// ---------- About ----------
const About = () => {
  return (
  <section id="about" className="relative px-6 md:px-12 py-32 border-t border-line">
    <div className="grid md:grid-cols-12 gap-10">
      <div className="md:col-span-2 reveal">
        <div className="eyebrow">(01) — Men haqimda</div>
      </div>
      <div className="md:col-span-7 reveal reveal-delay-1">
        <h2 className="font-display text-5xl md:text-7xl leading-[.95]">
          O'zbekistondan 21 yoshli vizual hikoyachi — g'oyalarni harakatga <span className="accent">aylantiraman</span>.
        </h2>
        <p className="ink-dim text-lg max-w-xl mt-8 leading-relaxed">
          Men video animator montajorman. Rejissyorlikdan tortib har bir kadrni animatsiya qilishgacha bo‘lgan jarayonni o‘z bo‘ynimga olaman — vizualizatsiyadan tortib yakuniy ishlovgacha. Mening ishlarim tipografiya, tekstura va vaqt uyg‘unligida tug‘iladi.
        </p>
      </div>
      <div className="md:col-span-3 reveal reveal-delay-2">
        <div className="aspect-[3/4] reel-card group">
          <img src="portrait.jpg" alt="Muhammadamin" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
          <div className="scanline"/>
          <div className="absolute top-3 left-3 right-3 flex justify-between font-mono text-[10px] ink-dim">
            <span>SELF · 2026</span><span>◉ LIVE</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] accent uppercase tracking-[.18em]">CREZ_PORTRAIT.MOV</div>
        </div>
      </div>
    </div>

    {/* Marquee statement */}
    <div className="mt-24 overflow-hidden border-y border-line py-8 marquee-mask">
      <div className="flex whitespace-nowrap marquee-l">
        {Array.from({length:2}).map((_,k)=>(
          <div key={k} className="flex gap-12 pr-12 font-display text-7xl md:text-9xl">
            <span>ANIMATSIYA</span><span className="accent">·</span>
            <span>3D</span><span className="accent">·</span>
            <span>BREND</span><span className="accent">·</span>
            <span>FILM</span><span className="accent">·</span>
            <span>VFX</span><span className="accent">·</span>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

// ---------- Stats ----------
const Stat = ({ n, suffix, label, delay=0 }) => {
  const [ref, val] = useCounter(n);
  return (
    <div ref={ref} className="reveal" style={{transitionDelay:`${delay}ms`}}>
      <div className="font-display leading-[.9] text-[clamp(80px,14vw,220px)]">
        {val}<span className="accent">{suffix}</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[.22em] ink-dim mt-2 border-t border-line pt-3">{label}</div>
    </div>
  );
};

const Stats = () => (
  <section className="px-6 md:px-12 py-32 border-t border-line">
    <div className="eyebrow mb-12">(02) — Raqamlarda</div>
    <div className="grid md:grid-cols-3 gap-12 md:gap-6">
      <Stat n={2} suffix="+" label="Yillik tajriba" delay={0}/>
      <Stat n={120} suffix="+" label="Tugallangan loyihalar" delay={150}/>
      <Stat n={40} suffix="+" label="Mamnun mijozlar" delay={300}/>
    </div>
  </section>
);

// ---------- Skills ----------
const SkillCard = ({ name, level, kind, idx }) => {
  const ref = React.useRef(null);
  const onMove = (e)=>{
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    ref.current.style.transform = `translateY(-6px) rotateX(${ -y*8 }deg) rotateY(${ x*8 }deg)`;
  };
  const onLeave = ()=>{ if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
         className="tilt reveal border border-line rounded-2xl p-6 md:p-8 relative overflow-hidden"
         style={{transitionDelay:`${idx*80}ms`, background:'linear-gradient(180deg, rgba(255,255,255,.02), transparent)'}}>
      <div className="flex justify-between items-start mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[.22em] ink-dim">{kind}</div>
        <div className="font-mono text-[10px] accent">0{idx+1}</div>
      </div>
      <div className="font-display text-3xl md:text-4xl leading-[1]">{name}</div>
      <div className="mt-6">
        <div className="flex justify-between font-mono text-[10px] ink-dim mb-2">
          <span>MAHORAT</span><span>{level}%</span>
        </div>
        <div className="h-[2px] bg-line relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-accent reveal-bar" style={{width:`${level}%`}}/>
        </div>
      </div>
    </div>
  );
};

const Skills = () => (
  <section className="px-6 md:px-12 py-32 border-t border-line">
    <div className="grid md:grid-cols-12 gap-10 mb-16">
      <div className="md:col-span-2"><div className="eyebrow">(03) — Skillar</div></div>
      <div className="md:col-span-10 reveal">
        <h2 className="font-display text-5xl md:text-7xl leading-[.95]">Skilllar —<br/><span className="accent">to'liq</span>.</h2>
      </div>
    </div>
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
      <SkillCard name="After Effects" level={95} kind="Compositing" idx={0}/>
      <SkillCard name="DaVinci Resolve" level={70} kind="Edit · Grade" idx={1}/>
      <SkillCard name="Blender 3D" level={60} kind="3D · Render" idx={2}/>
      <SkillCard name="3ds Max" level={60} kind="Modelling" idx={3}/>
      <SkillCard name="3D Animation" level={50} kind="Discipline" idx={4}/>
    </div>
  </section>
);

// ---------- Work / Bento ----------
const VideoTile = ({ src, title, client, year, category, span = '', large = false }) => (
  <div className={`reel-card group reveal ${span} block relative overflow-hidden bg-black`}>
    <video src={src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"/>
    <div className="scanline pointer-events-none"/>
    <div className="play-tag flex items-center gap-2 pointer-events-none"><span className="live-dot"/> {category}</div>
    <div className="absolute top-4 right-4 font-mono text-[10px] ink-dim flex items-center gap-2 pointer-events-none">
      <span>{year}</span>
    </div>
    <div className="reel-overlay z-10 pointer-events-none">
      <div className="font-mono text-[10px] uppercase tracking-[.22em] accent mb-2">{client}</div>
      <div className={`font-display ${large ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'} leading-[.95] text-white`}>{title}</div>
      <div className="flex justify-between items-end mt-6">
        <div className="font-mono text-[10px] ink-dim">{category} · {year}</div>
      </div>
    </div>
  </div>
);

const Work = () => (
  <section id="work" className="px-6 md:px-12 py-32 border-t border-line">
    <div className="grid md:grid-cols-12 gap-10 mb-12">
      <div className="md:col-span-2"><div className="eyebrow">(04) — Tanlangan ishlar</div></div>
      <div className="md:col-span-10 reveal flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-5xl md:text-8xl leading-[.92]">Ishlardan<br/><span className="accent">bir parcha</span>.</h2>
        <div className="font-mono text-[11px] ink-dim uppercase tracking-[.18em]">2023 — 2026 / 120 tadan 06 tasi</div>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
      <VideoTile src="605-Branding.mp4" title="605 Brand Reel" client="605 Agency" year="’25" category="Brend rili" span="col-span-12 md:col-span-6 row-span-2 md:row-span-3" large/>
      <VideoTile src="AQO6sWjMKyvkrzRrw8z_VJVBxvMMbml4OYmeMZr3Gmuhn8uSrM86d87nedZmd_h.mp4" title="Yusuf Inspire Motion" client="@yusuf.inspire" year="’24" category="Motion Design" span="col-span-12 md:col-span-6 row-span-2 md:row-span-3" large/>
      
      <VideoTile src="4-mefortg.mp4" title="Odilbekova Promo" client="@odilbekovva" year="’24" category="Instagram Reel" span="col-span-6 md:col-span-3 row-span-4"/>
      <VideoTile src="AQNBGsao1FSHXxlFW7_cs26nRF_ig4DV5jeRUEabyqe5Ep0qpEhhYOAqllXjiAD.mp4" title="Yusuf Inspire Reel" client="@yusuf.inspire" year="’24" category="Reel" span="col-span-6 md:col-span-3 row-span-4"/>
      <VideoTile src="AQO8jSCn4cGbejgB6EXSnY3SNBQaExPjyQbyaKmwd9jTsOcHXkk0wJL6yZFmmu8.mp4" title="Millat Umidi Promo" client="Millat Umidi Univ." year="’24" category="Motion Video" span="col-span-6 md:col-span-3 row-span-4"/>
      <VideoTile src="SaveInta_com_AQNnbdIG6N4a2qw9wjt12F87bm_I2jTXSkpfGSUl6Q_YENrVBGDvSGpnPqNY8tT.mp4" title="Millat Umidi Reel" client="Millat Umidi Univ." year="’24" category="Promo" span="col-span-6 md:col-span-3 row-span-4"/>
    </div>
  </section>
);

// ---------- Clients Logo Wall ----------
const ClientLogo = ({ name, kind, year, idx }) => (
  <div className="reveal group relative border-r border-b border-line p-8 md:p-10 min-h-[180px] flex flex-col justify-between transition-colors duration-500 hover:bg-[var(--accent)] hover:text-black overflow-hidden"
       style={{transitionDelay:`${idx*60}ms`}}>
    <div className="flex justify-between font-mono text-[10px] uppercase tracking-[.22em] opacity-60">
      <span>0{idx+1}</span>
      <span>{year}</span>
    </div>
    <div className="font-display text-3xl md:text-5xl leading-[.95]">{name}</div>
    <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-[.22em]">
      <span className="opacity-60">{kind}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗ Birga ishlangan</span>
    </div>
    {/* corner mark */}
    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent group-hover:bg-black transition-colors"/>
  </div>
);

const Clients = () => {
  const brands = [
    { name:'Honor Uzbekistan', kind:'Mahsulot Viz · 3D', year:'’25' },
    { name:'Pepsi',            kind:'Reklama · Ril', year:'’24' },
    { name:'Lipton',           kind:'Logotip animatsiyasi',   year:'’24' },
    { name:'605 Agency',       kind:'Brend rili',       year:'’25' },
    { name:'Bloger Agency',    kind:'VFX · Montaj',       year:'’25' },
    { name:'Bashkent',         kind:'3D Ident',         year:'’24' },
    { name:'Millat Umidi Univ.', kind:'Ovoz · Montaj',   year:'’23' },
    { name:'TAFU',             kind:'VFX · Promo',      year:'’23' },
  ];
  return (
    <section className="px-6 md:px-12 py-32 border-t border-line">
      <div className="grid md:grid-cols-12 gap-10 mb-16">
        <div className="md:col-span-2"><div className="eyebrow">(05) — Hamkorlar</div></div>
        <div className="md:col-span-10 reveal flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-5xl md:text-7xl leading-[.95]">
            Montajga<br/>ishongan <span className="accent">brendlar</span>.
          </h2>
          <div className="font-mono text-[11px] ink-dim uppercase tracking-[.18em] max-w-xs">
            O'zbekiston bo'ylab 40+ mijozlar — film, brend, ta'lim, agentliklar
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-line">
        {brands.map((b,i)=>(<ClientLogo key={b.name} {...b} idx={i}/>))}
      </div>
    </section>
  );
};

// ---------- Testimonials ----------
const Testimonials = () => {
  const reviews = [
    { text: "manam xursandman siz bilan ishlaganimdan, kutganimdan ancha yaxshi narsa qilib berayabsiz", label: "MIJOZ 01" },
    { text: "Raxmat bro, ishlariz Juda yoqayabdi, Juda zo'r", label: "MIJOZ 02" },
    { text: "Siz bilan ishlab mazza qildim! shu vaqtgacha xech qaysi montajor bilan bunaqa ishlanagan edim, raxmat", label: "MIJOZ 03" },
    { text: "Ishlariz darajasi boshqacha ekan, bunaqa sifat kutmagandim. Juda professional ishlayabsi, respect.", label: "MIJOZ 04" },
  ];
  const [idx, setIdx] = React.useState(0);
  const [dragStart, setDragStart] = React.useState(null);
  const [dragDelta, setDragDelta] = React.useState(0);
  const n = reviews.length;

  const goTo = (i) => setIdx((i + n) % n);
  const next = React.useCallback(() => goTo(idx + 1), [idx]);
  const prev = () => goTo(idx - 1);

  React.useEffect(() => {
    if (dragStart !== null) return;
    const t = setInterval(() => setIdx(c => (c + 1) % n), 4500);
    return () => clearInterval(t);
  }, [dragStart, n]);

  const getX = (e) => e.clientX ?? e.touches?.[0]?.clientX ?? 0;

  const onStart = (e) => { setDragStart(getX(e)); setDragDelta(0); };
  const onMove  = (e) => { if (dragStart === null) return; setDragDelta(getX(e) - dragStart); };
  const onEnd   = () => {
    if (dragStart === null) return;
    if (dragDelta < -60) goTo(idx + 1);
    else if (dragDelta > 60) goTo(idx - 1);
    setDragStart(null);
    setDragDelta(0);
  };

  const cardW = 75; // vw per card
  const gap = 2;    // vw gap

  return (
    <section id="testimonials" className="py-32 border-t border-line overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-12 grid md:grid-cols-12 gap-10 mb-14">
        <div className="md:col-span-2"><div className="eyebrow">(06) — Mijozlar fikri</div></div>
        <div className="md:col-span-10 reveal flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-5xl md:text-7xl leading-[.95]">
            Mijozlar nima <span className="accent">deydi?</span>
          </h2>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] ink-dim tracking-[.18em] uppercase">
              <span className="accent">{String(idx+1).padStart(2,'0')}</span> / {String(n).padStart(2,'0')}
            </span>
            <div className="flex gap-3">
              <button onClick={prev}
                className="w-11 h-11 rounded-full border border-line flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={next}
                className="w-11 h-11 rounded-full border border-line flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding track */}
      <div
        className="reveal"
        style={{ cursor: dragStart !== null ? 'grabbing' : 'grab', userSelect: 'none' }}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      >
        <div
          style={{
            display: 'flex',
            gap: `${gap}vw`,
            paddingLeft: '6vw',
            transform: `translateX(calc(${-idx * (cardW + gap)}vw + ${dragDelta}px))`,
            transition: dragStart !== null ? 'none' : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }}
        >
          {reviews.map((r, i) => {
            const isActive = i === idx;
            return (
              <div
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  flexShrink: 0,
                  width: `${cardW}vw`,
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                  padding: '44px 48px 36px',
                  borderRadius: 20,
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--line)'}`,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(198,255,0,.07), rgba(198,255,0,.02))'
                    : 'linear-gradient(180deg, rgba(255,255,255,.018), transparent)',
                  boxShadow: isActive ? '0 0 80px rgba(198,255,0,.1)' : 'none',
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? 'scale(1)' : 'scale(0.97)',
                  transition: 'border-color .5s, background .5s, box-shadow .5s, opacity .5s, transform .5s',
                  cursor: isActive ? 'grab' : 'pointer',
                }}
              >
                {/* Giant quote mark */}
                <div style={{
                  fontFamily: "'Anton','Bebas Neue',sans-serif",
                  fontSize: 100,
                  lineHeight: 0.5,
                  color: isActive ? 'var(--accent)' : 'var(--line)',
                  transition: 'color .5s',
                  pointerEvents: 'none',
                }}>"</div>

                {/* Quote text */}
                <p style={{
                  fontFamily: "'Anton','Bebas Neue',sans-serif",
                  fontSize: 'clamp(22px,2.4vw,34px)',
                  lineHeight: 1.2,
                  color: isActive ? 'var(--ink)' : 'var(--ink-dim)',
                  transition: 'color .5s',
                  flex: 1,
                  pointerEvents: 'none',
                }}>{r.text}</p>

                {/* Footer row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 20,
                  borderTop: `1px solid ${isActive ? 'rgba(198,255,0,.25)' : 'var(--line)'}`,
                  transition: 'border-color .5s',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                    letterSpacing: '.22em', textTransform: 'uppercase',
                    color: isActive ? 'var(--accent)' : 'var(--ink-dim)',
                    transition: 'color .5s',
                  }}>{r.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-accent pulse-dot"/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress pills */}
      <div className="px-6 md:px-12 mt-8 flex gap-2">
        {reviews.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{
              height: 3, borderRadius: 99, border: 'none', padding: 0,
              background: i === idx ? 'var(--accent)' : 'var(--line)',
              width: i === idx ? 44 : 16,

              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </section>
  );
};

// ---------- Process ----------
const Process = () => {
  const steps = [
    {n:'01', title:'Brif', body:'Eshitish, tahlil qilish va hikoyamiz hamda u qoldirishi kerak bo\'lgan his-tuyg\'ularni aniqlash.'},
    {n:'02', title:'Konsept', body:'Mudbordlar, storibordlar, tipografik tadqiqotlar. Birorta kadr render bo\'lishidan oldin yo\'nalishni tasdiqlaymiz.'},
    {n:'03', title:'Produksiya', body:'Modellashtirish, animatsiya, suratga olish va kompoziting. Kunlik hisobotlar, montajda kutilmagan sovg\'alar bo\'lmaydi.'},
    {n:'04', title:'Yetkazib berish', body:'Rang, ovoz, yakuniy natija — kampaniyangizga kerakli barcha formatlarda eksport qilinadi.'},
  ];
  return (
    <section id="process" className="px-6 md:px-12 py-32 border-t border-line">
      <div className="grid md:grid-cols-12 gap-10 mb-20">
        <div className="md:col-span-2"><div className="eyebrow">(07) — Jarayon</div></div>
        <div className="md:col-span-10 reveal">
          <h2 className="font-display text-5xl md:text-7xl leading-[.95]">To'rt bosqich.<br/>To'siqlarsiz <span className="accent">natija</span>.</h2>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-0 right-0 top-12 hidden md:block" height="2" width="100%">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#1C1C1A" strokeWidth="1"/>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#C6FF00" strokeWidth="1" strokeDasharray="6 8"/>
        </svg>
        <div className="grid md:grid-cols-4 gap-10">
          {steps.map((s,i)=>(
            <div key={s.n} className="reveal" style={{transitionDelay:`${i*120}ms`}}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-6 h-6 rounded-full bg-accent relative">
                  <div className="absolute inset-0 rounded-full bg-accent" style={{animation:'pulse-dot 2s infinite'}}/>
                </div>
                <div className="font-mono text-[11px] ink-dim">QADAM {s.n}</div>
              </div>
              <div className="font-display text-4xl md:text-5xl leading-[.95]">{s.title}</div>
              <p className="ink-dim mt-4 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Pricing ----------
const PricingCard = ({ tier, price, tagline, features, accent: isAccent, idx, unit = 'reels' }) => (
  <div className={`reveal relative rounded-2xl p-6 md:p-8 border ${isAccent ? 'border-[var(--accent)]' : 'border-line'} overflow-hidden tilt`}
       style={{transitionDelay:`${idx*120}ms`, background: isAccent ? 'linear-gradient(180deg, rgba(198,255,0,.08), transparent)' : 'linear-gradient(180deg, rgba(255,255,255,.02), transparent)'}}>
    {isAccent && (
      <div className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[.22em] bg-accent text-black px-3 py-1 rounded-full">★ Premium</div>
    )}
    <div className="font-mono text-[11px] uppercase tracking-[.22em] ink-dim">{tier}</div>
    <div className="mt-8 flex items-end gap-2">
      <div className="font-display text-[100px] md:text-[140px] leading-[.85]">
        <span className={isAccent ? 'accent' : ''}>${price}</span>
      </div>
      <div className="font-mono text-[11px] ink-dim mb-6 uppercase tracking-[.18em]">/ {unit}</div>
    </div>
    <p className="ink-dim mt-2 mb-8 leading-relaxed">{tagline}</p>
    <div className="border-t border-line pt-6 space-y-3">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <span className={`font-mono text-[12px] mt-[2px] ${isAccent ? 'accent' : 'ink-dim'}`}>+</span>
          <span className="ink">{f}</span>
        </div>
      ))}
    </div>
    <a href="#contact"
       className={`cta-btn group inline-flex items-center justify-between w-full mt-10 font-mono text-[11px] uppercase tracking-[.18em] rounded-full px-6 py-4 transition ${
         isAccent ? 'bg-accent text-black hover:bg-transparent hover:text-[var(--accent)] border border-accent' : 'border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-black'
       }`}>
      <span>{tier} buyurtma berish</span>
      <span className="cta-arrow inline-block">↗</span>
    </a>
  </div>
);

const Pricing = () => (
  <section id="pricing" className="px-6 md:px-12 py-32 border-t border-line">
    <div className="grid md:grid-cols-12 gap-10 mb-16">
      <div className="md:col-span-2"><div className="eyebrow">(08) — Narxlar</div></div>
      <div className="md:col-span-10 reveal flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-5xl md:text-7xl leading-[.95]">Men bilan ishlashning<br/><span className="accent">to'rt yo'li</span>.</h2>
        <div className="font-mono text-[11px] ink-dim uppercase tracking-[.18em] max-w-xs">
          Ruxsat etilgan narxlar · 100% oldindan to'lov · Tuzatishlar kiritilgan
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PricingCard
        tier="Standart"
        price="25"
        tagline="Ijtimoiy tarmoqlar, logotip animatsiyalari va qisqa rillar uchun tezkor yechim. Bitta topshiriq uchun ideal."
        features={[
          '1 minutgacha bo\'lgan video',
          '1 ta konsept yo\'nalishi',
          '2 marta tuzatish kiritish',
          '1080p · MP4 + MOV eksport',
          'Tayyor bo\'lish muddati: 1 kun',
          'Mualliflik huquqisiz musiqa',
        ]}
        idx={0}
      />
      <PricingCard
        tier="Premium"
        price="35"
        tagline="To'liq kreativ ishlab chiqarish — 3D, brend-rillar, reklamalar. Konseptdan yetkazib berishgacha."
        accent
        features={[
          '1.5 minutgacha video / 3D',
          'Tanlash uchun 2 ta konsept yo\'nalishi',
          'Cheksiz tuzatishlar',
          '4K · barcha o\'lchamlarda (16:9 · 9:16 · 1:1)',
          'Sound dizayn + individual rang berish',
          'Asl fayllar (.aep / .blend) taqdim etiladi (xohishiy)',
          'Navbatdan tashqari: 1 kunda tayyor',
        ]}
        idx={1}
      />
      <PricingCard
        tier="YouTube"
        price="80"
        unit="video"
        tagline="Uzun formatli videolar uchun professional montaj va motion dizayn. (Narxlar vaziyatga qarab o'zgaradi)"
        features={[
          '15 minutgacha bo\'lgan video',
          'O\'rtacha darajadagi motion',
          'Professional montaj va rang',
          'Mavzuga mos animatsiyalar',
          'Tayyor bo\'lish: Kelishiladi',
        ]}
        idx={2}
      />
      <PricingCard
        tier="Promo"
        price="100"
        unit="rolik"
        tagline="To'liq metrajli professional promo roliklar — brendingiz uchun eng yuqori sifat. (Narxlar vaziyatga qarab o'zgaradi)"
        features={[
          'Full motion dizayn',
          '1-2 haftada tayyor bo\'ladi',
          'Professional sound dizayn',
          'To\'liq dizaynerlik ishi',
          '10 tagacha tuzatish kiritish',
          'Premium sifat va yondashuv',
        ]}
        idx={3}
      />
    </div>

    <div className="mt-10 reveal flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] ink-dim uppercase tracking-[.18em] border-t border-line pt-6">
      <div>Kattaroq loyihangiz bormi? — To'liq kampaniyalar uchun individual taklif.</div>
      <a href="#contact" className="hover:text-[var(--accent)] transition">Individual narxni bilish ↗</a>
    </div>
  </section>
);
const MagneticLink = ({ children, href }) => {
  const ref = React.useRef(null);
  const onMove = (e)=>{
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*.2}px, ${y*.3}px)`;
  };
  const onLeave = ()=>{ if (ref.current) ref.current.style.transform = ''; };
  return (
    <a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave}
       data-magnet
       className="inline-flex items-center gap-3 font-display text-3xl md:text-5xl leading-tight transition-transform duration-300 group">
      <span className="group-hover:text-[var(--accent)] transition-colors">{children}</span>
      <span className="accent text-2xl group-hover:translate-x-2 transition-transform">↗</span>
    </a>
  );
};

const Contact = () => (
  <section id="contact" className="relative px-6 md:px-12 py-32 border-t border-line overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="mesh-blob absolute" style={{width:600,height:600,right:'-10%',top:'-10%',background:'#C6FF00',opacity:.1,borderRadius:'50%'}}/>
    </div>
    <div className="eyebrow mb-12">(09) — Bog'lanish</div>
    <h2 className="font-display leading-[.85] reveal" style={{fontSize:'clamp(64px, 14vw, 260px)'}}>
      Keling, jarangdor<br/>
      <span className="accent">narsa</span> yaratamiz.
    </h2>

    <div className="grid md:grid-cols-12 gap-10 mt-20">
      <div className="md:col-span-7 reveal reveal-delay-1">
        <div className="eyebrow mb-6">Kanallar</div>
        <div className="space-y-5">
          <MagneticLink href="mailto:salyamovcrez@gmail.com">salyamovcrez@gmail.com</MagneticLink><br/>
          <MagneticLink href="https://instagram.com/salyamov_vd">@salyamov_vd — Instagram</MagneticLink><br/>
          <MagneticLink href="https://t.me/crez_vd">@crez_vd — Telegram</MagneticLink>
        </div>
      </div>
      <div className="md:col-span-5 reveal reveal-delay-2">
        <div className="eyebrow mb-6">Studiya</div>
        <div className="space-y-3 ink-dim leading-relaxed">
          <div>Tashkent, Uzbekistan</div>
          <div>UTC +05:00</div>
          <div className="ink">Mavjud xizmatlar: brend filmlari, 3D reklamalar, logotip tizimlari, motion identika, post-produksiya.</div>
        </div>
        <a href="https://t.me/crez_vd" className="cta-btn group inline-flex items-center gap-3 mt-10 font-mono text-[11px] uppercase tracking-[.18em] border border-accent rounded-full px-6 py-4 bg-accent text-black hover:bg-transparent hover:text-[var(--accent)] transition">
          Loyihani boshlash <span className="cta-arrow inline-block">↗</span>
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="px-6 md:px-12 py-10 border-t border-line flex flex-wrap justify-between items-center gap-4 font-mono text-[11px] ink-dim uppercase tracking-[.18em]">
    <div>© CREZ Studio 2023 — 2026</div>
    <div className="font-display text-3xl ink">CREZ<span className="accent">/</span></div>
    <div>E'tibor bilan kodlangan · Toshkent ◐ UZ</div>
  </footer>
);

Object.assign(window, { useReveal, Cursor, Nav, Hero, About, Stats, Skills, Work, Clients, Testimonials, Process, Pricing, Contact, Footer });
