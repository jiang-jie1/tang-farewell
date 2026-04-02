// 唐代送别诗地图 - 诗词数据
// 分类：京畿送别 | 边塞送别 | 江汉水乡送别 | 其他

export type Category = 'jingji' | 'biansai' | 'jianghan' | 'other';

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
  notes: { word: string; explanation: string }[];
  appreciation: string;
  trivia: string;
  blanks: number[];
}

export interface Location {
  id: string;
  name: string;          // 古地名
  modernName: string;    // 今地名
  description: string;
  category: Category;
  coordinates: [number, number]; // [lng, lat]
  poems: Poem[];
}

// ============================================================
// 一、京畿送别
// ============================================================

const weicheng: Location = {
  id: 'weicheng',
  name: '渭城',
  modernName: '陕西咸阳',
  description: '渭城，汉代咸阳故城，位于渭水之滨。王维在此为友人饯行，留下千古绝唱。',
  category: 'jingji',
  coordinates: [108.7048, 34.3293],
  poems: [
    {
      id: 'song-yuan-er',
      title: '送元二使安西',
      author: '王维',
      dynasty: '唐',
      lines: ['渭城朝雨浥轻尘，', '客舍青青柳色新。', '劝君更尽一杯酒，', '西出阳关无故人。'],
      notes: [
        { word: '渭城', explanation: '秦时咸阳城，汉代改称渭城，在今陕西咸阳东北。' },
        { word: '浥', explanation: '湿润，沾湿。' },
        { word: '客舍', explanation: '旅馆。' },
        { word: '阳关', explanation: '古关名，在今甘肃敦煌西南，是古代通往西域的要道。' },
        { word: '故人', explanation: '老朋友，旧相识。' },
      ],
      appreciation: '这首诗是送别诗中的千古名篇。清晨的细雨湿润了渭城的轻尘，旅馆旁的柳树在雨后显得格外青翠。诗人劝友人再干一杯酒，因为向西出了阳关，便再也见不到老朋友了。全诗语言朴素，情感真挚，以景衬情，将离别之情表达得淋漓尽致。',
      trivia: '此诗后被谱成乐曲《阳关三叠》，因反复吟唱"西出阳关无故人"一句，故名。是唐代最著名的送别曲之一，流传至今。',
      blanks: [1, 5, 10, 15, 20],
    },
  ],
};

const changan: Location = {
  id: 'changan',
  name: '长安',
  modernName: '陕西西安',
  description: '长安，唐代都城，政治文化中心。无数文人墨客在此送别友人，留下了大量送别诗篇。',
  category: 'jingji',
  coordinates: [108.9402, 34.3416],
  poems: [
    {
      id: 'song-du-shaofu',
      title: '送杜少府之任蜀州',
      author: '王勃',
      dynasty: '唐',
      lines: ['城阙辅三秦，', '风烟望五津。', '与君离别意，', '同是宦游人。', '海内存知己，', '天涯若比邻。', '无为在歧路，', '儿女共沾巾。'],
      notes: [
        { word: '城阙', explanation: '城门两旁的高台，这里指长安。' },
        { word: '三秦', explanation: '指关中地区，项羽灭秦后将关中分为三部分，故称三秦。' },
        { word: '五津', explanation: '四川岷江的五个渡口，泛指蜀地。' },
        { word: '宦游', explanation: '在外做官，离家在外求仕。' },
        { word: '比邻', explanation: '近邻，紧邻。' },
        { word: '歧路', explanation: '岔路口，这里指分别之处。' },
      ],
      appreciation: '"海内存知己，天涯若比邻"是千古名句。诗人以豁达的胸怀，打破了离别的愁苦，认为真正的友情不受地域阻隔。全诗格调高昂，一扫送别诗的悲凉之气，展现了初唐诗歌的蓬勃朝气。',
      trivia: '王勃写此诗时年仅十四岁，才华横溢。他是"初唐四杰"之首，可惜英年早逝，二十七岁便溺水而亡。',
      blanks: [2, 7, 12, 17, 22],
    },
  ],
};

const lantian: Location = {
  id: 'lantian',
  name: '蓝田',
  modernName: '陕西西安蓝田',
  description: '蓝田，位于秦岭北麓，王维晚年在此附近的辋川别墅隐居，常于山中送别友人。',
  category: 'jingji',
  coordinates: [109.3228, 34.1513],
  poems: [
    {
      id: 'shanzhong-songbie',
      title: '山中送别',
      author: '王维',
      dynasty: '唐',
      lines: ['山中相送罢，', '日暮掩柴扉。', '春草明年绿，', '王孙归不归？'],
      notes: [
        { word: '掩', explanation: '关上，合上。' },
        { word: '柴扉', explanation: '柴门，用柴木做的门，指简陋的门。' },
        { word: '王孙', explanation: '贵族子弟，这里指送别的友人。' },
      ],
      appreciation: '此诗写送别后的思念之情。送别之后，独自掩上柴门，望着眼前的春草，不禁想到：明年春草又绿，你会回来吗？全诗以景寓情，含蓄蕴藉，将对友人的思念和期盼融入自然景物之中。',
      trivia: '王维晚年笃信佛教，在蓝田辋川隐居，过着半官半隐的生活。他的山水田园诗被苏轼评价为"诗中有画，画中有诗"。',
      blanks: [1, 4, 8, 12],
    },
  ],
};

const baling: Location = {
  id: 'baling',
  name: '灞陵',
  modernName: '西安东郊灞桥区',
  description: '灞陵，汉文帝陵墓所在地，灞河之畔。唐人送别多至灞桥折柳，"灞陵伤别"成为送别文化的重要意象。',
  category: 'jingji',
  coordinates: [109.1200, 34.3200],
  poems: [
    {
      id: 'baling-xing-songbie',
      title: '灞陵行送别',
      author: '李白',
      dynasty: '唐',
      lines: ['送君灞陵亭，', '灞水流浩浩。', '上有无花之古树，', '下有伤心之春草。', '我向秦人问路歧，', '云是王粲南登之古道。', '古道连绵走西京，', '紫阙落日浮云生。', '正当今夕断肠处，', '骊歌愁绝不忍听。'],
      notes: [
        { word: '灞陵亭', explanation: '灞陵附近的亭子，是长安东郊送别之所。' },
        { word: '王粲', explanation: '东汉末年文学家，曾登灞陵，作《登楼赋》抒发思乡之情。' },
        { word: '西京', explanation: '长安，唐代称长安为西京。' },
        { word: '紫阙', explanation: '皇宫，指长安皇城。' },
        { word: '骊歌', explanation: '送别之歌，《骊驹》是古代送别时唱的歌曲。' },
      ],
      appreciation: '此诗描写在灞陵送别友人的情景。灞水浩浩流淌，古树无花，春草令人伤心。诗人借王粲南登的典故，渲染古道的历史沧桑感。落日余晖中，骊歌声声，令人断肠。全诗情景交融，气势雄浑。',
      trivia: '灞桥折柳送别是唐代著名习俗，"年年柳色，灞陵伤别"成为送别文化的经典意象。唐代诗人送别多至此处，留下了大量送别诗篇。',
      blanks: [2, 6, 10, 15, 20],
    },
  ],
};

