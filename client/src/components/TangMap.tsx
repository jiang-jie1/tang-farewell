/*
 * TangMap.tsx - 唐代送别诗地图主组件（高德地图版）
 * 设计：水墨山水·宣纸质感 | 高德地图 + CSS滤镜实现古风地图效果
 * 功能：显示现代地图，标注今地名（旁注古地名），点击显示诗词列表
 * 注意：高德地图在中国境内可正常使用，无需科学上网
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { locations, type Location } from '@/data/poems';

declare global {
  interface Window {
    AMap: any;
    _amapLoaded?: boolean;
    _amapLoadCallbacks?: Array<() => void>;
  }
}

interface TangMapProps {
  onLocationSelect: (location: Location) => void;
  highlightedLocationId?: string | null;
  onMapReady?: () => void;
}

const categoryColors: Record<string, string> = {
  capital: '#C0392B',
  river: '#2E7D32',
  frontier: '#8B6914',
  other: '#4A4A8A',
};

const categoryLabels: Record<string, string> = {
  capital: '都城',
  river: '水路枢纽',
  frontier: '边塞',
  other: '其他',
};

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';

function loadAMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.AMap && window._amapLoaded) {
      resolve();
      return;
    }

    if (window._amapLoadCallbacks) {
      window._amapLoadCallbacks.push(resolve);
      return;
    }

    window._amapLoadCallbacks = [resolve];

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Scale`;
    script.async = true;
    script.onload = () => {
      window._amapLoaded = true;
      window._amapLoadCallbacks?.forEach(cb => cb());
      window._amapLoadCallbacks = [];
    };
    script.onerror = () => {
      reject(new Error('高德地图加载失败，请检查网络连接'));
    };
    document.head.appendChild(script);
  });
}

export default function TangMap({ onLocationSelect, highlightedLocationId, onMapReady }: TangMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapLoadedRef = useRef(false);
  const [, setForceUpdate] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      await loadAMapScript();

      const AMap = window.AMap;
      if (!AMap) throw new Error('AMap未加载');

      // 创建地图实例
      // 使用 whitesmoke（远山黛）作为基础样式，再通过CSS滤镜叠加古风色调
      const map = new AMap.Map(mapContainerRef.current, {
        zoom: 5,
        center: [105, 35.5],
        mapStyle: 'amap://styles/whitesmoke',
        features: ['bg', 'road', 'point'],
        viewMode: '2D',
        lang: 'zh_cn',
        showLabel: true,
        showBuildingBlock: false,
        rotateEnable: false,
        pitchEnable: false,
      });

      // 添加比例尺（右下角）
      const scale = new AMap.Scale({
        visible: true,
        position: { bottom: '30px', right: '10px' },
      });
      map.addControl(scale);

      mapRef.current = map;

      // 隐藏高德地图版权标志
      const hideStyle = document.createElement('style');
      hideStyle.textContent = `
        .amap-logo,
        .amap-copyright {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(hideStyle);

      // 添加标注点
      locations.forEach(loc => {
        const color = categoryColors[loc.category] || '#C0392B';

        // 创建自定义标注内容
        const markerContent = document.createElement('div');
        markerContent.style.cssText = `
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%) translateY(-100%);
        `;
        markerContent.innerHTML = `
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            border: 2.5px solid rgba(255,255,255,0.95);
            box-shadow: 0 3px 14px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 13px;
              font-weight: 700;
              font-family: 'Ma Shan Zheng', serif;
              text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            ">${loc.modernName.charAt(0)}</span>
          </div>
          <div style="
            margin-top: 4px;
            background: rgba(245,237,214,0.97);
            border: 1px solid #c9b49a;
            border-radius: 2px;
            padding: 2px 6px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.18);
            text-align: center;
          ">
            <div style="
              font-size: 12px;
              font-weight: 700;
              color: #1a1a1a;
              font-family: 'Noto Serif SC', serif;
              line-height: 1.4;
            ">${loc.modernName}</div>
            <div style="
              font-size: 10px;
              color: #8B6914;
              font-family: 'Noto Serif SC', serif;
              line-height: 1.3;
            ">古为${loc.ancientName}</div>
          </div>
        `;

        const marker = new AMap.Marker({
          position: new AMap.LngLat(loc.lng, loc.lat),
          content: markerContent,
          offset: new AMap.Pixel(0, 0),
          zIndex: 100,
        });

        marker.on('click', () => {
          onLocationSelectRef.current(loc);
        });

        marker.setMap(map);
        markersRef.current.set(loc.id, marker);
      });

      map.on('complete', () => {
        mapLoadedRef.current = true;
        setMapLoaded(true);
        onMapReadyRef.current?.();
      });

      // 超时保护
      setTimeout(() => {
        if (!mapLoadedRef.current) setMapLoaded(true);
      }, 3000);

    } catch (err) {
      const msg = err instanceof Error ? err.message : '地图加载失败';
      setLoadError(msg);
    }
  }, []);

  useEffect(() => {
    initMap();
  }, [initMap]);

  // 高亮指定地点
  useEffect(() => {
    if (!mapRef.current || !highlightedLocationId) return;

    const loc = locations.find(l => l.id === highlightedLocationId);
    if (!loc) return;

    mapRef.current.setZoomAndCenter(7, new window.AMap.LngLat(loc.lng, loc.lat), false, 600);

    // 标注抖动动画
    const marker = markersRef.current.get(highlightedLocationId);
    if (marker) {
      const el = marker.getContent();
      if (el) {
        el.style.transition = 'transform 0.15s ease';
        el.style.transform = 'translateX(-50%) translateY(-100%) scale(1.25)';
        setTimeout(() => {
          el.style.transform = 'translateX(-50%) translateY(-100%) scale(1)';
        }, 300);
      }
    }
  }, [highlightedLocationId]);

  return (
    <div className="relative w-full h-full">
      {/* 地图容器 - 应用CSS滤镜实现古风色调 */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{
          // CSS滤镜：sepia棕褐色 + 降低饱和度 + 轻微提亮
          // 将现代地图转换为仿古地图色调
          filter: 'sepia(45%) saturate(70%) brightness(1.05) contrast(0.95)',
        }}
      />

      {/* 宣纸纹理叠加层 - 增加古风质感 */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6,
        }}
      />

      {/* 地图加载中 */}
      {!mapLoaded && !loadError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50"
          style={{ background: '#f5edd6' }}
        >
          <div
            className="text-lg mb-4 text-[#3d2b1f]"
            style={{ fontFamily: 'Ma Shan Zheng, serif' }}
          >
            地图加载中…
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: '#C0392B',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 加载错误 */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: '#f5edd6' }}>
          <div className="text-center px-8">
            <div
              className="text-xl mb-2"
              style={{ fontFamily: 'Ma Shan Zheng, serif', color: '#C0392B' }}
            >
              地图暂时无法加载
            </div>
            <div
              className="text-sm text-[#5a4030]"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              {loadError}
            </div>
            <button
              onClick={() => { setLoadError(null); initMap(); }}
              className="mt-4 px-4 py-2 text-sm rounded-sm border border-[#c9b49a] text-[#5a4030] hover:bg-[#e8d5a3] transition-colors"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              重新加载
            </button>
          </div>
        </div>
      )}

      {/* 图例 - 右上角 */}
      <div
        className="absolute top-4 right-4 z-10 rounded-sm p-3 shadow-md"
        style={{
          background: 'rgba(245,237,214,0.95)',
          border: '1px solid #c9b49a',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          className="text-xs font-semibold text-[#3d2b1f] mb-2 pb-1.5 border-b border-[#c9b49a]/60"
          style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '0.85rem' }}
        >
          图例
        </div>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
              className="w-3 h-3 rounded-full border border-white/80 shadow-sm shrink-0"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-xs text-[#3d2b1f]"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              {categoryLabels[cat]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
