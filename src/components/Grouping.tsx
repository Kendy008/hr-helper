import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { Person, Group } from '../types';
import { cn } from '../lib/utils';

interface GroupingProps {
  names: Person[];
}

export default function Grouping({ names }: GroupingProps) {
  const [groupSize, setGroupSize] = useState(3);
  const [groups, setGroups] = useState<Group[]>([]);

  const handleGroup = () => {
    if (names.length === 0) return;

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${Math.floor(i / groupSize) + 1} 組`,
        members: shuffled.slice(i, i + groupSize)
      });
    }
    
    setGroups(newGroups);
  };

  const downloadResults = () => {
    if (groups.length === 0) return;

    // Create CSV content
    const csvRows = [
      ['組別', '成員姓名'], // Header
      ...groups.flatMap(g => g.members.map(m => [g.name, m.name]))
    ];
    
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `分組結果_${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-blue-600" />
              分組設定
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">每組人數</label>
                <input
                  type="number"
                  min="1"
                  max={names.length}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">預計組數</label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-medium">
                  {Math.ceil(names.length / groupSize) || 0} 組
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleGroup}
              disabled={names.length === 0}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-lg",
                names.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              )}
            >
              <Shuffle className="w-5 h-5" />
              開始分組
            </button>
            {groups.length > 0 && (
              <button
                onClick={downloadResults}
                className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                title="下載結果"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{group.name}</h3>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">
                {group.members.length} 人
              </span>
            </div>
            <div className="space-y-2">
              {group.members.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-2 text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {member.name}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        {groups.length === 0 && names.length > 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>設定好人數後點擊「開始分組」</p>
          </div>
        )}
        {names.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <p>請先在「名單管理」中加入成員</p>
          </div>
        )}
      </div>
    </div>
  );
}
