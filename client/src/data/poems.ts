// 唐代送別詩地圖 - 詩詞數據
// 分類：京畿送別 | 邊塞送別 | 江漢水鄉送別 | 其他

export type Category = 'jingji' | 'biansai' | 'jianghan' | 'other';

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
  blanks: { lineIndex: number; charIndex: number; answer: string }[];
  notes: { word: string; explanation: string }[];
  appreciation: string;
  trivia: string;
}

export interface Location {
  id: string;
  name: string;
  ancientName: string;
  modernName: string;
  coordinates: [number, number]; // [lng, lat]
  category: Category;
  description: string;
  poems: Poem[];
}

// ─────────────────────────────────────────────
// 京畿送別
// ─────────────────────────────────────────────

const changAnPoems: Poem[] = [
  {
    id: 'song-yuan-er',
    title: '送元二使安西',
    author: '王維',
    dynasty: '唐',
    lines: ['渭城朝雨浥輕塵，', '客舍青青柳色新。', '勸君更盡一杯酒，', '西出陽關無故人。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '朝' },
      { lineIndex: 0, charIndex: 4, answer: '浥' },
      { lineIndex: 2, charIndex: 3, answer: '更' },
      { lineIndex: 3, charIndex: 2, answer: '陽' },
      { lineIndex: 3, charIndex: 5, answer: '故' },
    ],
    notes: [
      { word: '渭城', explanation: '秦時咸陽城，漢改渭城，在今陝西咸陽東北，渭水北岸。' },
      { word: '浥', explanation: '（yì）濕潤。' },
      { word: '客舍', explanation: '旅館。' },
      { word: '陽關', explanation: '漢朝設置的邊關名，故址在今甘肅省敦煌市西南，古代前往西域必經之地。' },
    ],
    appreciation: '這首詩以清晨渭城的細雨起筆，雨後空氣清新，柳色青翠，景色宜人，卻是離別之際。前兩句以景烘托情，後兩句直抒胸臆，「勸君更盡一杯酒」，是依依惜別之情的直接表達；「西出陽關無故人」，則道出了此行的艱辛與孤寂。全詩語言樸素，情感真摯，被後人譜曲傳唱，稱為《陽關三疊》，成為千古送別名曲。',
    trivia: '此詩又名《渭城曲》或《陽關曲》，因被譜入樂府，廣為傳唱。「陽關三疊」即指此詩，因演唱時反複疊唱而得名。',
  },
  {
    id: 'shan-zhong-song-bie',
    title: '山中送別',
    author: '王維',
    dynasty: '唐',
    lines: ['山中相送罷，', '日暮掩柴扉。', '春草明年綠，', '王孫歸不歸？'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '送' },
      { lineIndex: 1, charIndex: 1, answer: '暮' },
      { lineIndex: 2, charIndex: 2, answer: '明' },
      { lineIndex: 3, charIndex: 2, answer: '歸' },
    ],
    notes: [
      { word: '柴扉', explanation: '柴門。' },
      { word: '王孫', explanation: '原指貴族子弟，後來也泛指出行之人，此處指送別的友人。' },
    ],
    appreciation: '此詩寫送別友人後獨自歸家的心境。送別已畢，日暮掩門，心中空落。「春草明年綠，王孫歸不歸？」借春草年年重生，反問友人明年能否歸來，以景寄情，含蓄深婉，道出了對友人的深切思念與期盼。',
    trivia: '王維晚年隱居終南山輞川，此詩即作於山中。王維精通詩、書、畫、音樂，蘇軾稱其「詩中有畫，畫中有詩」。',
  },
  {
    id: 'song-du-shaofu',
    title: '送杜少府之任蜀州',
    author: '王勃',
    dynasty: '唐',
    lines: ['城闕輔三秦，', '風煙望五津。', '與君離別意，', '同是宦遊人。', '海內存知己，', '天涯若比鄰。', '無為在歧路，', '兒女共沾巾。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '輔' },
      { lineIndex: 4, charIndex: 2, answer: '存' },
      { lineIndex: 5, charIndex: 2, answer: '若' },
      { lineIndex: 6, charIndex: 2, answer: '在' },
      { lineIndex: 7, charIndex: 2, answer: '共' },
    ],
    notes: [
      { word: '城闕', explanation: '指長安，城指城牆，闕指城門兩側的望樓。' },
      { word: '三秦', explanation: '指關中地區，項羽滅秦後將關中分為三個王國，故稱三秦。' },
      { word: '五津', explanation: '指岷江上的五個渡口，代指蜀地。' },
      { word: '宦遊人', explanation: '在外做官或求仕的人。' },
      { word: '比鄰', explanation: '緊鄰，近鄰。' },
    ],
    appreciation: '這是一首送別詩，卻一反送別詩的悲戚之情，以豪邁之筆抒寫離別。「海內存知己，天涯若比鄰」是千古名句，表達了真正的友情不受地域阻隔，只要心心相通，天涯也如近鄰。全詩格調高昂，氣象宏大，是唐代送別詩中的傑作。',
    trivia: '王勃是「初唐四傑」之首（王勃、楊炯、盧照鄰、駱賓王），此詩寫於他赴蜀地任職之前，時年約十六七歲。',
  },
  {
    id: 'baling-song-bie',
    title: '灞陵行送別',
    author: '李白',
    dynasty: '唐',
    lines: ['送君灞陵亭，', '灞水流浩浩。', '上有無花之古樹，', '下有傷心之春草。', '我向秦人問路歧，', '雲是王粲南登之古道。', '古道連綿走西京，', '紫闕落日浮雲生。', '正當今夕斷腸處，', '驪歌愁絕不忍聽。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '灞' },
      { lineIndex: 3, charIndex: 3, answer: '心' },
      { lineIndex: 8, charIndex: 3, answer: '夕' },
      { lineIndex: 9, charIndex: 1, answer: '歌' },
    ],
    notes: [
      { word: '灞陵', explanation: '地名，在今陝西省西安市東，漢文帝陵墓所在地，灞水流經其旁。' },
      { word: '王粲', explanation: '東漢末年文學家，「建安七子」之一，曾南登灞陵，有感而作《登樓賦》。' },
      { word: '西京', explanation: '指長安，唐代以長安為西京，洛陽為東京。' },
      { word: '紫闕', explanation: '皇宮，紫色是帝王之色，闕指宮門。' },
      { word: '驪歌', explanation: '送別之歌，出自《詩經·小雅·驪駒》。' },
    ],
    appreciation: '此詩以灞陵送別為題，灞橋折柳送別是長安的著名習俗。詩中以古樹、春草、古道、落日等意象渲染離別的悲愁，最後以「驪歌愁絕不忍聽」作結，情感深沉，意境蒼涼。',
    trivia: '灞橋在唐代是長安東郊的重要送別地，「灞橋折柳」成為送別的代名詞，古人折柳相贈，取「柳」與「留」諧音，表達依依不捨之情。',
  },
  {
    id: 'wang-zhihuan-songbie',
    title: '送別',
    author: '王之渙',
    dynasty: '唐',
    lines: ['楊柳東風樹，', '青青夾御河。', '近來攀折苦，', '應為別離多。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '東' },
      { lineIndex: 1, charIndex: 2, answer: '夾' },
      { lineIndex: 2, charIndex: 2, answer: '攀' },
      { lineIndex: 3, charIndex: 2, answer: '為' },
    ],
    notes: [
      { word: '御河', explanation: '皇城附近的河流，此指長安城中的河渠。' },
      { word: '攀折', explanation: '折取柳枝，古人送別時折柳相贈。' },
    ],
    appreciation: '此詩借楊柳寫送別之情。春風中楊柳青青，夾岸生長，卻因送別者頻繁折取而受苦。詩人以擬人手法，賦予楊柳情感，借柳之「苦」道出離別之多、之苦，構思巧妙，情感含蓄。',
    trivia: '王之渙以《登鸛雀樓》「白日依山盡，黃河入海流」和《涼州詞》「黃河遠上白雲間」聞名，此詩是其送別詩的代表作。',
  },
  {
    id: 'changlebo-songren',
    title: '長樂坡送人',
    author: '白居易',
    dynasty: '唐',
    lines: ['青青楊柳陌，', '迢迢征騎征。', '去盡楊花雪，', '猶不見春城。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '楊' },
      { lineIndex: 1, charIndex: 2, answer: '征' },
      { lineIndex: 2, charIndex: 3, answer: '花' },
      { lineIndex: 3, charIndex: 3, answer: '見' },
    ],
    notes: [
      { word: '長樂坡', explanation: '在長安城東，是出城東行的必經之地，也是送別的常見地點。' },
      { word: '陌', explanation: '田間小路，泛指道路。' },
      { word: '迢迢', explanation: '遙遠的樣子。' },
      { word: '楊花雪', explanation: '楊花（柳絮）飄落如雪。' },
    ],
    appreciation: '此詩寫在長樂坡送別友人，楊柳青青的小路上，遠行的馬蹄聲漸漸遠去。楊花如雪飄盡，卻仍望不見春城（長安），表達了送別後的悵惘與思念。詩境清麗，情感真摯。',
    trivia: '白居易在長安為官多年，長樂坡是他送別友人的常去之處。白居易的詩以通俗易懂著稱，相傳他每寫一首詩都要讀給老嫗聽，直到對方能理解為止。',
  },
  {
    id: 'fa-huazhou-liubie',
    title: '發華州留別張侍御',
    author: '劉禹錫',
    dynasty: '唐',
    lines: ['昔者諸侯飢，', '今年天子哀。', '不知何處去，', '白日自西來。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '侯' },
      { lineIndex: 1, charIndex: 3, answer: '子' },
      { lineIndex: 2, charIndex: 3, answer: '處' },
      { lineIndex: 3, charIndex: 2, answer: '日' },
    ],
    notes: [
      { word: '華州', explanation: '今陝西省渭南市華州區，唐代重要的州府。' },
      { word: '張侍御', explanation: '姓張的侍御史，侍御史是監察官員。' },
      { word: '白日自西來', explanation: '太陽從西邊照來，暗示時光流逝，也有漂泊無依之感。' },
    ],
    appreciation: '此詩是劉禹錫離開華州時留別友人之作。詩中以「昔者諸侯飢」與「今年天子哀」對比，感慨時世變遷，末句「白日自西來」以景結情，含蓄地表達了漂泊之感和對友人的依依不捨。',
    trivia: '劉禹錫因參與「永貞革新」被貶，一生仕途坎坷，卻始終保持樂觀豁達的精神，有「詩豪」之稱。他的《陋室銘》「斯是陋室，惟吾德馨」廣為人知。',
  },
];

