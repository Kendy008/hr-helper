import { useState } from 'react';
import { Users, Trophy, LayoutGrid, Settings, Heart } from 'lucide-react';
import { Person, AppTab } from './types';
import { cn } from './lib/utils';
import NameInput from './components/NameInput';
import LuckyDraw from './components/LuckyDraw';
import Grouping from './components/Grouping';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('list');
  const [names, setNames] = useState<Person[]>([]);

  const tabs = [
    { id: 'list', label: '名單管理', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'draw', label: '獎品抽籤', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'group', label: '自動分組', icon: LayoutGrid, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">HR 萬能助手</h1>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">All-in-One HR Tool</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    isActive 
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? tab.color : "text-gray-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">目前名單</span>
              <span className="text-sm font-black text-blue-600">{names.length} 人</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=HR" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center justify-around bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 z-50 px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? tab.color : "text-gray-400"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            {activeTab === 'list' && "上傳或輸入您的名單，這是所有功能的基礎。"}
            {activeTab === 'draw' && "公平公正的隨機抽籤，支援重複與不重複模式。"}
            {activeTab === 'group' && "一鍵自動分組，讓團隊合作更簡單。"}
          </p>
        </div>

        <div className="relative">
          {activeTab === 'list' && <NameInput names={names} onNamesChange={setNames} />}
          {activeTab === 'draw' && <LuckyDraw names={names} />}
          {activeTab === 'group' && <Grouping names={names} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100 mt-12 hidden md:block">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <span>© 2026 HR 萬能助手</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for HR Professionals</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">隱私權政策</a>
            <a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">使用條款</a>
            <a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">聯絡我們</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