const changandongmen: Location = {
  id: 'changandongmen',
  name: '长安东门',
  modernName: '陕西西安',
  description: '长安东门，是唐代出行东向的主要城门，送别友人东行时常在此处分别。',
  category: 'jingji',
  coordinates: [108.9600, 34.2700],
  poems: [
    {
      id: 'wangzhihuan-songbie',
      title: '送别',
      author: '王之涣',
      dynasty: '唐',
      lines: ['杨柳东风树，', '青青夹御河。', '近来攀折苦，', '应为别离多。'],
      notes: [
        { word: '御河', explanation: '皇城附近的河流，这里指长安城内的水渠。' },
        { word: '攀折', explanation: '折取柳枝，古人送别有折柳相赠的习俗。' },
      ],
      appreciation: '这首小诗以杨柳起兴，写出了送别的频繁与伤感。东风吹拂下，御河两岸的杨柳青青，但近来折柳送别太多，柳枝都快被折光了。诗人以柳树的"苦"来映衬离别的频繁，含蓄而有力。',
      trivia: '王之涣以《登鹳雀楼》和《凉州词》最为著名，但他的送别诗同样情感真挚。折柳送别是唐代最流行的送别习俗，"柳"与"留"谐音，寄托了挽留之意。',
      blanks: [1, 4, 8, 12],
    },
  ],
};

const changlepо: Location = {
  id: 'changlepo',
  name: '长乐坡',
  modernName: '西安东郊',
  description: '长乐坡，位于长安城东，是唐代送别东行旅人的重要地点，与灞桥相近。',
  category: 'jingji',
  coordinates: [109.0800, 34.2900],
  poems: [
    {
      id: 'changlepo-songren',
      title: '长乐坡送人',
      author: '白居易',
      dynasty: '唐',
      lines: ['灞浐风烟函谷路，', '曾经几度别长安。', '昔时蹙促为迁客，', '今日从容自去官。', '优诏幸分四皓秩，', '祖筵惭继二疏欢。', '尽将旧友随君去，', '独有前心与我难。'],
      notes: [
        { word: '灞浐', explanation: '灞河和浐河，均在长安东郊。' },
        { word: '函谷路', explanation: '经函谷关东去的道路。' },
        { word: '蹙促', explanation: '局促不安，形容被贬时的狼狈。' },
        { word: '迁客', explanation: '被贬谪的官员。' },
        { word: '四皓', explanation: '秦末四位隐居商山的老人，后比喻高洁之士。' },
        { word: '二疏', explanation: '汉代疏广、疏受叔侄，功成身退，后比喻知足辞官之人。' },
      ],
      appreciation: '此诗写白居易在长乐坡送别友人时的感慨。昔日被贬时局促不安，如今从容辞官，心境大不相同。诗人将旧友都送走了，只剩下自己的一颗心难以割舍。全诗情感复杂，既有洒脱，又有不舍。',
      trivia: '白居易一生多次被贬，对离别有深刻体会。他的诗语言平易近人，相传他写完诗后会念给老妪听，若听不懂便修改，直到老妪能懂为止。',
      blanks: [2, 6, 11, 16, 21],
    },
  ],
};

const huazhou: Location = {
  id: 'huazhou',
  name: '华州',
  modernName: '陕西渭南华州区',
  description: '华州，位于关中东部，渭河南岸，是长安通往东方的要道上的重要城市。',
  category: 'jingji',
  coordinates: [109.7714, 34.5122],
  poems: [
    {
      id: 'fa-huazhou',
      title: '发华州留别张侍御',
      author: '刘禹锡',
      dynasty: '唐',
      lines: ['莫辞酒，', '此会固难同。', '请看女工机上帛，', '半作军人旗上红。', '莫辞酒，', '谁为君王之爪牙？', '春雷三月不作响，', '空看沙尘扑地起。'],
      notes: [
        { word: '侍御', explanation: '官职名，御史台官员，负责监察。' },
        { word: '女工', explanation: '女子纺织，这里指织布的女工。' },
        { word: '爪牙', explanation: '比喻得力助手，这里指保卫国家的将士。' },
        { word: '春雷', explanation: '比喻朝廷的号令或有力的行动。' },
      ],
      appreciation: '此诗写刘禹锡离开华州时与张侍御的告别。诗人以"莫辞酒"反复劝饮，感叹此次分别难以再聚。借女工织帛、军人旗帜的意象，表达对国家局势的忧虑。全诗慷慨激昂，不同于一般送别诗的儿女情长。',
      trivia: '刘禹锡因参与永贞革新，被贬二十三年，辗转多地。他以"沉舟侧畔千帆过，病树前头万木春"表达乐观精神，被称为"诗豪"。',
      blanks: [2, 6, 10, 15],
    },
  ],
};

// ============================================================
// 二、边塞送别
// ============================================================