const changAnLocation: Location = {
  id: 'changan',
  name: '長安',
  ancientName: '長安（含渭城、灞陵、長樂坡）',
  modernName: '陝西省西安市、咸陽市',
  coordinates: [108.9398, 34.3416],
  category: 'jingji',
  description: '長安是唐代的都城，也是天下送別詩最多的地方。渭城（今咸陽）是西出陽關的起點，灞橋折柳是著名的送別習俗，長樂坡是東行必經之地。無數詩人在此揮淚相別，留下了千古傳誦的送別名篇。',
  poems: changAnPoems,
};

const zhongnanShanLocation: Location = {
  id: 'zhongnanshan',
  name: '終南山',
  ancientName: '終南山（山中）',
  modernName: '陝西省西安市南部秦嶺',
  coordinates: [108.8, 33.85],
  category: 'jingji',
  description: '終南山是秦嶺的主峰之一，緊鄰長安，自古是隱士修道之地。王維晚年在此附近的輞川別業隱居，留下了許多描寫山中生活和送別的詩篇。',
  poems: [
    {
      id: 'shan-zhong-song-bie-2',
      title: '山中送別',
      author: '王維',
      dynasty: '唐',
      lines: ['山中相送罷，', '日暮掩柴扉。', '春草明年綠，', '王孫歸不歸？'],
      blanks: [
        { lineIndex: 0, charIndex: 3, answer: '送' },
        { lineIndex: 1, charIndex: 1, answer: '暮' },
        { lineIndex: 2, charIndex: 2, answer: '明' },
        { lineIndex: 3, charIndex: 2, answer: '歸' },
      ],
      notes: [
        { word: '柴扉', explanation: '柴門。' },
        { word: '王孫', explanation: '原指貴族子弟，後來也泛指出行之人，此處指送別的友人。' },
      ],
      appreciation: '此詩寫送別友人後獨自歸家的心境。送別已畢，日暮掩門，心中空落。「春草明年綠，王孫歸不歸？」借春草年年重生，反問友人明年能否歸來，以景寄情，含蓄深婉，道出了對友人的深切思念與期盼。',
      trivia: '王維晚年隱居終南山輞川，此詩即作於山中。王維精通詩、書、畫、音樂，蘇軾稱其「詩中有畫，畫中有詩」。',
    },
  ],
};

// ─────────────────────────────────────────────
// 邊塞送別
// ─────────────────────────────────────────────

