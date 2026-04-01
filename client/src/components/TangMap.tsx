/*
 * TangMap.tsx - 唐代送别诗地图主组件
 * 设计：水墨山水·宣纸质感 | 地图使用古朴风格，标注点以朱砂印记呈现
 * 功能：显示现代地图，标注今地名（旁注古地名），点击显示诗词列表
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapView } from '@/components/Map';
import { locations, type Location } from '@/data/poems';

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

export default function TangMap({ onLocationSelect, highlightedLocationId, onMapReady }: TangMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // 设置地图样式 - 古朴水墨风格
    map.setOptions({
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5edd6' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#3d2b1f' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5edd6' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b49a' }] },
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
        { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
        { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f8f1e4' }] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f3d19c' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
        { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
    });

    // 创建信息窗口
    infoWindowRef.current = new google.maps.InfoWindow();

    // 添加标注点
    locations.forEach(loc => {
      const color = categoryColors[loc.category] || '#C0392B';
      
      // 创建自定义SVG标注
      const svgMarker = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 1.5,
        scale: 1.6,
        anchor: new google.maps.Point(12, 22),
      };

      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: map,
        icon: svgMarker,
        title: loc.modernName,
        animation: google.maps.Animation.DROP,
      });

      // 创建标注标签
      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = `
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
        pointer-events: none;
        text-align: center;
        margin-top: 2px;
      `;
      labelDiv.innerHTML = `
        <div style="
          font-family: 'Noto Serif SC', serif;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          text-shadow: 0 1px 3px rgba(245,237,214,0.9), 0 0 6px rgba(245,237,214,0.8);
          line-height: 1.3;
        ">${loc.modernName}</div>
        <div style="
          font-family: 'Noto Serif SC', serif;
          font-size: 10px;
          color: #8B6914;
          text-shadow: 0 1px 2px rgba(245,237,214,0.9);
        ">古为${loc.ancientName}</div>
      `;

      // 添加标注覆盖物
      class LabelOverlay extends google.maps.OverlayView {
        private div: HTMLDivElement | null = null;
        constructor(private position: google.maps.LatLng, private content: HTMLDivElement) {
          super();
        }
        onAdd() {
          this.div = this.content;
          const panes = this.getPanes();
          panes?.overlayLayer.appendChild(this.div);
        }
        draw() {
          const overlayProjection = this.getProjection();
          const pos = overlayProjection.fromLatLngToDivPixel(this.position);
          if (pos && this.div) {
            this.div.style.left = pos.x + 'px';
            this.div.style.top = (pos.y + 5) + 'px';
          }
        }
        onRemove() {
          if (this.div) {
            this.div.parentNode?.removeChild(this.div);
            this.div = null;
          }
        }
      }

      const overlay = new LabelOverlay(
        new google.maps.LatLng(loc.lat, loc.lng),
        labelDiv
      );
      overlay.setMap(map);

      marker.addListener('click', () => {
        onLocationSelect(loc);
        map.panTo({ lat: loc.lat, lng: loc.lng });
      });

      marker.addListener('mouseover', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
      });

      markersRef.current.set(loc.id, marker);
    });

    setMapLoaded(true);
    onMapReady?.();
  }, [onLocationSelect, onMapReady]);

  // 高亮指定地点
  useEffect(() => {
    if (!mapLoaded || !highlightedLocationId) return;
    
    const marker = markersRef.current.get(highlightedLocationId);
    const location = locations.find(l => l.id === highlightedLocationId);
    
    if (marker && location && mapRef.current) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      mapRef.current.setZoom(7);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 2000);
    }
  }, [highlightedLocationId, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <MapView
        onMapReady={handleMapReady}
        initialCenter={{ lat: 35.5, lng: 105 }}
        initialZoom={5}
        className="w-full h-full"
      />
      
      {/* 地图图例 */}
      <div className="absolute bottom-8 left-4 bg-[#f5edd6]/90 backdrop-blur-sm border border-[#c9b49a] rounded-sm p-3 shadow-md">
        <div className="text-xs font-semibold text-[#3d2b1f] mb-2" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
          图例
        </div>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#3d2b1f]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {categoryLabels[cat]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
