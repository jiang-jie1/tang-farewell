/*
 * LocationPanel.tsx - 地点信息侧边面板
 * 设计：宣纸质感卡片，展示地点基本信息和诗词列表
 * 点击诗词卡片触发诗词详情弹窗
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, BookOpen, ChevronRight } from 'lucide-react';
import { type Location, type Poem } from '@/data/poems';

interface LocationPanelProps {
  location: Location | null;
  onClose: () => void;
  onPoemSelect: (poem: Poem) => void;
}

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  capital: { bg: '#C0392B', text: '#fff', label: '都城' },
  river: { bg: '#2E7D32', text: '#fff', label: '水路枢纽' },
  frontier: { bg: '#8B6914', text: '#fff', label: '边塞' },
  other: { bg: '#4A4A8A', text: '#fff', label: '其他' },
};

export default function LocationPanel({ location, onClose, onPoemSelect }: LocationPanelProps) {
  if (!location) return null;
  const catStyle = categoryColors[location.category] || categoryColors.other;

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          key={location.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-80 md:w-96 z-30 flex flex-col"
          style={{
            background: 'linear-gradient(135deg, #f5edd6 0%, #ede0c4 100%)',
            borderLeft: '1px solid #c9b49a',
            boxShadow: '-4px 0 20px rgba(60,40,20,0.15)',
          }}
        >
          {/* 头部 */}
          <div className="relative p-5 pb-4 border-b border-[#c9b49a]">
            {/* 装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: catStyle.bg }} />
            
            <div className="flex items-start justify-between mt-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{ background: catStyle.bg, color: catStyle.text, fontFamily: 'Noto Serif SC, serif' }}
                  >
                    {catStyle.label}
                  </span>
                  <span className="text-xs text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    {location.province}
                  </span>
                </div>
                <h2
                  className="text-2xl text-[#1a1a1a] leading-tight"
                  style={{ fontFamily: 'Ma Shan Zheng, serif' }}
                >
                  {location.modernName}
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#8B6914]" />
                  <span className="text-sm text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    古为{location.ancientName}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#8B6914] hover:text-[#C0392B] transition-colors p-1 mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 地点描述 */}
          <div className="px-5 py-4 border-b border-[#c9b49a]/60">
            <p
              className="text-sm text-[#3d2b1f] leading-relaxed"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              {location.description}
            </p>
          </div>

          {/* 诗词列表 */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B6914]" />
              <span
                className="text-sm font-semibold text-[#3d2b1f]"
                style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '1rem' }}
              >
                相关送别诗（{location.poems.length}首）
              </span>
            </div>
            
            <div className="px-4 pb-6 space-y-3">
              {location.poems.map((poem, idx) => (
                <motion.button
                  key={poem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => onPoemSelect(poem)}
                  className="w-full text-left rounded-sm overflow-hidden group"
                  style={{
                    background: 'rgba(245,237,214,0.8)',
                    border: '1px solid #c9b49a',
                    boxShadow: '1px 1px 4px rgba(60,40,20,0.1)',
                  }}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div
                          className="font-semibold text-[#1a1a1a] text-base group-hover:text-[#C0392B] transition-colors"
                          style={{ fontFamily: 'Ma Shan Zheng, serif' }}
                        >
                          《{poem.title}》
                        </div>
                        <div className="text-xs text-[#8B6914] mt-0.5" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                          {poem.dynasty} · {poem.author}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#c9b49a] group-hover:text-[#C0392B] transition-colors mt-1 shrink-0" />
                    </div>
                    
                    {/* 诗句预览 */}
                    <div className="space-y-0.5">
                      {poem.lines.slice(0, 2).map((line, i) => (
                        <div
                          key={i}
                          className="text-xs text-[#5a4030] leading-relaxed"
                          style={{ fontFamily: 'Noto Serif SC, serif', letterSpacing: '0.05em' }}
                        >
                          {line}
                        </div>
                      ))}
                      {poem.lines.length > 2 && (
                        <div className="text-xs text-[#a08060]">…</div>
                      )}
                    </div>
                  </div>
                  
                  {/* 悬停底部装饰 */}
                  <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: catStyle.bg }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
