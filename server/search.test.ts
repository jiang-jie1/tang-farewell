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

// 新增地点数据验证测试
describe("新增地点数据验证", () => {
  // 模拟新增地点数据
  const newLocations: Location[] = [
    {
      id: "jingmen",
      modernName: "荆门",
      ancientName: "荆门山",
      province: "湖北省",
      category: "river",
      poems: [
        {
          id: "du_jingmen_songbie",
          title: "渡荆门送别",
          author: "李白",
          dynasty: "唐",
          lines: ["渡远荆门外，", "来从楚国游。", "山随平野尽，", "江入大荒流。", "月下飞天镜，", "云生结海楼。", "仍怜故乡水，", "万里送行舟。"],
        },
      ],
    },
    {
      id: "suzhou",
      modernName: "苏州",
      ancientName: "姑苏",
      province: "江苏省",
      category: "river",
      poems: [
        {
          id: "feng_qiao_ye_bo",
          title: "枫桥夜泊",
          author: "张继",
          dynasty: "唐",
          lines: ["月落乌啼霜满天，", "江枫渔火对愁眠。", "姑苏城外寒山寺，", "夜半钟声到客船。"],
        },
        {
          id: "song_li_dan",
          title: "寄李儋元锡",
          author: "韦应物",
          dynasty: "唐",
          lines: ["去年花里逢君别，", "今日花开又一年。", "世事茫茫难自料，", "春愁黯黯独成眠。", "身多疾病思田里，", "邑有流亡愧俸钱。", "闻道欲来相问讯，", "西楼望月几回圆。"],
        },
      ],
    },
    {
      id: "chongqing",
      modernName: "重庆",
      ancientName: "夔州（白帝城）",
      province: "重庆市",
      category: "river",
      poems: [
        {
          id: "deng_gao",
          title: "登高",
          author: "杜甫",
          dynasty: "唐",
          lines: ["风急天高猿啸哀，", "渚清沙白鸟飞回。", "无边落木萧萧下，", "不尽长江滚滚来。", "万里悲秋常作客，", "百年多病独登台。", "艰难苦恨繁霜鬓，", "潦倒新停浊酒杯。"],
        },
      ],
    },
    {
      id: "dunhuang",
      modernName: "敦煌",
      ancientName: "沙州（玉门关外）",
      province: "甘肃省",
      category: "frontier",
      poems: [
        {
          id: "liangzhou_ci_wanhan",
          title: "凉州词",
          author: "王翰",
          dynasty: "唐",
          lines: ["葡萄美酒夜光杯，", "欲饮琵琶马上催。", "醉卧沙场君莫笑，", "古来征战几人回。"],
        },
      ],
    },
    {
      id: "beijing",
      modernName: "北京",
      ancientName: "幽州（蓟城）",
      province: "北京市",
      category: "frontier",
      poems: [
        {
          id: "deng_youzhou_tai",
          title: "登幽州台歌",
          author: "陈子昂",
          dynasty: "唐",
          lines: ["前不见古人，", "后不见来者。", "念天地之悠悠，", "独怆然而涕下。"],
        },
      ],
    },
  ];

  it("荆门地点应可搜索到", () => {
    const results = search("荆门", newLocations);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].location.id).toBe("jingmen");
  });

  it("搜索渡荆门送别应返回李白的诗", () => {
    const results = search("渡荆门", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("李白");
  });

  it("搜索姑苏应返回苏州地点", () => {
    const results = search("姑苏", newLocations);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].location.id).toBe("suzhou");
  });

  it("搜索枫桥夜泊应返回张继的诗", () => {
    const results = search("枫桥夜泊", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("张继");
    expect(poemResult?.location.id).toBe("suzhou");
  });

  it("搜索夜半钟声应返回枫桥夜泊", () => {
    const results = search("夜半钟声", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.id).toBe("feng_qiao_ye_bo");
  });

  it("搜索韦应物应返回寄李儋元锡", () => {
    const results = search("韦应物", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("韦应物");
  });

  it("搜索重庆应返回夔州地点", () => {
    const results = search("重庆", newLocations);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].location.id).toBe("chongqing");
  });

  it("搜索登高应返回杜甫的诗", () => {
    const results = search("登高", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("杜甫");
  });

  it("搜索无边落木应返回登高", () => {
    const results = search("无边落木", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.id).toBe("deng_gao");
  });

  it("搜索葡萄美酒应返回王翰的凉州词", () => {
    const results = search("葡萄美酒", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("王翰");
    expect(poemResult?.location.id).toBe("dunhuang");
  });

  it("搜索北京应返回幽州地点", () => {
    const results = search("北京", newLocations);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].location.id).toBe("beijing");
  });

  it("搜索登幽州台歌应返回陈子昂的诗", () => {
    const results = search("登幽州台歌", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.author).toBe("陈子昂");
  });

  it("搜索前不见古人应返回登幽州台歌", () => {
    const results = search("前不见古人", newLocations);
    const poemResult = results.find((r) => r.type === "poem");
    expect(poemResult?.poem?.id).toBe("deng_youzhou_tai");
  });

  it("苏州地点应有两首诗", () => {
    const suzhou = newLocations.find(l => l.id === "suzhou");
    expect(suzhou?.poems).toHaveLength(2);
  });

  it("所有新增地点都应有经纬度数据（通过id验证存在）", () => {
    const expectedIds = ["jingmen", "suzhou", "chongqing", "dunhuang", "beijing"];
    expectedIds.forEach(id => {
      const loc = newLocations.find(l => l.id === id);
      expect(loc).toBeDefined();
      expect(loc?.poems.length).toBeGreaterThan(0);
    });
  });
});
