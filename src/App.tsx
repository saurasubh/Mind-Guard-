import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldAlert, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCcw,
  Loader2,
  ChevronRight,
  UserCheck,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNextAction, analyzeSituation, reframeNegativity } from './lib/gemini';
import { cn } from './lib/utils';

type View = 'dashboard' | 'action' | 'discernment' | 'reframe';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await getNextAction(input);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscernment = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeSituation(input);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReframe = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await reframeNegativity(input);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={reset}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">MindGuard</span>
          </div>
          <button 
            onClick={reset}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Hello. What's on your mind?
                </h1>
                <p className="text-lg text-slate-500">
                  Let's break the cycle of procrastination and fear together.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard 
                  icon={<Zap className="w-6 h-6 text-amber-500" />}
                  title="What's Next?"
                  description="Break down a scary task into one tiny, easy step."
                  onClick={() => setView('action')}
                  color="hover:border-amber-200 hover:bg-amber-50/30"
                />
                <DashboardCard 
                  icon={<ShieldAlert className="w-6 h-6 text-indigo-500" />}
                  title="Discernment"
                  description="Analyze a situation to see if you're being taken advantage of."
                  onClick={() => setView('discernment')}
                  color="hover:border-indigo-200 hover:bg-indigo-50/30"
                />
                <DashboardCard 
                  icon={<RefreshCcw className="w-6 h-6 text-emerald-500" />}
                  title="Reframe"
                  description="Turn a negative or fearful thought into a growth mindset."
                  onClick={() => setView('reframe')}
                  color="hover:border-emerald-200 hover:bg-emerald-50/30"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Daily Affirmation
                </h3>
                <p className="text-slate-600 italic leading-relaxed">
                  "I am capable of making my own decisions. My time is valuable, and I choose to spend it on things that help me grow. I don't need to be perfect; I just need to take the next step."
                </p>
              </div>
            </motion.div>
          )}

          {view !== 'dashboard' && !result && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Dashboard
              </button>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  {view === 'action' && "What are you putting off?"}
                  {view === 'discernment' && "Describe the situation."}
                  {view === 'reframe' && "What's the negative thought?"}
                </h2>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    view === 'action' ? "e.g., I need to start my taxes but it feels overwhelming..." :
                    view === 'discernment' ? "e.g., My friend keeps asking for money and I feel bad saying no..." :
                    "e.g., I'm afraid I'll fail if I try this new project..."
                  }
                  className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-lg"
                />
                <button 
                  onClick={
                    view === 'action' ? handleAction :
                    view === 'discernment' ? handleDiscernment :
                    handleReframe
                  }
                  disabled={loading || !input.trim()}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Get Guidance
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-100">
                {view === 'action' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="text-amber-600 w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Your Next Step</span>
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{result.step}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-indigo-600" />
                          Why this works
                        </h4>
                        <p className="text-slate-600 leading-relaxed">{result.why}</p>
                      </div>
                      <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          Motivation
                        </h4>
                        <p className="text-indigo-700 leading-relaxed">{result.motivation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {view === 'discernment' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="text-indigo-600 w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Discernment Analysis</span>
                        <p className="text-lg text-slate-700 leading-relaxed">{result.analysis}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        Potential Red Flags
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {result.redFlags.map((flag: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-sm font-medium">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-indigo-600 rounded-xl text-white">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Advice for You
                      </h4>
                      <p className="opacity-90 leading-relaxed">{result.advice}</p>
                    </div>
                  </div>
                )}

                {view === 'reframe' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <RefreshCcw className="text-emerald-600 w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Reframed Perspective</span>
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight italic">"{result.reframedThought}"</h3>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-xl text-white">
                      <h4 className="font-bold mb-2 text-emerald-400 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Actionable Insight
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{result.actionableInsight}</p>
                    </div>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => {
                      setResult(null);
                      setInput('');
                    }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Try Another
                  </button>
                  <button 
                    onClick={reset}
                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2026 MindGuard AI • Your Personal Action & Discernment Coach</p>
      </footer>
    </div>
  );
}

function DashboardCard({ icon, title, description, onClick, color }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  onClick: () => void,
  color: string
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 bg-white border border-slate-200 rounded-2xl text-left transition-all duration-300 group shadow-sm hover:shadow-md",
        color
      )}
    >
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
}
