import React, { useState, useEffect, useRef } from 'react';
import { Play, Activity, Layers, Cpu, CheckCircle, AlertTriangle, Zap, Search, Settings, ArrowRight, BarChart3 } from 'lucide-react';

/**
 * TAPE-OUT CRUNCH: 7nm FINFET SERDES SIMULATION
 * * Design Philosophy:
 * - Geometric Vector Art: Simple rounded shapes, no gradients.
 * - Dark Mode Palette: #1E1E2E background with neon accents.
 * - Tactile Feel: "Squashy" buttons with offset hard shadows.
 */

// --- Constants & Data ---

const DAYS = [
  { id: 'mon', title: 'Mon: Triage', icon: AlertTriangle, desc: 'Top-level flag: CTLE failing at SS/125°C.' },
  { id: 'tue', title: 'Tue: Investigation', icon: Search, desc: 'Parasitic extraction reveals R-C issues.' },
  { id: 'wed', title: 'Wed: Circuit Fix', icon: Settings, desc: 'Circuit trade-offs: Gain vs. Power.' },
  { id: 'thu', title: 'Thu: Layout ECO', icon: Layers, desc: 'Mitigating LOD & WPE effects.' },
  { id: 'fri', title: 'Fri: Sign-off', icon: CheckCircle, desc: 'Final regression & DRD generation.' },
];

const METRICS_BASE = {
  gain: 8.5, // dB
  bandwidth: 10.5, // GHz
  eyeHeight: 28, // mV
  power: 4.2, // mW
};

const TARGETS = {
  gain: 11.0,
  bandwidth: 14.0,
  eyeHeight: 50,
  power: 5.0,
};

// --- Helper Components ---

const Card = ({ children, className = "", onClick, active = false }) => (
  <div 
    onClick={onClick}
    className={`
      relative bg-[#2d2d44] border-2 border-[#4c4c6c] rounded-2xl p-4 transition-all duration-200
      ${onClick ? 'cursor-pointer active:scale-95' : ''}
      ${active ? 'border-[#a78bfa] bg-[#363654]' : ''}
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
      ${className}
    `}
  >
    {children}
  </div>
);

const TactileButton = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const colors = {
    primary: 'bg-[#8b5cf6] border-[#7c3aed] text-white hover:bg-[#7c3aed]', // Violet
    success: 'bg-[#10b981] border-[#059669] text-white hover:bg-[#059669]', // Emerald
    danger:  'bg-[#ef4444] border-[#dc2626] text-white hover:bg-[#dc2626]', // Red
    neutral: 'bg-[#4b5563] border-[#374151] text-white hover:bg-[#374151]', // Gray
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-bold rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all
        ${colors[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed active:translate-y-0 active:border-b-4' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'bg-gray-700' }) => (
  <span className={`${color} px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white`}>
    {children}
  </span>
);

// --- Visualizations ---

// 1. Geometric Engineer Avatar
const EngineerAvatar = ({ emotion = 'neutral' }) => {
  // Simple geometric construction
  return (
    <div className="relative w-24 h-24 float-anim">
      {/* Background Circle */}
      <div className="absolute inset-0 bg-[#a78bfa] rounded-full border-4 border-[#1E1E2E]"></div>
      {/* Body (Rounded Rect) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-[#1E1E2E] rounded-t-2xl"></div>
      {/* Head (Circle) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-16 bg-[#ffedd5] rounded-2xl border-2 border-[#1E1E2E]">
        {/* Hair (Triangles/Circles) */}
        <div className="absolute -top-2 -left-2 w-18 h-8 bg-[#4c1d95] rounded-full"></div>
        {/* Glasses (Rectangles) */}
        <div className="absolute top-6 left-1 flex gap-1 justify-center w-full px-1">
          <div className="w-5 h-4 bg-[#1E1E2E] opacity-20 rounded-sm"></div>
          <div className="w-1 h-1 bg-[#1E1E2E] mt-2 rounded-full"></div>
          <div className="w-5 h-4 bg-[#1E1E2E] opacity-20 rounded-sm"></div>
        </div>
        {/* Mouth */}
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#be123c] rounded-full transition-all ${emotion === 'happy' ? 'h-3 w-6' : 'h-1'}`}></div>
      </div>
      {/* Status Badge */}
      <div className="absolute -bottom-2 -right-2 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#1E1E2E]">
        SS/125C
      </div>
    </div>
  );
};

// 2. The Eye Diagram Monitor (Canvas)
const EyeDiagram = ({ quality }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear with CRT phosphor fade effect
    ctx.fillStyle = 'rgba(20, 20, 30, 0.3)';
    ctx.fillRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.stroke();

    // Draw Eye
    const drawWave = (offset, amplitude, jitter) => {
      ctx.beginPath();
      ctx.strokeStyle = quality > 0.8 ? '#4ade80' : quality > 0.5 ? '#facc15' : '#ef4444';
      ctx.lineWidth = 2;
      
      for (let x = 0; x <= w; x+=2) {
        // Normalized X (0 to 2PI)
        const nx = (x / w) * Math.PI * 2;
        
        // Basic Eye Shape (Sine)
        let y = Math.sin(nx + offset) * amplitude * (h/2.5);
        
        // Add Jitter (Simulating Noise/ISI) based on quality
        // Lower quality = Higher Jitter
        const noise = (Math.random() - 0.5) * jitter * 40;
        
        // Add "DC" offset drift for bad LDE
        const dcDrift = quality < 0.4 ? Math.sin(x * 0.05) * 10 : 0;

        ctx.lineTo(x, h/2 + y + noise + dcDrift);
      }
      ctx.stroke();
    };

    // Draw multiple traces to simulate persistence
    const traceCount = 15;
    const baseAmp = quality * 0.8 + 0.2; // 0.2 to 1.0
    const jitterAmount = 1 - quality;

    for(let i=0; i<traceCount; i++) {
        // Top rail
        drawWave(Math.PI / 2, baseAmp, jitterAmount);
        // Bottom rail
        drawWave(3 * Math.PI / 2, baseAmp, jitterAmount);
        // Transitions
        if (Math.random() > 0.5) drawWave(0, baseAmp, jitterAmount);
    }
    
    // Overlay text
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText(`EYE_H: ${(quality * 55).toFixed(1)}mV`, 10, 20);
    ctx.fillText(`JITTER: ${(jitterAmount * 4).toFixed(1)}ps`, 10, 35);

  }, [quality]);

  return (
    <div className="bg-black rounded-lg border-4 border-[#333] p-1 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
        <canvas ref={canvasRef} width={280} height={180} className="w-full h-full opacity-90" />
    </div>
  );
};

