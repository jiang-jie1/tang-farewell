/*
 * SearchBar.tsx - 古风搜索栏组件
 * 功能：支持搜索古地名/今地名/诗歌名/诗句，高亮显示对应地点
 * 修复：使用 createPortal 渲染下拉框，避免被父容器 overflow:hidden 裁剪
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, MapPin, BookOpen } from 'lucide-react';
import { locations, type Location, type Poem } from '@/data/poems';

interface SearchResult {
  type: 'location' | 'poem';
  location: Location;
  poem?: Poem;
  matchText: string;
  subText?: string;
}

interface SearchBarProps {
  onLocationHighlight: (locationId: string, poemId?: string) => void;
  onClear: () => void;
}

function doSearch(q: string): SearchResult[] {
  if (!q.trim()) return [];
  const keyword = q.trim().toLowerCase();
  const found: SearchResult[] = [];

  locations.forEach(loc => {
    // 搜索今地名、古地名、省份
    if (
      loc.modernName.toLowerCase().includes(keyword) ||
      loc.name.toLowerCase().includes(keyword)
    ) {
      found.push({
        type: 'location',
        location: loc,
        matchText: `${loc.modernName}`,
        subText: `古为${loc.name}`,
      });
    }

    // 搜索诗歌名、作者、诗句
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
            ? `《${poem.title}》`
            : authorMatch
            ? `${poem.author}·《${poem.title}》`
            : `"${matchLine?.trim()}"`,
          subText: titleMatch
            ? `${poem.dynasty} · ${poem.author} | ${loc.modernName}（${loc.name}）`
            : authorMatch
            ? `${poem.dynasty} · ${loc.modernName}（${loc.name}）`
            : `《${poem.title}》${poem.author} | ${loc.modernName}`,
        });
      }
    });
  });

  // 去重
  return found.filter((item, index, self) => {
    if (item.type === 'location') {
      return self.findIndex(i => i.type === 'location' && i.location.id === item.location.id) === index;
    }
    return self.findIndex(i => i.type === 'poem' && i.poem?.id === item.poem?.id) === index;
  }).slice(0, 10);
}

export default function SearchBar({ onLocationHighlight, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算下拉框位置（使用 portal 渲染到 body，避免 overflow 裁剪）
  const updateDropdownPos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = doSearch(value);
    setResults(found);
    setIsOpen(found.length > 0);
    updateDropdownPos();
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.type === 'poem' ? result.matchText : result.matchText);
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

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        // 检查是否点击了下拉框（portal渲染在body中）
        const dropdown = document.getElementById('search-dropdown-portal');
        if (dropdown && !dropdown.contains(target)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 窗口滚动或resize时更新位置
  useEffect(() => {
    if (isOpen) {
      updateDropdownPos();
      window.addEventListener('resize', updateDropdownPos);
      return () => window.removeEventListener('resize', updateDropdownPos);
    }
  }, [isOpen, updateDropdownPos]);

  const dropdown = isOpen && results.length > 0 ? createPortal(
    <div
      id="search-dropdown-portal"
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
        background: 'rgba(250,244,230,0.99)',
        border: '1px solid #c9b49a',
        borderRadius: '2px',
        boxShadow: '0 8px 32px rgba(60,40,20,0.18), 0 2px 8px rgba(60,40,20,0.1)',
        overflow: 'hidden',
        maxHeight: '360px',
        overflowY: 'auto',
      }}
    >
      {/* 搜索结果头部提示 */}
      <div
        style={{
          padding: '6px 12px',
          fontSize: '11px',
          color: '#8B6914',
          borderBottom: '1px solid #e8d5a3',
          fontFamily: 'Noto Serif SC, serif',
          background: 'rgba(245,237,214,0.6)',
        }}
      >
        找到 {results.length} 条结果，点击即可定位
      </div>

      {results.map((result, idx) => (
        <button
          key={`${result.type}-${result.location.id}-${result.poem?.id ?? ''}`}
          onMouseDown={e => {
            e.preventDefault(); // 防止 input blur 先触发
            handleSelect(result);
          }}
          onMouseEnter={() => setActiveIndex(idx)}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            borderBottom: idx < results.length - 1 ? '1px solid rgba(201,180,154,0.3)' : 'none',
            background: activeIndex === idx ? 'rgba(232,213,163,0.5)' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {/* 类型图标 */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
              background: result.type === 'location' ? '#C0392B' : '#2E7D32',
            }}
          >
            {result.type === 'location'
              ? <MapPin style={{ width: '14px', height: '14px', color: '#fff' }} />
              : <BookOpen style={{ width: '14px', height: '14px', color: '#fff' }} />
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 类型标签 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '2px',
                  background: result.type === 'location' ? 'rgba(192,57,43,0.12)' : 'rgba(46,125,50,0.12)',
                  color: result.type === 'location' ? '#C0392B' : '#2E7D32',
                  fontFamily: 'Noto Serif SC, serif',
                  flexShrink: 0,
                }}
              >
                {result.type === 'location' ? '地点' : '诗词'}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  fontFamily: result.type === 'poem' ? 'Ma Shan Zheng, serif' : 'Noto Serif SC, serif',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {result.matchText}
              </span>
            </div>
            {result.subText && (
              <div
                style={{
                  fontSize: '11px',
                  color: '#8B6914',
                  fontFamily: 'Noto Serif SC, serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {result.subText}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245,237,214,0.97)',
            border: `1px solid ${isOpen ? '#8B6914' : '#c9b49a'}`,
            borderRadius: '2px',
            padding: '8px 12px',
            boxShadow: isOpen
              ? '0 0 0 2px rgba(139,105,20,0.2), 0 4px 16px rgba(60,40,20,0.15)'
              : '0 2px 8px rgba(60,40,20,0.12)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <Search style={{ width: '16px', height: '16px', color: '#8B6914', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
                updateDropdownPos();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="搜索地名、诗歌名或诗句…"
            style={{
              background: 'transparent',
              outline: 'none',
              border: 'none',
              fontSize: '14px',
              color: '#1a1a1a',
              fontFamily: 'Noto Serif SC, serif',
              width: '100%',
              minWidth: 0,
            }}
          />
          {query && (
            <button
              onClick={handleClear}
              style={{
                color: '#a08060',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a08060')}
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          )}
        </div>
      </div>

      {/* 通过 portal 渲染到 body，避免被父容器 overflow:hidden 裁剪 */}
      {dropdown}
    </>
  );
}