const luntaiPoems: Poem[] = [
  {
    id: 'bai-xue-ge',
    title: '白雪歌送武判官歸京',
    author: '岑參',
    dynasty: '唐',
    lines: [
      '北風捲地白草折，',
      '胡天八月即飛雪。',
      '忽如一夜春風來，',
      '千樹萬樹梨花開。',
      '散入珠簾濕羅幕，',
      '狐裘不暖錦衾薄。',
      '將軍角弓不得控，',
      '都護鐵衣冷難著。',
      '瀚海闌干百丈冰，',
      '愁雲慘淡萬里凝。',
      '中軍置酒飲歸客，',
      '胡琴琵琶與羌笛。',
      '紛紛暮雪下轅門，',
      '風掣紅旗凍不翻。',
      '輪台東門送君去，',
      '去時雪滿天山路。',
      '山迴路轉不見君，',
      '雪上空留馬行處。',
    ],
    blanks: [
      { lineIndex: 2, charIndex: 3, answer: '春' },
      { lineIndex: 3, charIndex: 2, answer: '萬' },
      { lineIndex: 8, charIndex: 2, answer: '闌' },
      { lineIndex: 13, charIndex: 2, answer: '紅' },
      { lineIndex: 16, charIndex: 3, answer: '不' },
    ],
    notes: [
      { word: '白草', explanation: '西域的一種牧草，乾枯後呈白色。' },
      { word: '胡天', explanation: '北方少數民族地區的天空，泛指北方邊疆。' },
      { word: '梨花', explanation: '此處以梨花比喻雪花，是千古名喻。' },
      { word: '瀚海', explanation: '沙漠，此指今新疆北部的戈壁沙漠。' },
      { word: '輪台', explanation: '唐代西域重鎮，在今新疆輪台縣。' },
      { word: '風掣紅旗凍不翻', explanation: '大風吹來，紅旗卻因凍結而無法飄揚，極寫邊地嚴寒。' },
    ],
    appreciation: '這是唐代邊塞詩中最著名的送別詩之一。全詩以雪為線索，從「忽如一夜春風來，千樹萬樹梨花開」的奇麗想象，到「山迴路轉不見君，雪上空留馬行處」的深情惜別，情景交融，氣象壯闊。前半寫雪景之奇，後半寫送別之情，以景結情，餘韻悠長。',
    trivia: '岑參兩度出塞，在邊疆生活多年，留下了大量邊塞詩。「忽如一夜春風來，千樹萬樹梨花開」被譽為詠雪最美的詩句之一，以春花喻冬雪，想象奇特，成為千古名句。',
  },
  {
    id: 'song-wu-panguan-chusai',
    title: '送武判官出塞',
    author: '岑參',
    dynasty: '唐',
    lines: ['流水通波接武岡，', '送君不覺有離傷。', '青山一道同雲雨，', '明月何曾是兩鄉。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '波' },
      { lineIndex: 1, charIndex: 4, answer: '有' },
      { lineIndex: 2, charIndex: 3, answer: '同' },
      { lineIndex: 3, charIndex: 3, answer: '曾' },
    ],
    notes: [
      { word: '武岡', explanation: '地名，在今湖南省武岡市。此處泛指友人前往之地。' },
      { word: '離傷', explanation: '離別的傷感。' },
      { word: '明月何曾是兩鄉', explanation: '同一輪明月照耀兩地，何嘗是兩個不同的地方，表達了天涯共此時的情感。' },
    ],
    appreciation: '此詩一反送別詩的悲傷基調，以「青山一道同雲雨，明月何曾是兩鄉」表達了雖然分別，但共享同一片天地的豁達情懷，與王勃「海內存知己，天涯若比鄰」異曲同工。',
    trivia: '岑參與高適並稱「高岑」，是唐代邊塞詩派的代表人物。他的詩以描寫邊塞風光和軍旅生活著稱，氣勢雄渾，想象奇特。',
  },
  {
    id: 'song-cui-zi-huan-jing',
    title: '送崔子還京',
    author: '岑參',
    dynasty: '唐',
    lines: ['匹馬西從天外歸，', '揚鞭只共鳥爭飛。', '送君九月交河北，', '雪裡題詩淚滿衣。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '從' },
      { lineIndex: 1, charIndex: 2, answer: '只' },
      { lineIndex: 2, charIndex: 3, answer: '月' },
      { lineIndex: 3, charIndex: 3, answer: '詩' },
    ],
    notes: [
      { word: '交河', explanation: '地名，在今新疆吐魯番市西，是唐代西域的重要城市。' },
      { word: '九月', explanation: '農曆九月，邊塞已是嚴冬。' },
    ],
    appreciation: '此詩寫在邊塞送別友人返京，九月的交河北，大雪紛飛，詩人在雪中題詩送別，淚濕衣衫。詩境蒼涼，情感真摯，展現了邊塞送別的特殊氛圍。',
    trivia: '交河故城是世界上保存最完好的生土建築城市遺址，現為世界文化遺產。岑參在西域任職期間，多次途經此地。',
  },
];

