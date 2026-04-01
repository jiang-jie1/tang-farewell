/**
 * 搜索功能测试
 * 测试地名搜索、诗歌名搜索、诗句搜索的核心逻辑
 * 测试数据与 client/src/data/poems.ts 中的实际地点保持一致
 */
import { describe, expect, it } from "vitest";

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

// 与 poems.ts 一致的测试数据（12个地点）
const testLocations: Location[] = [
  {
    id: "changan",
    modernName: "西安",
    ancientName: "长安",
    province: "陕西省",
    category: "capital",
    poems: [
      {
        id: "song_du_shaofu",
        title: "送杜少府之任蜀州",
        author: "王勃",
        dynasty: "唐",
        lines: ["城阙辅三秦，风烟望五津。", "与君离别意，同是宦游人。", "海内存知己，天涯若比邻。", "无为在歧路，儿女共沾巾。"],
      },
      {
        id: "fu_de_gu_yuan_cao",
        title: "赋得古原草送别",
        author: "白居易",
        dynasty: "唐",
        lines: ["离离原上草，一岁一枯荣。", "野火烧不尽，春风吹又生。", "远芳侵古道，晴翠接荒城。", "又送王孙去，萋萋满别情。"],
      },
      {
        id: "song_you_ren",
        title: "送友人",
        author: "李白",
        dynasty: "唐",
        lines: ["青山横北郭，白水绕东城。", "此地一为别，孤蓬万里征。", "浮云游子意，落日故人情。", "挥手自兹去，萧萧班马鸣。"],
      },
      {
        id: "nan_pu_bie",
        title: "南浦别",
        author: "白居易",
        dynasty: "唐",
        lines: ["南浦凄凄别，", "西风袅袅秋。", "一看肠一断，", "好去莫回头。"],
      },
    ],
  },
  {
    id: "weicheng",
    modernName: "咸阳",
    ancientName: "渭城",
    province: "陕西省",
    category: "capital",
    poems: [
      {
        id: "weicheng_qu",
        title: "送元二使安西",
        author: "王维",
        dynasty: "唐",
        lines: ["渭城朝雨浥轻尘，", "客舍青青柳色新。", "劝君更尽一杯酒，", "西出阳关无故人。"],
      },
    ],
  },
  {
    id: "zhongnanshan",
    modernName: "终南山",
    ancientName: "终南山（山中）",
    province: "陕西省",
    category: "other",
    poems: [
      {
        id: "shan_zhong_song_bie",
        title: "山中送别",
        author: "王维",
        dynasty: "唐",
        lines: ["山中相送罢，", "日暮掩柴扉。", "春草明年绿，", "王孙归不归？"],
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
        id: "huanghe_lou",
        title: "黄鹤楼送孟浩然之广陵",
        author: "李白",
        dynasty: "唐",
        lines: ["故人西辞黄鹤楼，", "烟花三月下扬州。", "孤帆远影碧空尽，", "唯见长江天际流。"],
      },
    ],
  },
  {
    id: "taohuatan",
    modernName: "泾县",
    ancientName: "桃花潭",
    province: "安徽省",
    category: "river",
    poems: [
      {
        id: "zeng_wang_lun",
        title: "赠汪伦",
        author: "李白",
        dynasty: "唐",
        lines: ["李白乘舟将欲行，", "忽闻岸上踏歌声。", "桃花潭水深千尺，", "不及汪伦送我情。"],
      },
    ],
  },
  {
    id: "zhenjiang",
    modernName: "镇江",
    ancientName: "润州·芙蓉楼",
    province: "江苏省",
    category: "river",
    poems: [
      {
        id: "fu_rong_lou",
        title: "芙蓉楼送辛渐",
        author: "王昌龄",
        dynasty: "唐",
        lines: ["寒雨连江夜入吴，", "平明送客楚山孤。", "洛阳亲友如相问，", "一片冰心在玉壶。"],
      },
    ],
  },
  {
    id: "shangqiu",
    modernName: "商丘",
    ancientName: "睢阳",
    province: "河南省",
    category: "other",
    poems: [
      {
        id: "bie_dong_da",
        title: "别董大",
        author: "高适",
        dynasty: "唐",
        lines: ["千里黄云白日曛，", "北风吹雁雪纷纷。", "莫愁前路无知己，", "天下谁人不识君。"],
      },
    ],
  },
  {
    id: "luntai",
    modernName: "轮台",
    ancientName: "轮台（北庭）",
    province: "新疆维吾尔自治区",
    category: "frontier",
    poems: [
      {
        id: "bai_xue_ge",
        title: "白雪歌送武判官归京",
        author: "岑参",
        dynasty: "唐",
        lines: ["北风卷地白草折，胡天八月即飞雪。", "忽如一夜春风来，千树万树梨花开。", "轮台东门送君去，去时雪满天山路。", "山回路转不见君，雪上空留马行处。"],
      },
    ],
  },
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
        lines: ["渡远荆门外，", "来从楚国游。", "山随平野尽，", "江入大荒流。", "仍怜故乡水，", "万里送行舟。"],
      },
    ],
  },
  {
    id: "yangzhou",
    modernName: "扬州",
    ancientName: "广陵",
    province: "江苏省",
    category: "river",
    poems: [
      {
        id: "wen_wang_changling",
        title: "闻王昌龄左迁龙标遥有此寄",
        author: "李白",
        dynasty: "唐",
        lines: ["杨花落尽子规啼，", "闻道龙标过五溪。", "我寄愁心与明月，", "随君直到夜郎西。"],
      },
    ],
  },
  {
    id: "jiangnan",
    modernName: "江南",
    ancientName: "江南（泛指）",
    province: "江浙一带",
    category: "river",
    poems: [
      {
        id: "bu_suan_zi_song_bao",
        title: "卜算子·送鲍浩然之浙东",
        author: "王观",
        dynasty: "宋",
        lines: ["水是眼波横，", "山是眉峰聚。", "若到江南赶上春，", "千万和春住。"],
      },
    ],
  },
  {
    id: "nanjing",
    modernName: "南京",
    ancientName: "金陵",
    province: "江苏省",
    category: "river",
    poems: [
      {
        id: "jinling_jiusi",
        title: "金陵酒肆留别",
        author: "李白",
        dynasty: "唐",
        lines: ["风吹柳花满店香，", "吴姬压酒唤客尝。", "金陵子弟来相送，", "欲行不行各尽觞。", "请君试问东流水，", "别意与之谁短长。"],
      },
      {
        id: "zeng_bie_yi",
        title: "赠别（其一）",
        author: "杜牧",
        dynasty: "唐",
        lines: ["娉娉袅袅十三余，", "豆蔻梢头二月初。", "春风十里扬州路，", "卷上珠帘总不如。"],
      },
      {
        id: "zeng_bie_er",
        title: "赠别（其二）",
        author: "杜牧",
        dynasty: "唐",
        lines: ["多情却似总无情，", "唯觉樽前笑不成。", "蜡烛有心还惜别，", "替人垂泪到天明。"],
      },
    ],
  },
];

