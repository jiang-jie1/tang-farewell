/*
 * TangMap.tsx - 唐代送别诗地图主组件（高德地图版）
 * 设计：水墨山水·宣纸质感 | 高德地图古风自定义样式
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
  jingji: '#8B4513',   // 深棕色 - 京畿地区
  biansai: '#4A6741',  // 墨绿色 - 边塞地区
  jianghan: '#2c5f7a', // 深蓝色 - 江汉水乡
  other: '#6B4C8B',    // 紫色 - 其他
};

const categoryLabels: Record<string, string> = {
  jingji: '京畿地区',
  biansai: '边塞地区',
  jianghan: '江汉水乡',
  other: '其他',
};

// 高德地图古风水墨自定义样式
// 使用高德内置的"幻影黑"或自定义宣纸色调
const AMAP_STYLE_FEATURES = [
  // ──────────── 地形底色 ────────────
  {
    featureType: 'background',
    elementType: 'geometry',
    stylers: { color: '#f5edd6ff' }, // 宣纸色底色
  },
  {
    featureType: 'land',
    elementType: 'geometry',
    stylers: { color: '#ede0c4ff' }, // 浅黄土色
  },
  {
    featureType: 'green',
    elementType: 'geometry',
    stylers: { color: '#c8d5a8ff' }, // 淡绿植被
  },
  // ──────────── 水域：偏蓝古风色 ────────────
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: { color: '#9bbfd4ff' }, // 淡蓝色水域，古风青瓷色调
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: { color: '#2c5f7aff' }, // 水域名称深蓝色
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: { color: '#d4eaf5ff' }, // 水域名称描边淡蓝
  },
  // ──────────── 山地：墨色古风 ────────────
  {
    featureType: 'mountain',
    elementType: 'geometry',
    stylers: { color: '#c5b89aff' }, // 山地底色，偏墨灰
  },
  {
    featureType: 'mountain',
    elementType: 'labels.text.fill',
    stylers: { color: '#2d2d2dff' }, // 山名深墨色
  },
  {
    featureType: 'mountain',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f0e8d0ff' }, // 山名描边宣纸色
  },
  // ──────────── 道路 ────────────
  {
    featureType: 'highway',
    elementType: 'geometry',
    stylers: { color: '#f3d19cff' },
  },
  {
    featureType: 'highway',
    elementType: 'geometry.stroke',
    stylers: { color: '#e9bc62ff' },
  },
  {
    featureType: 'arterial',
    elementType: 'geometry',
    stylers: { color: '#fdfcf8ff' },
  },
  {
    featureType: 'local',
    elementType: 'geometry',
    stylers: { color: '#f8f1e4ff' },
  },
  // ──────────── 隐藏现代交通 ────────────
  {
    featureType: 'railway',
    elementType: 'geometry',
    stylers: { visibility: 'off' },
  },
  {
    featureType: 'subway',
    elementType: 'geometry',
    stylers: { visibility: 'off' },
  },
  {
    featureType: 'building',
    elementType: 'geometry',
    stylers: { color: '#e8d5b0ff' },
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: { color: '#dfd2aeff' },
  },
  // ──────────── 行政区划线 ────────────
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: { color: '#c9b49aff' },
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: { color: '#3d2b1fff' },
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // ──────────── 地名标注（全部显示）────────────
  {
    featureType: 'label',
    elementType: 'labels.text.fill',
    stylers: { color: '#3d2b1fff' },
  },
  {
    featureType: 'label',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // 省级地名：深棕色
  {
    featureType: 'province',
    elementType: 'labels.text.fill',
    stylers: { color: '#4a2e1aff' },
  },
  {
    featureType: 'province',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // 市级地名：棕色
  {
    featureType: 'city',
    elementType: 'labels.text.fill',
    stylers: { color: '#5a3e2bff' },
  },
  {
    featureType: 'city',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // 县级地名：淡棕色
  {
    featureType: 'district',
    elementType: 'labels.text.fill',
    stylers: { color: '#7a5a3aff' },
  },
  {
    featureType: 'district',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // 镇级地名：淡色
  {
    featureType: 'town',
    elementType: 'labels.text.fill',
    stylers: { color: '#7a5a3aff' },
  },
  {
    featureType: 'town',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
  // 道路名称
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: { color: '#806b63ff' },
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: { color: '#f5edd6ff' },
  },
];

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
        // 应用自定义古風样式
        customMapStyle: {
          styleJson: AMAP_STYLE_FEATURES,
        },
        // 限制地图范围到中亚+东亚（经纬度边界）
        limitBounds: new AMap.Bounds([50, 10], [145, 60]),
        viewMode: '2D',
        lang: 'zh_cn',
        showLabel: true,
        showBuildingBlock: false,
        rotateEnable: false,
        pitchEnable: false,
        // 限制缩放范围：最小4（中亚+东亚范围），最大9（城市级，不显示铁路/建筑细节）
        zooms: [4, 9],
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
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            border: 2.5px solid rgba(255,255,255,0.9);
            box-shadow: 0 3px 12px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s;
          ">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: rgba(255,255,255,0.9);
              transform: rotate(45deg);
            "></div>
          </div>
          <div style="
            margin-top: 6px;
            text-align: center;
            pointer-events: none;
          ">
            <div style="
              font-family: 'Ma Shan Zheng', serif;
              font-size: 13px;
              font-weight: 600;
              color: #1a1a1a;
              text-shadow: 0 1px 3px rgba(245,237,214,0.95), 0 0 8px rgba(245,237,214,0.9);
              line-height: 1.3;
              white-space: nowrap;
            ">${loc.modernName}</div>
            <div style="
              font-family: 'Noto Serif SC', serif;
              font-size: 10px;
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
            pinEl.style.transform = 'rotate(-45deg) scale(1.15)';
            pinEl.style.boxShadow = `0 6px 20px rgba(0,0,0,0.4), 0 2px 8px ${color}80`;
          }
        });
        markerContent.addEventListener('mouseleave', () => {
          if (pinEl) {
            pinEl.style.transform = 'rotate(-45deg) scale(1)';
            pinEl.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)';
          }
        });

        const marker = new AMap.Marker({
          position: new AMap.LngLat(loc.coordinates[0], loc.coordinates[1]),
          content: markerContent,
          offset: new AMap.Pixel(0, 0),
          zIndex: 100,
          title: loc.modernName,
        });

        marker.on('click', () => {
          onLocationSelectRef.current(loc);
          map.setCenter([loc.coordinates[0], loc.coordinates[1]]);
          map.setZoom(7);
        });

        marker.setMap(map);
        markersRef.current.set(loc.id, marker);
      });

      setMapLoaded(true);
      onMapReadyRef.current?.();

    } catch (err) {
      console.error('地图初始化失败:', err);
      setLoadError('地图加载失败，请检查网络连接');
    }
  }, []);

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
    map.setZoom(7);

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
          filter: mapLoaded ? 'sepia(50%) saturate(65%) brightness(1.04) contrast(0.92) hue-rotate(-5deg)' : 'none',
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