const wuweiPoems: Poem[] = [
  {
    id: 'pei-zhongshu-song-wu',
    title: '陪裴使君登岳陽樓',
    author: '岑參',
    dynasty: '唐',
    lines: ['戍樓西望煙塵黑，', '漢兵屯在輪台北。', '上將擁旄西出征，', '平明吹笛大軍行。', '四邊伐鼓雪海湧，', '三軍大呼陰山動。', '虜塞兵氣連雲屯，', '戰場白骨纏草根。', '劍河風急雪片闊，', '沙口石凍馬蹄脫。', '亞相勤王甘苦辛，', '誓將報主靜邊塵。', '古來青史誰不見，', '今見功名勝古人。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '望' },
      { lineIndex: 3, charIndex: 2, answer: '吹' },
      { lineIndex: 8, charIndex: 2, answer: '風' },
      { lineIndex: 11, charIndex: 3, answer: '主' },
    ],
    notes: [
      { word: '戍樓', explanation: '邊境上的瞭望樓。' },
      { word: '輪台', explanation: '唐代西域重鎮，在今新疆輪台縣。' },
      { word: '上將', explanation: '高級將領，此指封常清。' },
      { word: '擁旄', explanation: '持旌旗，旄是用氂牛尾裝飾的旗幟，是將帥的標誌。' },
      { word: '亞相', explanation: '副宰相，此指封常清。' },
    ],
    appreciation: '此詩描寫大軍出征的壯觀場面，氣勢磅礴。詩人以宏大的視角描繪了邊塞的戰爭場景，從戍樓西望到大軍出征，從雪海翻湧到白骨纏草，既有壯闊的戰爭畫面，又有對將士犧牲的悲憫，最後以「今見功名勝古人」作結，表達了對將領的讚頌。',
    trivia: '武威是古代「河西四郡」之一，自漢代起就是中原通往西域的重要通道，也是絲綢之路的重要節點。唐代在此設涼州都督府，是西北的軍事重鎮。',
  },
  {
    id: 'liangzhou-ci-wanghan',
    title: '涼州詞',
    author: '王翰',
    dynasty: '唐',
    lines: ['葡萄美酒夜光杯，', '欲飲琵琶馬上催。', '醉臥沙場君莫笑，', '古來征戰幾人回。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '酒' },
      { lineIndex: 1, charIndex: 3, answer: '琶' },
      { lineIndex: 2, charIndex: 2, answer: '沙' },
      { lineIndex: 3, charIndex: 3, answer: '戰' },
    ],
    notes: [
      { word: '夜光杯', explanation: '用白玉製成的酒杯，因能在月光下發光而得名，是西域的名貴器物。' },
      { word: '琵琶', explanation: '樂器，也指演奏琵琶的音樂，此處指出征前的音樂催促。' },
      { word: '沙場', explanation: '戰場。' },
    ],
    appreciation: '此詩以豪放的筆調寫邊塞將士出征前的豪飲。「醉臥沙場君莫笑，古來征戰幾人回」，以豁達的態度面對生死，既有豪邁之氣，又含悲壯之情，是邊塞詩中的名篇。',
    trivia: '涼州（今武威）是唐代著名的葡萄酒產地，「涼州詞」是樂府曲調名，許多詩人都寫過以此為題的詩。王翰的這首是其中最著名的一首。',
  },
  {
    id: 'jiurizhuibie',
    title: '九日送別',
    author: '王之渙',
    dynasty: '唐',
    lines: ['薊庭蕭瑟故人稀，', '何處登高且送歸。', '今日暫同芳菊酒，', '明朝應作斷蓬飛。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '瑟' },
      { lineIndex: 1, charIndex: 3, answer: '高' },
      { lineIndex: 2, charIndex: 3, answer: '芳' },
      { lineIndex: 3, charIndex: 3, answer: '作' },
    ],
    notes: [
      { word: '薊庭', explanation: '薊門，在今北京附近，是北方邊境的重要地名。' },
      { word: '九日', explanation: '農曆九月初九重陽節，古人有登高送別的習俗。' },
      { word: '芳菊酒', explanation: '重陽節飲菊花酒的習俗。' },
      { word: '斷蓬', explanation: '斷根的蓬草，隨風飄轉，比喻漂泊無依。' },
    ],
    appreciation: '此詩寫重陽節送別友人，薊門蕭瑟，故人稀少，今日共飲菊花酒，明朝便如斷蓬飛散。詩中以「斷蓬」比喻漂泊，意象生動，情感真摯，展現了邊地送別的蒼涼氛圍。',
    trivia: '重陽節登高送別是唐代的重要習俗，許多詩人都有重陽送別詩。王之渙以《登鸛雀樓》和《涼州詞》最為著名，此詩是其邊塞送別詩的代表。',
  },
];

const luntaiLocation: Location = {
  id: 'luntai',
  name: '輪台',
  ancientName: '輪台（西域都護府轄地）',
  modernName: '新疆維吾爾自治區輪台縣',
  coordinates: [84.25, 41.78],
  category: 'biansai',
  description: '輪台是唐代西域的重要軍事重鎮，也是絲綢之路的必經之地。岑參曾在此任職，留下了大量描寫邊塞風光和軍旅生活的詩篇，其中《白雪歌送武判官歸京》是唐代邊塞送別詩的巔峰之作。',
  poems: luntaiPoems,
};

const wuweiLocation: Location = {
  id: 'wuwei',
  name: '武威',
  ancientName: '涼州（河西都督府）',
  modernName: '甘肅省武威市',
  coordinates: [102.638, 37.928],
  category: 'biansai',
  description: '武威古稱涼州，是唐代河西走廊的重要城市，也是絲綢之路的咽喉要道。這裡是邊塞詩人的聚集地，王翰的《涼州詞》「葡萄美酒夜光杯」就是在此地寫就的。',
  poems: wuweiPoems,
};

// ─────────────────────────────────────────────
// 江漢水鄉送別
// ─────────────────────────────────────────────

const huanghelouPoems: Poem[] = [
  {
    id: 'huanghelou-song-menghaoran',
    title: '黃鶴樓送孟浩然之廣陵',
    author: '李白',
    dynasty: '唐',
    lines: ['故人西辭黃鶴樓，', '煙花三月下揚州。', '孤帆遠影碧空盡，', '唯見長江天際流。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '辭' },
      { lineIndex: 1, charIndex: 2, answer: '三' },
      { lineIndex: 2, charIndex: 2, answer: '遠' },
      { lineIndex: 3, charIndex: 2, answer: '見' },
    ],
    notes: [
      { word: '故人', explanation: '老朋友，此指孟浩然。' },
      { word: '煙花三月', explanation: '春天煙霧迷蒙、繁花似錦的三月，形容春色之美。' },
      { word: '廣陵', explanation: '即揚州，今江蘇省揚州市。' },
      { word: '碧空盡', explanation: '消失在碧藍的天空中。' },
    ],
    appreciation: '這首詩是李白送別好友孟浩然的名作。「煙花三月下揚州」，以「煙花三月」渲染了春天的美好，也寄托了對友人此行的美好祝願。「孤帆遠影碧空盡，唯見長江天際流」，以孤帆漸遠、長江滾滾的畫面，表達了詩人目送友人遠去的深情，情景交融，意境深遠。',
    trivia: '黃鶴樓是中國著名的歷史名樓，與岳陽樓、滕王閣並稱「江南三大名樓」。李白和孟浩然是唐代著名的詩友，李白曾說「吾愛孟夫子，風流天下聞」。',
  },
];

