import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Settings2, UserCheck } from 'lucide-react';
import { Person } from '../types';
import { cn } from '../lib/utils';

interface LuckyDrawProps {
  names: Person[];
}

export default function LuckyDraw({ names }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [history, setHistory] = useState<Person[]>([]);
  const [repeatable, setRepeatable] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableNames = repeatable 
    ? names 
    : names.filter(p => !history.find(h => h.id === p.id));

  const startDraw = useCallback(() => {
    if (availableNames.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);

    // Animation duration
    const duration = 2000;
    const interval = 80;
    let elapsed = 0;

    const timer = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * availableNames.length));
      elapsed += interval;
      
      if (elapsed >= duration) {
        clearInterval(timer);
        const finalWinner = availableNames[Math.floor(Math.random() * availableNames.length)];
        setWinner(finalWinner);
        setHistory(prev => [finalWinner, ...prev]);
        setIsDrawing(false);
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#60A5FA', '#93C5FD']
        });
      }
    }, interval);
  }, [availableNames, history, repeatable]);

  const resetHistory = () => {
    setHistory([]);
    setWinner(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12 text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={cn(
              "p-3 rounded-2xl transition-colors",
              isDrawing ? "bg-blue-100 text-blue-600 animate-pulse" : "bg-gray-100 text-gray-600"
            )}>
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">獎品抽籤</h2>
          </div>

          <div className="relative h-48 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-5xl font-black text-blue-600 tracking-widest"
                >
                  {availableNames[currentIndex]?.name}
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-medium text-blue-500 uppercase tracking-widest">恭喜中獎者</p>
                  <p className="text-6xl font-black text-gray-900">{winner.name}</p>
                </motion.div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <UserCheck className="w-12 h-12 opacity-20" />
                  <p>準備就緒，點擊下方按鈕開始</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <Settings2 className="w-4 h-4 text-gray-500" />
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={repeatable}
                  onChange={(e) => setRepeatable(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 font-medium">允許重複中獎</span>
              </label>
            </div>

            <button
              onClick={startDraw}
              disabled={isDrawing || availableNames.length === 0}
              className={cn(
                "px-12 py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-lg",
                isDrawing || availableNames.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              )}
            >
              {isDrawing ? "抽籤中..." : "開始抽籤"}
            </button>
          </div>

          {availableNames.length === 0 && names.length > 0 && !repeatable && (
            <p className="text-sm text-red-500 font-medium">所有人皆已中獎！請重置歷史記錄或開啟重複中獎。</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500" />
              中獎歷史
            </h3>
            <button
              onClick={resetHistory}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              清空歷史
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 italic">尚無中獎記錄</p>
            ) : (
              history.map((person, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`${person.id}-${idx}`}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm font-medium"
                >
                  {person.name}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-6 text-white flex flex-col justify-center items-center text-center space-y-2">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">剩餘候選人</p>
          <p className="text-5xl font-black">{availableNames.length}</p>
          <p className="text-blue-100 text-xs">總人數: {names.length}</p>
        </div>
      </div>
    </div>
  );
}