const luntai: Location = {
  id: 'luntai',
  name: '轮台',
  modernName: '乌鲁木齐乌拉泊古城',
  description: '轮台，唐代西域重镇，今新疆乌鲁木齐乌拉泊古城一带。岑参在此任职期间写下多首边塞送别诗。',
  category: 'biansai',
  coordinates: [87.6177, 43.6028],
  poems: [
    {
      id: 'bai-xue-ge',
      title: '白雪歌送武判官归京',
      author: '岑参',
      dynasty: '唐',
      lines: ['北风卷地白草折，', '胡天八月即飞雪。', '忽如一夜春风来，', '千树万树梨花开。', '散入珠帘湿罗幕，', '狐裘不暖锦衾薄。', '将军角弓不得控，', '都护铁衣冷难着。', '瀚海阑干百丈冰，', '愁云惨淡万里凝。', '中军置酒饮归客，', '胡琴琵琶与羌笛。', '纷纷暮雪下辕门，', '风掣红旗冻不翻。', '轮台东门送君去，', '去时雪满天山路。', '山回路转不见君，', '雪上空留马行处。'],
      notes: [
        { word: '白草', explanation: '西域的一种草，秋冬变白，故名。' },
        { word: '胡天', explanation: '北方少数民族地区的天空，泛指边塞地区。' },
        { word: '狐裘', explanation: '狐皮制成的皮衣，是御寒的高档衣物。' },
        { word: '锦衾', explanation: '织锦被子。' },
        { word: '角弓', explanation: '用兽角装饰的弓，天冷则弓弦收缩，难以拉开。' },
        { word: '都护', explanation: '唐代西域最高军政长官。' },
        { word: '瀚海', explanation: '沙漠，这里指戈壁沙漠。' },
        { word: '阑干', explanation: '纵横交错的样子。' },
        { word: '辕门', explanation: '军营的大门。' },
        { word: '风掣', explanation: '被风吹动。' },
      ],
      appreciation: '"忽如一夜春风来，千树万树梨花开"是千古名句，以梨花比喻雪花，新奇瑰丽。全诗描绘了西域边塞壮阔的雪景，在此背景下送别友人，情感更加深沉。结尾"雪上空留马行处"，以空旷的雪地上留下的马蹄印，表达了对友人的深深不舍。',
      trivia: '岑参两度出塞，在西域生活多年，对边塞生活有深刻体验。他的边塞诗气势磅礴，与高适并称"高岑"，是唐代边塞诗的代表人物。',
      blanks: [3, 8, 13, 18, 23],
    },
    {
      id: 'luntai-ge',
      title: '轮台歌奉送封大夫出师西征',
      author: '岑参',
      dynasty: '唐',
      lines: ['轮台城头夜吹角，', '轮台城北旄头落。', '羽书昨夜过渠黎，', '单于已在金山西。', '戍楼西望烟尘黑，', '汉兵屯在轮台北。', '上将拥旄西出征，', '平明吹笛大军行。', '四边伐鼓雪海涌，', '三军大呼阴山动。', '虏塞兵气连云屯，', '战场白骨缠草根。', '剑河风急雪片阔，', '沙口石冻马蹄脱。', '亚相勤王甘苦辛，', '誓将报主静边尘。', '古来青史谁不见，', '今见功名胜古人。'],
      notes: [
        { word: '旄头', explanation: '星名，古人认为旄头星出现预示战争。' },
        { word: '羽书', explanation: '插有羽毛的紧急军事文书，即加急军报。' },
        { word: '渠黎', explanation: '西域地名，今新疆轮台县附近。' },
        { word: '单于', explanation: '匈奴最高首领的称号，这里泛指敌方首领。' },
        { word: '旄', explanation: '用牦牛尾装饰的旗帜，是高级将领的仪仗。' },
        { word: '亚相', explanation: '副宰相，这里指封常清，时任安西节度使。' },
      ],
      appreciation: '此诗以雄浑的笔墨描写出师西征的壮观场面。从轮台城头的号角声，到大军出征的浩荡气势，再到战场的艰苦与将士的英勇，层层递进。结尾以"今见功名胜古人"表达对封大夫的赞颂和期许，格调高昂。',
      trivia: '封常清是唐代名将，曾任安西节度使，镇守西域多年。岑参在其幕府任职，与封常清关系密切，写下多首赞颂其功绩的诗篇。',
      blanks: [2, 7, 12, 17, 22],
    },
    {
      id: 'zouma-chuan',
      title: '走马川行奉送封大夫出师西征',
      author: '岑参',
      dynasty: '唐',
      lines: ['君不见走马川行雪海边，', '平沙莽莽黄入天。', '轮台九月风夜吼，', '一川碎石大如斗，', '随风满地石乱走。', '匈奴草黄马正肥，', '金山西见烟尘飞，', '汉家大将西出师。', '将军金甲夜不脱，', '半夜军行戈相拨，', '风头如刀面如割。', '马毛带雪汗气蒸，', '五花连钱旋作冰，', '幕中草檄砚水凝。', '虏骑闻之应胆慑，', '料知短兵不敢接，', '车师西门伫献捷。'],
      notes: [
        { word: '走马川', explanation: '西域河流名，在今新疆境内。' },
        { word: '雪海', explanation: '形容大雪覆盖的广阔地区。' },
        { word: '平沙莽莽', explanation: '广阔无边的沙漠。' },
        { word: '匈奴', explanation: '古代北方游牧民族，这里泛指西域敌军。' },
        { word: '金山', explanation: '阿尔泰山，在今新疆北部。' },
        { word: '五花连钱', explanation: '形容马的毛色花纹，五花指五种颜色，连钱指圆形花纹。' },
        { word: '草檄', explanation: '起草讨伐文书。' },
        { word: '车师', explanation: '西域古国名，在今新疆吐鲁番附近。' },
      ],
      appreciation: '此诗以奇特的想象和夸张的手法，描绘了西域边塞的奇异风光和出征的壮观场面。"一川碎石大如斗，随风满地石乱走"写出了边塞风沙的猛烈；"马毛带雪汗气蒸，五花连钱旋作冰"写出了行军的艰苦。全诗气势磅礴，是边塞诗的杰作。',
      trivia: '此诗与《白雪歌送武判官归京》同为岑参边塞诗的代表作，均以奇特的边塞风光为背景，展现了唐代边疆将士的英勇气概。',
      blanks: [3, 8, 13, 18, 23],
    },
  ],
};

