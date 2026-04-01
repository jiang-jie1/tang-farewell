/*
 * PoemModal.tsx - 诗词详情弹窗
 * 设计：卷轴展开动画，宣纸质感，包含诗词原文/赏析/课外知识/填词游戏入口
 * 功能：展示诗词全文，赏析，课外小知识；右下角有"挑战填词"按钮
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lightbulb, Feather, ChevronDown, ChevronUp } from 'lucide-react';
import { type Poem, type Location } from '@/data/poems';

interface PoemModalProps {
  poem: Poem | null;
  location: Location | null;
  onClose: () => void;
  onStartGame: (poem: Poem) => void;
}

export default function PoemModal({ poem, location, onClose, onStartGame }: PoemModalProps) {
  const [activeTab, setActiveTab] = useState<'poem' | 'appreciation' | 'trivia'>('poem');
  const [expandedTrivia, setExpandedTrivia] = useState<number | null>(null);

  if (!poem || !location) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(30,20,10,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #f5edd6 0%, #ede0c4 60%, #e8d5a3 100%)',
            boxShadow: '0 20px 60px rgba(30,20,10,0.4), inset 0 0 60px rgba(245,237,214,0.3)',
            border: '1px solid #c9b49a',
          }}
        >
          {/* 顶部装饰条 */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #C0392B, #8B6914, #C0392B)' }} />

          {/* 头部 */}
          <div className="px-6 pt-5 pb-4 border-b border-[#c9b49a]/60 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#8B6914] hover:text-[#C0392B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[#8B6914] border border-[#8B6914] px-2 py-0.5" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                {poem.dynasty}
              </span>
              <span className="text-xs text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                {location.modernName} · {location.ancientName}
              </span>
            </div>
            <h2
              className="text-2xl text-[#1a1a1a] mb-1"
              style={{ fontFamily: 'Ma Shan Zheng, serif' }}
            >
              《{poem.title}》
            </h2>
            <p className="text-sm text-[#5a4030]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {poem.author}
            </p>
          </div>

          {/* 标签页 */}
          <div className="flex border-b border-[#c9b49a]/60">
            {[
              { key: 'poem', label: '诗词原文', icon: Feather },
              { key: 'appreciation', label: '赏析', icon: BookOpen },
              { key: 'trivia', label: '课外知识', icon: Lightbulb },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm transition-all"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: activeTab === key ? '#C0392B' : '#8B6914',
                  borderBottom: activeTab === key ? '2px solid #C0392B' : '2px solid transparent',
                  background: activeTab === key ? 'rgba(192,57,43,0.05)' : 'transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'poem' && (
                <motion.div
                  key="poem"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {/* 诗词正文 */}
                  <div
                    className="text-center mb-8"
                    style={{
                      backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/poem-card-bg-F7AqPQzbt28Hf7dxMEcsM5.webp)`,
                      backgroundSize: 'cover',
                      padding: '2rem',
                      borderRadius: '2px',
                      border: '1px solid #c9b49a',
                    }}
                  >
                    {poem.lines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-xl text-[#1a1a1a] leading-loose tracking-widest"
                        style={{ fontFamily: 'Noto Serif SC, serif', textShadow: '0 1px 2px rgba(245,237,214,0.5)' }}
                      >
                        {line}
                      </motion.div>
                    ))}
                    <div className="mt-4 text-sm text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                      —— {poem.dynasty} · {poem.author}
                    </div>
                  </div>

                  {/* 填词游戏按钮 */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onStartGame(poem)}
                      className="btn-seal flex items-center gap-2"
                      style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '1rem' }}
                    >
                      <Feather className="w-4 h-4" />
                      挑战填词
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appreciation' && (
                <motion.div
                  key="appreciation"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div
                    className="text-sm text-[#2d1f0f] leading-8 whitespace-pre-line"
                    style={{ fontFamily: 'Noto Serif SC, serif' }}
                  >
                    {poem.appreciation}
                  </div>
                  
                  {/* 底部填词按钮 */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => onStartGame(poem)}
                      className="btn-seal flex items-center gap-2"
                      style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '1rem' }}
                    >
                      <Feather className="w-4 h-4" />
                      挑战填词
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'trivia' && (
                <motion.div
                  key="trivia"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 space-y-3"
                >
                  {poem.trivia.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="rounded-sm overflow-hidden"
                      style={{ border: '1px solid #c9b49a', background: 'rgba(245,237,214,0.5)' }}
                    >
                      <button
                        onClick={() => setExpandedTrivia(expandedTrivia === idx ? null : idx)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                            style={{ background: '#8B6914', fontFamily: 'Noto Serif SC, serif' }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className="text-sm text-[#2d1f0f] font-medium line-clamp-1"
                            style={{ fontFamily: 'Noto Serif SC, serif' }}
                          >
                            {item.slice(0, 25)}{item.length > 25 ? '…' : ''}
                          </span>
                        </div>
                        {expandedTrivia === idx
                          ? <ChevronUp className="w-4 h-4 text-[#8B6914] shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-[#8B6914] shrink-0" />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {expandedTrivia === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-4 pb-3 text-sm text-[#3d2b1f] leading-7 border-t border-[#c9b49a]/40"
                              style={{ fontFamily: 'Noto Serif SC, serif' }}
                            >
                              {item}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  
                  {/* 底部填词按钮 */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => onStartGame(poem)}
                      className="btn-seal flex items-center gap-2"
                      style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '1rem' }}
                    >
                      <Feather className="w-4 h-4" />
                      挑战填词
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 底部装饰 */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #C0392B, #8B6914, #C0392B)' }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