const jinlingPoems: Poem[] = [
  {
    id: 'jinling-jiusi-liubie',
    title: '金陵酒肆留別',
    author: '李白',
    dynasty: '唐',
    lines: ['風吹柳花滿店香，', '吳姬壓酒喚客嘗。', '金陵子弟來相送，', '欲行不行各盡觴。', '請君試問東流水，', '別意與之誰短長。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '花' },
      { lineIndex: 1, charIndex: 2, answer: '壓' },
      { lineIndex: 3, charIndex: 3, answer: '行' },
      { lineIndex: 4, charIndex: 4, answer: '東' },
      { lineIndex: 5, charIndex: 3, answer: '與' },
    ],
    notes: [
      { word: '金陵', explanation: '今江蘇省南京市，六朝古都。' },
      { word: '吳姬', explanation: '江南的年輕女子，此指酒肆的侍女。' },
      { word: '壓酒', explanation: '壓榨、過濾新釀的酒。' },
      { word: '盡觴', explanation: '喝盡杯中的酒，觴是古代的酒杯。' },
      { word: '東流水', explanation: '向東流去的江水，比喻離別之情綿綿不絕。' },
    ],
    appreciation: '此詩寫在金陵酒肆與友人告別的情景。柳花飄香，美酒飄香，金陵子弟相送，依依不捨。末句「請君試問東流水，別意與之誰短長」，以東流水比喻離別之情，問哪個更長，構思巧妙，情感深摯。',
    trivia: '金陵（今南京）是六朝古都，李白多次遊歷此地，留下了許多詩篇。「金陵酒肆」是當時著名的飲酒之地，李白一生嗜酒，有「詩仙」之稱，也有「酒仙」之名。',
  },
  {
    id: 'zengbie-yi',
    title: '贈別（其一）',
    author: '杜牧',
    dynasty: '唐',
    lines: ['娉娉嫋嫋十三餘，', '豆蔻梢頭二月初。', '春風十里揚州路，', '捲上珠簾總不如。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '嫋' },
      { lineIndex: 1, charIndex: 2, answer: '蔻' },
      { lineIndex: 2, charIndex: 2, answer: '十' },
      { lineIndex: 3, charIndex: 3, answer: '簾' },
    ],
    notes: [
      { word: '娉娉嫋嫋', explanation: '形容女子姿態輕盈柔美。' },
      { word: '豆蔻', explanation: '植物名，花未開時如含苞待放，比喻少女。「豆蔻年華」指十三四歲的少女，即源於此詩。' },
      { word: '揚州路', explanation: '揚州的街道，揚州在唐代是著名的繁華都市。' },
    ],
    appreciation: '此詩是杜牧離開揚州時贈別一位歌女的詩。以「豆蔻梢頭二月初」比喻少女的青春，以「春風十里揚州路，捲上珠簾總不如」讚美她的美麗，語言清麗，情感真摯。「豆蔻年華」這一成語即源於此詩。',
    trivia: '杜牧在揚州任職期間，留下了許多著名詩篇。揚州在唐代是中國最繁華的城市之一，有「揚一益二」之說（揚州第一，成都第二）。',
  },
  {
    id: 'zengbie-er',
    title: '贈別（其二）',
    author: '杜牧',
    dynasty: '唐',
    lines: ['多情卻似總無情，', '唯覺樽前笑不成。', '蠟燭有心還惜別，', '替人垂淚到天明。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '似' },
      { lineIndex: 1, charIndex: 3, answer: '前' },
      { lineIndex: 2, charIndex: 3, answer: '還' },
      { lineIndex: 3, charIndex: 2, answer: '人' },
    ],
    notes: [
      { word: '多情卻似總無情', explanation: '情深反而像是無情，因為太傷心而說不出話來。' },
      { word: '樽前', explanation: '酒杯前，指飲酒送別的場合。' },
      { word: '蠟燭有心', explanation: '蠟燭的芯（心），雙關語，既指蠟芯，又指有情之心。' },
      { word: '垂淚', explanation: '蠟燭燃燒時流下的蠟油，比喻眼淚。' },
    ],
    appreciation: '此詩是杜牧離別揚州時的另一首贈別詩。「多情卻似總無情」，道出了情深時反而說不出話的矛盾心理。「蠟燭有心還惜別，替人垂淚到天明」，以蠟燭的淚比喻離別的淚，構思精巧，情感深沉。',
    trivia: '李商隱有名句「蠟炬成灰淚始乾」，與杜牧此詩的「蠟燭有心還惜別，替人垂淚到天明」都以蠟燭比喻離別之情，是唐詩中的著名意象。',
  },
];

const yangzhouPoems: Poem[] = [
  {
    id: 'wen-wangchangling-zuiqian',
    title: '聞王昌齡左遷龍標遙有此寄',
    author: '李白',
    dynasty: '唐',
    lines: ['楊花落盡子規啼，', '聞道龍標過五溪。', '我寄愁心與明月，', '隨君直到夜郎西。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '盡' },
      { lineIndex: 1, charIndex: 3, answer: '標' },
      { lineIndex: 2, charIndex: 2, answer: '愁' },
      { lineIndex: 3, charIndex: 3, answer: '到' },
    ],
    notes: [
      { word: '楊花', explanation: '柳絮，春末飄落。' },
      { word: '子規', explanation: '杜鵑鳥，其叫聲淒厲，古人認為是思鄉、悲傷的象徵。' },
      { word: '龍標', explanation: '地名，今湖南省懷化市黔陽縣，王昌齡被貶至此。' },
      { word: '五溪', explanation: '指湘西的五條溪流，是偏遠之地的象徵。' },
      { word: '夜郎', explanation: '古國名，在今貴州省，是當時的偏遠蠻荒之地。' },
    ],
    appreciation: '此詩是李白得知好友王昌齡被貶龍標後，遙寄的一首詩。「楊花落盡子規啼」，以楊花飄落、子規哀啼渲染悲涼氣氛。「我寄愁心與明月，隨君直到夜郎西」，將愁心托付給明月，讓它隨友人而去，想象奇特，情感深摯。',
    trivia: '王昌齡以邊塞詩著稱，有「七絕聖手」之稱。他被貶龍標（今湖南黔陽）是因為「不護細行」，即行為不檢點。李白這首詩是遙寄之作，並非在揚州當面送別。',
  },
  {
    id: 'song-meng-haoran-zhi-guangling',
    title: '送孟浩然之廣陵',
    author: '李白',
    dynasty: '唐',
    lines: ['故人西辭黃鶴樓，', '煙花三月下揚州。', '孤帆遠影碧空盡，', '唯見長江天際流。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '辭' },
      { lineIndex: 1, charIndex: 2, answer: '三' },
      { lineIndex: 2, charIndex: 2, answer: '遠' },
      { lineIndex: 3, charIndex: 2, answer: '見' },
    ],
    notes: [
      { word: '故人', explanation: '老朋友，此指孟浩然。' },
      { word: '煙花三月', explanation: '春天煙霧迷蒙、繁花似錦的三月。' },
      { word: '廣陵', explanation: '即揚州。' },
    ],
    appreciation: '此詩寫李白在黃鶴樓送別孟浩然前往揚州，以揚州為目的地。「煙花三月下揚州」，揚州是此行的終點，也是繁華之地的象徵。',
    trivia: '揚州在唐代是中國最繁華的城市之一，「腰纏十萬貫，騎鶴下揚州」是當時人們對揚州繁華的嚮往。',
  },
];