// 3. FinFET Layout Visualizer
const FinFetLayout = ({ hasDummyPoly, traceWidth }) => {
    return (
        <div className="w-full h-32 bg-[#1e293b] rounded-lg border-2 border-[#475569] p-4 relative overflow-hidden flex flex-col justify-center items-center">
            <span className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">LAYOUT_VIEW: OD/PO/M1</span>
            
            <div className="flex items-center gap-1">
                {/* Left Dummy (Conditional) */}
                <div className={`h-16 w-2 rounded-sm transition-all duration-500 ${hasDummyPoly ? 'bg-slate-600 scale-100' : 'bg-transparent scale-0 w-0'}`}></div>
                
                {/* Active Fins */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="relative group">
                        {/* Fin (Vertical) */}
                        <div className="w-1 h-20 bg-emerald-500/30 mx-2 rounded-full"></div>
                        {/* Gate (Horizontal, crossing fin) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-rose-500 rounded-sm z-10 border border-rose-400"></div>
                        {/* Metal 1 Contact (The Source) */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 z-20 rounded-sm transition-all duration-500 
                            ${traceWidth === 'wide' ? 'w-4 h-16 opacity-80' : 'w-2 h-14 opacity-60'}`}>
                        </div>
                    </div>
                ))}

                {/* Right Dummy (Conditional) */}
                <div className={`h-16 w-2 rounded-sm transition-all duration-500 ${hasDummyPoly ? 'bg-slate-600 scale-100' : 'bg-transparent scale-0 w-0'}`}></div>
            </div>

            {/* Annotations */}
            {!hasDummyPoly && (
                 <div className="absolute bottom-2 text-rose-400 text-xs font-bold animate-pulse">LDE STRESS DETECTED</div>
            )}
            {traceWidth === 'wide' && hasDummyPoly && (
                 <div className="absolute bottom-2 text-emerald-400 text-xs font-bold">OPTIMIZED</div>
            )}
        </div>
    )
}

// --- Main Application Component ---

export default function TapeOutCrunch() {
  const [day, setDay] = useState(0);
  const [metrics, setMetrics] = useState(METRICS_BASE);
  const [simState, setSimState] = useState({
    analysisRun: false,      // Mon
    parasiticsFound: false,  // Tue
    circuitFixed: false,     // Wed
    layoutFixed: false,      // Thu
    signedOff: false         // Fri
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Derived Quality for Eye Diagram (0.0 to 1.0)
  const eyeQuality = metrics.eyeHeight / 60; 

  const handleNextDay = () => {
    if (day < 4) setDay(day + 1);
  };

  // --- Day Actions ---

  const runAnalysis = () => {
    // Mon: Run Sim
    setSimState(prev => ({ ...prev, analysisRun: true }));
  };

  const runExtraction = () => {
    // Tue: Find the resistance
    setSimState(prev => ({ ...prev, parasiticsFound: true }));
    // Metrics drop slightly to show truth
    setMetrics(prev => ({ ...prev, bandwidth: 9.8, eyeHeight: 25 }));
  };

  const applyCircuitFix = () => {
    // Wed: Split Cap + Dummy Poly
    setSimState(prev => ({ ...prev, circuitFixed: true }));
    setMetrics(prev => ({ 
        ...prev, 
        gain: 10.8, 
        power: 4.8, // Power increases! Trade-off.
        eyeHeight: 40 
    }));
  };

  const applyLayoutECO = () => {
    // Thu: Widen traces
    setSimState(prev => ({ ...prev, layoutFixed: true }));
    setMetrics(prev => ({ 
        ...prev, 
        gain: 11.8, 
        bandwidth: 15.2, 
        eyeHeight: 48,
        power: 4.8
    }));
  };

  const signOff = () => {
    // Fri: Done
    setSimState(prev => ({ ...prev, signedOff: true }));
    setShowConfetti(true);
  };

  // --- Rendering Content Based on Day ---

  const renderDayContent = () => {
    switch (day) {
      case 0: // Monday
        return (
          <div className="space-y-4">
            <div className="bg-rose-900/30 border border-rose-500/50 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-rose-500 shrink-0" />
              <div>
                <h3 className="font-bold text-rose-200">JIRA-4022: CTLE Critical Failure</h3>
                <p className="text-sm text-rose-100/80 mt-1">
                  "Hey, the SerDes eye is completely closed at the SS/125C corner. 
                  We are -3 weeks to tape-out. Please fix ASAP." - Architect
                </p>
              </div>
            </div>
            
            <div className="flex justify-center py-6">
                {!simState.analysisRun ? (
                    <TactileButton onClick={runAnalysis}>
                        <Play className="inline mr-2 w-4 h-4"/> Launch ADE Assembler
                    </TactileButton>
                ) : (
                   <div className="text-center animate-pulse text-rose-400 font-bold">
                      DIAGNOSIS CONFIRMED: Gain &lt; 9dB
                   </div>
                )}
            </div>
          </div>
        );

      case 1: // Tuesday
        return (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              We suspect layout parasitics. The extraction tool (Calibre PEX) can tell us if the metal resistance is killing our "zero" frequency.
            </p>
             <div className="flex justify-center py-6">
                {!simState.parasiticsFound ? (
                    <TactileButton onClick={runExtraction} variant="neutral">
                        <Search className="inline mr-2 w-4 h-4"/> Run DSPF Extraction
                    </TactileButton>
                ) : (
                   <div className="w-full bg-slate-800 p-4 rounded-xl border-l-4 border-yellow-500">
                      <div className="text-yellow-400 font-bold mb-1">FINDING: High Source Resistance</div>
                      <p className="text-xs text-slate-400">
                        R_par ≈ 25Ω on the source node. This pushes the zero to a lower frequency.
                        Also, input pair is too close to well edge (LDE/LOD effect).
                      </p>
                   </div>
                )}
            </div>
          </div>
        );

      case 2: // Wednesday
        return (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-400 uppercase">Current Power</div>
                    <div className="text-xl font-mono text-emerald-400">{metrics.power}mW</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-400 uppercase">Power Budget</div>
                    <div className="text-xl font-mono text-rose-400">5.0mW</div>
                </div>
             </div>
             
             <p className="text-slate-300 text-sm">
                We need to recover gain. Increasing tail current is easy, but burns power. 
                Let's try splitting the source cap bank and adding dummy poly fingers to fix the stress effect.
             </p>

            <div className="flex justify-center py-4">
                <TactileButton onClick={applyCircuitFix} disabled={simState.circuitFixed} variant="primary">
                    <Settings className="inline mr-2 w-4 h-4"/> Apply Circuit Fixes
                </TactileButton>
            </div>
          </div>
        );
      
      case 3: // Thursday
        return (
          <div className="space-y-4">
            <FinFetLayout 
                hasDummyPoly={simState.circuitFixed} 
                traceWidth={simState.layoutFixed ? 'wide' : 'narrow'} 
            />
            <p className="text-slate-300 text-sm">
               Sitting with the Layout Designer. We need to widen M1 traces (drop resistance) and confirm the dummy poly placement.
            </p>
            <div className="flex justify-center py-4">
                <TactileButton onClick={applyLayoutECO} disabled={simState.layoutFixed} variant="success">
                    <Layers className="inline mr-2 w-4 h-4"/> Execute ECO & Re-Sim
                </TactileButton>
            </div>
          </div>
        );

      case 4: // Friday
        return (
          <div className="space-y-4 text-center">
            {showConfetti && <div className="absolute inset-0 pointer-events-none flex justify-center overflow-hidden">
                <div className="animate-bounce text-6xl mt-20">🎉</div>
            </div>}
            
            <div className="bg-emerald-900/30 border border-emerald-500/50 p-6 rounded-xl">
               <div className="text-3xl font-bold text-white mb-2">{metrics.eyeHeight}mV</div>
               <div className="text-emerald-400 uppercase tracking-widest text-sm">Eye Height (Passing)</div>
            </div>

            <p className="text-slate-300 text-sm">
               The SS/125C corner is clean. Power is slightly up (4.8mW), but within the 5mW budget.
            </p>

            <div className="flex justify-center py-4">
                 <TactileButton onClick={signOff} disabled={simState.signedOff} variant="success">
                    <CheckCircle className="inline mr-2 w-4 h-4"/> Generate DRD & Sign-off
                </TactileButton>
            </div>
          </div>
        );
    }
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-violet-500/30 p-4 md:p-8 flex justify-center items-center">
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .float-anim {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Header / Nav Area (Top or Left on Desktop) */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center bg-[#1E1E2E] p-6 rounded-3xl border border-[#2d2d44] shadow-2xl">
           <div className="flex items-center gap-4">
             <div className="bg-violet-600 p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <Cpu className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Tape-Out Crunch</h1>
                <p className="text-violet-400 font-medium">7nm FinFET SerDes • Analog Design</p>
             </div>
           </div>
           
           {/* Day Stepper */}
           <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {DAYS.map((d, index) => {
                 const isActive = day === index;
                 const isPast = day > index;
                 return (
                   <button 
                     key={d.id}
                     onClick={() => setDay(index)}
                     disabled={index > day && !simState.signedOff /* Can only jump back or current */}
                     className={`
                        flex flex-col items-center justify-center p-2 min-w-[60px] rounded-lg transition-all
                        ${isActive ? 'bg-[#363654] border-b-2 border-violet-500' : ''}
                        ${isPast ? 'opacity-50 hover:opacity-100' : ''}
                        ${index > day ? 'opacity-20 cursor-not-allowed' : ''}
                     `}
                   >
                      <d.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-bold uppercase">{d.id}</span>
                   </button>
                 )
              })}
           </div>
        </div>

        {/* Left Column: The Dashboard / Task */}
        <div className="lg:col-span-5 space-y-6">
           {/* Current Task Card */}
           <Card className="min-h-[300px] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <Badge color="bg-violet-900/50 text-violet-300">{DAYS[day].title}</Badge>
                 <div className="text-xs text-slate-500 font-mono">Sprint: Week 42</div>
              </div>
              
              <div className="flex-grow">
                 {renderDayContent()}
              </div>

              {/* Navigation Footer */}
              <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                 <div className="text-xs text-slate-500">
                    Step {day + 1} of 5
                 </div>
                 {day < 4 && (
                   <button 
                     onClick={handleNextDay}
                     disabled={
                        (day === 0 && !simState.analysisRun) ||
                        (day === 1 && !simState.parasiticsFound) ||
                        (day === 2 && !simState.circuitFixed) ||
                        (day === 3 && !simState.layoutFixed)
                     }
                     className="flex items-center text-sm font-bold text-violet-400 hover:text-white disabled:opacity-30 disabled:hover:text-violet-400 transition-colors"
                   >
                      Next Day <ArrowRight className="w-4 h-4 ml-1" />
                   </button>
                 )}
              </div>
           </Card>

           {/* Metrics Deck */}
           <div className="grid grid-cols-2 gap-3">
              <Card className="flex flex-col items-center justify-center py-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Peaking Gain</span>
                  <div className={`text-2xl font-mono font-bold ${metrics.gain < TARGETS.gain ? 'text-rose-500' : 'text-emerald-400'}`}>
                     {metrics.gain}<span className="text-sm ml-1">dB</span>
                  </div>
                  <div className="w-16 h-1 bg-slate-700 mt-2 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 ${metrics.gain < TARGETS.gain ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(metrics.gain/15)*100}%` }}
                     />
                  </div>
              </Card>
              <Card className="flex flex-col items-center justify-center py-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Bandwidth</span>
                  <div className={`text-2xl font-mono font-bold ${metrics.bandwidth < TARGETS.bandwidth ? 'text-rose-500' : 'text-emerald-400'}`}>
                     {metrics.bandwidth}<span className="text-sm ml-1">GHz</span>
                  </div>
                  <div className="w-16 h-1 bg-slate-700 mt-2 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 ${metrics.bandwidth < TARGETS.bandwidth ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(metrics.bandwidth/20)*100}%` }}
                     />
                  </div>
              </Card>
           </div>
        </div>

        {/* Right Column: The Visual Metaphor (Workbench) */}
        <div className="lg:col-span-7">
           <Card className="h-full bg-[#151520] border-[#333] flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
              
              {/* Background Elements (Decor) */}
              <div className="absolute top-10 right-10 opacity-10">
                 <Zap className="w-48 h-48 text-violet-500" />
              </div>

              {/* The Engineer Character */}
              <div className="z-10 mb-8">
                 <EngineerAvatar emotion={metrics.eyeHeight > 40 ? 'happy' : 'neutral'} />
              </div>

              {/* The "Machine" (CTLE Block) */}
              <div className="bg-[#2a2a35] border-4 border-[#3f3f50] rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full max-w-md relative z-10">
                  
                  {/* Machine Header */}
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Cadence Virtuoso ADE
                      </div>
                  </div>

                  {/* Main Screen (Eye Diagram) */}
                  <div className="mb-6">
                      <EyeDiagram quality={eyeQuality} />
                  </div>

                  {/* Knobs & Sliders (Visual Only) */}
                  <div className="grid grid-cols-3 gap-4">
                      {/* Knob 1 */}
                      <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-[#1a1a24] border-2 border-[#333] shadow-inner flex items-center justify-center relative">
                             <div className="w-1 h-4 bg-violet-500 absolute top-1 rounded-full transition-transform duration-700" style={{ transform: `rotate(${metrics.gain * 20}deg)`, transformOrigin: 'bottom center', top: '50%', marginTop: '-50%' }}></div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">GAIN</span>
                      </div>
                      
                      {/* Knob 2 */}
                      <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-[#1a1a24] border-2 border-[#333] shadow-inner flex items-center justify-center relative">
                             <div className="w-1 h-4 bg-cyan-500 absolute top-1 rounded-full transition-transform duration-700" style={{ transform: `rotate(${metrics.bandwidth * 10}deg)`, transformOrigin: 'bottom center', top: '50%', marginTop: '-50%' }}></div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">PEAKING</span>
                      </div>

                      {/* Switch */}
                      <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-12 rounded-lg border-2 border-[#333] flex flex-col items-center justify-between p-1 transition-colors ${simState.signedOff ? 'bg-emerald-900/50' : 'bg-[#1a1a24]'}`}>
                             <div className={`w-full h-4 rounded-md transition-all ${simState.signedOff ? 'bg-emerald-500 translate-y-0' : 'bg-slate-700 translate-y-5'}`}></div>
                          </div>
                           <span className="text-[10px] text-slate-500 font-bold">SIGNOFF</span>
                      </div>
                  </div>

                  {/* Cables (Decorative SVG) */}
                  <svg className="absolute -bottom-12 left-10 w-24 h-24 text-slate-700 -z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M10 0 C 10 50, 90 50, 90 100" />
                  </svg>
                   <svg className="absolute -bottom-12 right-10 w-24 h-24 text-slate-700 -z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M90 0 C 90 50, 10 50, 10 100" />
                  </svg>
              </div>

              <div className="mt-8 text-center opacity-40">
                 <div className="text-[10px] uppercase font-bold text-slate-500">Simulation Environment</div>
                 <div className="text-xs font-mono text-slate-600">Spectre X • 7nm PDK v1.2</div>
              </div>

           </Card>
        </div>

      </div>
    </div>
  );
}

