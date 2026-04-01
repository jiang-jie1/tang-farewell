/**
 * 搜索功能测试
 * 测试地名搜索、诗歌名搜索、诗句搜索的核心逻辑
 */
import { describe, expect, it } from "vitest";

// 模拟诗词数据结构（与 client/src/data/poems.ts 对应）
interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
}

interface Location {
  id: string;
  modernName: string;
  ancientName: string;
  province: string;
  category: string;
  poems: Poem[];
}

// 测试数据
const testLocations: Location[] = [
  {
    id: "xian",
    modernName: "西安",
    ancientName: "长安",
    province: "陕西省",
    category: "capital",
    poems: [
      {
        id: "song-du-shaofu",
        title: "送杜少府之任蜀州",
        author: "王勃",
        dynasty: "唐",
        lines: ["城阙辅三秦，风烟望五津", "与君离别意，同是宦游人", "海内存知己，天涯若比邻", "无为在歧路，儿女共沾巾"],
      },
    ],
  },
  {
    id: "wuhan",
    modernName: "武汉",
    ancientName: "黄鹤楼（江夏）",
    province: "湖北省",
    category: "river",
    poems: [
      {
        id: "huanghelu-song",
        title: "黄鹤楼送孟浩然之广陵",
        author: "李白",
        dynasty: "唐",
        lines: ["故人西辞黄鹤楼，烟花三月下扬州", "孤帆远影碧空尽，唯见长江天际流"],
      },
    ],
  },
  {
    id: "jiayuguan",
    modernName: "嘉峪关",
    ancientName: "玉门关（阳关）",
    province: "甘肃省",
    category: "frontier",
    poems: [
      {
        id: "song-yuan-er",
        title: "送元二使安西",
        author: "王维",
        dynasty: "唐",
        lines: ["渭城朝雨浥轻尘，客舍青青柳色新", "劝君更尽一杯酒，西出阳关无故人"],
      },
    ],
  },
];

// 搜索函数（与 SearchBar.tsx 中的逻辑一致）
function search(query: string, locations: Location[]) {
  if (!query.trim()) return [];
  const keyword = query.trim().toLowerCase();

  const results: Array<{
    type: "location" | "poem";
    location: Location;
    poem?: Poem;
    matchText: string;
  }> = [];

  locations.forEach((loc) => {
    if (
      loc.modernName.toLowerCase().includes(keyword) ||
      loc.ancientName.toLowerCase().includes(keyword) ||
      loc.province.toLowerCase().includes(keyword)
    ) {
      results.push({
        type: "location",
        location: loc,
        matchText: `${loc.modernName}（古为${loc.ancientName}）`,
      });
    }

    loc.poems.forEach((poem) => {
      const titleMatch = poem.title.toLowerCase().includes(keyword);
      const authorMatch = poem.author.toLowerCase().includes(keyword);
      const lineMatch = poem.lines.some((line) => line.toLowerCase().includes(keyword));

      if (titleMatch || authorMatch || lineMatch) {
        const matchLine = poem.lines.find((l) => l.toLowerCase().includes(keyword));
        results.push({
          type: "poem",
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
  return results.filter((item, index, self) => {
    if (item.type === "location") {
      return self.findIndex((i) => i.type === "location" && i.location.id === item.location.id) === index;
    }
    return self.findIndex((i) => i.type === "poem" && i.poem?.id === item.poem?.id) === index;
  });
}

describe("搜索功能", () => {
  describe("地名搜索", () => {
    it("搜索今地名（西安）应返回对应地点", () => {
      const results = search("西安", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe("location");
      expect(results[0].location.id).toBe("xian");
    });

    it("搜索古地名（长安）应返回对应地点", () => {
      const results = search("长安", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.location.id === "xian")).toBe(true);
    });

    it("搜索古地名（玉门关）应返回嘉峪关", () => {
      const results = search("玉门关", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].location.id).toBe("jiayuguan");
    });

    it("搜索省份（湖北）应返回武汉", () => {
      const results = search("湖北", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].location.id).toBe("wuhan");
    });
  });

  describe("诗歌名搜索", () => {
    it("搜索诗歌名应返回对应诗词结果", () => {
      const results = search("送杜少府", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult).toBeDefined();
      expect(poemResult?.poem?.id).toBe("song-du-shaofu");
      expect(poemResult?.location.id).toBe("xian");
    });

    it("搜索诗歌名应包含地点信息", () => {
      const results = search("黄鹤楼送孟浩然", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("wuhan");
    });

    it("搜索诗歌名结果应包含正确的matchText", () => {
      const results = search("送元二使安西", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.matchText).toContain("送元二使安西");
      expect(poemResult?.matchText).toContain("王维");
    });
  });

  describe("诗句搜索", () => {
    it("搜索诗句片段应返回对应诗词", () => {
      const results = search("海内存知己", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("song-du-shaofu");
    });

    it("搜索诗句应定位到正确地点", () => {
      const results = search("西出阳关无故人", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("jiayuguan");
    });

    it("搜索诗句结果的matchText应包含匹配的诗句", () => {
      const results = search("天涯若比邻", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.matchText).toContain("天涯若比邻");
    });
  });

  describe("作者搜索", () => {
    it("搜索作者名应返回该作者的诗词", () => {
      const results = search("王维", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("王维");
    });
  });

  describe("空搜索处理", () => {
    it("空字符串搜索应返回空结果", () => {
      const results = search("", testLocations);
      expect(results).toHaveLength(0);
    });

    it("空白字符串搜索应返回空结果", () => {
      const results = search("   ", testLocations);
      expect(results).toHaveLength(0);
    });

    it("不存在的关键词应返回空结果", () => {
      const results = search("宋朝诗人", testLocations);
      expect(results).toHaveLength(0);
    });
  });

  describe("去重逻辑", () => {
    it("同一地点不应重复出现", () => {
      // 搜索"西安"，地点名和诗句都可能匹配，但地点结果应只出现一次
      const results = search("西安", testLocations);
      const locationResults = results.filter((r) => r.type === "location" && r.location.id === "xian");
      expect(locationResults).toHaveLength(1);
    });
  });
});