const jingmenPoems: Poem[] = [
  {
    id: 'du-jingmen-songbie',
    title: '渡荊門送別',
    author: '李白',
    dynasty: '唐',
    lines: ['渡遠荊門外，', '來從楚國遊。', '山隨平野盡，', '江入大荒流。', '月下飛天鏡，', '雲生結海樓。', '仍憐故鄉水，', '萬里送行舟。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '荊' },
      { lineIndex: 2, charIndex: 2, answer: '平' },
      { lineIndex: 3, charIndex: 2, answer: '入' },
      { lineIndex: 6, charIndex: 2, answer: '憐' },
      { lineIndex: 7, charIndex: 2, answer: '里' },
    ],
    notes: [
      { word: '荊門', explanation: '荊門山，在今湖北省荊門市，長江南岸，是蜀地進入平原的門戶。' },
      { word: '楚國', explanation: '古楚國地域，即今湖北、湖南一帶。' },
      { word: '大荒', explanation: '廣闊無際的原野。' },
      { word: '天鏡', explanation: '月亮倒映在江水中，如同天上的鏡子。' },
      { word: '海樓', explanation: '海市蜃樓，指雲彩變幻形成的奇景。' },
      { word: '故鄉水', explanation: '從故鄉（四川）流來的江水。' },
    ],
    appreciation: '此詩是李白出蜀時所作，以「送別」為題，實際上是自己離開故鄉的感懷。「山隨平野盡，江入大荒流」，描寫了出三峽後豁然開朗的壯闊景象，氣勢磅礴。末句「仍憐故鄉水，萬里送行舟」，以故鄉的水送自己遠行，情感深摯，是千古名句。',
    trivia: '李白出生於西域（今吉爾吉斯斯坦），幼年隨父遷居四川，此詩是他第一次出蜀時所作，時年約二十五歲。荊門山是長江三峽的出口，過此便進入廣闊的江漢平原。',
  },
];

const suzhou_jiangnanPoems: Poem[] = [
  {
    id: 'song-du-shisi-zhijiangnan',
    title: '送杜十四之江南',
    author: '孟浩然',
    dynasty: '唐',
    lines: ['荊吳相接水為鄉，', '君去春江正渺茫。', '日暮征帆何處泊，', '天涯一望斷人腸。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '接' },
      { lineIndex: 1, charIndex: 3, answer: '江' },
      { lineIndex: 2, charIndex: 2, answer: '征' },
      { lineIndex: 3, charIndex: 3, answer: '望' },
    ],
    notes: [
      { word: '荊吳', explanation: '荊指荊楚（今湖北），吳指吳地（今江蘇），兩地以長江相連。' },
      { word: '渺茫', explanation: '遼闊而模糊，形容春江水面廣闊。' },
      { word: '征帆', explanation: '遠行的船帆。' },
      { word: '斷人腸', explanation: '令人極度悲傷，肝腸寸斷。' },
    ],
    appreciation: '此詩寫送別友人杜十四前往江南。「荊吳相接水為鄉」，以水鄉點明地域特色；「君去春江正渺茫」，以春江的渺茫烘托離別的惆悵；末句「天涯一望斷人腸」，以極度悲傷的情感作結，情景交融，意境深遠。',
    trivia: '孟浩然是唐代著名的山水田園詩人，與王維並稱「王孟」。他一生未入仕，以布衣終老，但詩名極盛，李白有詩讚他「吾愛孟夫子，風流天下聞」。',
  },
  {
    id: 'fu-rong-lou-song-xinjian',
    title: '芙蓉樓送辛漸',
    author: '王昌齡',
    dynasty: '唐',
    lines: ['寒雨連江夜入吳，', '平明送客楚山孤。', '洛陽親友如相問，', '一片冰心在玉壺。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '連' },
      { lineIndex: 1, charIndex: 2, answer: '送' },
      { lineIndex: 2, charIndex: 3, answer: '友' },
      { lineIndex: 3, charIndex: 3, answer: '心' },
    ],
    notes: [
      { word: '芙蓉樓', explanation: '在今江蘇省鎮江市，是王昌齡送別辛漸的地方。' },
      { word: '吳', explanation: '吳地，今江蘇一帶。' },
      { word: '平明', explanation: '天剛亮的時候。' },
      { word: '楚山', explanation: '楚地的山，此指鎮江附近的山。' },
      { word: '冰心在玉壺', explanation: '比喻心地純潔，品格高尚，如冰心置於玉壺之中。' },
    ],
    appreciation: '此詩寫王昌齡在芙蓉樓送別友人辛漸。「寒雨連江夜入吳」，以寒雨渲染離別的悲涼；「一片冰心在玉壺」，則是詩人借送別之機，表明自己雖身處貶謫之地，但心地純潔，品格高尚，不受世俗污染。',
    trivia: '王昌齡以邊塞詩著稱，有「七絕聖手」之稱。「一片冰心在玉壺」是他的名句，表達了他在逆境中保持高潔品格的決心。',
  },
  {
    id: 'song-lingling-wei',
    title: '送靈澈上人',
    author: '劉長卿',
    dynasty: '唐',
    lines: ['蒼蒼竹林寺，', '杳杳鐘聲晚。', '荷笠帶斜陽，', '青山獨歸遠。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '竹' },
      { lineIndex: 1, charIndex: 2, answer: '鐘' },
      { lineIndex: 2, charIndex: 2, answer: '帶' },
      { lineIndex: 3, charIndex: 2, answer: '山' },
    ],
    notes: [
      { word: '靈澈上人', explanation: '唐代著名詩僧，與劉長卿交好。' },
      { word: '蒼蒼', explanation: '深青色，形容竹林茂密。' },
      { word: '杳杳', explanation: '深遠、隱約的樣子。' },
      { word: '荷笠', explanation: '背著斗笠。' },
    ],
    appreciation: '此詩寫送別詩僧靈澈歸竹林寺。全詩以白描手法，描繪了一幅清幽的山林送別圖：蒼翠的竹林，悠遠的鐘聲，斜陽下背著斗笠獨行的身影，意境清遠，禪意深厚。',
    trivia: '劉長卿是唐代著名詩人，以五言詩著稱，自稱「五言長城」。他與靈澈上人交情深厚，留下了多首贈別詩。',
  },
  {
    id: 'nan-pu-bie',
    title: '南浦別',
    author: '白居易',
    dynasty: '唐',
    lines: ['南浦淒淒別，', '西風嫋嫋秋。', '一看腸一斷，', '好去莫回頭。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '淒' },
      { lineIndex: 1, charIndex: 2, answer: '嫋' },
      { lineIndex: 2, charIndex: 2, answer: '腸' },
      { lineIndex: 3, charIndex: 2, answer: '去' },
    ],
    notes: [
      { word: '南浦', explanation: '南面的水邊，古代送別常在水邊，「南浦」成為送別之地的代名詞。' },
      { word: '淒淒', explanation: '形容悲涼的樣子。' },
      { word: '嫋嫋', explanation: '形容風輕輕吹動的樣子。' },
      { word: '好去莫回頭', explanation: '好好地走，不要回頭，表達了送別時的依依不捨和對友人的祝福。' },
    ],
    appreciation: '此詩以極簡的語言寫送別之情。南浦、西風、秋天，三個意象共同營造了淒涼的送別氛圍。「一看腸一斷，好去莫回頭」，每看一眼都令人心碎，卻又叮囑對方不要回頭，情感真摯，令人動容。',
    trivia: '「南浦」在古詩中是送別的經典意象，屈原《九歌》中有「送美人兮南浦」，後世詩人沿用此意象，白居易此詩即是其中的名篇。',
  },
  {
    id: 'zheng-gu-huai-shang-bie',
    title: '淮上與友人別',
    author: '鄭谷',
    dynasty: '唐',
    lines: ['揚子江頭楊柳春，', '楊花愁殺渡江人。', '數聲風笛離亭晚，', '君向瀟湘我向秦。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '楊' },
      { lineIndex: 1, charIndex: 2, answer: '愁' },
      { lineIndex: 2, charIndex: 3, answer: '笛' },
      { lineIndex: 3, charIndex: 4, answer: '湘' },
    ],
    notes: [
      { word: '揚子江', explanation: '長江下游的別稱，此指揚州附近的江段。' },
      { word: '楊花', explanation: '柳絮，春天飄飛，象徵離別。' },
      { word: '愁殺', explanation: '令人極度憂愁。' },
      { word: '離亭', explanation: '送別的亭子，古代在路旁設亭，供送別使用。' },
      { word: '瀟湘', explanation: '瀟水和湘水，在今湖南省，代指南方。' },
      { word: '秦', explanation: '指關中地區，代指北方。' },
    ],
    appreciation: '此詩寫在揚子江邊與友人分別，各奔東西。「君向瀟湘我向秦」，一南一北，方向相反，更顯離別的悲涼。楊柳、楊花、風笛，共同渲染了離別的氛圍，情景交融，是唐代送別詩中的佳作。',
    trivia: '鄭谷是晚唐著名詩人，以《鷓鴣》詩最為著名，被稱為「鄭鷓鴣」。此詩寫於揚州附近的淮河邊，是其送別詩的代表作。',
  },
  {
    id: 'zhang-shuo-song-liang',
    title: '送梁六自洞庭山',
    author: '張說',
    dynasty: '唐',
    lines: ['巴陵一望洞庭秋，', '日見孤峰水上浮。', '聞道神仙不可接，', '心隨湖水共悠悠。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '洞' },
      { lineIndex: 1, charIndex: 3, answer: '峰' },
      { lineIndex: 2, charIndex: 3, answer: '仙' },
      { lineIndex: 3, charIndex: 3, answer: '水' },
    ],
    notes: [
      { word: '巴陵', explanation: '今湖南省岳陽市，洞庭湖畔。' },
      { word: '洞庭', explanation: '洞庭湖，中國第二大淡水湖，在今湖南省北部。' },
      { word: '孤峰', explanation: '指洞庭湖中的君山，又稱洞庭山。' },
      { word: '神仙', explanation: '傳說君山是神仙居住之地。' },
    ],
    appreciation: '此詩寫在洞庭湖邊送別友人梁六。秋天的洞庭湖，孤峰浮水，神仙難接，心隨湖水悠悠。詩境開闊，情感深遠，以洞庭湖的浩渺烘托送別的惆悵。',
    trivia: '張說是唐代著名的政治家和文學家，官至中書令，封燕國公，是「開元之治」的重要推動者。他的詩文在當時頗有影響，被稱為「大手筆」。',
  },
  {
    id: 'changsun-zuofu-bie-zhangyi',
    title: '別張儀',
    author: '長孫佐輔',
    dynasty: '唐',
    lines: ['故人千里隔天涯，', '舉目無親更可嗟。', '共作千年別，', '俱為異鄉客。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '隔' },
      { lineIndex: 1, charIndex: 3, answer: '親' },
      { lineIndex: 2, charIndex: 2, answer: '年' },
      { lineIndex: 3, charIndex: 2, answer: '為' },
    ],
    notes: [
      { word: '天涯', explanation: '天邊，形容距離極遠。' },
      { word: '嗟', explanation: '感嘆，嘆息。' },
      { word: '異鄉客', explanation: '在他鄉漂泊的旅人。' },
    ],
    appreciation: '此詩寫與友人張儀分別，兩人都是漂泊在外的異鄉人，相聚不易，別離更難。詩中以「千里」「天涯」「千年別」誇張地表達了離別的悲傷，情感真摯。',
    trivia: '長孫佐輔是唐代詩人，生平事跡不詳，但留有詩作傳世。此詩是其送別詩的代表作，情感真摯，意境深遠。',
  },
  {
    id: 'liuyuxi-song-chunmu',
    title: '送春暮',
    author: '劉禹錫',
    dynasty: '唐',
    lines: ['春盡雜英歇，', '夏初芳草深。', '薰風自南至，', '吹我池上林。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '英' },
      { lineIndex: 1, charIndex: 2, answer: '芳' },
      { lineIndex: 2, charIndex: 2, answer: '自' },
      { lineIndex: 3, charIndex: 2, answer: '我' },
    ],
    notes: [
      { word: '雜英', explanation: '各種花朵。' },
      { word: '薰風', explanation: '和暖的南風，夏天的風。' },
    ],
    appreciation: '此詩以送春為題，寫春天即將結束、夏天到來的景象。雖是送春，卻無悲傷，以平和的心態接受季節的更替，展現了劉禹錫豁達的人生態度。',
    trivia: '劉禹錫有「詩豪」之稱，以豪邁樂觀著稱。他雖屢遭貶謫，卻始終保持積極的人生態度，「沉舟側畔千帆過，病樹前頭萬木春」是其人生態度的最好寫照。',
  },
];

