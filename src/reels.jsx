// Animated CSS/SVG "video reel" thumbnails — each unique
// Exports several Reel components to window.

const Reel3D = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 30% 30%, #1a1a14 0%, #0A0A0A 70%)'}}></div>
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="r3d" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C6FF00"/>
          <stop offset="100%" stopColor="#3a4a00"/>
        </linearGradient>
      </defs>
      <g style={{transformOrigin:'200px 150px', animation:'spin-slow 18s linear infinite'}}>
        <polygon points="200,80 280,140 200,200 120,140" fill="url(#r3d)" opacity=".9"/>
        <polygon points="200,80 280,140 200,200 120,140" fill="none" stroke="#C6FF00" strokeWidth="1"/>
        <line x1="200" y1="80" x2="200" y2="200" stroke="#0A0A0A" strokeWidth="1"/>
        <line x1="120" y1="140" x2="280" y2="140" stroke="#0A0A0A" strokeWidth="1"/>
      </g>
      <g style={{transformOrigin:'200px 150px', animation:'spin-slow 28s linear infinite reverse'}}>
        <circle cx="200" cy="150" r="110" fill="none" stroke="#C6FF00" strokeWidth=".5" strokeDasharray="3 6" opacity=".5"/>
        <circle cx="200" cy="150" r="130" fill="none" stroke="#F2F1EA" strokeWidth=".5" strokeDasharray="1 8" opacity=".3"/>
      </g>
    </svg>
  </div>
);

const ReelWave = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{background:'linear-gradient(180deg, #0E0E14 0%, #0A0A0A 100%)'}}></div>
    <div className="absolute inset-x-0 bottom-0 flex items-end gap-[3px] px-3 pb-3" style={{height:'60%'}}>
      {Array.from({length:48}).map((_,i)=>(
        <div key={i} className="flex-1 bg-accent rounded-sm" style={{
          animation:`barUp ${1+ (i%5)*.2}s ease-in-out ${i*.03}s infinite`,
          height:'30%', opacity: .4 + (i%3)*.2
        }}/>
      ))}
    </div>
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center font-mono text-[10px] ink-dim">
      <span>● REC 00:24</span>
      <span>—TO'LQIN—</span>
    </div>
  </div>
);

const ReelOrbit = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{background:'radial-gradient(circle at 50% 60%, #2a1230 0%, #0A0A0A 70%)'}}></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{width:0, height:0}}>
        <div className="absolute rounded-full bg-accent" style={{width:18, height:18, left:-9, top:-9, boxShadow:'0 0 30px #C6FF00'}}/>
        <div className="absolute rounded-full bg-white" style={{width:8, height:8, left:-4, top:-4, animation:'orbit 4s linear infinite'}}/>
        <div className="absolute rounded-full" style={{width:6, height:6, left:-3, top:-3, background:'#FF4500', animation:'orbit2 7s linear infinite'}}/>
        <div className="absolute rounded-full bg-white/60" style={{width:4, height:4, left:-2, top:-2, animation:'orbit 9s linear infinite reverse'}}/>
      </div>
    </div>
  </div>
);

const ReelGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{background:'#0A0A0A'}}></div>
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C6FF00" strokeWidth=".4" opacity=".4"/>
        </pattern>
      </defs>
      <g style={{transformOrigin:'center', transform:'perspective(400px) rotateX(55deg) translateZ(0)'}}>
        <rect x="-200" y="0" width="800" height="600" fill="url(#gp)"/>
      </g>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-display text-7xl accent" style={{textShadow:'0 0 30px #C6FF00, 0 0 60px #C6FF00', animation:'flicker 2.5s infinite'}}>3D</div>
    </div>
  </div>
);

const ReelGradient = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{
      background:'conic-gradient(from 0deg at 50% 50%, #FF4500, #C6FF00, #00E5FF, #FF3BCC, #FF4500)',
      animation:'spin-slow 12s linear infinite',
      filter:'blur(30px)'
    }}/>
    <div className="absolute inset-2 rounded-xl" style={{background:'rgba(10,10,10,.7)', backdropFilter:'blur(20px)'}}/>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="font-mono text-[10px] ink-dim mb-2">REKLAMA · 30S</div>
      <div className="font-display text-5xl ink">PEPSI</div>
      <div className="font-mono text-[10px] ink-dim mt-2">O'ZB · 2024</div>
    </div>
  </div>
);

const ReelType = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0" style={{background:'#C6FF00'}}/>
    <div className="absolute inset-0 mix-blend-difference flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-6xl text-black leading-[.9]" style={{animation:'flicker 3s infinite'}}>BREND</div>
        <div className="font-display text-6xl text-black leading-[.9]" style={{animation:'flicker 3.4s infinite'}}>RILI</div>
      </div>
    </div>
    <div className="absolute top-3 left-3 right-3 flex justify-between font-mono text-[10px] text-black">
      <span>◐ 605 AGENCY</span><span>2025</span>
    </div>
    <div className="absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[10px] text-black">
      <span>00:00 / 00:45</span><span>4K · H264</span>
    </div>
  </div>
);

const ReelLogo = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{background:'radial-gradient(circle at 50% 50%, #14140e 0%, #0A0A0A 80%)'}}></div>
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
      <g style={{transformOrigin:'200px 150px', animation:'spin-slow 14s linear infinite'}}>
        <circle cx="200" cy="150" r="60" fill="none" stroke="#C6FF00" strokeWidth="1.5"/>
        <circle cx="200" cy="150" r="80" fill="none" stroke="#F2F1EA" strokeWidth=".5" strokeDasharray="2 4" opacity=".6"/>
        <circle cx="200" cy="150" r="100" fill="none" stroke="#C6FF00" strokeWidth=".5" strokeDasharray="1 12" opacity=".4"/>
      </g>
      <g style={{transformOrigin:'200px 150px', animation:'spin-slow 8s linear infinite reverse'}}>
        <rect x="170" y="120" width="60" height="60" fill="none" stroke="#C6FF00" strokeWidth="1"/>
      </g>
      <text x="200" y="158" textAnchor="middle" fill="#F2F1EA" fontFamily="Anton" fontSize="36">LIPTON</text>
    </svg>
  </div>
);

const ReelVFX = () => (
  <div className="absolute inset-0 overflow-hidden" style={{background:'#0A0A0A'}}>
    {Array.from({length:30}).map((_,i)=>(
      <div key={i} className="absolute rounded-full" style={{
        width: 2 + Math.random()*3, height: 2 + Math.random()*3,
        left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
        background: i%4===0 ? '#C6FF00' : '#F2F1EA',
        opacity: .3 + Math.random()*.7,
        animation:`floaty ${4+Math.random()*6}s ease-in-out ${Math.random()*3}s infinite`,
        boxShadow: i%4===0 ? '0 0 8px #C6FF00' : 'none'
      }}/>
    ))}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border border-accent rounded-full" style={{animation:'spin-slow 20s linear infinite'}}/>
        <div className="absolute inset-2 border border-white/30 rounded-full" style={{animation:'spin-slow 12s linear infinite reverse'}}/>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] accent">VFX_04</div>
      </div>
    </div>
  </div>
);

Object.assign(window, { Reel3D, ReelWave, ReelOrbit, ReelGrid, ReelGradient, ReelType, ReelLogo, ReelVFX });
