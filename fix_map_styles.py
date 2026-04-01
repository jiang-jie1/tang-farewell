#!/usr/bin/env python3
"""Replace AMAP_STYLE_FEATURES in TangMap.tsx with improved ancient-style map config."""

with open('/home/ubuntu/tang-farewell-map/client/src/components/TangMap.tsx', 'r') as f:
    content = f.read()

# Find the start and end of AMAP_STYLE_FEATURES
start_marker = 'const AMAP_STYLE_FEATURES = ['
start_idx = content.find(start_marker)

# Find the matching closing bracket
search_from = start_idx + len(start_marker)
depth = 1
i = search_from
while i < len(content) and depth > 0:
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
    i += 1

# Find the semicolon
while i < len(content) and content[i] in ' \t':
    i += 1
if content[i] == ';':
    i += 1

end_idx = i

new_features = '''const AMAP_STYLE_FEATURES = [
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
];'''

new_content = content[:start_idx] + new_features + content[end_idx:]

with open('/home/ubuntu/tang-farewell-map/client/src/components/TangMap.tsx', 'w') as f:
    f.write(new_content)

print("Done! AMAP_STYLE_FEATURES replaced successfully.")
print(f"Original length: {len(content)}, New length: {len(new_content)}")