const huanghelouLocation: Location = {
  id: 'huanghelou',
  name: '黃鶴樓',
  ancientName: '黃鶴樓（鄂州）',
  modernName: '湖北省武漢市武昌區',
  coordinates: [114.3054, 30.5444],
  category: 'jianghan',
  description: '黃鶴樓是中國著名的歷史名樓，與岳陽樓、滕王閣並稱「江南三大名樓」。李白曾在此送別好友孟浩然，留下了「煙花三月下揚州」的千古名句。',
  poems: huanghelouPoems,
};

const jinlingLocation: Location = {
  id: 'jinling',
  name: '金陵',
  ancientName: '金陵（江寧府）',
  modernName: '江蘇省南京市',
  coordinates: [118.7969, 32.0603],
  category: 'jianghan',
  description: '金陵是六朝古都，也是唐代的重要城市。李白多次遊歷此地，留下了《金陵酒肆留別》等名篇；杜牧在揚州任職期間，也在此留下了《贈別》二首。',
  poems: jinlingPoems,
};

const yangzhouLocation: Location = {
  id: 'yangzhou',
  name: '揚州',
  ancientName: '揚州（廣陵）',
  modernName: '江蘇省揚州市',
  coordinates: [119.4127, 32.3942],
  category: 'jianghan',
  description: '揚州在唐代是中國最繁華的城市之一，有「揚一益二」之說。李白曾在此遙寄《聞王昌齡左遷龍標遙有此寄》，孟浩然的《送杜十四之江南》也以揚州為目的地。',
  poems: yangzhouPoems,
};

