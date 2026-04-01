/*
 * Home.tsx - 主页面
 * 设计：水墨山水·宣纸质感 | 全屏地图为主体，左侧竖排标题栏，右上角搜索，右侧智能体按钮
 * 布局：全屏地图 + 左侧标题面板 + 右侧地点信息面板 + 顶部搜索 + 智能体浮动按钮
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TangMap from '@/components/TangMap';
import LocationPanel from '@/components/LocationPanel';
import PoemModal from '@/components/PoemModal';
import FillGame from '@/components/FillGame';
import AncientAgent from '@/components/AncientAgent';
import SearchBar from '@/components/SearchBar';
import { locations, type Location, type Poem } from '@/data/poems';

const AGENT_AVATAR = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/agent-avatar-ZJjam5uQ4DnvgPJJG4VNA7.webp';
const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/hero-bg-HKSCQ6BNnzzMPWUnNPMrrK.webp';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [gamePoem, setGamePoem] = useState<Poem | null>(null);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | null>(null);
  const [directPoemId, setDirectPoemId] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    if (directPoemId) {
      const poem = location.poems.find(p => p.id === directPoemId);
      if (poem) {
        setSelectedPoem(poem);
        setDirectPoemId(null);
      }
    }
    setShowIntro(false);
  }, [directPoemId]);

  const handleLocationHighlight = useCallback((locationId: string, poemId?: string) => {
    setHighlightedLocationId(locationId);
    if (poemId) setDirectPoemId(poemId);
    setShowIntro(false);
    
    // 搜索诗歌后自动打开地点面板并跳转至对应诗词
    const location = locations.find(l => l.id === locationId);
    if (location) {
      setSelectedLocation(location);
      if (poemId) {
        const poem = location.poems.find(p => p.id === poemId);
        if (poem) {
          // 延迟打开诗词弹窗，等待地点面板动画完成
          setTimeout(() => {
            setSelectedPoem(poem);
            setDirectPoemId(null);
          }, 400);
        }
      }
    }
  }, []);

  const handlePoemSelect = useCallback((poem: Poem) => {
    setSelectedPoem(poem);
  }, []);

  const handleStartGame = useCallback((poem: Poem) => {
    setSelectedPoem(null);
    setGamePoem(poem);
  }, []);

  const handleCloseLocation = useCallback(() => {
    setSelectedLocation(null);
    setHighlightedLocationId(null);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#f5edd6' }}>
      {/* 全屏地图 */}
      <div className="absolute inset-0">
        <TangMap
          onLocationSelect={handleLocationSelect}
          highlightedLocationId={highlightedLocationId}
        />
      </div>

      {/* 左侧标题面板 */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -120, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200, delay: 0.4 }}
            className="absolute left-0 top-0 bottom-0 w-60 z-20 flex flex-col justify-center pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(245,237,214,0.97) 0%, rgba(245,237,214,0.88) 65%, transparent 100%)',
            }}
          >
            <div className="px-6 py-8">
              {/* 水墨装饰图 */}
              <div className="mb-5 w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9b49a] shadow-md">
                <img
                  src={AGENT_AVATAR}
                  alt="装饰"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 主标题 */}
              <h1
                className="text-[2rem] text-[#1a1a1a] leading-tight mb-1"
                style={{ fontFamily: 'Ma Shan Zheng, serif' }}
              >
                从长安出发
              </h1>
              <h2
                className="text-lg text-[#C0392B] leading-tight mb-4"
                style={{ fontFamily: 'Ma Shan Zheng, serif' }}
              >
                看唐人都在哪里送别
              </h2>

              {/* 分隔线 */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#8B6914]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                <div className="w-8 h-px bg-[#8B6914]" />
              </div>

              {/* 副标题 */}
              <p
                className="text-xs text-[#5a4030] leading-7"
                style={{ fontFamily: 'Noto Serif SC, serif' }}
              >
                精讲《送杜少府之任蜀州》
                <br />辐射长安·江畔水路·边塞
                <br />探寻唐代送别文化地图
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-xs text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                <span className="animate-bounce inline-block">↓</span>
                <span>点击地图标注探索</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部搜索栏 - 始终显示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[420px]">
        <SearchBar
          onLocationHighlight={handleLocationHighlight}
          onClear={() => setHighlightedLocationId(null)}
        />
      </div>

      {/* 右侧地点信息面板 */}
      <div className="absolute right-0 top-0 bottom-0 z-20">
        <LocationPanel
          location={selectedLocation}
          onClose={handleCloseLocation}
          onPoemSelect={handlePoemSelect}
        />
      </div>

      {/* 智能体浮动按钮 */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsAgentOpen(!isAgentOpen)}
        className="absolute left-4 bottom-8 z-30 flex flex-col items-center gap-1.5"
        style={{ filter: 'drop-shadow(0 4px 14px rgba(30,20,10,0.28))' }}
      >
        <div
          className="w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300"
          style={{
            borderColor: isAgentOpen ? '#C0392B' : '#8B6914',
            boxShadow: isAgentOpen
              ? '0 0 24px rgba(192,57,43,0.45), 0 4px 12px rgba(30,20,10,0.2)'
              : '0 4px 12px rgba(30,20,10,0.2)',
          }}
        >
          <img
            src={AGENT_AVATAR}
            alt="诗仙引路人"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="text-xs px-2.5 py-0.5 rounded-sm shadow-sm"
          style={{
            background: 'rgba(245,237,214,0.95)',
            border: '1px solid #c9b49a',
            color: '#5a4030',
            fontFamily: 'Noto Serif SC, serif',
            fontSize: '11px',
          }}
        >
          {isAgentOpen ? '收起' : '问诗仙'}
        </div>
      </motion.button>

      {/* 诗词详情弹窗 */}
      <AnimatePresence>
        {selectedPoem && (
          <PoemModal
            poem={selectedPoem}
            location={selectedLocation}
            onClose={() => setSelectedPoem(null)}
            onStartGame={handleStartGame}
          />
        )}
      </AnimatePresence>

      {/* 填词游戏 */}
      <AnimatePresence>
        {gamePoem && (
          <FillGame
            poem={gamePoem}
            onClose={() => setGamePoem(null)}
          />
        )}
      </AnimatePresence>

      {/* 古风智能体 */}
      <AncientAgent
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
      />

      {/* 水墨背景装饰 */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute bottom-0 right-0 w-[500px] h-[320px] pointer-events-none z-0"
            style={{
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
