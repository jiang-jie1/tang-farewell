/*
 * SearchBar.tsx - 古风搜索栏组件
 * 功能：支持搜索古地名/今地名/诗歌名/诗句，高亮显示对应地点
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { locations, type Location, type Poem } from '@/data/poems';

interface SearchResult {
  type: 'location' | 'poem';
  location: Location;
  poem?: Poem;
  matchText: string;
}

interface SearchBarProps {
  onLocationHighlight: (locationId: string, poemId?: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onLocationHighlight, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const search = (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const keyword = q.trim().toLowerCase();
    const found: SearchResult[] = [];

    locations.forEach(loc => {
      // 搜索地名
      if (
        loc.modernName.toLowerCase().includes(keyword) ||
        loc.ancientName.toLowerCase().includes(keyword) ||
        loc.province.toLowerCase().includes(keyword)
      ) {
        found.push({
          type: 'location',
          location: loc,
          matchText: `${loc.modernName}（古为${loc.ancientName}）`,
        });
      }

      // 搜索诗歌
      loc.poems.forEach(poem => {
        const titleMatch = poem.title.toLowerCase().includes(keyword);
        const authorMatch = poem.author.toLowerCase().includes(keyword);
        const lineMatch = poem.lines.some(line => line.toLowerCase().includes(keyword));

        if (titleMatch || authorMatch || lineMatch) {
          const matchLine = poem.lines.find(l => l.toLowerCase().includes(keyword));
          found.push({
            type: 'poem',
            location: loc,
            poem,
            matchText: titleMatch
              ? `《${poem.title}》— ${poem.author}`
              : authorMatch
              ? `${poem.author}·《${poem.title}》`
              : `"${matchLine?.trim()}"`,
          });
        }
      });
    });

    // 去重
    const unique = found.filter((item, index, self) => {
      if (item.type === 'location') {
        return self.findIndex(i => i.type === 'location' && i.location.id === item.location.id) === index;
      }
      return self.findIndex(i => i.type === 'poem' && i.poem?.id === item.poem?.id) === index;
    });

    setResults(unique.slice(0, 8));
    setIsOpen(unique.length > 0);
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.matchText);
    setIsOpen(false);
    onLocationHighlight(result.location.id, result.poem?.id);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onClear();
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-[#f5edd6]/95 border border-[#c9b49a] rounded-sm px-3 py-2 shadow-md backdrop-blur-sm">
        <Search className="w-4 h-4 text-[#8B6914] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="搜索地名、诗歌或诗句…"
          className="bg-transparent outline-none text-sm text-[#1a1a1a] placeholder-[#a08060] w-full min-w-0"
          style={{ fontFamily: 'Noto Serif SC, serif' }}
        />
        {query && (
          <button onClick={handleClear} className="text-[#a08060] hover:text-[#C0392B] transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#f5edd6]/98 border border-[#c9b49a] rounded-sm shadow-lg z-50 overflow-hidden">
          {results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-3 py-2 hover:bg-[#e8d5a3]/60 transition-colors flex items-start gap-2 border-b border-[#e8d5a3] last:border-0"
            >
              <span
                className="shrink-0 text-xs px-1.5 py-0.5 rounded-sm mt-0.5"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  background: result.type === 'location' ? '#C0392B' : '#2E7D32',
                  color: '#f5edd6',
                }}
              >
                {result.type === 'location' ? '地点' : '诗词'}
              </span>
              <div>
                <div className="text-sm text-[#1a1a1a]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  {result.matchText}
                </div>
                {result.type === 'poem' && (
                  <div className="text-xs text-[#8B6914] mt-0.5">
                    位于：{result.location.modernName}（{result.location.ancientName}）
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