const jingmenLocation: Location = {
  id: 'jingmen',
  name: '荊門',
  ancientName: '荊門山（荊州）',
  modernName: '湖北省荊門市',
  coordinates: [112.2, 30.98],
  category: 'jianghan',
  description: '荊門山是長江三峽的出口，是蜀地進入江漢平原的門戶。李白出蜀時途經此地，寫下了《渡荊門送別》，以「山隨平野盡，江入大荒流」描繪了出三峽後豁然開朗的壯闊景象。',
  poems: jingmenPoems,
};

const suzhouLocation: Location = {
  id: 'suzhou-jiangnan',
  name: '江南水鄉',
  ancientName: '吳越之地（蘇州、鎮江、揚子江一帶）',
  modernName: '江蘇省蘇州市、鎮江市一帶',
  coordinates: [120.5853, 31.2989],
  category: 'jianghan',
  description: '江南水鄉是唐代文人最嚮往的地方，煙雨迷濛，水網縱橫。孟浩然、王昌齡、劉長卿、白居易、鄭谷等詩人都在此留下了著名的送別詩篇。',
  poems: suzhou_jiangnanPoems,
};

// ─────────────────────────────────────────────
// 其他
// ─────────────────────────────────────────────

const shangqiuPoems: Poem[] = [
  {
    id: 'bie-dong-da',
    title: '別董大',
    author: '高適',
    dynasty: '唐',
    lines: ['千里黃雲白日曛，', '北風吹雁雪紛紛。', '莫愁前路無知己，', '天下誰人不識君。'],
    blanks: [
      { lineIndex: 0, charIndex: 2, answer: '雲' },
      { lineIndex: 1, charIndex: 3, answer: '雁' },
      { lineIndex: 2, charIndex: 3, answer: '路' },
      { lineIndex: 3, charIndex: 3, answer: '人' },
    ],
    notes: [
      { word: '董大', explanation: '董庭蘭，唐代著名琴師，高適的好友，「大」是排行。' },
      { word: '黃雲', explanation: '黃色的雲，北方沙塵天氣時天空呈黃色。' },
      { word: '曛', explanation: '（xūn）昏黃，日落時的昏暗。' },
      { word: '知己', explanation: '了解自己、與自己志同道合的朋友。' },
    ],
    appreciation: '此詩一反送別詩的悲傷基調，以豪邁之筆鼓勵友人。「莫愁前路無知己，天下誰人不識君」，以充滿自信的語氣告訴友人：你的才華天下皆知，不必擔心前路沒有知音。全詩格調高昂，充滿正能量，是唐代送別詩中的名篇。',
    trivia: '高適是唐代著名的邊塞詩人，與岑參並稱「高岑」。董庭蘭是唐代著名的琴師，以彈奏胡笳十八拍著稱。此詩寫於高適落魄之時，卻以豪邁之語勉勵友人，展現了他豁達的人生態度。',
  },
];

const shangqiuLocation: Location = {
  id: 'shangqiu',
  name: '睢陽',
  ancientName: '睢陽（宋州）',
  modernName: '河南省商丘市',
  coordinates: [115.6415, 34.4153],
  category: 'other',
  description: '睢陽是唐代宋州的治所，也是高適送別好友董大的地方。高適在此寫下了《別董大》，以「莫愁前路無知己，天下誰人不識君」鼓勵友人，成為千古名句。',
  poems: shangqiuPoems,
};

const taohualanPoems: Poem[] = [
  {
    id: 'zeng-wang-lun',
    title: '贈汪倫',
    author: '李白',
    dynasty: '唐',
    lines: ['李白乘舟將欲行，', '忽聞岸上踏歌聲。', '桃花潭水深千尺，', '不及汪倫送我情。'],
    blanks: [
      { lineIndex: 0, charIndex: 3, answer: '將' },
      { lineIndex: 1, charIndex: 3, answer: '踏' },
      { lineIndex: 2, charIndex: 3, answer: '深' },
      { lineIndex: 3, charIndex: 2, answer: '及' },
    ],
    notes: [
      { word: '汪倫', explanation: '李白的朋友，安徽涇縣人，曾邀請李白遊覽桃花潭。' },
      { word: '踏歌', explanation: '一種民間歌唱方式，邊踏腳打節拍邊唱歌。' },
      { word: '桃花潭', explanation: '在今安徽省涇縣，水深而清澈。' },
    ],
    appreciation: '此詩是李白離開桃花潭時，感謝汪倫相送而作。「桃花潭水深千尺，不及汪倫送我情」，以潭水之深比喻友情之深，構思巧妙，情感真摯。全詩語言通俗，情感真摯，是李白送別詩中最膾炙人口的一首。',
    trivia: '相傳汪倫以「此地有十里桃花，萬家酒店」為由邀請李白前來，李白到後才發現「十里桃花」是一個叫「十里」的地方有一棵桃花，「萬家酒店」是一家姓萬的人開的酒店，但李白並不生氣，反而與汪倫結為好友。',
  },
];

const taohualanLocation: Location = {
  id: 'taohuatan',
  name: '桃花潭',
  ancientName: '桃花潭（涇縣）',
  modernName: '安徽省宣城市涇縣',
  coordinates: [118.4197, 30.3342],
  category: 'other',
  description: '桃花潭在今安徽省涇縣，是李白遊覽並與汪倫結下深厚友情的地方。李白離別時，汪倫踏歌相送，李白感動之餘寫下了《贈汪倫》，「桃花潭水深千尺，不及汪倫送我情」成為千古名句。',
  poems: taohualanPoems,
};

// ─────────────────────────────────────────────
// 匯總所有地點
// ─────────────────────────────────────────────

export const locations: Location[] = [
  // 京畿送別
  changAnLocation,
  zhongnanShanLocation,
  // 邊塞送別
  luntaiLocation,
  wuweiLocation,
  // 江漢水鄉送別
  huanghelouLocation,
  jinlingLocation,
  yangzhouLocation,
  jingmenLocation,
  suzhouLocation,
  // 其他
  shangqiuLocation,
  taohualanLocation,
];

export const categoryLabels: Record<Category, string> = {
  jingji: '京畿地區',
  biansai: '邊塞地區',
  jianghan: '江漢水鄉',
  other: '其他',
};

export const categoryColors: Record<Category, string> = {
  jingji: '#8B4513',   // 深棕色
  biansai: '#4A6741',  // 墨綠色
  jianghan: '#2c5f7a', // 深藍色
  other: '#6B4C8B',    // 紫色
};
