/*
 * TangMap.tsx - 唐代送别诗地图主组件（高德地图版）
 * 设计：水墨山水·宣纸质感 | 高德地图古风自定义样式
 * 功能：显示现代地图，标注今地名（旁注古地名），点击显示诗词列表
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
  jingji: '#c23737',   // 红色 - 京畿地区
  biansai: '#23671a',  // 墨绿色 - 边塞地区
  jianghan: '#2c5f7a', // 深蓝色 - 江汉水乡
  other: '#4823b9',    // 紫色 - 其他
};

// 地图容器有整体滤镜，标注点使用补偿色以保证视觉上接近 categoryColors
const categoryCompensatedColors: Record<string, string> = {
  jingji: '#ff0000',
  biansai: '#22b500',
  jianghan: '#007aff',
  other: '#bb00ff',
};

const categoryLabels: Record<string, string> = {
  jingji: '京畿地区',
  biansai: '边塞地区',
  jianghan: '江汉水乡',
  other: '其他',
};

const MIN_MAP_ZOOM = 4;
const MAX_MAP_ZOOM = 9;
const BASE_MARKER_ZOOM = 5;

function getMarkerScaleByZoom(zoom: number): number {
  const clampedZoom = Math.max(MIN_MAP_ZOOM, Math.min(MAX_MAP_ZOOM, zoom));
  // 在 zoom=5 时保持当前尺寸，放大时同步放大标注与文字。
  return 1 + (clampedZoom - BASE_MARKER_ZOOM) * 0.2;
}

// 加载高德地图脚本（使用免费的无密钥模式或申请key）
// 注意：生产环境请在高德开放平台申请API Key
// 申请地址：https://lbs.amap.com/
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''; // 从环境变量读取

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
    // 使用高德地图JS API 2.0，支持中国境内访问
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar,AMap.MapType,AMap.DistrictLayer`;
    script.async = true;
    script.onload = () => {
      window._amapLoaded = true;
      window._amapLoadCallbacks?.forEach(cb => cb());
      window._amapLoadCallbacks = [];
    };
    script.onerror = () => {
      reject(new Error('高德地图加载失败'));
    };
    document.head.appendChild(script);
  });
}

export default function TangMap({ onLocationSelect, highlightedLocationId, onMapReady }: TangMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const labelsRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  const applyMarkerScale = useCallback((marker: any, zoom: number) => {
    const content = marker.getContent?.() as HTMLDivElement | null;
    if (!content) return;

    const scale = getMarkerScaleByZoom(zoom);
    const pinSize = Math.max(14, 20 * scale);
    const dotSize = Math.max(3, 5 * scale);
    const borderSize = Math.max(1, 1.5 * scale);
    const labelTop = 24 * scale;
    const modernFontSize = Math.max(6, 8 * scale);
    const ancientFontSize = Math.max(5, 6 * scale);

    const pinEl = content.querySelector('[data-role="pin"]') as HTMLDivElement | null;
    const dotEl = content.querySelector('[data-role="dot"]') as HTMLDivElement | null;
    const labelWrapEl = content.querySelector('[data-role="label-wrap"]') as HTMLDivElement | null;
    const modernLabelEl = content.querySelector('[data-role="modern-label"]') as HTMLDivElement | null;
    const ancientLabelEl = content.querySelector('[data-role="ancient-label"]') as HTMLDivElement | null;

    content.style.width = `${pinSize}px`;
    content.style.height = `${pinSize}px`;

    if (pinEl) {
      pinEl.style.width = `${pinSize}px`;
      pinEl.style.height = `${pinSize}px`;
      pinEl.style.borderWidth = `${borderSize}px`;
    }
    if (dotEl) {
      dotEl.style.width = `${dotSize}px`;
      dotEl.style.height = `${dotSize}px`;
    }
    if (labelWrapEl) {
      labelWrapEl.style.top = `${labelTop}px`;
    }
    if (modernLabelEl) {
      modernLabelEl.style.fontSize = `${modernFontSize}px`;
    }
    if (ancientLabelEl) {
      ancientLabelEl.style.fontSize = `${ancientFontSize}px`;
    }
  }, []);

  const applyAllMarkerScales = useCallback((zoom: number) => {
    markersRef.current.forEach(marker => applyMarkerScale(marker, zoom));
  }, [applyMarkerScale]);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      await loadAMapScript();

      const AMap = window.AMap;
      if (!AMap) throw new Error('AMap未加载');

      // 创建地图实例 - 使用古风地图样式
      const map = new AMap.Map(mapContainerRef.current, {
        zoom: 5,
        center: [105, 35.5],
        // 自定义古風样式：宣纸底色 + 水域蓝色 + 山脉墨色
        mapStyle: 'amap://styles/whitesmoke',
        // 显示背景、道路、地名标注（point）、行政区划边界线（district）
        // 根据《公开地图内容表示规范》，必须显示国界线、省市县边界线
        features: ['bg', 'road', 'point', 'district'],
        // 限制地图范围到中亚+东亚（经纬度边界）
        limitBounds: new AMap.Bounds([50, 10], [145, 60]),
        viewMode: '2D',
        lang: 'zh_cn',
        showLabel: true,
        showBuildingBlock: false,
        rotateEnable: false,
        pitchEnable: false,
        // 限制缩放范围：最小5（中亚+东亚范围），最大9（城市级，不显示铁路/建筑细节）
        zooms: [5, 9],
      });

      // 添加行政区划边界图层（符合《公开地图内容表示规范》）
      // 使用 AMap.DistrictLayer 系列，确保国界线、省界线、市界线均正确显示
      if (AMap.DistrictLayer) {
        // 国界线（含各国边界）
        const countryLayer = new AMap.DistrictLayer.Country({
          zIndex: 10,
          SOC: 'CHN',
          depth: 2, // 0=国界, 1=省界, 2=市界
          styles: {
            'nation-stroke': '#8B4513',      // 国界线：深棕色，较粗
            'coastline-stroke': '#2c5f7a',   // 海岸线：深蓝色
            'province-stroke': '#a07850',    // 省界线：中棕色
            'city-stroke': '#c4a882',        // 市界线：浅棕色
            'fill': 'rgba(0,0,0,0)',         // 填充透明
          },
        });
        countryLayer.setMap(map);

        // 世界各国边界线
        const worldLayer = new AMap.DistrictLayer.World({
          zIndex: 9,
          styles: {
            'nation-stroke': '#8B6914',      // 各国边界：棕金色
            'coastline-stroke': '#2c5f7a',   // 海岸线
            'fill': 'rgba(0,0,0,0)',         // 填充透明
          },
        });
        worldLayer.setMap(map);
      }

      // 隐藏铁路、地铁等现代交通图层
      map.on('complete', () => {
        // 移除铁路、地铁等图层（高德地图2.0 API）
        const layers = map.getLayers();
        layers.forEach((layer: any) => {
          const name = layer.getClassName?.() || '';
          if (name.includes('Railway') || name.includes('Subway') || name.includes('Transit')) {
            map.remove(layer);
          }
        });
      });

      // 添加比例尺
      const scale = new AMap.Scale({
        visible: true,
        position: { bottom: '30px', right: '10px' },
      });
      map.addControl(scale);

      mapRef.current = map;

      // 添加标注点
      locations.forEach(loc => {
        const color = categoryCompensatedColors[loc.category] || '#C0392B';

        // 创建自定义标注内容
        const markerContent = document.createElement('div');
        markerContent.style.cssText = `
          position: relative;
          cursor: pointer;
          width: 20px;
          height: 20px;
          overflow: visible;
        `;
        markerContent.innerHTML = `
          <div data-role="pin" style="
            width: 20px;
            height: 20px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            filter: saturate(1.6);
            border: 1.5px solid rgba(255,255,255,0.9);
            box-shadow: 0 1px 7px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.16);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s;
          ">
            <div data-role="dot" style="
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: rgba(255,255,255,0.9);
              transform: rotate(45deg);
            "></div>
          </div>
          <div data-role="label-wrap" style="
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            pointer-events: none;
          ">
            <div data-role="modern-label" style="
              font-family: 'Ma Shan Zheng', serif;
              font-size: 8px;
              font-weight: 600;
              color: #1a1a1a;
              text-shadow: 0 1px 3px rgba(245,237,214,0.95), 0 0 8px rgba(245,237,214,0.9);
              line-height: 1.3;
              white-space: nowrap;
            ">${loc.modernName}</div>
            <div data-role="ancient-label" style="
              font-family: 'Noto Serif SC', serif;
              font-size: 6px;
              color: #8B6914;
              text-shadow: 0 1px 2px rgba(245,237,214,0.9);
              white-space: nowrap;
              margin-top: 1px;
            ">古为${loc.name}</div>
          </div>
        `;

        // 悬停效果
        const pinEl = markerContent.querySelector('div') as HTMLDivElement;
        markerContent.addEventListener('mouseenter', () => {
          if (pinEl) {
            pinEl.style.transform = 'rotate(-45deg) scale(1.05)';
            pinEl.style.boxShadow = `0 3px 10px rgba(0,0,0,0.3), 0 1px 4px ${color}80`;
          }
        });
        markerContent.addEventListener('mouseleave', () => {
          if (pinEl) {
            pinEl.style.transform = 'rotate(-45deg) scale(1)';
            pinEl.style.boxShadow = '0 1px 7px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.16)';
          }
        });

        const marker = new AMap.Marker({
          position: new AMap.LngLat(loc.coordinates[0], loc.coordinates[1]),
          content: markerContent,
          anchor: 'bottom-center',
          offset: new AMap.Pixel(0, 0),
          zIndex: 100,
        });

        marker.on('click', () => {
          onLocationSelectRef.current(loc);
          map.setCenter([loc.coordinates[0], loc.coordinates[1]]);
          map.setZoom(9);
        });

        marker.setMap(map);
        markersRef.current.set(loc.id, marker);
      });

      applyAllMarkerScales(map.getZoom?.() ?? BASE_MARKER_ZOOM);
      map.on('zoomchange', () => {
        applyAllMarkerScales(map.getZoom?.() ?? BASE_MARKER_ZOOM);
      });

      setMapLoaded(true);
      onMapReadyRef.current?.();

    } catch (err) {
      console.error('地图初始化失败:', err);
      setLoadError('地图加载失败，请检查网络连接');
    }
  }, [applyAllMarkerScales]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  // 高亮指定地点
  useEffect(() => {
    if (!mapLoaded || !highlightedLocationId || !mapRef.current) return;

    const location = locations.find(l => l.id === highlightedLocationId);
    if (!location) return;

    const map = mapRef.current;
    map.setCenter([location.coordinates[0], location.coordinates[1]]);
    map.setZoom(9);

    // 标注闪烁动画
    const marker = markersRef.current.get(highlightedLocationId);
    if (marker) {
      const content = marker.getContent() as HTMLDivElement;
      const pinEl = content?.querySelector('div') as HTMLDivElement;
      if (pinEl) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          pinEl.style.transform = count % 2 === 0
            ? 'rotate(-45deg) scale(1)'
            : 'rotate(-45deg) scale(1.25)';
          if (count >= 6) {
            clearInterval(interval);
            pinEl.style.transform = 'rotate(-45deg) scale(1)';
          }
        }, 300);
      }
    }
  }, [highlightedLocationId, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      {/* 地图容器 - 古风CSS滤镜：sepia棕褐色调 */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{
          filter: mapLoaded ? 'sepia(68%) saturate(55%) brightness(0.98) contrast(0.88) hue-rotate(-8deg)' : 'none',
          transition: 'filter 0.8s ease',
        }}
      />

      {/* 加载状态 */}
      {!mapLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#f5edd6' }}>
          <div className="text-center">
            <div
              className="text-2xl mb-3 animate-pulse"
              style={{ fontFamily: 'Ma Shan Zheng, serif', color: '#8B6914' }}
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
        </div>
      )}

      {/* 加载错误 */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center"
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
          background: 'rgba(245,237,214,0.92)',
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