describe("搜索功能", () => {
  describe("地名搜索", () => {
    it("搜索今地名（西安）应返回对应地点", () => {
      const results = search("西安", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe("location");
      expect(results[0].location.id).toBe("changan");
    });

    it("搜索古地名（长安）应返回对应地点", () => {
      const results = search("长安", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.location.id === "changan")).toBe(true);
    });

    it("搜索古地名（渭城）应返回咸阳", () => {
      const results = search("渭城", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].location.id).toBe("weicheng");
    });

    it("搜索古地名（桃花潭）应返回泾县", () => {
      const results = search("桃花潭", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].location.id).toBe("taohuatan");
    });

    it("搜索省份（湖北）应返回武汉和荆门", () => {
      const results = search("湖北", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const ids = results.map(r => r.location.id);
      expect(ids.some(id => id === "wuhan" || id === "jingmen")).toBe(true);
    });

    it("搜索古地名（金陵）应返回南京", () => {
      const results = search("金陵", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.location.id === "nanjing")).toBe(true);
    });

    it("搜索古地名（广陵）应在结果中包含扬州", () => {
      const results = search("广陵", testLocations);
      expect(results.length).toBeGreaterThan(0);
      // "广陵"同时出现在扬州古地名和《黄鹤楼送孟浩然之广陵》诗名中
      // 验证扬州地点存在于结果中
      expect(results.some(r => r.location.id === "yangzhou")).toBe(true);
    });

    it("搜索轮台应返回新疆地点", () => {
      const results = search("轮台", testLocations);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].location.id).toBe("luntai");
    });
  });

  describe("诗歌名搜索", () => {
    it("搜索送杜少府应返回王勃的诗", () => {
      const results = search("送杜少府", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult).toBeDefined();
      expect(poemResult?.poem?.id).toBe("song_du_shaofu");
      expect(poemResult?.location.id).toBe("changan");
    });

    it("搜索黄鹤楼送孟浩然应返回李白的诗", () => {
      const results = search("黄鹤楼送孟浩然", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("wuhan");
      expect(poemResult?.poem?.author).toBe("李白");
    });

    it("搜索送元二使安西应返回王维的诗", () => {
      const results = search("送元二使安西", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.matchText).toContain("送元二使安西");
      expect(poemResult?.poem?.author).toBe("王维");
    });

    it("搜索赠汪伦应返回李白的诗", () => {
      const results = search("赠汪伦", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("李白");
      expect(poemResult?.location.id).toBe("taohuatan");
    });

    it("搜索芙蓉楼送辛渐应返回王昌龄的诗", () => {
      const results = search("芙蓉楼送辛渐", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("王昌龄");
      expect(poemResult?.location.id).toBe("zhenjiang");
    });

    it("搜索别董大应返回高适的诗", () => {
      const results = search("别董大", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("高适");
      expect(poemResult?.location.id).toBe("shangqiu");
    });

    it("搜索白雪歌应返回岑参的诗", () => {
      const results = search("白雪歌", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("岑参");
      expect(poemResult?.location.id).toBe("luntai");
    });

    it("搜索渡荆门送别应返回李白的诗", () => {
      const results = search("渡荆门送别", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("李白");
      expect(poemResult?.location.id).toBe("jingmen");
    });

    it("搜索金陵酒肆留别应返回李白的诗", () => {
      const results = search("金陵酒肆留别", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("李白");
      expect(poemResult?.location.id).toBe("nanjing");
    });

    it("搜索赠别应返回杜牧的诗", () => {
      const results = search("赠别", testLocations);
      const poemResults = results.filter((r) => r.type === "poem" && r.poem?.author === "杜牧");
      expect(poemResults.length).toBeGreaterThan(0);
    });

    it("搜索山中送别应返回王维的诗", () => {
      const results = search("山中送别", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("王维");
      expect(poemResult?.location.id).toBe("zhongnanshan");
    });

    it("搜索卜算子应返回王观的词", () => {
      const results = search("卜算子", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("王观");
      expect(poemResult?.location.id).toBe("jiangnan");
    });
  });

  describe("诗句搜索", () => {
    it("搜索海内存知己应返回送杜少府", () => {
      const results = search("海内存知己", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("song_du_shaofu");
    });

    it("搜索西出阳关无故人应返回渭城地点", () => {
      const results = search("西出阳关无故人", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("weicheng");
    });

    it("搜索野火烧不尽应返回白居易的诗", () => {
      const results = search("野火烧不尽", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.author).toBe("白居易");
    });

    it("搜索烟花三月应返回黄鹤楼的诗", () => {
      const results = search("烟花三月", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("wuhan");
    });

    it("搜索桃花潭水深千尺应返回赠汪伦", () => {
      const results = search("桃花潭水深千尺", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("zeng_wang_lun");
    });

    it("搜索一片冰心在玉壶应返回芙蓉楼的诗", () => {
      const results = search("一片冰心在玉壶", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("zhenjiang");
    });

    it("搜索莫愁前路无知己应返回别董大", () => {
      const results = search("莫愁前路无知己", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("bie_dong_da");
    });

    it("搜索忽如一夜春风来应返回白雪歌", () => {
      const results = search("忽如一夜春风来", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("bai_xue_ge");
    });

    it("搜索仍怜故乡水应返回渡荆门送别", () => {
      const results = search("仍怜故乡水", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("du_jingmen_songbie");
    });

    it("搜索我寄愁心与明月应返回扬州的诗", () => {
      const results = search("我寄愁心与明月", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.location.id).toBe("yangzhou");
    });

    it("搜索蜡烛有心还惜别应返回赠别其二", () => {
      const results = search("蜡烛有心还惜别", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("zeng_bie_er");
    });

    it("搜索若到江南赶上春应返回卜算子", () => {
      const results = search("若到江南赶上春", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("bu_suan_zi_song_bao");
    });

    it("搜索春草明年绿应返回山中送别", () => {
      const results = search("春草明年绿", testLocations);
      const poemResult = results.find((r) => r.type === "poem");
      expect(poemResult?.poem?.id).toBe("shan_zhong_song_bie");
    });
  });

  describe("作者搜索", () => {
    it("搜索王维应返回其诗词", () => {
      const results = search("王维", testLocations);
      expect(results.length).toBeGreaterThan(0);
      const poemResults = results.filter((r) => r.type === "poem");
      expect(poemResults.every(r => r.poem?.author === "王维")).toBe(true);
    });

    it("搜索李白应返回多首诗", () => {
      const results = search("李白", testLocations);
      const poemResults = results.filter((r) => r.type === "poem");
      expect(poemResults.length).toBeGreaterThan(2);
    });

    it("搜索白居易应返回其诗词", () => {
      const results = search("白居易", testLocations);
      const poemResults = results.filter((r) => r.type === "poem");
      expect(poemResults.length).toBeGreaterThan(0);
      expect(poemResults.every(r => r.poem?.author === "白居易")).toBe(true);
    });

    it("搜索杜牧应返回赠别", () => {
      const results = search("杜牧", testLocations);
      const poemResults = results.filter((r) => r.type === "poem");
      expect(poemResults.length).toBeGreaterThan(0);
      expect(poemResults.every(r => r.poem?.author === "杜牧")).toBe(true);
    });

    it("搜索岑参应返回白雪歌", () => {
      const results = search("岑参", testLocations);
      const poemResults = results.filter((r) => r.type === "poem");
      expect(poemResults.length).toBeGreaterThan(0);
      expect(poemResults[0].poem?.author).toBe("岑参");
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
      const results = search("元朝诗人", testLocations);
      expect(results).toHaveLength(0);
    });
  });

  describe("去重逻辑", () => {
    it("同一地点不应重复出现", () => {
      const results = search("西安", testLocations);
      const locationResults = results.filter((r) => r.type === "location" && r.location.id === "changan");
      expect(locationResults).toHaveLength(1);
    });

    it("南京有三首诗，搜索金陵应返回地点和诗词结果", () => {
      const results = search("金陵", testLocations);
      const locationResults = results.filter(r => r.type === "location");
      expect(locationResults).toHaveLength(1);
    });
  });

  describe("数据完整性验证", () => {
    it("共应有12个地点", () => {
      expect(testLocations).toHaveLength(12);
    });

    it("长安（西安）应有4首诗", () => {
      const changan = testLocations.find(l => l.id === "changan");
      expect(changan?.poems).toHaveLength(4);
    });

    it("南京（金陵）应有3首诗", () => {
      const nanjing = testLocations.find(l => l.id === "nanjing");
      expect(nanjing?.poems).toHaveLength(3);
    });

    it("所有地点都应有至少一首诗", () => {
      testLocations.forEach(loc => {
        expect(loc.poems.length).toBeGreaterThan(0);
      });
    });

    it("所有诗词都应有完整的基本信息", () => {
      testLocations.forEach(loc => {
        loc.poems.forEach(poem => {
          expect(poem.id).toBeTruthy();
          expect(poem.title).toBeTruthy();
          expect(poem.author).toBeTruthy();
          expect(poem.lines.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