const wuwei: Location = {
  id: 'wuwei',
  name: '武威',
  modernName: '甘肃武威',
  description: '武威，古称凉州，河西走廊重镇，是古代丝绸之路上的重要城市，也是唐代边塞诗的重要地理坐标。',
  category: 'biansai',
  coordinates: [102.6378, 37.9282],
  poems: [
    {
      id: 'wuwei-song-liu',
      title: '武威送刘判官赴碛西行军',
      author: '岑参',
      dynasty: '唐',
      lines: ['火山五月行人少，', '看君马去疾如鸟。', '都护行营太白西，', '角声一动胡天晓。'],
      notes: [
        { word: '火山', explanation: '火焰山，在今新疆吐鲁番东北，夏季极热，故名。' },
        { word: '碛西', explanation: '大沙漠以西，泛指西域地区。' },
        { word: '都护', explanation: '唐代西域最高军政长官，这里指安西都护府。' },
        { word: '太白', explanation: '太白星，即金星，古人认为其出现与战争有关。' },
      ],
      appreciation: '这首短诗写送别的场景。五月的火山地区人迹罕至，友人骑马远去，快如飞鸟。都护的行营在太白星西边，号角声一响，边塞的天就亮了。全诗以简洁的笔墨，勾勒出边塞送别的壮阔画面。',
      trivia: '火焰山（火山）是古代丝绸之路上的著名地标，《西游记》中唐僧取经路过此地，孙悟空借芭蕉扇扑灭火焰山的故事家喻户晓。',
      blanks: [1, 4, 8, 12],
    },
    {
      id: 'song-li-fushi',
      title: '送李副使赴碛西官军',
      author: '岑参',
      dynasty: '唐',
      lines: ['火山六月应更热，', '赤亭道口行人绝。', '知君惯度祁连城，', '岂能愁见轮台月。', '脱鞍暂入酒家垆，', '送君万里西击胡。', '功名只向马上取，', '真是英雄一丈夫。'],
      notes: [
        { word: '赤亭', explanation: '地名，在今甘肃境内，是通往西域的要道。' },
        { word: '祁连城', explanation: '祁连山附近的城池，在今甘肃、青海一带。' },
        { word: '轮台月', explanation: '轮台的月亮，代指边塞的孤寂生活。' },
        { word: '酒家垆', explanation: '酒店，垆是古代酒店用来放酒坛的土台。' },
        { word: '击胡', explanation: '攻打北方游牧民族，泛指出征作战。' },
      ],
      appreciation: '此诗豪迈奔放，充满阳刚之气。六月的火山更加炎热，道路上行人绝迹，但诗人相信友人早已习惯了边塞的艰苦。"功名只向马上取，真是英雄一丈夫"是千古名句，表达了边塞将士建功立业的豪情壮志。',
      trivia: '岑参的边塞诗以豪迈奔放著称，与高适的沉郁顿挫形成鲜明对比。他的诗中充满了对边塞风光的热爱和对将士英勇的赞颂。',
      blanks: [2, 6, 11, 16],
    },
  ],
};

const jiaohe: Location = {
  id: 'jiaohe',
  name: '交河',
  modernName: '新疆吐鲁番交河故城',
  description: '交河，古代西域重要城市，位于今新疆吐鲁番市西郊，是丝绸之路上的重要节点。',
  category: 'biansai',
  coordinates: [89.0500, 42.9300],
  poems: [
    {
      id: 'song-cuizi-huanjing',
      title: '送崔子还京',
      author: '岑参',
      dynasty: '唐',
      lines: ['匹马西从天外归，', '扬鞭只共鸟争飞。', '送君九月交河北，', '雪里题诗泪满衣。'],
      notes: [
        { word: '天外', explanation: '极远的地方，这里指西域边塞。' },
        { word: '扬鞭', explanation: '挥动马鞭，形容骑马疾驰。' },
        { word: '交河北', explanation: '交河城的北边，泛指西域边塞地区。' },
      ],
      appreciation: '此诗写在交河送别友人返回京城的情景。九月的交河，大雪纷飞，诗人在雪中题诗送别，泪水沾湿了衣衫。全诗简洁而情感浓烈，以雪中题诗、泪满衣的细节，将离别之情表达得淋漓尽致。',
      trivia: '交河故城是世界上保存最完好的土建筑城市遗址之一，已有两千多年历史，现为全国重点文物保护单位和世界文化遗产。',
      blanks: [1, 4, 8, 12],
    },
  ],
};

const jizhou: Location = {
  id: 'jizhou',
  name: '蓟州',
  modernName: '天津蓟州',
  description: '蓟州，古代燕地重镇，位于今天津市蓟州区，是唐代北方边塞的重要城市。',
  category: 'biansai',
  coordinates: [117.4000, 40.0450],
  poems: [
    {
      id: 'jiuri-songbie',
      title: '九日送别',
      author: '王之涣',
      dynasty: '唐',
      lines: ['蓟庭萧瑟故人稀，', '何处登高且送归。', '今日暂同芳菊酒，', '明朝应作断蓬飞。'],
      notes: [
        { word: '蓟庭', explanation: '蓟州的庭院，泛指蓟州地区。' },
        { word: '萧瑟', explanation: '形容秋风吹拂、草木凋零的景象。' },
        { word: '九日', explanation: '农历九月九日，重阳节，有登高饮菊花酒的习俗。' },
        { word: '芳菊酒', explanation: '菊花酒，重阳节饮菊花酒是古代习俗，寓意长寿。' },
        { word: '断蓬', explanation: '折断的蓬草，随风飘荡，比喻漂泊无定的旅人。' },
      ],
      appreciation: '此诗写重阳节在蓟州送别友人。秋风萧瑟，故人稀少，今日暂且同饮菊花酒，明天便要像断蓬一样随风飘散。全诗以重阳节的习俗为背景，将节日的欢聚与离别的伤感融为一体，情感真挚。',
      trivia: '重阳节登高、饮菊花酒、插茱萸是唐代重要习俗。王维的"遥知兄弟登高处，遍插茱萸少一人"是描写重阳节思乡的千古名句。',
      blanks: [1, 4, 8, 12],
    },
  ],
};

// ============================================================
// 三、江汉水乡送别
// ============================================================

const jingmenshan: Location = {
  id: 'jingmenshan',
  name: '荆门山',
  modernName: '湖北宜昌宜都西北',
  description: '荆门山，位于今湖北宜昌宜都西北，长江穿越此处进入平原地带，是古代入蜀出蜀的重要地理节点。',
  category: 'jianghan',
  coordinates: [111.5000, 30.3800],
  poems: [
    {
      id: 'du-jingmen-songbie',
      title: '渡荆门送别',
      author: '李白',
      dynasty: '唐',
      lines: ['渡远荆门外，', '来从楚国游。', '山随平野尽，', '江入大荒流。', '月下飞天镜，', '云生结海楼。', '仍怜故乡水，', '万里送行舟。'],
      notes: [
        { word: '荆门', explanation: '荆门山，在今湖北宜都西北，长江南岸。' },
        { word: '楚国', explanation: '古代楚国地域，泛指今湖北、湖南一带。' },
        { word: '平野', explanation: '平坦的原野，指长江中下游平原。' },
        { word: '大荒', explanation: '广阔无边的原野。' },
        { word: '天镜', explanation: '比喻月亮倒映在水中，如同天上的镜子。' },
        { word: '海楼', explanation: '海市蜃楼，指云彩变幻形成的奇异景象。' },
      ],
      appreciation: '"山随平野尽，江入大荒流"是千古名句，描绘了长江出三峡后进入平原的壮阔景象。结尾"仍怜故乡水，万里送行舟"，以拟人手法写故乡的水万里相送，表达了对故乡的深深眷恋。',
      trivia: '李白年轻时从四川出发，顺长江东下，这首诗是他初次离开故乡时所作。"仍怜故乡水"中的故乡水指的是四川的江水，李白将其拟人化，写它万里相送，情感真挚动人。',
      blanks: [1, 5, 9, 13, 17],
    },
  ],
};

