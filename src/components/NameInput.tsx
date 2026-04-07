import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Upload, Trash2, Users, FileText, Sparkles, UserMinus, AlertCircle } from 'lucide-react';
import { Person } from '../types';
import { cn } from '../lib/utils';

interface NameInputProps {
  names: Person[];
  onNamesChange: (names: Person[]) => void;
}

const MOCK_NAMES = [
  "陳小明", "林美惠", "張大華", "李志強", "王曉萍", 
  "趙子龍", "孫悟空", "周杰倫", "蔡依林", "林俊傑",
  "劉德華", "張學友", "郭富城", "黎明", "周星馳",
  "梁朝偉", "金城武", "彭于晏", "許光漢", "桂綸鎂"
];

export default function NameInput({ names, onNamesChange }: NameInputProps) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect duplicates
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    names.forEach(p => {
      const name = p.name.trim();
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return new Set([...counts.entries()].filter(([_, count]) => count > 1).map(([name]) => name));
  }, [names]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const newNames = lines.map((name, index) => ({
      id: `manual-${index}-${Date.now()}`,
      name: name.trim()
    }));
    onNamesChange(newNames);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames: Person[] = results.data
          .flat()
          .filter((name: any) => typeof name === 'string' && name.trim() !== '')
          .map((name: any, index: number) => ({
            id: `csv-${index}-${Date.now()}`,
            name: name.trim()
          }));
        
        if (parsedNames.length > 0) {
          const combinedNames = [...names, ...parsedNames];
          onNamesChange(combinedNames);
          setInputText(combinedNames.map(p => p.name).join('\n'));
        }
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const loadMockData = () => {
    const mockPeople = MOCK_NAMES.map((name, index) => ({
      id: `mock-${index}-${Date.now()}`,
      name
    }));
    onNamesChange(mockPeople);
    setInputText(MOCK_NAMES.join('\n'));
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueNames: Person[] = [];
    names.forEach(p => {
      const name = p.name.trim();
      if (!seen.has(name)) {
        seen.add(name);
        uniqueNames.push(p);
      }
    });
    onNamesChange(uniqueNames);
    setInputText(uniqueNames.map(p => p.name).join('\n'));
  };

  const clearNames = () => {
    onNamesChange([]);
    setInputText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              名單來源
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={loadMockData}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                載入模擬名單
              </button>
              <button
                onClick={clearNames}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={inputText}
              onChange={handleTextChange}
              placeholder="請輸入姓名，每行一個..."
              className="w-full h-64 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-sans text-gray-700"
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              共 {names.length} 人
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              批次上傳與預覽
            </h2>
            {duplicateNames.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-amber-200 transition-colors"
              >
                <UserMinus className="w-3 h-3" />
                移除重複 ({duplicateNames.size} 組)
              </button>
            )}
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 text-sm">點擊或拖拽 CSV 檔案</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-blue-500" />
              名單預覽
              {duplicateNames.size > 0 && (
                <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  發現重複姓名
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {names.length === 0 ? (
                <span className="text-sm text-gray-400 italic">尚未加入任何姓名</span>
              ) : (
                names.map(person => {
                  const isDuplicate = duplicateNames.has(person.name.trim());
                  return (
                    <span 
                      key={person.id} 
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                        isDuplicate 
                          ? "bg-red-50 text-red-600 border-red-100 ring-2 ring-red-50" 
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      )}
                    >
                      {person.name}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