const jiangxia: Location = {
  id: 'jiangxia',
  name: '江夏',
  modernName: '湖北武汉黄鹤楼',
  description: '江夏，今湖北武汉，黄鹤楼矗立于此。李白在此送别孟浩然东下扬州，留下千古名篇。',
  category: 'jianghan',
  coordinates: [114.3054, 30.5928],
  poems: [
    {
      id: 'huanghe-lou-song-meng',
      title: '黄鹤楼送孟浩然之广陵',
      author: '李白',
      dynasty: '唐',
      lines: ['故人西辞黄鹤楼，', '烟花三月下扬州。', '孤帆远影碧空尽，', '唯见长江天际流。'],
      notes: [
        { word: '故人', explanation: '老朋友，指孟浩然。' },
        { word: '西辞', explanation: '从西边辞别，黄鹤楼在扬州西边，故云西辞。' },
        { word: '烟花三月', explanation: '春天烟雾迷蒙、繁花似锦的三月。' },
        { word: '广陵', explanation: '扬州的古称。' },
        { word: '碧空尽', explanation: '消失在碧蓝的天空中。' },
      ],
      appreciation: '"烟花三月下扬州"是千古名句，将春天的美景与扬州的繁华融为一体。最后两句以目送孤帆远去，只见长江滚滚东流，将依依不舍的离情表达得含蓄而深沉。',
      trivia: '孟浩然是李白最敬重的诗人之一，李白曾写诗赞颂他"吾爱孟夫子，风流天下闻"。这首诗写于开元盛世，当时扬州是全国最繁华的城市之一。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const jingzhou: Location = {
  id: 'jingzhou',
  name: '荆州',
  modernName: '湖北荆州',
  description: '荆州，古代楚国故都，位于长江中游，是江汉平原的重要城市。孟浩然在此送别友人南下江南。',
  category: 'jianghan',
  coordinates: [112.2384, 30.3354],
  poems: [
    {
      id: 'song-du-shisi',
      title: '送杜十四之江南',
      author: '孟浩然',
      dynasty: '唐',
      lines: ['荆吴相接水为乡，', '君去春江正渺茫。', '日暮征帆何处泊，', '天涯一望断人肠。'],
      notes: [
        { word: '荆吴', explanation: '荆州和吴地（今江苏、浙江一带），两地均临水。' },
        { word: '水为乡', explanation: '以水为故乡，形容江南水乡的特点。' },
        { word: '春江', explanation: '春天的江水，烟波浩渺。' },
        { word: '渺茫', explanation: '广阔而模糊，形容江面烟雾迷蒙。' },
        { word: '征帆', explanation: '远行的船帆。' },
        { word: '断人肠', explanation: '令人极度悲伤，肝肠寸断。' },
      ],
      appreciation: '此诗写送别友人南下江南的情景。荆州与吴地都是水乡，友人乘船而去，春江烟波浩渺。日暮时分，不知征帆停泊何处，天涯一望，令人肝肠寸断。全诗以水为背景，情景交融，将离别之情表达得深沉而含蓄。',
      trivia: '孟浩然是唐代著名山水田园诗人，与王维并称"王孟"。他一生未仕，漫游各地，对江南水乡有深厚感情。"杜十四"是友人杜某，排行第十四，唐人习惯以排行称呼友人。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const longbiao: Location = {
  id: 'longbiao',
  name: '龙标',
  modernName: '湖南洪江市（黔阳）',
  description: '龙标，今湖南洪江市黔阳古城，王昌龄曾被贬至此地任龙标尉。',
  category: 'jianghan',
  coordinates: [109.7333, 27.2000],
  poems: [
    {
      id: 'song-chai-shiyü',
      title: '送柴侍御',
      author: '王昌龄',
      dynasty: '唐',
      lines: ['流水通波接武冈，', '送君不觉有离伤。', '青山一道同云雨，', '明月何曾是两乡。'],
      notes: [
        { word: '武冈', explanation: '地名，今湖南武冈市，与龙标相邻。' },
        { word: '通波', explanation: '水流相通，指两地之间有河流相连。' },
        { word: '离伤', explanation: '离别的伤感。' },
        { word: '两乡', explanation: '两个不同的地方，指送别双方各在一方。' },
      ],
      appreciation: '"青山一道同云雨，明月何曾是两乡"是千古名句。诗人以豁达的胸怀，打破了地域的隔阂，认为青山共享云雨，明月照耀两地，并非真正的两乡。全诗一扫离别的悲愁，充满了乐观豁达的情怀。',
      trivia: '王昌龄因"不护细行"被贬龙标，在此任职多年。李白得知后写下《闻王昌龄左迁龙标遥有此寄》，以"我寄愁心与明月，随风直到夜郎西"表达对友人的思念。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const yuezhou: Location = {
  id: 'yuezhou',
  name: '岳州',
  modernName: '湖南岳阳',
  description: '岳州，今湖南岳阳，洞庭湖畔，岳阳楼所在地。张说在此送别友人，留下深情诗篇。',
  category: 'jianghan',
  coordinates: [113.1292, 29.3572],
  poems: [
    {
      id: 'song-liang-liu',
      title: '送梁六自洞庭山作',
      author: '张说',
      dynasty: '唐',
      lines: ['巴陵一望洞庭秋，', '日见孤峰水上浮。', '闻道神仙不可接，', '心随湖水共悠悠。'],
      notes: [
        { word: '巴陵', explanation: '岳州的古称，今湖南岳阳。' },
        { word: '洞庭', explanation: '洞庭湖，中国第二大淡水湖，在湖南北部。' },
        { word: '孤峰', explanation: '洞庭湖中的君山，孤立于湖中，故称孤峰。' },
        { word: '神仙', explanation: '这里指隐居洞庭山的高人，也暗指友人梁六。' },
        { word: '悠悠', explanation: '绵长，形容思念之情绵绵不绝。' },
      ],
      appreciation: '此诗写在洞庭湖畔送别友人的情景。秋日的洞庭湖上，孤峰（君山）浮现在水面上，如同仙境。诗人感叹神仙（友人）难以相见，心随湖水悠悠荡漾，表达了深深的不舍之情。',
      trivia: '张说是唐代著名政治家和文学家，曾三次担任宰相，被称为"燕许大手笔"。洞庭湖中的君山岛传说是舜帝二妃娥皇、女英的墓地，充满神话色彩。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const jiangzhou: Location = {
  id: 'jiangzhou',
  name: '江州',
  modernName: '江西九江',
  description: '江州，今江西九江，长江与鄱阳湖交汇处，白居易曾被贬至此，留下《琵琶行》等名篇。',
  category: 'jianghan',
  coordinates: [115.9929, 29.7050],
  poems: [
    {
      id: 'jiangzhou-chongbie',
      title: '江州重别薛六柳八二员外',
      author: '刘长卿',
      dynasty: '唐',
      lines: ['生涯岂料承优诏，', '世事空知学醉歌。', '江上月明胡雁过，', '淮南木落楚山多。', '寄身且喜沧洲近，', '顾影无如白发何。', '今日龙钟人共老，', '愿将余勇付潮波。'],
      notes: [
        { word: '优诏', explanation: '朝廷的优待诏书，这里指被召回朝廷。' },
        { word: '醉歌', explanation: '借酒浇愁，以歌消遣，指消极避世的生活方式。' },
        { word: '胡雁', explanation: '从北方飞来的大雁，秋天南飞。' },
        { word: '沧洲', explanation: '水边之地，古代隐士居住的地方，这里指江州。' },
        { word: '龙钟', explanation: '形容年老体衰，行动迟缓。' },
        { word: '余勇', explanation: '剩余的勇气和力量。' },
      ],
      appreciation: '此诗写刘长卿在江州再次与友人分别时的感慨。人生际遇难以预料，只能以醉歌度日。江上明月，胡雁南飞，楚山连绵，景色苍茫。诗人感叹年老体衰，却仍愿将余勇付诸东流，表达了不甘沉沦的精神。',
      trivia: '刘长卿一生多次被贬，仕途坎坷。他的诗以五言为主，语言清丽，情感深沉，被誉为"五言长城"。',
      blanks: [2, 6, 11, 16],
    },
  ],
};

const xuanzhou: Location = {
  id: 'xuanzhou',
  name: '宣州',
  modernName: '安徽宣城',
  description: '宣州，今安徽宣城，江南名城，李白多次游历此地，在此送别友人，留下名篇。',
  category: 'jianghan',
  coordinates: [118.7575, 30.9460],
  poems: [
    {
      id: 'song-youren-xuanzhou',
      title: '送友人',
      author: '李白',
      dynasty: '唐',
      lines: ['青山横北郭，', '白水绕东城。', '此地一为别，', '孤蓬万里征。', '浮云游子意，', '落日故人情。', '挥手自兹去，', '萧萧班马鸣。'],
      notes: [
        { word: '北郭', explanation: '城北，郭指城外的墙，北郭即城北郊外。' },
        { word: '白水', explanation: '清澈的河水，这里指宣城附近的河流。' },
        { word: '孤蓬', explanation: '孤独的蓬草，随风飘荡，比喻漂泊的旅人。' },
        { word: '浮云', explanation: '飘浮的云，比喻游子漂泊不定的生活。' },
        { word: '班马', explanation: '离群的马，这里指分别时各自骑乘的马。' },
        { word: '萧萧', explanation: '马嘶声，形容马的叫声。' },
      ],
      appreciation: '"浮云游子意，落日故人情"是千古名句，以浮云比喻游子漂泊不定，以落日比喻故人依依不舍的深情。结尾以马的嘶鸣声作结，余音绕梁，将离别的伤感表达得含蓄而深沉。',
      trivia: '李白一生漫游各地，对送别有深刻体验。他的送别诗往往豪迈中带着深情，与一般送别诗的哀愁不同，展现了他独特的个性。',
      blanks: [1, 5, 9, 13, 17],
    },
  ],
};

const jingxian: Location = {
  id: 'jingxian',
  name: '泾县',
  modernName: '安徽宣城泾县',
  description: '泾县，今安徽宣城泾县，桃花潭所在地。李白在此受到汪伦盛情款待，临别作诗留念。',
  category: 'jianghan',
  coordinates: [118.4200, 30.6900],
  poems: [
    {
      id: 'zeng-wang-lun',
      title: '赠汪伦',
      author: '李白',
      dynasty: '唐',
      lines: ['李白乘舟将欲行，', '忽闻岸上踏歌声。', '桃花潭水深千尺，', '不及汪伦送我情。'],
      notes: [
        { word: '踏歌', explanation: '一种民间歌唱形式，边唱边以脚踏地打节拍。' },
        { word: '桃花潭', explanation: '在今安徽泾县西南，水深清澈，风景秀美。' },
      ],
      appreciation: '"桃花潭水深千尺，不及汪伦送我情"是千古名句，以桃花潭水的深度来比喻友情的深厚，夸张而生动。全诗语言朴素，情感真挚，是李白友情诗中的代表作。',
      trivia: '汪伦是泾县的一位普通百姓，他写信邀请李白来游玩，信中说此地有"十里桃花"和"万家酒店"，李白欣然前往，到后才知道"十里桃花"是十里外的桃花潭，"万家酒店"是姓万的人开的酒店，被汪伦的机智逗乐了。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const fuli: Location = {
  id: 'fuli',
  name: '符离',
  modernName: '安徽宿州符离集',
  description: '符离，今安徽宿州符离集，白居易少年时曾在此居住，后来写下《赋得古原草送别》。',
  category: 'jianghan',
  coordinates: [117.3500, 33.6500],
  poems: [
    {
      id: 'fudeGuyuancao',
      title: '赋得古原草送别',
      author: '白居易',
      dynasty: '唐',
      lines: ['离离原上草，', '一岁一枯荣。', '野火烧不尽，', '春风吹又生。', '远芳侵古道，', '晴翠接荒城。', '又送王孙去，', '萋萋满别情。'],
      notes: [
        { word: '离离', explanation: '形容草木茂盛的样子。' },
        { word: '枯荣', explanation: '枯萎和繁荣，指草木的生长规律。' },
        { word: '远芳', explanation: '远处的芳草，芳香弥漫。' },
        { word: '晴翠', explanation: '晴天里青翠的草色。' },
        { word: '王孙', explanation: '贵族子弟，这里泛指离去的友人。' },
        { word: '萋萋', explanation: '草木茂盛的样子，这里形容离别之情浓厚。' },
      ],
      appreciation: '"野火烧不尽，春风吹又生"是千古名句，以野草顽强的生命力比喻坚韧不拔的精神。全诗以草的枯荣比喻人生的离合，将送别之情融入自然景物，含蓄而深沉。',
      trivia: '白居易十六岁时写下此诗，参加科举考试。顾况看到这首诗后，由原来的轻视变为赞赏，说："有才如此，居天下亦不难。"此诗因此成为白居易的成名作。',
      blanks: [1, 5, 9, 13, 17],
    },
  ],
};

const jinling: Location = {
  id: 'jinling',
  name: '金陵',
  modernName: '江苏南京',
  description: '金陵，今江苏南京，六朝古都，繁华之地。李白多次游历此地，留下多首送别诗。',
  category: 'jianghan',
  coordinates: [118.7969, 32.0603],
  poems: [
    {
      id: 'jinling-jiusi-liubie',
      title: '金陵酒肆留别',
      author: '李白',
      dynasty: '唐',
      lines: ['风吹柳花满店香，', '吴姬压酒唤客尝。', '金陵子弟来相送，', '欲行不行各尽觞。', '请君试问东流水，', '别意与之谁短长。'],
      notes: [
        { word: '吴姬', explanation: '吴地的女子，这里指酒店的女服务员。' },
        { word: '压酒', explanation: '过滤酒，将酿好的酒过滤澄清。' },
        { word: '子弟', explanation: '年轻人，这里指金陵的年轻朋友们。' },
        { word: '尽觞', explanation: '喝干杯中的酒，觞是古代盛酒的器具。' },
        { word: '东流水', explanation: '向东流去的江水，比喻时光流逝和离别之情。' },
      ],
      appreciation: '此诗写在金陵酒肆与友人告别的情景。柳花飘香，吴姬劝酒，金陵的年轻朋友们依依不舍，频频举杯。结尾以"别意与之谁短长"发问，将离别之情与东流水相比，含蓄而有力。',
      trivia: '李白一生漫游，金陵是他最喜爱的城市之一。他曾多次游历金陵，留下了大量诗篇，对金陵的繁华和历史有深厚感情。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const guangling: Location = {
  id: 'guangling',
  name: '广陵',
  modernName: '江苏扬州',
  description: '广陵，今江苏扬州，唐代最繁华的城市之一。杜牧曾在扬州任职，留下多首送别诗。',
  category: 'jianghan',
  coordinates: [119.4127, 32.3912],
  poems: [
    {
      id: 'zengbie-yi',
      title: '赠别（其一）',
      author: '杜牧',
      dynasty: '唐',
      lines: ['娉娉袅袅十三余，', '豆蔻梢头二月初。', '春风十里扬州路，', '卷上珠帘总不如。'],
      notes: [
        { word: '娉娉袅袅', explanation: '形容女子体态轻盈、姿态优美。' },
        { word: '豆蔻', explanation: '植物名，初夏开花，这里比喻少女。' },
        { word: '梢头', explanation: '枝梢，豆蔻梢头指豆蔻花刚开放的样子，比喻少女的青春年华。' },
        { word: '珠帘', explanation: '用珠子串成的帘子，这里指扬州各处的美女。' },
      ],
      appreciation: '"春风十里扬州路，卷上珠帘总不如"是千古名句，将扬州路上的所有美女都比下去，对送别对象的赞美达到极致。全诗以豆蔻比喻少女的青春，清新而含蓄。',
      trivia: '杜牧在扬州任职期间，流连于扬州的繁华之中，留下了大量描写扬州风情的诗篇。"豆蔻年华"一词由此而来，后专指十三四岁的少女。',
      blanks: [1, 5, 9, 13],
    },
    {
      id: 'zengbie-er',
      title: '赠别（其二）',
      author: '杜牧',
      dynasty: '唐',
      lines: ['多情却似总无情，', '唯觉樽前笑不成。', '蜡烛有心还惜别，', '替人垂泪到天明。'],
      notes: [
        { word: '多情', explanation: '感情丰富，这里指内心深处的离别之情。' },
        { word: '樽前', explanation: '酒杯前，指饯别的酒席上。' },
        { word: '蜡烛有心', explanation: '蜡烛的芯，谐音"心"，这里用拟人手法，说蜡烛也有心，懂得惜别。' },
        { word: '垂泪', explanation: '流泪，这里指蜡烛燃烧时滴落的蜡油，比喻眼泪。' },
      ],
      appreciation: '"蜡烛有心还惜别，替人垂泪到天明"是千古名句，以蜡烛的燃烧比喻离别的泪水，含蓄而深情。"多情却似总无情"写出了离别时强作欢颜、内心却悲痛欲绝的矛盾心理。',
      trivia: '李商隐的"春蚕到死丝方尽，蜡炬成灰泪始干"与此诗有异曲同工之妙，均以蜡烛比喻深情。杜牧的这首诗语言精炼，情感真挚，是唐代送别诗中的佳作。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const huaishang: Location = {
  id: 'huaishang',
  name: '淮上',
  modernName: '扬州附近淮水边',
  description: '淮上，淮水边，位于扬州附近。郑谷在此与友人分别，写下情感真挚的送别诗。',
  category: 'jianghan',
  coordinates: [119.5000, 33.0000],
  poems: [
    {
      id: 'huaishang-youren-bie',
      title: '淮上与友人别',
      author: '郑谷',
      dynasty: '唐',
      lines: ['扬子江头杨柳春，', '杨花愁杀渡江人。', '数声风笛离亭晚，', '君向潇湘我向秦。'],
      notes: [
        { word: '扬子江', explanation: '长江在扬州附近的一段，又称扬子江。' },
        { word: '杨花', explanation: '柳絮，杨树和柳树的种子，随风飘飞。' },
        { word: '愁杀', explanation: '使人极度忧愁，愁煞。' },
        { word: '风笛', explanation: '随风传来的笛声。' },
        { word: '离亭', explanation: '送别的亭子，古代在路旁设亭，供行人休息和送别。' },
        { word: '潇湘', explanation: '潇水和湘水，在今湖南境内，泛指南方。' },
        { word: '秦', explanation: '秦地，指关中地区，泛指北方。' },
      ],
      appreciation: '"君向潇湘我向秦"是千古名句，简洁地写出了两人分别后各奔东西的命运。全诗以杨柳、杨花、风笛等意象，营造出浓郁的离别氛围，最后一句言简意赅，余味无穷。',
      trivia: '郑谷是晚唐诗人，以《鹧鸪》诗著名，被称为"郑鹧鸪"。这首《淮上与友人别》是他最著名的送别诗，语言清新，情感真挚。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const runzhou: Location = {
  id: 'runzhou',
  name: '润州',
  modernName: '江苏镇江',
  description: '润州，今江苏镇江，长江南岸，芙蓉楼所在地。王昌龄在此送别友人辛渐北上。',
  category: 'jianghan',
  coordinates: [119.4552, 32.2042],
  poems: [
    {
      id: 'furong-lou-song-xin-jian',
      title: '芙蓉楼送辛渐',
      author: '王昌龄',
      dynasty: '唐',
      lines: ['寒雨连江夜入吴，', '平明送客楚山孤。', '洛阳亲友如相问，', '一片冰心在玉壶。'],
      notes: [
        { word: '芙蓉楼', explanation: '在今江苏镇江，是古代著名的楼台，王昌龄曾在此送别友人。' },
        { word: '吴', explanation: '吴地，指今江苏、浙江一带，润州在古代属吴地。' },
        { word: '平明', explanation: '天刚亮，清晨。' },
        { word: '楚山', explanation: '楚地的山，这里指镇江附近的山。' },
        { word: '冰心', explanation: '像冰一样纯洁的心，比喻高洁的品格。' },
        { word: '玉壶', explanation: '玉制的壶，比喻纯洁无瑕的品格。' },
      ],
      appreciation: '"一片冰心在玉壶"是千古名句，以冰心玉壶比喻自己高洁的品格，表达了对友人的嘱托：请告诉洛阳的亲友，我依然保持着纯洁的心志。全诗情景交融，将离别之情与自我表白融为一体。',
      trivia: '王昌龄因"不护细行"被贬，但他始终保持高洁的品格。"一片冰心在玉壶"成为后世表达高洁品格的经典意象，被广泛引用。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const qiantang: Location = {
  id: 'qiantang',
  name: '钱塘',
  modernName: '浙江杭州',
  description: '钱塘，今浙江杭州，古代著名的繁华城市，西湖所在地。长孙佐辅在此送别故友。',
  category: 'jianghan',
  coordinates: [120.1551, 30.2741],
  poems: [
    {
      id: 'hangzhou-qiuri-bie',
      title: '杭州秋日别故友',
      author: '长孙佐辅',
      dynasty: '唐',
      lines: ['别来杨柳街头树，', '摆弄春风只欲飞。', '还有小园桃李在，', '留花不发待郎归。'],
      notes: [
        { word: '杨柳', explanation: '柳树，古代送别时常折柳相赠，寓意挽留。' },
        { word: '摆弄', explanation: '摇摆，随风摆动。' },
        { word: '留花不发', explanation: '花朵不开放，等待主人归来再开。' },
        { word: '郎', explanation: '对男性友人的亲切称呼。' },
      ],
      appreciation: '此诗写别后对友人的思念。杨柳在春风中摇摆，小园里的桃李花朵不开放，仿佛在等待友人归来。全诗以拟人手法，将花木的等待与对友人的思念融为一体，情感真挚而含蓄。',
      trivia: '长孙佐辅是唐代诗人，生平事迹不详，但留下了一些情感真挚的诗篇。杭州自古以来就是著名的风景名胜之地，"上有天堂，下有苏杭"的说法由来已久。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

const suzhou: Location = {
  id: 'suzhou',
  name: '苏州',
  modernName: '江苏苏州',
  description: '苏州，古称吴，江南水乡名城，园林之都。刘禹锡在此任职，离别时写下深情诗篇。',
  category: 'jianghan',
  coordinates: [120.5853, 31.2989],
  poems: [
    {
      id: 'bie-suzhou',
      title: '别苏州',
      author: '刘禹锡',
      dynasty: '唐',
      lines: ['苏州十万户，', '尽作婴儿啼。', '寒日晴犹薄，', '春风暖不齐。', '桃花浪暖吴娃唱，', '竹枝声啼蛮女悲。', '相送情无限，', '沾襟比散丝。'],
      notes: [
        { word: '婴儿啼', explanation: '婴儿哭泣，这里比喻苏州百姓为刘禹锡离去而哭泣。' },
        { word: '吴娃', explanation: '吴地的女子，这里指苏州的女子。' },
        { word: '竹枝', explanation: '竹枝词，一种民间歌曲形式，刘禹锡曾大力推广。' },
        { word: '蛮女', explanation: '南方少数民族的女子，这里泛指南方女子。' },
        { word: '沾襟', explanation: '泪水沾湿衣襟。' },
        { word: '散丝', explanation: '飘散的丝线，比喻纷纷落下的泪水。' },
      ],
      appreciation: '此诗写刘禹锡离开苏州时，百姓依依不舍的感人场景。苏州十万户人家仿佛都在哭泣，桃花盛开的春日里，吴娃唱歌，蛮女悲啼，相送之情无限，泪水如散丝般落下。全诗情感真挚，展现了刘禹锡深得民心的一面。',
      trivia: '刘禹锡曾在苏州任刺史，政绩卓著，深受百姓爱戴。他在苏州期间，大力推广竹枝词等民间文学形式，对唐代文学的发展做出了重要贡献。',
      blanks: [2, 6, 11, 16],
    },
  ],
};

// ============================================================
// 四、其他
// ============================================================

const suiyang: Location = {
  id: 'suiyang',
  name: '睢阳',
  modernName: '河南商丘',
  description: '睢阳，今河南商丘，古代重要城市。高适在此送别友人董大，写下豪迈的送别诗。',
  category: 'other',
  coordinates: [115.6414, 34.4141],
  poems: [
    {
      id: 'bie-dong-da',
      title: '别董大',
      author: '高适',
      dynasty: '唐',
      lines: ['千里黄云白日曛，', '北风吹雁雪纷纷。', '莫愁前路无知己，', '天下谁人不识君。'],
      notes: [
        { word: '黄云', explanation: '黄色的云，北方冬天沙尘天气时天空呈黄色。' },
        { word: '曛', explanation: '昏暗，日色昏黄。' },
        { word: '知己', explanation: '了解自己、与自己心意相通的朋友。' },
        { word: '识君', explanation: '认识你，了解你的才华。' },
      ],
      appreciation: '"莫愁前路无知己，天下谁人不识君"是千古名句，以豪迈的语气鼓励友人，一扫送别诗的悲凉之气。全诗以北方冬天的苍茫景色为背景，在悲凉中透出豪迈，展现了盛唐诗歌的精神风貌。',
      trivia: '董大是著名琴师董庭兰，以弹奏胡笳著称。高适是唐代著名边塞诗人，与岑参并称"高岑"，他的诗以豪迈奔放、慷慨激昂著称。',
      blanks: [1, 5, 9, 13],
    },
  ],
};

// ============================================================
// 导出所有地点
// ============================================================

export const locations: Location[] = [
  // 京畿送别
  weicheng,
  changan,
  lantian,
  baling,
  changandongmen,
  changlepо,
  huazhou,
  // 边塞送别
  luntai,
  wuwei,
  jiaohe,
  jizhou,
  // 江汉水乡送别
  jingmenshan,
  jiangxia,
  jingzhou,
  longbiao,
  yuezhou,
  jiangzhou,
  xuanzhou,
  jingxian,
  fuli,
  jinling,
  guangling,
  huaishang,
  runzhou,
  qiantang,
  suzhou,
  // 其他
  suiyang,
];
