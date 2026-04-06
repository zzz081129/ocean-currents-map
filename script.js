const countryLabels = document.querySelectorAll("text");

countryLabels.forEach((label) => {
  label.addEventListener("mouseover", () => {
    const code = label.getAttribute("class");
    const elements = document.querySelectorAll(`.${code}`);

    for (const element of elements) {
      if (element.tagName !== "text") {
        element.classList.add("hover");
      }
    }
  });

  label.addEventListener("mouseleave", () => {
    const elements = document.querySelectorAll(`.hover`);

    for (const element of elements) {
      element.classList.remove("hover");
    }
  });
});

const palettes = {
  signature: {
    background: "#87CEEB",
    land: "#FFF8DC",
    secondary: "#FFDEAD",
    text: "#800000",
  },
  grey: {
    background: "#fafafa",
    land: "#d3d3d3",
    secondary: "#939393",
    text: "#191919",
  },
  green: {
    background: "#dda15e",
    land: "#606c38",
    secondary: "#394021",
    text: "#fefae0",
  },
  calm: {
    background: "#9dc7e2",
    land: "#e1e0d0",
    secondary: "#c3c1a1",
    text: "#191919",
  },
  purple: {
    background: "#ffcdb2",
    land: "#b5838d",
    secondary: "#6d6875",
    text: "#023047",
  },
  dark: {
    background: "#2c3e50",
    land: "#f4a261",
    secondary: "#92613a",
    text: "#ffffff",
  },
};

const svgNamespace = "http://www.w3.org/2000/svg";
const svgMap = document.getElementById("svg-map");
const zoomContainer = document.getElementById("zoom-container");
const palettesDiv = document.getElementById("palettes");
const paletteToggleButton = document.getElementById("toggle-palettes");
const layerToggleButtons = document.querySelectorAll("[data-layer-toggle]");
const circulationDiagramButton = document.getElementById(
  "show-circulation-diagram"
);
const labelsSwitch = document.getElementById("show-labels");
const downloadButton = document.getElementById("downloadButton");
const monthSlider = document.getElementById("month-slider");
const monthDisplay = document.getElementById("month-display");
const ensoButtons = document.querySelectorAll("[data-enso-mode]");
const ensoIndicator = document.getElementById("enso-indicator");
const ensoIndicatorText = document.getElementById("enso-indicator-text");
const defaultPalette = Object.keys(palettes)[0];
const svgSize = { width: 2754, height: 1398 };
const cameraBounds = {
  horizontalPadding: 260,
  verticalPadding: 40,
};
let currentMonth = monthSlider ? Number(monthSlider.value) : 1;
let currentEnso = "normal";
const cameraState = {
  x: 0,
  y: 0,
  width: svgSize.width,
  height: svgSize.height,
  minWidth: 560,
  maxWidth: svgSize.width + cameraBounds.horizontalPadding * 2,
  isDragging: false,
  pointerId: null,
  dragStartClientX: 0,
  dragStartClientY: 0,
  dragStartX: 0,
  dragStartY: 0,
  activePointers: new Map(),
  pinchStartDistance: 0,
  pinchStartWidth: svgSize.width,
  pinchStartHeight: svgSize.height,
  pinchWorldFocusX: 0,
  pinchWorldFocusY: 0,
};

const teachingModal = document.getElementById("teaching-modal");
const teachingModalCard = teachingModal
  ? teachingModal.querySelector(".teaching-modal-card")
  : null;
const teachingModalType = document.getElementById("teaching-modal-type");
const teachingModalTitle = document.getElementById("teaching-modal-title");
const teachingModalTags = document.getElementById("teaching-modal-tags");
const teachingModalDescription = document.getElementById(
  "teaching-modal-description"
);
const teachingModalExtra = document.getElementById("teaching-modal-extra");

const teachingState = {
  currents: true,
  currentLabels: true,
  atmosphere: false,
};

const currentPalette = {
  warm: {
    line: "#dc2626",
    glow: "rgba(220, 38, 38, 0.24)",
    labelFill: "rgba(255, 237, 237, 0.92)",
    labelStroke: "rgba(220, 38, 38, 0.28)",
    labelText: "#8f1426",
  },
  cold: {
    line: "#2563eb",
    glow: "rgba(37, 99, 235, 0.22)",
    labelFill: "rgba(239, 246, 255, 0.94)",
    labelStroke: "rgba(37, 99, 235, 0.26)",
    labelText: "#18459d",
  },
};

const hotspotPalette = {
  fill: "#2563eb",
  stroke: "rgba(255, 255, 255, 0.92)",
  text: "#ffffff",
};

const fisheryHotspotPalette = {
  fill: "#059669",
  glow: "rgba(5, 150, 105, 0.22)",
  stroke: "rgba(255, 255, 255, 0.92)",
  text: "#ffffff",
};

const ensoModeDescriptions = {
  normal: "",
  el: "厄尔尼诺：东太平洋异常增暖，赤道逆流增强，南赤道暖流和秘鲁寒流减弱，秘鲁多雨、澳洲偏干。",
  la: "拉尼娜：西太平洋暖水堆积更明显，南赤道暖流和秘鲁寒流增强，赤道逆流减弱，澳洲多雨、秘鲁偏干。",
};

const oceanRegionLabels = [
  {
    name: "太平洋",
    positions: [
      [9, -150],
      [9, 150],
    ],
    fontSize: 52,
    letterSpacing: 4,
  },
  {
    name: "大西洋",
    positions: [[25, -45]],
    fontSize: 48,
    letterSpacing: 4,
  },
  {
    name: "印度洋",
    positions: [[-18, 78]],
    fontSize: 46,
    letterSpacing: 4,
  },
  {
    name: "北冰洋",
    positions: [[77, 0]],
    fontSize: 40,
    letterSpacing: 3,
  },
  {
    name: "地中海",
    positions: [[40, 10]],
    fontSize: 18,
    letterSpacing: 2,
  },
  {
    name: "黑海",
    positions: [[48, 22]],
    fontSize: 18,
    letterSpacing: 2,
  },
  {
    name:"红海",
    positions:[[20,30]],
    fontSize: 10,
    letterSpacing: 1,
  },
  {
      name:"里海",
      positions:[[48,36]],
      fontSize:8,
      letterSpacing:1,
  },
  {
    name:"阿拉伯海",
    positions:[[20,55]],
    fontSize:10,
    letterSpacing:1,
  },
  {
    name:"孟加拉湾",
    positions:[[20,78]],
    fontSize:10,
    letterSpacing:1,
  },
  {
    name:"南海",
    positions:[[22,103]],
    fontSize:10,
    letterSpacing:1,
  },
  {
    name:"加勒比海",
    positions:[[18,-86]],
    fontSize:10,
    letterSpacing:1,
  },
  {
    name:"东海",
    positions:[[35,110]],
    fontSize:5,
    letterSpacing:1,
  },
  {
    name:"日本海",
    positions:[[43,114]],
    fontSize:9,
    letterSpacing:1,
  },
  {
    name:"墨西哥湾",
    positions:[[28,-100]],
    fontSize:10,
    letterSpacing:1,

  },
  {
    name:"波罗的海",
    positions:[[63,7.5]],
    fontSize:5,
    letterSpacing:0.5,
  },
  {
    name:"南冰洋",
    positions:[[-70,0]],
    fontSize:20,
    letterSpacing:2,
  }
];//海洋区域标签数据

const circulationDiagramTeachingItem = {
  name: "三圈环流示意图",
  modalType: "示意图",
  tags: ["气压带风带", "三圈环流"],
  description:
    "tips：三圈环流示意图可配合气压带风带一起观察。",
  modalClass: "is-wide",
  extraHtml: `
    <figure class="teaching-image-figure">
      <img src="img/三圈环流示意图.png" alt="三圈环流示意图" />
     
    </figure>
  `,
};

const oceanCurrents = [
  {
    id: "kuroshio",
    name: "日本暖流（黑潮）",
    labelText: "日本暖流",
    type: "warm",
    tags: ["北太平洋", "暖流", "副热带环流西侧"],
    description:
      "北赤道暖流到达菲律宾以东后转向北流，沿日本南岸北上，是太平洋西部典型的强暖流。",
    labelAt: [30, 136],
    segments: [[[16, 123], [22, 124], [28, 128], [35, 138], [41, 148]]],
  },
  {
    id: "oyashio",
    name: "千岛寒流",
    labelText: "千岛寒流",
    type: "cold",
    tags: ["北太平洋", "寒流", "副极地环流"],
    description:
      "千岛寒流自高纬海区南下，带来低温海水，与日本暖流交汇后形成重要渔场。",
    labelAt: [60, 134],
    segments: [[[81, 148], [75, 142], [68, 136], [63, 130], [54, 126]]],
  },
  {
    id: "north-pacific-drift",
    name: "北太平洋暖流",
    labelText: "北太平洋暖流",
    type: "warm",
    tags: ["北太平洋", "暖流", "盛行西风"],
    description:
      "日本暖流东流后在中纬度海区形成北太平洋暖流，是西风带驱动下的重要暖流。",
    labelAt: [43, -170],
    segments: [
      [[42, 148], [43, 162], [44, 176], [44, 179]],
      [[44, -179], [44, -168], [43, -154], [42, -140]],
    ],
  },
  {
    id: "alaska",
    name: "阿拉斯加暖流",
    labelText: "阿拉斯加暖流",
    type: "warm",
    tags: ["北太平洋", "暖流", "副极地环流"],
    description:
      "北太平洋暖流在北美西岸向北分支，沿阿拉斯加湾流动，增温增湿作用明显。",
    labelAt: [55, -145],
    segments: [[[42, -140], [48, -145], [54, -150], [60, -152]]],
  },
  {
    id: "california",
    name: "加利福尼亚寒流",
    labelText: "加州寒流",
    type: "cold",
    tags: ["北太平洋", "寒流", "沿岸流"],
    description:
      "加利福尼亚寒流沿北美洲西岸南下，常伴随沿岸上升流，对附近气候和渔业影响显著。",
    labelAt: [28, -128],
    segments: [[[42, -138], [36, -132], [30, -126], [24, -121], [18, -117]]],
  },
  {
    id: "north-equatorial-pacific",
    name: "北赤道暖流（太平洋）",
    labelText: "北赤道暖流",
    type: "warm",
    tags: ["太平洋", "暖流", "信风带"],
    description:
      "受东北信风驱动，北赤道暖流自东向西横穿太平洋，是副热带环流的重要组成部分。",
    labelAt: [14, 148],
    labelPositions: [
      [14, 150],
      [14, -140],
    ],
    segments: [
      [[16, -118], [15, -138], [15, -160], [15, -179]],
      [[15, 179], [15, 160], [15, 140], [14, 125]],
    ],
  },
 
  {
    id: "south-equatorial-pacific",
    name: "南赤道暖流（太平洋）",
    labelText: "南赤道暖流",
    type: "warm",
    tags: ["太平洋", "暖流", "信风带"],
    description:
      "南赤道暖流位于赤道以南，受东南信风推动向西流动，是南太平洋副热带环流的组成部分。",
    labelAt: [-8, 152],
    labelPositions: [
      [-8, 150],
      [-8, -140],
    ],
    segments: [
      [[-8, -82], [-9, -114], [-9, -146], [-8, -179]],
      [[-8, 179], [-8, 156], [-8, 138], [-8, 123]],
    ],
  },
  
  {
    id: "equatorial-counter-current",
    name: "赤道逆流（太平洋）",
    labelText: "赤道逆流",
    type: "warm",
    tags: ["太平洋", "暖流", "补偿流"],
    description:
      "赤道逆流位于北赤道暖流和南赤道暖流之间，整体由西向东流动，是赤道海区的重要补偿流。",
    labelAt: [5, -140],
    labelPositions: [
      [5, 160],
      [5, -140],
    ],
    segments: [
      [[5, 142], [6, 160], [6, 178]],
      [[6, -179], [6, -162], [5, -142], [4, -118]],
    ],
  },
  {
    id: "east-australia",
    name: "东澳大利亚暖流",
    labelText: "东澳暖流",
    type: "warm",
    tags: ["南太平洋", "暖流", "副热带环流西侧"],
    description:
      "东澳大利亚暖流沿澳大利亚东岸南下，是南太平洋暖流向西岸汇聚后的强暖流。",
    labelAt: [-28, 158],
    segments: [[[ -12, 154 ], [ -20, 156 ], [ -28, 158 ], [ -36, 160 ]]],
  },
  {
    id: "peru",
    name: "秘鲁寒流",
    labelText: "秘鲁寒流",
    type: "cold",
    tags: ["南太平洋", "寒流", "上升流"],
    description:
      "秘鲁寒流沿南美洲西岸北上，带动沿岸上升流，是形成秘鲁渔场的重要原因之一。",
    labelAt: [-20, -82],
    segments: [[[ -40, -85 ], [ -30, -86 ], [ -20, -85 ], [ -10, -90], [ -4, -94 ]]],
  },
  {
    id: "gulf-stream",
    name: "墨西哥湾暖流",
    labelText: "墨西哥湾暖流",
    type: "warm",
    tags: ["北大西洋", "暖流", "副热带环流西侧"],
    description:
      "墨西哥湾暖流由墨西哥湾和加勒比海暖水汇集形成，沿北美东岸北上，输送大量热量。",
    labelAt: [34, -60],
    segments: [[[20, -84], [26, -78], [32, -70], [40, -58], [47, -46]]],
  },
  {
    id: "labrador",
    name: "拉布拉多寒流",
    labelText: "拉布拉多寒流",
    type: "cold",
    tags: ["北大西洋", "寒流", "副极地环流"],
    description:
      "拉布拉多寒流沿加拿大东北岸南下，在纽芬兰附近与墨西哥湾暖流相遇，渔业资源丰富。",
    labelAt: [50, -53],
    segments: [[[64, -58], [58, -56], [52, -54], [46, -50], [42, -48]]],
  },
  {
    id: "north-atlantic-drift",
    name: "北大西洋暖流",
    labelText: "北大西洋暖流",
    type: "warm",
    tags: ["北大西洋", "暖流", "盛行西风"],
    description:
      "墨西哥湾暖流离开北美沿岸后向东北方向延伸，形成北大西洋暖流，对西欧增温作用明显。",
    labelAt: [53, -18],
    segments: [[[47, -46], [50, -34], [54, -22], [58, -10], [62, 2]]],
  },
  {
    id: "canary",
    name: "加那利寒流",
    labelText: "加那利寒流",
    type: "cold",
    tags: ["北大西洋", "寒流", "沿岸流"],
    description:
      "加那利寒流沿非洲西北岸南下，是北大西洋副热带环流东侧的寒流。",
    labelAt: [25, -24],
    segments: [[[42, -16], [34, -22], [26, -26], [18, -28]]],
  },
  {
    id: "north-equatorial-atlantic",
    name: "北赤道暖流（大西洋）",
    labelText: "北赤道暖流",
    type: "warm",
    tags: ["大西洋", "暖流", "信风带"],
    description:
      "北赤道暖流在东北信风作用下自东向西流动，是北大西洋副热带环流的重要环节。",
    labelAt: [13, -34],
    segments: [[[12, -16], [12, -30], [12, -44], [12, -56]]],
  },
  {
    id: "equatorial-counter-atlantic",
    name: "赤道逆流（大西洋）",
    labelText: "赤道逆流",
    type: "warm",
    tags: ["大西洋", "暖流", "补偿流"],
    description:
      "赤道逆流位于北赤道暖流和南赤道暖流之间，整体由西向东流动，是赤道海区的重要补偿流。",
    labelAt: [5, -34],
    
    segments: [
        [[5, -60], [6, -50], [6, -40], [6, -35], [5, -28], [5, -20]],
    ],

  },
  {
    id: "south-equatorial-atlantic",
    name: "南赤道暖流（大西洋）",
    labelText: "南赤道暖流",
    type: "warm",
    tags: ["大西洋", "暖流", "信风带"],
    description:
      "南赤道暖流受东南信风影响，自非洲西岸附近向南美洲东北岸流动。",
    labelAt: [-8, -18],
    segments: [[[ -10, 10 ], [ -9, -6 ], [ -8, -22 ], [ -8, -38 ]]],
  },
  {
    id: "brazil",
    name: "巴西暖流",
    labelText: "巴西暖流",
    type: "warm",
    tags: ["南大西洋", "暖流", "副热带环流西侧"],
    description:
      "巴西暖流沿南美洲东岸南下，是南赤道暖流抵达巴西沿岸后的南向分支。",
    labelAt: [-24, -40],
    segments: [[[4, -36], [ -8, -38 ], [ -20, -40 ], [ -32, -46 ]]],
  },
  {
    id: "benguela",
    name: "本格拉寒流",
    labelText: "本格拉寒流",
    type: "cold",
    tags: ["南大西洋", "寒流", "沿岸流"],
    description:
      "本格拉寒流沿非洲西南岸北上，与沿岸上升流共同作用，对沿海气候和渔场形成影响明显。",
    labelAt: [-30, 2],
    segments: [[[-43, 10], [-35, 6], [-28, 2], [-20, -1]]],
  },
  {
    id: "agulhas",
    name: "厄加勒斯暖流",
    labelText: "厄加勒斯暖流",
    type: "warm",
    tags: ["印度洋", "暖流", "副热带环流西侧"],
    description:
      "厄加勒斯暖流沿非洲东南岸南下，是南印度洋暖流在大陆西岸加强形成的暖流。" ,
    labelAt: [-32, 38],
    segments: [[[ -10, 32 ], [ -20, 32 ], [ -30, 32 ], [ -40, 28 ]]],
  },
  {
    id: "south-equatorial-indian",
    name: "南赤道暖流（印度洋）",
    labelText: "南赤道暖流",
    type: "warm",
    tags: ["印度洋", "暖流", "信风带"],
    description:
      "南赤道暖流在东南信风驱动下自澳大利亚西侧流向非洲东岸，是南印度洋环流的重要组成部分。",
    labelAt: [-12, 78],
    segments: [[[ -12, 104 ], [ -12, 92 ], [ -12, 78 ], [ -13, 62 ], [ -14, 50 ]]],
  },
  {
    id: "west-australia",
    name: "西澳大利亚寒流",
    labelText: "西澳寒流",
    type: "cold",
    tags: ["印度洋", "寒流", "沿岸流"],
    description:
      "西澳大利亚寒流沿澳大利亚西岸北上，是南印度洋副热带环流东侧的寒流。",
    labelAt: [-27, 100],
    segments: [[[ -38, 100 ], [ -30, 98 ], [ -22, 95 ], [ -15, 90 ]]],
  },
  {
    id: "indian-summer",
    name: "北印度洋夏季环流",
    labelText: "夏季环流",
    type: "warm",
    tags: ["印度洋", "季风洋流", "西南季风"],
    description:
      "夏季受西南季风驱动，北印度洋海区形成顺时针环流，是季风控制海流方向变化的典型案例。",
    labelAt: [12, 72],
    segments: [[[5, 52], [4, 65], [5, 78], [8, 88]]],
    season: "summer",
  },
  {
    id: "sumatra-summer",
    name: "苏门答腊洋流（夏）",
    labelText: "苏门答腊洋流",
    type: "warm",
    tags: ["印度洋", "季风洋流", "夏季"],
    description:
      "夏季受西南季风影响，苏门答腊岛西侧洋流偏向东南方向流动。",
    labelAt: [0, 100],
    segments: [[[5, 95], [0, 98], [-5, 102]]],
    season: "summer",
  },
  {
    id: "somalia-cold",
    name: "索马里寒流",
    labelText: "索马里寒流",
    type: "cold",
    tags: ["印度洋", "季风洋流", "夏季上升流"],
    description:
      "夏季离岸风增强，索马里沿岸出现显著上升流，形成索马里寒流。",
    labelAt: [5, 48],
    segments: [[[-3, 44], [3, 48], [8, 52]]],
    season: "summer",
  },
  {
    id: "indian-winter",
    name: "北印度洋冬季环流",
    labelText: "冬季环流",
    type: "warm",
    tags: ["印度洋", "季风洋流", "东北季风"],
    description:
      "冬季受东北季风驱动，北印度洋海区洋流方向发生逆转，呈逆时针环流。",
    labelAt: [12, 72],
    segments: [[[8, 88], [5, 75], [4, 62], [5, 52]]],
    season: "winter",
  },
  {
    id: "sumatra-winter",
    name: "苏门答腊洋流（冬）",
    labelText: "苏门答腊洋流",
    type: "warm",
    tags: ["印度洋", "季风洋流", "冬季"],
    description:
      "冬季东北季风盛行时，苏门答腊岛西侧洋流转而向西北流动。",
    labelAt: [0, 90],
    segments: [[[-5, 90], [0, 85], [5, 83]]],
    season: "winter",
  },
  {
    id: "equatorial-counter-indian",
    name: "印度洋赤道逆流",
    labelText: "赤道逆流",
    type: "warm",
    tags: ["印度洋", "补偿流", "冬季"],
    description:
      "冬季印度洋赤道附近可形成较明显的赤道逆流，整体流向由西向东。",
    labelAt: [-2, 75],
    segments: [[[-2, 55], [-2, 70], [-2, 85]]],
    season: "winter",
  },
  {
    id: "somalia-warm",
    name: "索马里暖流",
    labelText: "索马里暖流",
    type: "warm",
    tags: ["印度洋", "季风洋流", "冬季"],
    description:
      "冬季东北季风期间，索马里沿岸洋流方向转变，形成索马里暖流。",
    labelAt: [5, 48],
    segments: [[[8, 52], [3, 48], [-3, 44]]],
    season: "winter",
  },
  {
    id: "taiwan-warm-current",
    name: "台湾暖流",
    labelText: "台湾暖流",
    type: "warm",
    tags: ["中国近海", "黑潮分支", "暖流"],
    description:
      "台湾暖流是黑潮的分支之一，经台湾海峡北上，对东海海温和沿岸环境有明显影响。",
    labelAt: [25, 100.9],
    segments: [[[22, 106.9], [25, 106.9], [28, 106.4]]],
    seasonStrength: { summer: "strong", winter: "normal" },
    lineWidthScale: 0.72,
  },
  {
    id: "yellow-sea-warm-current",
    name: "黄海暖流",
    labelText: "黄海暖流",
    type: "warm",
    tags: ["中国近海", "对马暖流分支", "暖流"],
    description:
      "黄海暖流沿黄海槽北上，冬季较强、夏季较弱，是我国近海冬季环流的重要组成部分。",
    labelAt: [40, 105.9],
    segments: [[[37, 108.9], [39.5, 108.4], [42, 106.9]]],
    seasonStrength: { summer: "weak", winter: "strong" },
    lineWidthScale: 0.72,
  },
  {
    id: "tsushima-warm-current",
    name: "对马暖流",
    labelText: "对马暖流",
    type: "warm",
    tags: ["中国近海", "黑潮分支", "暖流"],
    description:
      "对马暖流由东海北上进入日本海，是黑潮向北的重要分支之一。",
    labelAt: [35, 118.9],
    segments: [[[33, 112], [36, 112], [38, 112.9]]],
    lineWidthScale: 0.72,
  },
  {
    id: "china-coastal-current",
    name: "沿岸流",
    labelText: "沿岸流",
    type: "cold",
    tags: ["中国近海", "沿岸流", "冬季风"],
    description:
      "冬季在西北季风和东北季风驱动下，我国东部近海形成明显南下沿岸流；夏季则明显减弱并与外海暖流重新调整。",
    labelAt: [35, 100.9],
    segments: [[[38, 108.9], [35, 108.9], [32, 108.4]]],
    season: "winter",
    lineWidthScale: 0.72,
  },
  {
    id: "west-wind-drift",
    name: "西风漂流",
    labelText: "西风漂流",
    type: "cold",
    tags: ["南半球", "寒流", "西风带"],
    description:
      "西风漂流位于南半球中高纬海区，在盛行西风作用下自西向东环绕南极大陆流动。",
    labelAt: [-50, 72],
    segments: [
      [[-52, 20], [-51, 50], [-50, 84], [-50, 112]],
      [[-50, 132], [-50, 160], [-50, 179]],
      [[-50, -179], [-50, -150], [-50, -120], [-50, -88], [-50, -56]],
    ],
  },
  {
    id: "antarctic-coastal-current",
    name: "南极沿岸流",
    labelText: "南极沿岸流",
    type: "cold",
    tags: ["南极地区", "寒流", "极地东风带"],
    description:
      "在极地东风吹拂下，南极沿岸流沿南极大陆边缘自东向西流动，是南极近岸海区的重要寒流。",
    labelAt: [-67, 90],
    segments: [
      [[-66, -110], [-67, -140], [-68, -179]],
      [[-68, 179], [-67, 140], [-66, 100], [-65, 60], [-65, 20]],
      [[-66, -20], [-68, -60], [-68, -100]],
    ],
  },
];

const pressureBelts = [
  {
    name: "北极高气压带",
    centerLat: 80,
    span: 16,
    fill: "rgba(59, 130, 246, 0.11)",
    stroke: "rgba(59, 130, 246, 0.28)",
    textColor: "#1d4ed8",
  },
  {
    name: "北副极地低气压带",
    centerLat: 60,
    span: 12,
    fill: "rgba(168, 85, 247, 0.11)",
    stroke: "rgba(168, 85, 247, 0.28)",
    textColor: "#7c3aed",
  },
  {
    name: "北副热带高气压带",
    centerLat: 30,
    span: 14,
    fill: "rgba(249, 115, 22, 0.12)",
    stroke: "rgba(249, 115, 22, 0.28)",
    textColor: "#c2410c",
  },
  {
    name: "赤道低气压带",
    centerLat: 0,
    span: 14,
    fill: "rgba(16, 185, 129, 0.13)",
    stroke: "rgba(16, 185, 129, 0.3)",
    textColor: "#047857",
  },
  {
    name: "南副热带高气压带",
    centerLat: -30,
    span: 14,
    fill: "rgba(249, 115, 22, 0.12)",
    stroke: "rgba(249, 115, 22, 0.28)",
    textColor: "#c2410c",
  },
  {
    name: "南副极地低气压带",
    centerLat: -60,
    span: 12,
    fill: "rgba(168, 85, 247, 0.11)",
    stroke: "rgba(168, 85, 247, 0.28)",
    textColor: "#7c3aed",
  },
  {
    name: "南极高气压带",
    centerLat: -80,
    span: 16,
    fill: "rgba(59, 130, 246, 0.11)",
    stroke: "rgba(59, 130, 246, 0.28)",
    textColor: "#1d4ed8",
  },
];

const windBelts = [
  {
    name: "极地东风带",
    lat: 75,
    direction: "↙",
    fill: "rgba(96, 165, 250, 0.15)",
    stroke: "rgba(96, 165, 250, 0.36)",
    textColor: "#1d4ed8",
  },
  {
    name: "盛行西风带",
    lat: 50,
    direction: "↗",
    fill: "rgba(249, 115, 22, 0.14)",
    stroke: "rgba(249, 115, 22, 0.35)",
    textColor: "#c2410c",
  },
  {
    name: "东北信风带",
    lat: 20,
    direction: "↙",
    fill: "rgba(245, 158, 11, 0.16)",
    stroke: "rgba(245, 158, 11, 0.35)",
    textColor: "#b45309",
  },
  {
    name: "赤道无风带",
    lat: 0,
    direction: "○",
    fill: "rgba(74, 222, 128, 0.15)",
    stroke: "rgba(22, 163, 74, 0.35)",
    textColor: "#15803d",
  },
  {
    name: "东南信风带",
    lat: -20,
    direction: "↖",
    fill: "rgba(245, 158, 11, 0.16)",
    stroke: "rgba(245, 158, 11, 0.35)",
    textColor: "#b45309",
  },
  {
    name: "盛行西风带",
    lat: -50,
    direction: "↘",
    fill: "rgba(249, 115, 22, 0.14)",
    stroke: "rgba(249, 115, 22, 0.35)",
    textColor: "#c2410c",
  },
  {
    name: "极地东风带",
    lat: -75,
    direction: "↖",
    fill: "rgba(96, 165, 250, 0.15)",
    stroke: "rgba(96, 165, 250, 0.36)",
    textColor: "#1d4ed8",
  },
];

const teachingHotspots = [
  {
    id: "gibraltar-strait",
    name: "直布罗陀海峡",
    labelText: "直布罗陀海峡",
    modalType: "重点",
    tags: ["重点", "海峡", "密度流"],
    description:
      "直布罗陀海峡是大西洋与地中海之间的狭窄水道，最典型的知识点是由密度差驱动形成的双层交换流。",
    position: [40, -14.5],
    extraHtml: `
      <div class="teaching-diagram">
        <div class="teaching-diagram-title">剖面示意：密度流</div>
        <div class="gibraltar-diagram">
          <div class="gibraltar-water"></div>
          <div class="gibraltar-sea-label atlantic">
            大西洋
            <small>密度较小</small>
          </div>
          <div class="gibraltar-sea-label mediterranean">
            地中海
            <small>密度较大</small>
          </div>
          <div class="gibraltar-arrow surface"></div>
          <div class="gibraltar-arrow deep"></div>
          <div class="gibraltar-bed"></div>
          <div class="gibraltar-bed-label">直布罗陀岩床</div>
        </div>
        <div class="gibraltar-note">
          表层较轻的大西洋海水流入地中海，深层较重的地中海海水流向大西洋，这是典型的密度流。
        </div>
      </div>
    `,
  },
  {
    id: "north-indian-monsoon-hotspot",
    name: "北印度洋季风洋流",
    labelText: "北印度洋季风洋流",
    modalType: "重点",
    tags: ["重点", "季风洋流", "夏顺冬逆"],
    description:
      "北印度洋是世界上海流季节变化最显著的海区之一，洋流方向会随季风转换而发生逆转，是课堂上讲解海气相互作用的经典案例。",
    position: [8, 50],
    extraHtml: () => createNorthIndianMonsoonHotspotHtml(),
  },
  {
    id: "peru-upwelling-hotspot",
    name: "秘鲁上升流",
    labelText: "秘鲁上升流",
    modalType: "重点",
    tags: ["重点", "上升流", "秘鲁寒流"],
    description:
      "秘鲁沿岸是世界地理教学中最典型的上升流海区之一，离岸风与寒流共同作用，使深层冷水上泛并带来丰富营养盐。",
    position: [-20, -90],
    extraHtml: () => createPeruUpwellingHotspotHtml(),
  },
  {
    id: "hokkaido-fishery",
    name: "北海道渔场",
    labelText: "北海道渔场",
    modalType: "渔场",
    markerType: "fishery",
    tags: ["世界四大渔场", "寒暖流交汇", "日本近海"],
    description:
      "北海道渔场位于日本北海道附近海域，是世界著名渔场之一，形成的关键在于寒暖流交汇。",
    position: [49, 125],
    extraHtml: `
      <div class="season-hotspot-panel">
        <h4>成因：寒暖流交汇</h4>
        <p><strong>相关洋流：</strong>千岛寒流、日本暖流。</p>
        <p><strong>形成机制：</strong>寒暖流交汇使海水上下扰动增强，营养盐更易到达表层，浮游生物繁盛，进而吸引大量鱼群聚集。</p>
        <p><strong>要点：</strong>这是“寒暖流交汇形成渔场”的经典案例，适合与纽芬兰渔场对照记忆。</p>
      </div>
    `,
  },
  {
    id: "newfoundland-fishery",
    name: "纽芬兰渔场",
    labelText: "纽芬兰渔场",
    modalType: "渔场",
    markerType: "fishery",
    tags: ["世界四大渔场", "寒暖流交汇", "北大西洋"],
    description:
      "纽芬兰渔场位于加拿大纽芬兰岛附近海域，是北大西洋最典型的寒暖流交汇渔场。",
    position: [47, -48],
    extraHtml: `
      <div class="season-hotspot-panel">
        <h4>成因：寒暖流交汇</h4>
        <p><strong>相关洋流：</strong>拉布拉多寒流、墨西哥湾暖流。</p>
        <p><strong>形成机制：</strong>寒暖流相遇后，海水密度与温度差异明显，促进海水混合和营养盐上涌，浮游生物丰富，鱼类资源集中。</p>
        <p><strong>要点：</strong>可与北海道渔场一起总结为“高纬寒流 + 中低纬暖流 = 世界重要渔场”。</p>
      </div>
    `,
  },
  {
    id: "peru-fishery",
    name: "秘鲁渔场",
    labelText: "秘鲁渔场",
    modalType: "渔场",
    markerType: "fishery",
    tags: ["世界四大渔场", "上升流", "东南太平洋"],
    description:
      "秘鲁渔场位于南美洲西岸秘鲁附近海域，是世界上最典型的上升流渔场。",
    position: [-10, -89],
    extraHtml: `
      <div class="season-hotspot-panel">
        <h4>成因：上升流</h4>
        <p><strong>相关洋流：</strong>秘鲁寒流。</p>
        <p><strong>形成机制：</strong>沿岸离岸风使表层海水远离海岸，深层冷水上涌补充，同时把大量营养盐带到表层，形成高生产力渔场。</p>
        <p><strong>要点：</strong>可与“秘鲁上升流”热点联动讲解，理解渔场形成和厄尔尼诺年份渔业减产之间的联系。</p>
      </div>
    `,
  },
  {
    id: "north-sea-fishery",
    name: "北海渔场",
    labelText: "北海渔场",
    modalType: "渔场",
    markerType: "fishery",
    tags: ["世界四大渔场", "寒暖流交汇", "欧洲近海"],
    description:
      "北海渔场位于欧洲西北部近海，是世界著名渔场之一，形成原因仍以寒暖流交汇为主。",
    position: [60, -6],
    extraHtml: `
      <div class="season-hotspot-panel">
        <h4>成因：寒暖流交汇</h4>
        <p><strong>相关洋流：</strong>东格陵兰寒流、北大西洋暖流。</p>
        <p><strong>形成机制：</strong>寒暖流交汇使海区海水交换旺盛，营养盐丰富，适合浮游生物和鱼群集中分布。</p>
        <p><strong>要点：</strong>可与北海道、纽芬兰对照，归纳“寒暖流交汇”和“上升流”是四大渔场形成的两类核心机制。</p>
      </div>
    `,
  },
];//直布罗陀海峡教学热点数据

if (palettesDiv) {
  for (const palette of Object.keys(palettes)) {
    const colors = Object.values(palettes[palette]);
    const group = document.createElement("div");

    group.setAttribute("class", "palette-colors");
    group.setAttribute("id", palette);
    palettesDiv.appendChild(group);

    colors.forEach((color) => {
      const cube = document.createElement("div");

      cube.style.backgroundColor = color;
      cube.style.height = "30px";
      group.appendChild(cube);
    });
  }
}

const paletteColors = document.querySelectorAll(".palette-colors");

paletteColors.forEach((palette) => {
  palette.addEventListener("click", (event) => {
    setColorPalette(event.currentTarget.id);
  });
});

function setColorPalette(selectedPalette) {
  paletteColors.forEach((palette) => {
    palette.classList.remove("selected");
  });

  const paletteButton = document.getElementById(selectedPalette);

  if (paletteButton) {
    paletteButton.classList.add("selected");
  }

  const styles = `
    text {
      fill: ${palettes[selectedPalette].text};
    }

    #background {
      fill: ${palettes[selectedPalette].background};
    }

    .landxx {
      fill: ${palettes[selectedPalette].land};
      stroke: ${palettes[selectedPalette].secondary};
    }

    g:hover path,
    path:hover,
    path.hover,
    g.hover path {
      fill: ${palettes[selectedPalette].secondary};
    }
  `;

  const paletteStyle = document.getElementById("palette");
  paletteStyle?.remove();

  document.body.style.backgroundColor = palettes[selectedPalette].background;

  if (!svgMap) {
    return;
  }

  const style = document.createElement("style");
  style.setAttribute("id", "palette");
  style.appendChild(document.createTextNode(styles));
  svgMap.prepend(style);
}

function createSvgElement(tagName, attributes = {}, textContent = "") {
  const element = document.createElementNS(svgNamespace, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function isWinterPattern() {
  return currentMonth >= 11 || currentMonth <= 4;
}

function isSummerPattern() {
  return currentMonth >= 5 && currentMonth <= 10;
}

function isCurrentVisible(current) {
  if (current.season === "winter") {
    return isWinterPattern();
  }

  if (current.season === "summer") {
    return isSummerPattern();
  }

  return true;
}

function getSeasonStrength(current) {
  if (!current.seasonStrength) {
    return "normal";
  }

  if (isSummerPattern()) {
    return current.seasonStrength.summer || "normal";
  }

  if (isWinterPattern()) {
    return current.seasonStrength.winter || "normal";
  }

  return "normal";
}

function getEnsoStrength(current) {
  if (currentEnso === "normal") {
    return "normal";
  }

  if (
    current.id === "equatorial-counter-current"
  ) {
    return currentEnso === "el" ? "strong" : "weak";
  }

  if (
    current.id === "south-equatorial-pacific" ||
    current.id === "peru"
  ) {
    return currentEnso === "el" ? "weak" : "strong";
  }

  return "normal";
}

function mergeStrengthState(primaryStrength, secondaryStrength) {
  const strengthScore = {
    weak: -1,
    normal: 0,
    strong: 1,
  };
  const mergedScore = Math.max(
    -1,
    Math.min(
      1,
      (strengthScore[primaryStrength] || 0) +
        (strengthScore[secondaryStrength] || 0)
    )
  );

  if (mergedScore > 0) {
    return "strong";
  }

  if (mergedScore < 0) {
    return "weak";
  }

  return "normal";
}

function createVisualState(
  strength,
  lineWidthScale = 1,
  glowWidthScale = lineWidthScale
) {
  if (strength === "strong") {
    return {
      lineWidth: 3.6 * lineWidthScale,
      glowWidth: 10 * glowWidthScale,
      opacity: 1,
      labelOpacity: 1,
      dashArray: "13 8",
    };
  }

  if (strength === "weak") {
    return {
      lineWidth: 1.9 * lineWidthScale,
      glowWidth: 5 * glowWidthScale,
      opacity: 0.5,
      labelOpacity: 0.72,
      dashArray: "10 8",
    };
  }

  return {
    lineWidth: 2.8 * lineWidthScale,
    glowWidth: 8 * glowWidthScale,
    opacity: 0.95,
    labelOpacity: 1,
    dashArray: "12 8",
  };
}

function getCurrentVisualState(current) {
  const seasonStrength = getSeasonStrength(current);
  const ensoStrength = getEnsoStrength(current);
  const combinedStrength = mergeStrengthState(seasonStrength, ensoStrength);
  const lineWidthScale = current.lineWidthScale || 1;
  const glowWidthScale = current.glowWidthScale || current.lineWidthScale || 1;
  const visualState = createVisualState(
    combinedStrength,
    lineWidthScale,
    glowWidthScale
  );

  if (ensoStrength !== "normal") {
    visualState.labelOpacity = Math.max(visualState.labelOpacity, 0.82);
  }

  return visualState;
}

function getSeasonLabel(month) {
  if (month >= 3 && month <= 5) {
    return "春季";
  }

  if (month >= 6 && month <= 8) {
    return "夏季";
  }

  if (month >= 9 && month <= 11) {
    return "秋季";
  }

  return "冬季";
}

function updateMonthDisplay() {
  if (!monthDisplay) {
    return;
  }

  monthDisplay.textContent = `${currentMonth}月（${getSeasonLabel(currentMonth)}）`;
}

function updateEnsoIndicator() {
  if (!ensoIndicator || !ensoIndicatorText) {
    return;
  }

  const description = ensoModeDescriptions[currentEnso] || "";
  const isNormalYear = currentEnso === "normal";

  ensoIndicator.hidden = isNormalYear;
  ensoIndicator.classList.toggle("is-el", currentEnso === "el");
  ensoIndicator.classList.toggle("is-la", currentEnso === "la");
  ensoIndicatorText.textContent = description;
}

function syncEnsoButtons() {
  ensoButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.ensoMode === currentEnso);
  });
}

function setEnsoMode(mode) {
  currentEnso = mode;
  syncEnsoButtons();
  updateEnsoIndicator();
  renderTeachingOverlay();
}

function createNorthIndianMonsoonHotspotHtml() {
  const isWinter = currentMonth >= 11 || currentMonth <= 2;
  const seasonTitle = isWinter
    ? "冬季：东北季风控制，海流逆时针"
    : "夏季：西南季风控制，海流顺时针";
  const seasonBody = isWinter
    ? `
      <p><strong>时间：</strong>11月到次年2月。</p>
      <p><strong>主导风：</strong>东北季风盛行，索马里海岸附近更容易形成向岸分量。</p>
      <p><strong>洋流表现：</strong>索马里沿岸以暖流为主，整个北印度洋表现为逆时针环流。</p>
      <p><strong>要点：</strong>可与夏季的索马里寒流和上升流对比，突出“方向会反转”的特点。</p>
    `
    : `
      <p><strong>时间：</strong>5月到10月。</p>
      <p><strong>主导风：</strong>西南季风盛行，索马里海岸更容易出现离岸风效应。</p>
      <p><strong>洋流表现：</strong>索马里沿岸形成寒流，整个北印度洋呈顺时针环流。</p>
      <p><strong>要点：</strong>离岸风会诱发上升流，这也是索马里海区具有典型教学意义的原因之一。</p>
    `;

  return `
    <div class="season-hotspot-head">
      <strong>核心知识点</strong>
      <div class="season-hotspot-tags">
        <span>世界典型季风洋流区</span>
        <span>方向随季节改变</span>
        <span>夏顺冬逆</span>
      </div>
    </div>
    <div class="season-hotspot-panel">
      <h4>${seasonTitle}</h4>
      ${seasonBody}
    </div>
  `;
}

function createPeruUpwellingHotspotHtml() {
  return `
    <div class="season-hotspot-head">
      <strong>核心知识点</strong>
      <div class="season-hotspot-tags">
        <span>离岸风</span>
        <span>深层冷水上泛</span>
        <span>营养盐丰富</span>
      </div>
    </div>
    <div class="season-hotspot-panel">
      <h4>秘鲁沿岸上升流机制</h4>
      <p><strong>形成原因：</strong>东南信风推动表层海水远离海岸，近岸表层海水被带走后，深层冷水沿大陆坡上升补充。</p>
      <p><strong>地理意义：</strong>深层冷水把丰富营养盐带到表层，浮游生物繁盛，进而形成著名的秘鲁渔场。</p>
      <p><strong>联系：</strong>可与秘鲁寒流、渔场分布和海气异常联系起来理解，是“风海流 + 上升流”综合教学的典型案例。</p>
      <p><strong>延伸提示：</strong>厄尔尼诺年份若信风减弱，上升流也会减弱，海温升高，渔业生产常受明显影响。</p>
    </div>
  `;
}

function clampCamera() {
  cameraState.height = (cameraState.width * svgSize.height) / svgSize.width;
  const minX = -cameraBounds.horizontalPadding;
  const maxX =
    svgSize.width + cameraBounds.horizontalPadding - cameraState.width;
  const minY = -cameraBounds.verticalPadding;
  const maxY =
    svgSize.height + cameraBounds.verticalPadding - cameraState.height;

  cameraState.x = Math.max(
    minX,
    Math.min(cameraState.x, maxX)
  );
  cameraState.y = Math.max(
    minY,
    Math.min(cameraState.y, maxY)
  );
}

function applyCamera() {
  if (!svgMap) {
    return;
  }

  clampCamera();
  svgMap.setAttribute(
    "viewBox",
    `${cameraState.x} ${cameraState.y} ${cameraState.width} ${cameraState.height}`
  );
}

function zoomCameraAtPoint(clientX, clientY, zoomFactor) {
  if (!zoomContainer) {
    return;
  }

  const rect = zoomContainer.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;

  if (offsetX < 0 || offsetY < 0 || offsetX > rect.width || offsetY > rect.height) {
    return;
  }

  const focusRatioX = offsetX / rect.width;
  const focusRatioY = offsetY / rect.height;
  const focusX = cameraState.x + cameraState.width * focusRatioX;
  const focusY = cameraState.y + cameraState.height * focusRatioY;

  cameraState.width = Math.max(
    cameraState.minWidth,
    Math.min(cameraState.maxWidth, cameraState.width * zoomFactor)
  );
  cameraState.height = (cameraState.width * svgSize.height) / svgSize.width;
  cameraState.x = focusX - cameraState.width * focusRatioX;
  cameraState.y = focusY - cameraState.height * focusRatioY;

  applyCamera();
}

function getCameraFocusRatios(clientX, clientY) {
  if (!zoomContainer) {
    return null;
  }

  const rect = zoomContainer.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return null;
  }

  return {
    rect,
    focusRatioX: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
    focusRatioY: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
  };
}

function getActiveCameraPointers() {
  return Array.from(cameraState.activePointers.values()).sort(
    (left, right) => left.pointerId - right.pointerId
  );
}

function beginCameraDrag(pointer) {
  cameraState.isDragging = true;
  cameraState.pointerId = pointer.pointerId;
  cameraState.dragStartClientX = pointer.clientX;
  cameraState.dragStartClientY = pointer.clientY;
  cameraState.dragStartX = cameraState.x;
  cameraState.dragStartY = cameraState.y;
  cameraState.pinchStartDistance = 0;
  zoomContainer.classList.add("is-dragging");
  document.body.classList.add("is-camera-dragging");
}

function beginCameraPinch() {
  const pointers = getActiveCameraPointers();

  if (pointers.length < 2) {
    return;
  }

  const [firstPointer, secondPointer] = pointers;
  const focus = getCameraFocusRatios(
    (firstPointer.clientX + secondPointer.clientX) / 2,
    (firstPointer.clientY + secondPointer.clientY) / 2
  );

  if (!focus) {
    return;
  }

  cameraState.isDragging = false;
  cameraState.pointerId = null;
  cameraState.pinchStartDistance = Math.max(
    1,
    Math.hypot(
      firstPointer.clientX - secondPointer.clientX,
      firstPointer.clientY - secondPointer.clientY
    )
  );
  cameraState.pinchStartWidth = cameraState.width;
  cameraState.pinchStartHeight = cameraState.height;
  cameraState.pinchWorldFocusX =
    cameraState.x + cameraState.width * focus.focusRatioX;
  cameraState.pinchWorldFocusY =
    cameraState.y + cameraState.height * focus.focusRatioY;
  zoomContainer.classList.add("is-dragging");
  document.body.classList.add("is-camera-dragging");
}

function clearCameraInteraction() {
  cameraState.isDragging = false;
  cameraState.pointerId = null;
  cameraState.pinchStartDistance = 0;
  zoomContainer.classList.remove("is-dragging");
  document.body.classList.remove("is-camera-dragging");
}

function initializeCameraControls() {
  if (!svgMap || !zoomContainer) {
    return;
  }

  applyCamera();

  zoomContainer.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 1.12 : 0.88;
      zoomCameraAtPoint(event.clientX, event.clientY, zoomFactor);
    },
    { passive: false }
  );

  zoomContainer.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest('[data-camera-interactive="true"]')
    ) {
      return;
    }

    const pointer = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };

    cameraState.activePointers.set(event.pointerId, pointer);
    zoomContainer.setPointerCapture(event.pointerId);

    if (cameraState.activePointers.size === 1) {
      beginCameraDrag(pointer);
      return;
    }

    if (cameraState.activePointers.size >= 2) {
      beginCameraPinch();
    }
  });

  zoomContainer.addEventListener("pointermove", (event) => {
    if (!cameraState.activePointers.has(event.pointerId)) {
      return;
    }

    cameraState.activePointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    });

    if (cameraState.activePointers.size >= 2) {
      const pointers = getActiveCameraPointers();
      const [firstPointer, secondPointer] = pointers;
      const focus = getCameraFocusRatios(
        (firstPointer.clientX + secondPointer.clientX) / 2,
        (firstPointer.clientY + secondPointer.clientY) / 2
      );

      if (!focus || !cameraState.pinchStartDistance) {
        return;
      }

      const currentDistance = Math.max(
        1,
        Math.hypot(
          firstPointer.clientX - secondPointer.clientX,
          firstPointer.clientY - secondPointer.clientY
        )
      );
      const zoomFactor = cameraState.pinchStartDistance / currentDistance;

      cameraState.width = Math.max(
        cameraState.minWidth,
        Math.min(cameraState.maxWidth, cameraState.pinchStartWidth * zoomFactor)
      );
      cameraState.height =
        (cameraState.width * svgSize.height) / svgSize.width;
      cameraState.x =
        cameraState.pinchWorldFocusX - cameraState.width * focus.focusRatioX;
      cameraState.y =
        cameraState.pinchWorldFocusY - cameraState.height * focus.focusRatioY;

      applyCamera();
      return;
    }

    if (!cameraState.isDragging || event.pointerId !== cameraState.pointerId) {
      return;
    }

    const rect = zoomContainer.getBoundingClientRect();
    const dx = event.clientX - cameraState.dragStartClientX;
    const dy = event.clientY - cameraState.dragStartClientY;

    cameraState.x =
      cameraState.dragStartX - (dx / rect.width) * cameraState.width;
    cameraState.y =
      cameraState.dragStartY - (dy / rect.height) * cameraState.height;

    applyCamera();
  });

  const stopDragging = (event) => {
    cameraState.activePointers.delete(event.pointerId);

    if (zoomContainer.hasPointerCapture(event.pointerId)) {
      zoomContainer.releasePointerCapture(event.pointerId);
    }

    if (cameraState.activePointers.size >= 2) {
      beginCameraPinch();
      return;
    }

    if (cameraState.activePointers.size === 1) {
      const [remainingPointer] = getActiveCameraPointers();
      beginCameraDrag(remainingPointer);
      return;
    }

    clearCameraInteraction();
  };

  zoomContainer.addEventListener("pointerup", stopDragging);
  zoomContainer.addEventListener("pointercancel", stopDragging);
  zoomContainer.addEventListener("pointerleave", stopDragging);
}

function normalizeLongitude(longitude) {
  let normalized = longitude;

  while (normalized > 180) {
    normalized -= 360;
  }

  while (normalized < -180) {
    normalized += 360;
  }

  return normalized;
}

function projectPoint([latitude, longitude]) {
  const normalizedLongitude = normalizeLongitude(longitude);
  const x = ((normalizedLongitude + 180) / 360) * svgSize.width;
  const y = ((90 - latitude) / 180) * svgSize.height;

  return { x, y };
}

function formatPoints(points) {
  return points
    .map((point) => {
      const { x, y } = projectPoint(point);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function createGeoRectangle(
  north,
  south,
  west,
  east,
  attributes = {}
) {
  const topLeft = projectPoint([north, west]);
  const bottomRight = projectPoint([south, east]);

  return createSvgElement("rect", {
    x: `${Math.min(topLeft.x, bottomRight.x).toFixed(1)}`,
    y: `${Math.min(topLeft.y, bottomRight.y).toFixed(1)}`,
    width: `${Math.abs(bottomRight.x - topLeft.x).toFixed(1)}`,
    height: `${Math.abs(bottomRight.y - topLeft.y).toFixed(1)}`,
    rx: "20",
    ...attributes,
  });
}

function createEnsoAnnotation(
  position,
  text,
  {
    fill = "rgba(15, 23, 42, 0.8)",
    stroke = "rgba(255, 255, 255, 0.3)",
    textColor = "#ffffff",
    fontSize = 12,
    fontWeight = 700,
    paddingX = 16,
    paddingY = 9,
  } = {}
) {
  const { x, y } = projectPoint(position);
  const width = Math.max(100, text.length * (fontSize + 1) + paddingX * 2);
  const height = fontSize + paddingY * 2;
  const group = createSvgElement("g", {
    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
    "pointer-events": "none",
  });
  const background = createSvgElement("rect", {
    x: `${(-width / 2).toFixed(1)}`,
    y: `${(-height / 2).toFixed(1)}`,
    width: `${width.toFixed(1)}`,
    height: `${height.toFixed(1)}`,
    rx: `${(height / 2).toFixed(1)}`,
    fill,
    stroke,
    "stroke-width": "1.2",
  });
  const label = createSvgElement(
    "text",
    {
      x: "0",
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:${fontSize}px;font-weight:${fontWeight};fill:${textColor};`,
    },
    text
  );

  group.appendChild(background);
  group.appendChild(label);
  return group;
}

function renderOceanRegionLabels() {
  if (!svgMap) {
    return;
  }

  let labelGroup = document.getElementById("ocean-region-label-layer");

  if (!labelGroup) {
    labelGroup = createSvgElement("g", {
      id: "ocean-region-label-layer",
    });
  }

  labelGroup.replaceChildren();

  oceanRegionLabels.forEach((region) => {
    region.positions.forEach((position) => {
      const { x, y } = projectPoint(position);
      const text = createSvgElement(
        "text",
        {
          x: x.toFixed(1),
          y: y.toFixed(1),
          "text-anchor": "middle",
          "dominant-baseline": "middle",
          "pointer-events": "none",
          style: `fill:#111111;font-size:${region.fontSize}px;font-weight:800;letter-spacing:${region.letterSpacing}px;opacity:0.88;paint-order:stroke;stroke:rgba(255,255,255,0.72);stroke-width:5px;stroke-linejoin:round;`,
        },
        region.name
      );

      labelGroup.appendChild(text);
    });
  });

  const teachingOverlay = document.getElementById("teaching-overlay");

  if (teachingOverlay) {
    if (labelGroup.parentNode !== svgMap || labelGroup.nextSibling !== teachingOverlay) {
      svgMap.insertBefore(labelGroup, teachingOverlay);
    }
    return;
  }

  if (labelGroup.parentNode !== svgMap) {
    svgMap.appendChild(labelGroup);
  }
}//海洋区域标签渲染

function ensureArrowMarker(defs, id, color) {
  if (document.getElementById(id)) {
    return;
  }

  const marker = createSvgElement("marker", {
    id,
    viewBox: "0 0 10 10",
    refX: "8",
    refY: "5",
    markerWidth: "7",
    markerHeight: "7",
    orient: "auto",
    markerUnits: "strokeWidth",
  });
  const triangle = createSvgElement("path", {
    d: "M 0 0 L 10 5 L 0 10 z",
    fill: color,
    opacity: "0.95",
  });

  marker.appendChild(triangle);
  defs.appendChild(marker);
}

function ensureTeachingOverlay() {
  if (!svgMap) {
    return null;
  }

  let defs = svgMap.querySelector("defs");

  if (!defs) {
    defs = createSvgElement("defs");
    svgMap.insertBefore(defs, svgMap.firstChild);
  }

  ensureArrowMarker(defs, "teaching-arrow-warm", currentPalette.warm.line);
  ensureArrowMarker(defs, "teaching-arrow-cold", currentPalette.cold.line);

  let teachingOverlay = document.getElementById("teaching-overlay");

  if (!teachingOverlay) {
    teachingOverlay = createSvgElement("g", {
      id: "teaching-overlay",
    });
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-atmosphere-pressure-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-atmosphere-wind-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-enso-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-current-glow-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-current-line-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-current-label-layer" })
    );
    teachingOverlay.appendChild(
      createSvgElement("g", { id: "teaching-hotspot-layer" })
    );
    svgMap.appendChild(teachingOverlay);
  }

  return teachingOverlay;
}

function clearGroup(groupId) {
  const group = document.getElementById(groupId);

  if (!group) {
    return null;
  }

  group.replaceChildren();
  return group;
}

function openTeachingModal(item) {
  if (!teachingModal) {
    return;
  }

  const modalType =
    item.modalType || (item.type === "warm" ? "暖流" : "寒流");
  const isWarm = item.type === "warm";
  const isCold = item.type === "cold";

  if (teachingModalCard) {
    teachingModalCard.classList.remove("is-wide");

    if (item.modalClass) {
      teachingModalCard.classList.add(item.modalClass);
    }
  }

  teachingModalType.textContent = modalType;
  teachingModalType.style.background = isWarm
    ? "rgba(220, 38, 38, 0.08)"
    : isCold
      ? "rgba(37, 99, 235, 0.08)"
      : "rgba(180, 83, 9, 0.08)";
  teachingModalType.style.color = isWarm
    ? "#8f1426"
    : isCold
      ? "#18459d"
      : "#92400e";
  teachingModalTitle.textContent = item.name;
  teachingModalDescription.textContent = item.description;
  teachingModalTags.innerHTML = item.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  teachingModalExtra.innerHTML =
    typeof item.extraHtml === "function"
      ? item.extraHtml()
      : item.extraHtml || "";

  teachingModal.classList.add("is-open");
  teachingModal.setAttribute("aria-hidden", "false");
}

function closeTeachingModal() {
  if (!teachingModal) {
    return;
  }

  if (teachingModalCard) {
    teachingModalCard.classList.remove("is-wide");
  }

  teachingModal.classList.remove("is-open");
  teachingModal.setAttribute("aria-hidden", "true");
}

function createCurrentLabel(
  current,
  labelPosition = current.labelAt,
  visualState = getCurrentVisualState(current)
) {
  const colors = currentPalette[current.type];
  const labelText = current.labelText || current.name;
  const { x, y } = projectPoint(labelPosition);
  const width = Math.max(92, labelText.length * 15 + 22);
  const fontSize = labelText.length > 7 ? 12 : 13;

  const labelGroup = createSvgElement("g", {
    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
    style: "cursor:pointer;",
    "data-camera-interactive": "true",
  });
  const background = createSvgElement("rect", {
    x: `${(-width / 2).toFixed(1)}`,
    y: "-13",
    width: `${width.toFixed(1)}`,
    height: "26",
    rx: "13",
    fill: colors.labelFill,
    stroke: colors.labelStroke,
    "stroke-width": "1",
    opacity: String(visualState.labelOpacity),
  });
  const text = createSvgElement(
    "text",
    {
      x: "0",
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:${fontSize}px;font-weight:600;fill:${colors.labelText};pointer-events:none;`,
    },
    labelText
  );

  labelGroup.appendChild(background);
  labelGroup.appendChild(text);
  labelGroup.addEventListener("click", () => openTeachingModal(current));

  return labelGroup;
}

function createHotspotLabel(hotspot) {
  const { x, y } = projectPoint(hotspot.position);
  const isFishery = hotspot.markerType === "fishery";
  const palette = isFishery ? fisheryHotspotPalette : hotspotPalette;
  const markerText = isFishery ? "🐟" : "?";
  const markerFontSize = isFishery ? 12 : 13;
  const group = createSvgElement("g", {
    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
    style: "cursor:pointer;",
    "data-camera-interactive": "true",
  });
  const title = createSvgElement("title", {}, hotspot.name);
  const glow = createSvgElement("circle", {
    cx: "0",
    cy: "0",
    r: "14",
    fill: isFishery ? fisheryHotspotPalette.glow : "rgba(37, 99, 235, 0.2)",
  });
  const circle = createSvgElement("circle", {
    cx: "0",
    cy: "0",
    r: "8",
    fill: palette.fill,
    stroke: palette.stroke,
    "stroke-width": "2",
  });
  const text = createSvgElement(
    "text",
    {
      x: "0",
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:${markerFontSize}px;font-weight:700;fill:${palette.text};pointer-events:none;`,
    },
    markerText
  );

  group.appendChild(title);
  group.appendChild(glow);
  group.appendChild(circle);
  group.appendChild(text);
  group.addEventListener("click", () => openTeachingModal(hotspot));

  return group;
}

function createCurrentLine(
  points,
  current,
  isGlow = false,
  visualState = getCurrentVisualState(current)
) {
  const colors = currentPalette[current.type];
  const attributes = {
    points: formatPoints(points),
    fill: "none",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  };

  if (isGlow) {
    return createSvgElement("polyline", {
      ...attributes,
      stroke: colors.glow,
      "stroke-width": String(visualState.glowWidth),
      opacity: String(Math.min(0.95, visualState.opacity * 0.7)),
    });
  }

  const line = createSvgElement("polyline", {
    ...attributes,
    stroke: colors.line,
    "stroke-width": String(visualState.lineWidth),
    "stroke-dasharray": visualState.dashArray,
    "marker-mid": `url(#teaching-arrow-${current.type})`,
    "marker-end": `url(#teaching-arrow-${current.type})`,
    opacity: String(visualState.opacity),
    style: "cursor:pointer;",
    "data-camera-interactive": "true",
  });

  line.addEventListener("click", () => openTeachingModal(current));
  return line;
}

function createPressureLabel(belt, xPosition) {
  const { y } = projectPoint([belt.centerLat, 0]);
  const width = Math.max(116, belt.name.length * 15 + 24);
  const group = createSvgElement("g", {
    transform: `translate(${xPosition.toFixed(1)} ${y.toFixed(1)})`,
    "pointer-events": "none",
  });
  const rect = createSvgElement("rect", {
    x: `${(-width / 2).toFixed(1)}`,
    y: "-14",
    width: `${width.toFixed(1)}`,
    height: "28",
    rx: "14",
    fill: "rgba(255, 255, 255, 0.74)",
    stroke: belt.stroke,
    "stroke-width": "1",
  });
  const text = createSvgElement(
    "text",
    {
      x: "0",
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:13px;font-weight:600;fill:${belt.textColor};`,
    },
    belt.name
  );

  group.appendChild(rect);
  group.appendChild(text);
  return group;
}

function createWindLabel(belt, longitude) {
  const { x, y } = projectPoint([belt.lat, longitude]);
  const width = Math.max(126, belt.name.length * 15 + 32);
  const group = createSvgElement("g", {
    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
    "pointer-events": "none",
  });
  const rect = createSvgElement("rect", {
    x: `${(-width / 2).toFixed(1)}`,
    y: "-14",
    width: `${width.toFixed(1)}`,
    height: "28",
    rx: "14",
    fill: "rgba(255, 255, 255, 0.72)",
    stroke: belt.stroke,
    "stroke-width": "1",
  });
  const arrow = createSvgElement(
    "text",
    {
      x: `${(-width / 2 + 18).toFixed(1)}`,
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:14px;font-weight:700;fill:${belt.textColor};`,
    },
    belt.direction
  );
  const label = createSvgElement(
    "text",
    {
      x: "10",
      y: "1",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      style: `font-size:12.5px;font-weight:600;fill:${belt.textColor};`,
    },
    belt.name
  );

  group.appendChild(rect);
  group.appendChild(arrow);
  group.appendChild(label);
  return group;
}

function renderEnsoTeachingLayer() {
  const ensoGroup = clearGroup("teaching-enso-layer");

  if (!ensoGroup || currentEnso === "normal") {
    return;
  }

  if (currentEnso === "el") {
    ensoGroup.appendChild(
      createGeoRectangle(-15, 8, -100, -80, {
        fill: "rgba(239, 68, 68, 0.24)",
        stroke: "#ef4444",
        "stroke-width": "2",
        "stroke-dasharray": "10 8",
        "pointer-events": "none",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-3, -90], "异常暖水区", {
        fill: "rgba(239, 68, 68, 0.9)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-8, -75], "秘鲁多雨", {
        fill: "rgba(37, 99, 235, 0.88)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-22, 150], "澳洲干旱", {
        fill: "rgba(217, 119, 6, 0.88)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([12, -160], "沃克环流减弱", {
        fill: "rgba(100, 116, 139, 0.84)",
        fontSize: 11,
      })
    );
  }

  if (currentEnso === "la") {
    ensoGroup.appendChild(
      createGeoRectangle(-12, 12, 130, 170, {
        fill: "rgba(239, 68, 68, 0.24)",
        stroke: "#ef4444",
        "stroke-width": "2",
        "stroke-dasharray": "10 8",
        "pointer-events": "none",
      })
    );
    ensoGroup.appendChild(
      createGeoRectangle(-12, 5, -110, -80, {
        fill: "rgba(59, 130, 246, 0.2)",
        stroke: "#3b82f6",
        "stroke-width": "2",
        "stroke-dasharray": "10 8",
        "pointer-events": "none",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([0, 150], "暖水堆积", {
        fill: "rgba(239, 68, 68, 0.9)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-3, -95], "冷水上涌增强", {
        fill: "rgba(37, 99, 235, 0.9)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-22, 150], "澳洲多雨", {
        fill: "rgba(37, 99, 235, 0.88)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([-8, -75], "秘鲁偏干", {
        fill: "rgba(217, 119, 6, 0.88)",
      })
    );
    ensoGroup.appendChild(
      createEnsoAnnotation([12, -160], "沃克环流增强", {
        fill: "rgba(22, 163, 74, 0.84)",
        fontSize: 11,
      })
    );
  }
}

function renderCurrentTeachingLayer() {
  const glowGroup = clearGroup("teaching-current-glow-layer");
  const lineGroup = clearGroup("teaching-current-line-layer");
  const labelGroup = clearGroup("teaching-current-label-layer");

  if (!glowGroup || !lineGroup || !labelGroup) {
    return;
  }

  oceanCurrents.forEach((current) => {
    if (!isCurrentVisible(current)) {
      return;
    }

    const visualState = getCurrentVisualState(current);

    if (teachingState.currents) {
      current.segments.forEach((segment) => {
        glowGroup.appendChild(
          createCurrentLine(segment, current, true, visualState)
        );
        lineGroup.appendChild(
          createCurrentLine(segment, current, false, visualState)
        );
      });
    }

    if (teachingState.currentLabels) {
      const labelPositions = current.labelPositions || [current.labelAt];

      labelPositions.forEach((labelPosition) => {
        labelGroup.appendChild(
          createCurrentLabel(current, labelPosition, visualState)
        );
      });
    }
  });
}

function renderTeachingHotspots() {
  const hotspotGroup = clearGroup("teaching-hotspot-layer");

  if (!hotspotGroup) {
    return;
  }

  teachingHotspots.forEach((hotspot) => {
    hotspotGroup.appendChild(createHotspotLabel(hotspot));
  });
}

function renderAtmosphereTeachingLayer() {
  const pressureGroup = clearGroup("teaching-atmosphere-pressure-layer");
  const windGroup = clearGroup("teaching-atmosphere-wind-layer");

  if (!pressureGroup || !windGroup) {
    return;
  }

  if (!teachingState.atmosphere) {
    return;
  }

  const repeatedPositions = [svgSize.width * 0.18, svgSize.width * 0.5, svgSize.width * 0.82];

  pressureBelts.forEach((belt) => {
    const top = projectPoint([belt.centerLat + belt.span / 2, -180]).y;
    const bottom = projectPoint([belt.centerLat - belt.span / 2, -180]).y;
    const band = createSvgElement("rect", {
      x: "0",
      y: `${Math.min(top, bottom).toFixed(1)}`,
      width: `${svgSize.width}`,
      height: `${Math.abs(bottom - top).toFixed(1)}`,
      fill: belt.fill,
      stroke: belt.stroke,
      "stroke-width": "1",
      "stroke-dasharray": "10 10",
      "pointer-events": "none",
    });

    pressureGroup.appendChild(band);
    repeatedPositions.forEach((position) => {
      pressureGroup.appendChild(createPressureLabel(belt, position));
    });
  });

  windBelts.forEach((belt) => {
    const { y } = projectPoint([belt.lat, 0]);
    const guide = createSvgElement("line", {
      x1: "0",
      y1: `${y.toFixed(1)}`,
      x2: `${svgSize.width}`,
      y2: `${y.toFixed(1)}`,
      stroke: belt.stroke,
      "stroke-width": "1.2",
      "stroke-dasharray": "12 10",
      opacity: "0.8",
      "pointer-events": "none",
    });

    windGroup.appendChild(guide);
    [-138, -18, 102].forEach((longitude) => {
      windGroup.appendChild(createWindLabel(belt, longitude));
    });
  });
}

function renderTeachingOverlay() {
  if (!ensureTeachingOverlay()) {
    return;
  }

  renderAtmosphereTeachingLayer();
  renderEnsoTeachingLayer();
  renderCurrentTeachingLayer();
  renderTeachingHotspots();
}

function syncLayerToggleButtons() {
  layerToggleButtons.forEach((button) => {
    const layerName = button.dataset.layerToggle;
    button.classList.toggle("is-active", teachingState[layerName]);
  });
}

function syncCirculationDiagramButton() {
  if (!circulationDiagramButton) {
    return;
  }

  circulationDiagramButton.hidden = !teachingState.atmosphere;
}

function initializeTeachingFeatures() {
  renderOceanRegionLabels();// 先渲染一次，确保标签层存在
  syncLayerToggleButtons();
  syncCirculationDiagramButton();
  syncEnsoButtons();
  updateEnsoIndicator();
  renderTeachingOverlay();

  layerToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const layerName = button.dataset.layerToggle;
      teachingState[layerName] = !teachingState[layerName];
      syncLayerToggleButtons();
      syncCirculationDiagramButton();
      renderTeachingOverlay();
    });
  });

  ensoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setEnsoMode(button.dataset.ensoMode || "normal");
    });
  });

  document.querySelectorAll("[data-close-teaching-modal]").forEach((button) => {
    button.addEventListener("click", closeTeachingModal);
  });

  if (circulationDiagramButton) {
    circulationDiagramButton.addEventListener("click", () => {
      openTeachingModal(circulationDiagramTeachingItem);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTeachingModal();
    }
  });
}

if (defaultPalette) {
  setColorPalette(defaultPalette);
}

if (paletteToggleButton && palettesDiv) {
  paletteToggleButton.addEventListener("click", () => {
    const isOpen = palettesDiv.classList.toggle("is-open");

    paletteToggleButton.setAttribute("aria-expanded", String(isOpen));
    palettesDiv.setAttribute("aria-hidden", String(!isOpen));
    paletteToggleButton.textContent = isOpen ? "隐藏配色栏" : "更改地图配色";
  });
}

if (labelsSwitch) {
  labelsSwitch.addEventListener("change", (event) => {
    const labels = document.getElementById("labels");

    if (labels) {
      labels.style.display = event.target.checked ? "block" : "none";
    }
  });
}

if (downloadButton) {
  downloadButton.addEventListener("click", () => {
    const svgContent = new XMLSerializer().serializeToString(svgMap);
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "SVG World Map with labels.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

if (monthSlider) {
  monthSlider.addEventListener("input", (event) => {
    currentMonth = Number(event.target.value);
    updateMonthDisplay();
    renderTeachingOverlay();
  });
}

updateMonthDisplay();
initializeTeachingFeatures();
initializeCameraControls();

// Language Switcher Module
(() => {
  let currentLanguage = "zh";
  let activeTeachingItem = null;

  const languageUi = {
    zh: {
      showLanguage: "中文",
      layerTitle: "图层",
      currents: "洋流系统",
      currentLabels: "洋流名称",
      atmosphere: "气压带风带",
      panelNote: "点击洋流线或洋流名称可查看知识说明。",
      legendTitle: "图例",
      warmCurrent: "暖流",
      coldCurrent: "寒流",
      pressureZone: "气压带",
      windZone: "风带标签",
      timeTitle: "时间调整",
      ensoTitle: "ENSO 模式",
      normalYear: "正常年份",
      elNino: "厄尔尼诺",
      laNina: "拉尼娜",
      paletteOpen: "隐藏配色",
      paletteClosed: "更改地图配色",
      circulationButton: "显示三圈环流示意图",
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    en: {
      showLanguage: "English",
      layerTitle: "Layers",
      currents: "Ocean Currents",
      currentLabels: "Current Labels",
      atmosphere: "Pressure & Wind Belts",
      panelNote: "Click a current line or label to open the teaching card.",
      legendTitle: "Legend",
      warmCurrent: "Warm Current",
      coldCurrent: "Cold Current",
      pressureZone: "Pressure Belt",
      windZone: "Wind Belt Label",
      timeTitle: "Time",
      ensoTitle: "ENSO Mode",
      normalYear: "Normal",
      elNino: "El Nino",
      laNina: "La Nina",
      paletteOpen: "Hide Palettes",
      paletteClosed: "Change Map Palette",
      circulationButton: "Show Three-Cell Circulation Diagram",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    de: {
      showLanguage: "Deutsch",
      layerTitle: "Ebenen",
      currents: "Meeresstroeme",
      currentLabels: "Stromnamen",
      atmosphere: "Druck- und Windguertel",
      panelNote: "Klicken Sie auf eine Stroemungslinie oder ein Label, um die Lernkarte zu oeffnen.",
      legendTitle: "Legende",
      warmCurrent: "Warmstrom",
      coldCurrent: "Kaltstrom",
      pressureZone: "Druckguertel",
      windZone: "Windguertel-Label",
      timeTitle: "Zeit",
      ensoTitle: "ENSO-Modus",
      normalYear: "Normaljahr",
      elNino: "El Nino",
      laNina: "La Nina",
      paletteOpen: "Paletten ausblenden",
      paletteClosed: "Kartenpalette aendern",
      circulationButton: "Drei-Zellen-Zirkulation anzeigen",
      months: ["Jan", "Feb", "Maerz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    },
  };

  const seasonTranslations = {
    zh: { spring: "春季", summer: "夏季", autumn: "秋季", winter: "冬季" },
    en: { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" },
    de: { spring: "Fruehling", summer: "Sommer", autumn: "Herbst", winter: "Winter" },
  };

  const ensoDescriptionsLocalized = {
    zh: ensoModeDescriptions,
    en: {
      normal: "",
      el: "El Nino: abnormal warming in the eastern Pacific | Equatorial Countercurrent stronger | South Equatorial Current and Peru Current weaker | wetter Peru, drier Australia.",
      la: "La Nina: warm water piled up in the western Pacific | South Equatorial Current and Peru Current stronger | Equatorial Countercurrent weaker | wetter Australia, drier Peru.",
    },
    de: {
      normal: "",
      el: "El Nino: unnormale Erwaermung im oestlichen Pazifik | staerkerer aequatorialer Gegenstrom | schwaecherer Suedaequatorialstrom und Perustrom | feuchteres Peru, trockeneres Australien.",
      la: "La Nina: staerkere Warmwasseransammlung im westlichen Pazifik | staerkerer Suedaequatorialstrom und Perustrom | schwaecherer aequatorialer Gegenstrom | feuchteres Australien, trockeneres Peru.",
    },
  };

  const termTranslations = {
    en: {
      "太平洋": "Pacific Ocean",
      "大西洋": "Atlantic Ocean",
      "印度洋": "Indian Ocean",
      "北冰洋": "Arctic Ocean",
      "地中海": "Mediterranean Sea",
      "黑海": "Black Sea",
      "渔场": "Fishery",
      "示意图": "Diagram",
      "红海": "Red Sea",
      "里海": "Caspian Sea",
      "阿拉伯海": "Arabian Sea",
      "孟加拉湾": "Bay of Bengal",
      "南海": "South China Sea",
      "加勒比海": "Caribbean Sea",
      "东海": "East China Sea",
      "日本海": "Sea of Japan",
      "墨西哥湾": "Gulf of Mexico",
      "波罗的海": "Baltic Sea",
      "南冰洋": "Southern Ocean",
      "暖流": "Warm Current",
      "寒流": "Cold Current",
      "补偿流": "Compensation Current",
      "沿岸流": "Coastal Current",
      "上升流": "Upwelling",
      "密度流": "Density Current",
      "季风洋流": "Monsoon Current",
      "夏季": "Summer",
      "冬季": "Winter",
      "西南季风": "Southwest Monsoon",
      "东北季风": "Northeast Monsoon",
      "世界四大渔场": "Four Great Fisheries of the World",
      "寒暖流交汇": "Convergence of warm and cold currents",
      "日本近海": "Waters near Japan",
      "东南太平洋": "Southeast Pacific",
      "欧洲近海": "European shelf seas",
      "重点": "Key Point",
      "海峡": "Strait",
      "三圈环流": "Three-Cell Circulation",
      "气压带风带": "Pressure and Wind Belts",
      "北太平洋": "North Pacific",
      "南太平洋": "South Pacific",
      "北大西洋": "North Atlantic",
      "南大西洋": "South Atlantic",
      "中国近海": "China offshore waters",
      "南半球": "Southern Hemisphere",
      "南极地区": "Antarctic region",
      "信风带": "Trade winds",
      "盛行西风": "Westerlies",
      "副热带环流西侧": "western side of the subtropical gyre",
      "副极地环流": "subpolar gyre",
      "冬季风": "winter monsoon",
      "黑潮分支": "Kuroshio branch",
      "对马暖流分支": "Tsushima branch",
      "极地东风带": "Polar easterlies",
      "北极高气压带": "Arctic High",
      "北副极地低气压带": "North Subpolar Low",
      "北副热带高气压带": "North Subtropical High",
      "赤道低气压带": "Equatorial Low",
      "南副热带高气压带": "South Subtropical High",
      "南副极地低气压带": "South Subpolar Low",
      "南极高气压带": "Antarctic High",
      "盛行西风带": "Westerlies",
      "东北信风带": "Northeast Trades",
      "赤道无风带": "Equatorial Calm Belt",
      "东南信风带": "Southeast Trades",
      "日本暖流（黑潮）": "Japan Current (Kuroshio)",
      "日本暖流": "Japan Current",
      "千岛寒流": "Oyashio Current",
      "北太平洋暖流": "North Pacific Drift",
      "阿拉斯加暖流": "Alaska Current",
      "加利福尼亚寒流": "California Current",
      "加州寒流": "California Current",
      "北赤道暖流（太平洋）": "North Equatorial Current (Pacific)",
      "北赤道暖流": "North Equatorial Current",
      "南赤道暖流（太平洋）": "South Equatorial Current (Pacific)",
      "南赤道暖流": "South Equatorial Current",
      "赤道逆流（太平洋）": "Equatorial Countercurrent (Pacific)",
      "赤道逆流": "Equatorial Countercurrent",
      "东澳大利亚暖流": "East Australian Current",
      "东澳暖流": "East Australian Current",
      "秘鲁寒流": "Peru Current",
      "墨西哥湾暖流": "Gulf Stream",
      "拉布拉多寒流": "Labrador Current",
      "北大西洋暖流": "North Atlantic Drift",
      "加那利寒流": "Canary Current",
      "北赤道暖流（大西洋）": "North Equatorial Current (Atlantic)",
      "赤道逆流（大西洋）": "Equatorial Countercurrent (Atlantic)",
      "南赤道暖流（大西洋）": "South Equatorial Current (Atlantic)",
      "巴西暖流": "Brazil Current",
      "本格拉寒流": "Benguela Current",
      "厄加勒斯暖流": "Agulhas Current",
      "南赤道暖流（印度洋）": "South Equatorial Current (Indian Ocean)",
      "西澳大利亚寒流": "West Australian Current",
      "西澳寒流": "West Australian Current",
      "北印度洋夏季环流": "North Indian Ocean Summer Gyre",
      "夏季环流": "Summer Gyre",
      "苏门答腊洋流（夏）": "Sumatra Current (Summer)",
      "苏门答腊洋流（冬）": "Sumatra Current (Winter)",
      "苏门答腊洋流": "Sumatra Current",
      "索马里寒流": "Somali Cold Current",
      "北印度洋冬季环流": "North Indian Ocean Winter Gyre",
      "冬季环流": "Winter Gyre",
      "印度洋赤道逆流": "Indian Ocean Equatorial Countercurrent",
      "索马里暖流": "Somali Warm Current",
      "台湾暖流": "Taiwan Warm Current",
      "黄海暖流": "Yellow Sea Warm Current",
      "对马暖流": "Tsushima Warm Current",
      "沿岸流": "Coastal Current",
      "西风漂流": "West Wind Drift",
      "南极沿岸流": "Antarctic Coastal Current",
      "直布罗陀海峡": "Strait of Gibraltar",
      "北印度洋季风洋流": "North Indian Ocean Monsoon Current",
      "秘鲁上升流": "Peru Upwelling",
      "北海道渔场": "Hokkaido Fishery",
      "纽芬兰渔场": "Newfoundland Fishery",
      "秘鲁渔场": "Peru Fishery",
      "北海渔场": "North Sea Fishery",
      "三圈环流示意图": "Three-Cell Circulation Diagram",
      "夏顺冬逆": "clockwise in summer, counterclockwise in winter",
      "东格陵兰寒流": "East Greenland Current",
      "密度较小": "lower density",
      "密度较大": "higher density",
      "直布罗陀岩床": "Gibraltar sill",
      "剖面示意：密度流": "Cross section: density current"
    },
    de: {
      "太平洋": "Pazifischer Ozean",
      "大西洋": "Atlantischer Ozean",
      "印度洋": "Indischer Ozean",
      "北冰洋": "Arktischer Ozean",
      "地中海": "Mittelmeer",
      "黑海": "Schwarzes Meer",
      "渔场": "Fischereigebiet",
      "示意图": "Schema",
      "红海": "Rotes Meer",
      "里海": "Kaspisches Meer",
      "阿拉伯海": "Arabisches Meer",
      "孟加拉湾": "Golf von Bengalen",
      "南海": "Suedchinesisches Meer",
      "加勒比海": "Karibisches Meer",
      "东海": "Ostchinesisches Meer",
      "日本海": "Japanisches Meer",
      "墨西哥湾": "Golf von Mexiko",
      "波罗的海": "Ostsee",
      "南冰洋": "Suedlicher Ozean",
      "暖流": "Warmstrom",
      "寒流": "Kaltstrom",
      "补偿流": "Ausgleichsstrom",
      "沿岸流": "Kuestenstrom",
      "上升流": "Auftriebsstrom",
      "密度流": "Dichtestrom",
      "季风洋流": "Monsunstrom",
      "夏季": "Sommer",
      "冬季": "Winter",
      "西南季风": "Suedwestmonsun",
      "东北季风": "Nordostmonsun",
      "世界四大渔场": "Vier grosse Fischereigebiete der Welt",
      "寒暖流交汇": "Treffen von Warm- und Kaltstroemen",
      "日本近海": "Seegebiet bei Japan",
      "东南太平洋": "Suedostpazifik",
      "欧洲近海": "Europaeische Randmeere",
      "重点": "Schwerpunkt",
      "海峡": "Meerenge",
      "三圈环流": "Drei-Zellen-Zirkulation",
      "气压带风带": "Druck- und Windguertel",
      "北太平洋": "Nordpazifik",
      "南太平洋": "Suedpazifik",
      "北大西洋": "Nordatlantik",
      "南大西洋": "Suedatlantik",
      "中国近海": "Chinas Kuestenmeere",
      "南半球": "Suedhalbkugel",
      "南极地区": "Antarktische Region",
      "信风带": "Passatguertel",
      "盛行西风": "Westwindzone",
      "副热带环流西侧": "Westseite des subtropischen Wirbels",
      "副极地环流": "subpolarer Wirbel",
      "冬季风": "Wintermonsun",
      "黑潮分支": "Kuroshio-Zweig",
      "对马暖流分支": "Tsushima-Zweig",
      "极地东风带": "Polare Ostwinde",
      "北极高气压带": "Arktischer Hochdruckguertel",
      "北副极地低气压带": "Noerdlicher subpolarer Tiefdruckguertel",
      "北副热带高气压带": "Noerdlicher subtropischer Hochdruckguertel",
      "赤道低气压带": "Aequatorialer Tiefdruckguertel",
      "南副热带高气压带": "Suedlicher subtropischer Hochdruckguertel",
      "南副极地低气压带": "Suedlicher subpolarer Tiefdruckguertel",
      "南极高气压带": "Antarktischer Hochdruckguertel",
      "盛行西风带": "Westwindguertel",
      "东北信风带": "Nordostpassat",
      "赤道无风带": "Aequatoriale Kalmenzone",
      "东南信风带": "Suedostpassat",
      "日本暖流（黑潮）": "Japanstrom (Kuroshio)",
      "日本暖流": "Japanstrom",
      "千岛寒流": "Ojaschio-Strom",
      "北太平洋暖流": "Nordpazifischer Strom",
      "阿拉斯加暖流": "Alaskastrom",
      "加利福尼亚寒流": "Kalifornienstrom",
      "加州寒流": "Kalifornienstrom",
      "北赤道暖流（太平洋）": "Nordaequatorialstrom (Pazifik)",
      "北赤道暖流": "Nordaequatorialstrom",
      "南赤道暖流（太平洋）": "Suedaequatorialstrom (Pazifik)",
      "南赤道暖流": "Suedaequatorialstrom",
      "赤道逆流（太平洋）": "Aequatorialer Gegenstrom (Pazifik)",
      "赤道逆流": "Aequatorialer Gegenstrom",
      "东澳大利亚暖流": "Ostaustralstrom",
      "东澳暖流": "Ostaustralstrom",
      "秘鲁寒流": "Perustrom",
      "墨西哥湾暖流": "Golfstrom",
      "拉布拉多寒流": "Labradorstrom",
      "北大西洋暖流": "Nordatlantischer Strom",
      "加那利寒流": "Kanarienstrom",
      "北赤道暖流（大西洋）": "Nordaequatorialstrom (Atlantik)",
      "赤道逆流（大西洋）": "Aequatorialer Gegenstrom (Atlantik)",
      "南赤道暖流（大西洋）": "Suedaequatorialstrom (Atlantik)",
      "巴西暖流": "Brasilstrom",
      "本格拉寒流": "Benguelastrom",
      "厄加勒斯暖流": "Agulhasstrom",
      "南赤道暖流（印度洋）": "Suedaequatorialstrom (Indischer Ozean)",
      "西澳大利亚寒流": "Westaustralstrom",
      "西澳寒流": "Westaustralstrom",
      "北印度洋夏季环流": "Sommerzirkulation des noerdlichen Indischen Ozeans",
      "夏季环流": "Sommerzirkulation",
      "苏门答腊洋流（夏）": "Sumatra-Strom (Sommer)",
      "苏门答腊洋流（冬）": "Sumatra-Strom (Winter)",
      "苏门答腊洋流": "Sumatra-Strom",
      "索马里寒流": "Somali-Kaltstrom",
      "北印度洋冬季环流": "Winterzirkulation des noerdlichen Indischen Ozeans",
      "冬季环流": "Winterzirkulation",
      "印度洋赤道逆流": "Aequatorialer Gegenstrom im Indischen Ozean",
      "索马里暖流": "Somali-Warmstrom",
      "台湾暖流": "Taiwan-Warmstrom",
      "黄海暖流": "Warmstrom des Gelben Meeres",
      "对马暖流": "Tsushima-Strom",
      "沿岸流": "Kuestenstrom",
      "西风漂流": "Westwinddrift",
      "南极沿岸流": "Antarktischer Kuestenstrom",
      "直布罗陀海峡": "Strasse von Gibraltar",
      "北印度洋季风洋流": "Monsunstroemung des noerdlichen Indischen Ozeans",
      "秘鲁上升流": "Peru-Auftrieb",
      "北海道渔场": "Fischereigebiet Hokkaido",
      "纽芬兰渔场": "Fischereigebiet Neufundland",
      "秘鲁渔场": "Fischereigebiet Peru",
      "北海渔场": "Fischereigebiet Nordsee",
      "三圈环流示意图": "Schema der Drei-Zellen-Zirkulation",
      "夏顺冬逆": "im Sommer im Uhrzeigersinn, im Winter gegen den Uhrzeigersinn",
      "东格陵兰寒流": "Ostgruendlandstrom",
      "密度较小": "geringere Dichte",
      "密度较大": "hoehere Dichte",
      "直布罗陀岩床": "Schwelle von Gibraltar",
      "剖面示意：密度流": "Querschnitt: Dichtestrom"
    }
  };

  const localizedDescriptions = {
    en: {
      "gibraltar-strait": "The Strait of Gibraltar is the narrow waterway between the Atlantic Ocean and the Mediterranean. Its classic teaching focus is the two-layer exchange flow driven by density differences.",
      "north-indian-monsoon-hotspot": "The northern Indian Ocean is one of the world's most typical regions with seasonally reversing currents. It is a classic case for teaching atmosphere-ocean interaction.",
      "peru-upwelling-hotspot": "The Peru coast is a classic upwelling region in geography teaching. Offshore winds and the cold current work together to lift deep cold water rich in nutrients.",
      "hokkaido-fishery": "The Hokkaido fishery near northern Japan is one of the world's famous fishing grounds, mainly formed by the convergence of warm and cold currents.",
      "newfoundland-fishery": "The Newfoundland fishery near eastern Canada is a classic North Atlantic fishery formed by the meeting of warm and cold currents.",
      "peru-fishery": "The Peru fishery on the west coast of South America is one of the world's most representative upwelling fisheries.",
      "north-sea-fishery": "The North Sea fishery is a famous fishing ground in northwestern Europe, also dominated by the convergence of warm and cold currents.",
      "circulation-diagram": "This diagram helps connect pressure belts, wind belts, and the global three-cell circulation system."
    },
    de: {
      "gibraltar-strait": "Die Strasse von Gibraltar ist die schmale Wasserverbindung zwischen Atlantik und Mittelmeer. Der klassische Lernschwerpunkt ist der zweischichtige Austauschstrom aufgrund von Dichteunterschieden.",
      "north-indian-monsoon-hotspot": "Der noerdliche Indische Ozean ist eines der typischsten Gebiete mit jahreszeitlich umkehrenden Stroemungen und ein klassisches Beispiel fuer Atmosphaere-Ozean-Wechselwirkungen.",
      "peru-upwelling-hotspot": "Die Kueste Perus ist ein klassisches Auftriebsgebiet im Geographieunterricht. Ablandige Winde und der Kaltstrom heben naehrstoffreiches Tiefenwasser an die Oberflaeche.",
      "hokkaido-fishery": "Das Fischereigebiet Hokkaido bei Nordjapan gehoert zu den beruehmten Fischgruenden der Welt und entsteht vor allem durch das Zusammentreffen von Warm- und Kaltstroemen.",
      "newfoundland-fishery": "Das Fischereigebiet Neufundland bei Ostkanada ist ein klassisches Fischereigebiet des Nordatlantiks, das durch das Treffen von Warm- und Kaltstroemen entsteht.",
      "peru-fishery": "Das Fischereigebiet Peru an der Westkueste Suedamerikas ist eines der typischsten Auftriebs-Fischereigebiete der Welt.",
      "north-sea-fishery": "Das Fischereigebiet Nordsee ist ein beruehmtes Fanggebiet in Nordwesteuropa und wird ebenfalls vor allem durch das Treffen von Warm- und Kaltstroemen gepraegt.",
      "circulation-diagram": "Dieses Schema verbindet Druckguertel, Windguertel und die globale Drei-Zellen-Zirkulation."
    }
  };

  const monthSeasonKeys = (month) => {
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  };

  const translateTerm = (text) => {
    if (currentLanguage === "zh" || !text) {
      return text;
    }
    return termTranslations[currentLanguage]?.[text] || text;
  };

  const getLocalizedDescription = (item) => {
    if (currentLanguage === "zh") {
      return item.description;
    }

    const direct = localizedDescriptions[currentLanguage]?.[item.id || ""];
    if (direct) {
      return direct;
    }

    if (item.type === "warm" || item.type === "cold") {
      const basin = (item.tags || []).map(translateTerm).join(", ");
      if (currentLanguage === "en") {
        return `${translateTerm(item.name)} is a ${item.type === "warm" ? "warm" : "cold"} current.${basin ? ` Related teaching tags: ${basin}.` : ""}`;
      }
      return `${translateTerm(item.name)} ist ein ${item.type === "warm" ? "Warm" : "Kalt"}strom.${basin ? ` Zugehoerige Lernstichwoerter: ${basin}.` : ""}`;
    }

    return item.description;
  };

  const getLocalizedExtraHtml = (item) => {
    if (!item) {
      return "";
    }

    if (item.id === "circulation-diagram") {
      const imageSrc = currentLanguage === "en"
        ? "img/three-cell-circulation-en.png"
        : currentLanguage === "de"
          ? "img/three-cell-circulation-de.png"
          : "img/三圈环流示意图.png";
      return `
        <figure class="teaching-image-figure">
          <img src="${imageSrc}" alt="${translateTerm("三圈环流示意图")}" />
        </figure>
      `;
    }

    if (item.id === "north-indian-monsoon-hotspot" && currentLanguage !== "zh") {
      const isWinter = currentMonth >= 11 || currentMonth <= 2;
      const isEn = currentLanguage === "en";
      const headTitle = isEn ? "Core teaching points" : "Zentrale Lernpunkte";
      const tagOne = isEn ? "classic monsoon-current region" : "klassischer Monsunstrom-Raum";
      const tagTwo = isEn ? "direction changes with season" : "Richtungswechsel mit den Jahreszeiten";
      const tagThree = isEn ? "clockwise in summer, counterclockwise in winter" : "im Sommer im Uhrzeigersinn, im Winter gegen den Uhrzeigersinn";
      const seasonTitle = isWinter
        ? (isEn ? "Winter: northeast monsoon, counterclockwise circulation" : "Winter: Nordostmonsun, Zirkulation gegen den Uhrzeigersinn")
        : (isEn ? "Summer: southwest monsoon, clockwise circulation" : "Sommer: Suedwestmonsun, Zirkulation im Uhrzeigersinn");
      const timeLine = isWinter
        ? (isEn ? "<p><strong>Time:</strong> November to February.</p>" : "<p><strong>Zeit:</strong> November bis Februar.</p>")
        : (isEn ? "<p><strong>Time:</strong> May to October.</p>" : "<p><strong>Zeit:</strong> Mai bis Oktober.</p>");
      const windLine = isWinter
        ? (isEn ? "<p><strong>Dominant wind:</strong> The northeast monsoon prevails, making an onshore component more likely near the Somali coast.</p>" : "<p><strong>Vorherrschender Wind:</strong> Der Nordostmonsun dominiert, sodass an der Kueste Somalias eher eine auflandige Komponente entsteht.</p>")
        : (isEn ? "<p><strong>Dominant wind:</strong> The southwest monsoon prevails and offshore-wind effects are more likely along the Somali coast.</p>" : "<p><strong>Vorherrschender Wind:</strong> Der Suedwestmonsun dominiert und an der Kueste Somalias tritt leichter ein ablandiger Windeffekt auf.</p>");
      const currentLine = isWinter
        ? (isEn ? "<p><strong>Current pattern:</strong> Warm flow dominates along Somalia, and the northern Indian Ocean shows a counterclockwise gyre.</p>" : "<p><strong>Stroemungsbild:</strong> Entlang Somalias ueberwiegt ein Warmstrom, und der noerdliche Indische Ozean zeigt eine gegen den Uhrzeigersinn gerichtete Zirkulation.</p>")
        : (isEn ? "<p><strong>Current pattern:</strong> A cold Somali current develops, and the northern Indian Ocean forms a clockwise gyre.</p>" : "<p><strong>Stroemungsbild:</strong> Ein kalter Somali-Strom bildet sich aus, und der noerdliche Indische Ozean zeigt eine Zirkulation im Uhrzeigersinn.</p>");
      const keyLine = isWinter
        ? (isEn ? "<p><strong>Teaching point:</strong> Compare it with the summer Somali cold current and upwelling to emphasize that the whole circulation can reverse direction.</p>" : "<p><strong>Merksatz:</strong> Im Vergleich mit dem sommerlichen Somali-Kaltstrom und dem Auftrieb laesst sich gut hervorheben, dass die gesamte Zirkulation ihre Richtung umkehren kann.</p>")
        : (isEn ? "<p><strong>Teaching point:</strong> Offshore winds can trigger upwelling, which is one reason the Somali Sea is such a classic teaching case.</p>" : "<p><strong>Merksatz:</strong> Ablandige Winde koennen Auftrieb ausloesen. Gerade deshalb ist das Seegebiet vor Somalia ein besonders typischer Unterrichtsfall.</p>");
      return `
        <div class="season-hotspot-head">
          <strong>${headTitle}</strong>
          <div class="season-hotspot-tags">
            <span>${tagOne}</span>
            <span>${tagTwo}</span>
            <span>${tagThree}</span>
          </div>
        </div>
        <div class="season-hotspot-panel">
          <h4>${seasonTitle}</h4>
          ${timeLine}
          ${windLine}
          ${currentLine}
          ${keyLine}
        </div>
      `;
    }

    if (item.id === "peru-upwelling-hotspot" && currentLanguage !== "zh") {
      const isEn = currentLanguage === "en";
      return `
        <div class="season-hotspot-head">
          <strong>${isEn ? "Core teaching points" : "Zentrale Lernpunkte"}</strong>
          <div class="season-hotspot-tags">
            <span>${isEn ? "offshore wind" : "ablandiger Wind"}</span>
            <span>${isEn ? "cold deep water rising" : "aufsteigendes kaltes Tiefenwasser"}</span>
            <span>${isEn ? "nutrient rich" : "naehrstoffreich"}</span>
          </div>
        </div>
        <div class="season-hotspot-panel">
          <h4>${isEn ? "Peru coastal upwelling mechanism" : "Mechanismus des Peru-Kuestenauftriebs"}</h4>
          <p>${isEn ? "<strong>Cause:</strong> The southeast trades drive surface water away from the coast. Once nearshore surface water is removed, cold deep water rises along the continental slope to replace it." : "<strong>Ursache:</strong> Der Suedostpassat treibt Oberflaechenwasser von der Kueste weg. Wenn kuestennahes Oberflaechenwasser abtransportiert wird, steigt kaltes Tiefenwasser entlang des Kontinentalhangs als Ersatz auf."}</p>
          <p>${isEn ? "<strong>Geographic meaning:</strong> The upwelled cold water brings abundant nutrients to the surface, promotes plankton growth, and supports the famous Peru fishery." : "<strong>Geographische Bedeutung:</strong> Das aufsteigende kalte Wasser bringt viele Naehrstoffe an die Oberflaeche, foerdert Plankton und traegt so das beruehmte Fischereigebiet vor Peru."}</p>
          <p>${isEn ? "<strong>Link:</strong> It can be taught together with the Peru Current, fishery distribution, and atmosphere-ocean anomalies as a classic combined case of wind-driven currents plus upwelling." : "<strong>Verknuepfung:</strong> Zusammen mit dem Perustrom, der Verteilung der Fischereigebiete und Atmosphaere-Ozean-Anomalien ist dies ein klassischer Gesamtfall aus windgesteuerter Stroemung und Auftrieb."}</p>
          <p>${isEn ? "<strong>Extension:</strong> In El Nino years, weaker trade winds usually weaken the upwelling as well, sea-surface temperature rises, and fishery output often drops sharply." : "<strong>Erweiterung:</strong> In El-Nino-Jahren schwaechen sich mit den Passaten meist auch die Auftriebsprozesse ab, die Meeresoberflaeche erwaermt sich und die Fischerei bricht oft deutlich ein."}</p>
        </div>
      `;
    }

    if (item.id === "gibraltar-strait" && currentLanguage !== "zh") {
      const isEn = currentLanguage === "en";
      return `
        <div class="teaching-diagram">
          <div class="teaching-diagram-title">${translateTerm("剖面示意：密度流")}</div>
          <div class="gibraltar-diagram">
            <div class="gibraltar-water"></div>
            <div class="gibraltar-sea-label atlantic">
              ${translateTerm("大西洋")}
              <small>${translateTerm("密度较小")}</small>
            </div>
            <div class="gibraltar-sea-label mediterranean">
              ${translateTerm("地中海")}
              <small>${translateTerm("密度较大")}</small>
            </div>
            <div class="gibraltar-arrow surface"></div>
            <div class="gibraltar-arrow deep"></div>
            <div class="gibraltar-bed"></div>
            <div class="gibraltar-bed-label">${translateTerm("直布罗陀岩床")}</div>
          </div>
          <div class="gibraltar-note">
            ${isEn
              ? "Lighter Atlantic surface water flows into the Mediterranean, while denser Mediterranean deep water returns toward the Atlantic. This is a classic density current."
              : "Leichteres Oberflaechenwasser aus dem Atlantik stroemt ins Mittelmeer, waehrend dichteres Tiefenwasser aus dem Mittelmeer zum Atlantik zurueckstroemt. Das ist ein typischer Dichtestrom."}
          </div>
        </div>
      `;
    }

    const fisheryCards = {
      en: {
        "hokkaido-fishery": `
          <div class="season-hotspot-panel">
            <h4>Cause: convergence of warm and cold currents</h4>
            <p><strong>Related currents:</strong> Oyashio Current, Japan Current.</p>
            <p><strong>Mechanism:</strong> Where cold and warm currents meet, vertical mixing becomes stronger and nutrients are brought upward more easily. Plankton flourishes and fish gather in large numbers.</p>
            <p><strong>Teaching point:</strong> This is a classic example of a fishery formed by the meeting of warm and cold currents, and it pairs well with the Newfoundland fishery for comparison.</p>
          </div>
        `,
        "newfoundland-fishery": `
          <div class="season-hotspot-panel">
            <h4>Cause: convergence of warm and cold currents</h4>
            <p><strong>Related currents:</strong> Labrador Current, Gulf Stream.</p>
            <p><strong>Mechanism:</strong> The contrast between cold and warm water masses enhances mixing and nutrient supply, supporting abundant plankton and concentrated fish resources.</p>
            <p><strong>Teaching point:</strong> Together with the Hokkaido fishery, it helps summarize the pattern that a high-latitude cold current meeting a lower-latitude warm current can create a major fishing ground.</p>
          </div>
        `,
        "peru-fishery": `
          <div class="season-hotspot-panel">
            <h4>Cause: upwelling</h4>
            <p><strong>Related current:</strong> Peru Current.</p>
            <p><strong>Mechanism:</strong> Offshore winds push surface water away from the coast, and cold deep water rises to replace it. The upwelled water brings abundant nutrients to the surface and supports very high productivity.</p>
            <p><strong>Teaching point:</strong> It can be taught together with the Peru upwelling hotspot to explain why El Nino years often weaken fisheries in this region.</p>
          </div>
        `,
        "north-sea-fishery": `
          <div class="season-hotspot-panel">
            <h4>Cause: convergence of warm and cold currents</h4>
            <p><strong>Related currents:</strong> East Greenland Current, North Atlantic Drift.</p>
            <p><strong>Mechanism:</strong> The meeting of different water masses strengthens water exchange and nutrient availability, creating favorable conditions for plankton and fish concentration.</p>
            <p><strong>Teaching point:</strong> Compared with Hokkaido and Newfoundland, it helps summarize that the four major fisheries are mainly linked either to current convergence or to upwelling.</p>
          </div>
        `,
      },
      de: {
        "hokkaido-fishery": `
          <div class="season-hotspot-panel">
            <h4>Ursache: Treffen von Warm- und Kaltstroemen</h4>
            <p><strong>Verbundene Stroemungen:</strong> Ojaschio-Strom, Japanstrom.</p>
            <p><strong>Mechanismus:</strong> Dort, wo kalte und warme Stroemungen aufeinandertreffen, wird die vertikale Durchmischung staerker und Naehrstoffe gelangen leichter in oberflaechennahe Schichten. Plankton vermehrt sich stark und Fische sammeln sich in grosser Zahl.</p>
            <p><strong>Merksatz:</strong> Dies ist ein klassisches Beispiel fuer ein Fischereigebiet, das durch das Treffen von Warm- und Kaltstroemen entsteht, und es laesst sich gut mit Neufundland vergleichen.</p>
          </div>
        `,
        "newfoundland-fishery": `
          <div class="season-hotspot-panel">
            <h4>Ursache: Treffen von Warm- und Kaltstroemen</h4>
            <p><strong>Verbundene Stroemungen:</strong> Labradorstrom, Golfstrom.</p>
            <p><strong>Mechanismus:</strong> Der Gegensatz zwischen kalten und warmen Wassermassen verstaerkt die Durchmischung und den Naehrstoffnachschub. Dadurch werden Plankton und Fischbestaende besonders reich.</p>
            <p><strong>Merksatz:</strong> Zusammen mit dem Fischereigebiet Hokkaido eignet es sich gut, um den Typus "Kaltstrom plus Warmstrom gleich bedeutendes Fischereigebiet" zusammenzufassen.</p>
          </div>
        `,
        "peru-fishery": `
          <div class="season-hotspot-panel">
            <h4>Ursache: Auftrieb</h4>
            <p><strong>Verbundene Stroemung:</strong> Perustrom.</p>
            <p><strong>Mechanismus:</strong> Ablandige Winde fuehren Oberflaechenwasser von der Kueste weg, kaltes Tiefenwasser steigt als Ersatz auf und bringt viele Naehrstoffe an die Oberflaeche. Dadurch entsteht eine sehr hohe biologische Produktivitaet.</p>
            <p><strong>Merksatz:</strong> Zusammen mit dem Peru-Auftriebs-Hotspot laesst sich erklaeren, warum El-Nino-Jahre die Fischerei in diesem Raum oft deutlich schwaechen.</p>
          </div>
        `,
        "north-sea-fishery": `
          <div class="season-hotspot-panel">
            <h4>Ursache: Treffen von Warm- und Kaltstroemen</h4>
            <p><strong>Verbundene Stroemungen:</strong> Ostgruendlandstrom, Nordatlantischer Strom.</p>
            <p><strong>Mechanismus:</strong> Das Zusammentreffen unterschiedlicher Wassermassen verstaerkt Wasseraustausch und Naehrstoffangebot und schafft gute Bedingungen fuer Plankton sowie die Konzentration von Fischschwaermen.</p>
            <p><strong>Merksatz:</strong> Im Vergleich mit Hokkaido und Neufundland zeigt sich gut, dass die grossen Fischereigebiete meist entweder auf Stroemungskonvergenz oder auf Auftrieb zurueckgehen.</p>
          </div>
        `,
      },
    };

    if (currentLanguage !== "zh" && fisheryCards[currentLanguage]?.[item.id]) {
      return fisheryCards[currentLanguage][item.id];
    }

    return typeof item.extraHtml === "function" ? item.extraHtml() : item.extraHtml || "";
  };

  const localizeTeachingItem = (item) => {
    const localized = { ...item };
    if (!localized.id && localized.name === "三圈环流示意图") {
      localized.id = "circulation-diagram";
    }
    localized.name = translateTerm(item.name);
    if (item.labelText) {
      localized.labelText = translateTerm(item.labelText);
    }
    localized.modalType = translateTerm(item.modalType || (item.type === "warm" ? "暖流" : "寒流"));
    localized.tags = (item.tags || []).map((tag) => translateTerm(tag));
    localized.description = getLocalizedDescription(localized);
    localized.extraHtml = getLocalizedExtraHtml(localized);
    return localized;
  };

  const restoreCountryLabel = (label) => {
    if (label.dataset.originalHtml) {
      label.innerHTML = label.dataset.originalHtml;
    }
  };

  const splitLabelLines = (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 2 || text.length < 14) {
      return [text];
    }
    const midpoint = Math.ceil(words.length / 2);
    return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
  };

  const localizeCountryLabels = () => {
    const displayNames = currentLanguage === "zh"
      ? null
      : new Intl.DisplayNames([currentLanguage], { type: "region" });

    countryLabels.forEach((label) => {
      if (!label.dataset.originalHtml) {
        label.dataset.originalHtml = label.innerHTML;
      }

      if (currentLanguage === "zh") {
        restoreCountryLabel(label);
        return;
      }

      const code = (label.getAttribute("class") || "").split(/\s+/)[0]?.toUpperCase();
      if (!code) {
        return;
      }
      const localizedName = displayNames?.of(code) || label.textContent;
      const lines = splitLabelLines(localizedName);
      label.replaceChildren();
      if (lines.length === 1) {
        label.textContent = lines[0];
        return;
      }
      const x = label.getAttribute("x") || "0";
      const y = Number(label.getAttribute("y") || "0");
      lines.forEach((line, index) => {
        const tspan = createSvgElement(
          "tspan",
          {
            x,
            y: String(y + (index === 0 ? -4 : 4)),
          },
          line
        );
        label.appendChild(tspan);
      });
    });
  };

  const updateStaticText = () => {
    const ui = languageUi[currentLanguage];
    const panelTitle = document.querySelector(".teaching-panel .teaching-panel-title");
    const legendTitle = document.querySelector(".teaching-legend .teaching-panel-title");
    const seasonTitle = document.querySelector(".season-control .teaching-panel-title");
    const ensoTitle = document.querySelector(".enso-control .teaching-panel-title");
    const legendItems = document.querySelectorAll(".teaching-legend .legend-item span:last-child");
    const teachingNote = document.querySelector(".teaching-panel-note");

    if (panelTitle) panelTitle.textContent = ui.layerTitle;
    if (legendTitle) legendTitle.textContent = ui.legendTitle;
    if (seasonTitle) seasonTitle.textContent = ui.timeTitle;
    if (ensoTitle) ensoTitle.textContent = ui.ensoTitle;
    if (teachingNote) teachingNote.textContent = ui.panelNote;

    const layerMap = {
      currents: ui.currents,
      currentLabels: ui.currentLabels,
      atmosphere: ui.atmosphere,
    };

    layerToggleButtons.forEach((button) => {
      const textSpan = button.querySelector("span:last-child");
      if (textSpan) {
        textSpan.textContent = layerMap[button.dataset.layerToggle] || textSpan.textContent;
      }
    });

    const ensoMap = {
      normal: ui.normalYear,
      el: ui.elNino,
      la: ui.laNina,
    };

    ensoButtons.forEach((button) => {
      button.textContent = ensoMap[button.dataset.ensoMode] || button.textContent;
    });

    if (legendItems[0]) legendItems[0].textContent = ui.warmCurrent;
    if (legendItems[1]) legendItems[1].textContent = ui.coldCurrent;
    if (legendItems[2]) legendItems[2].textContent = ui.pressureZone;
    if (legendItems[3]) legendItems[3].textContent = ui.windZone;

    if (paletteToggleButton) {
      paletteToggleButton.textContent = palettesDiv?.classList.contains("is-open")
        ? ui.paletteOpen
        : ui.paletteClosed;
    }

    if (circulationDiagramButton) {
      circulationDiagramButton.textContent = ui.circulationButton;
    }
  };

  const injectedStyle = document.createElement("style");
  injectedStyle.textContent = `
    .language-switcher { position: fixed; right: 18px; bottom: 18px; z-index: 30; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .language-toggle { border: none; border-radius: 999px; background: rgba(15,23,42,0.94); color: #fff; padding: 11px 16px; font-size: 0.9rem; font-weight: 700; cursor: pointer; box-shadow: 0 14px 28px rgba(0,0,0,0.18); }
    .language-menu { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.96); border: 1px solid rgba(32,45,58,0.12); box-shadow: 0 18px 32px rgba(0,0,0,0.16); }
    .language-option { border: 1px solid rgba(32,45,58,0.12); border-radius: 10px; background: rgba(247,250,252,0.92); color: #334155; padding: 8px 12px; font-size: 0.84rem; font-weight: 600; cursor: pointer; }
    .language-option.is-active { background: rgba(30,64,175,0.1); border-color: rgba(30,64,175,0.32); color: #1d4ed8; }
  `;
  document.head.appendChild(injectedStyle);

  const switcher = document.createElement("div");
  switcher.className = "language-switcher";
  switcher.innerHTML = `
    <button id="language-toggle" class="language-toggle" type="button" aria-expanded="false">中文</button>
    <div id="language-menu" class="language-menu" hidden>
      <button class="language-option is-active" type="button" data-language-option="zh">中文</button>
      <button class="language-option" type="button" data-language-option="en">English</button>
      <button class="language-option" type="button" data-language-option="de">Deutsch</button>
    </div>
  `;
  document.body.appendChild(switcher);

  const languageToggle = switcher.querySelector("#language-toggle");
  const languageMenu = switcher.querySelector("#language-menu");
  const languageOptions = switcher.querySelectorAll("[data-language-option]");

  const baseUpdateMonthDisplay = updateMonthDisplay;
  updateMonthDisplay = function updateMonthDisplayLocalized() {
    if (!monthDisplay) {
      return;
    }
    if (currentLanguage === "zh") {
      baseUpdateMonthDisplay();
      return;
    }
    const seasonKey = monthSeasonKeys(currentMonth);
    monthDisplay.textContent = `${languageUi[currentLanguage].months[currentMonth - 1]} (${seasonTranslations[currentLanguage][seasonKey]})`;
  };

  updateEnsoIndicator = function updateEnsoIndicatorLocalized() {
    if (!ensoIndicator || !ensoIndicatorText) {
      return;
    }
    const description = ensoDescriptionsLocalized[currentLanguage][currentEnso] || "";
    const isNormalYear = currentEnso === "normal";
    ensoIndicator.hidden = isNormalYear;
    ensoIndicator.classList.toggle("is-el", currentEnso === "el");
    ensoIndicator.classList.toggle("is-la", currentEnso === "la");
    ensoIndicatorText.textContent = description;
  };

  renderOceanRegionLabels = function renderOceanRegionLabelsLocalized() {
    if (!svgMap) {
      return;
    }
    let labelGroup = document.getElementById("ocean-region-label-layer");
    if (!labelGroup) {
      labelGroup = createSvgElement("g", { id: "ocean-region-label-layer" });
    }
    labelGroup.replaceChildren();
    oceanRegionLabels.forEach((region) => {
      region.positions.forEach((position) => {
        const { x, y } = projectPoint(position);
        const text = createSvgElement(
          "text",
          {
            x: x.toFixed(1),
            y: y.toFixed(1),
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            "pointer-events": "none",
            style: `fill:#111111;font-size:${region.fontSize}px;font-weight:800;letter-spacing:${region.letterSpacing}px;opacity:0.88;paint-order:stroke;stroke:rgba(255,255,255,0.72);stroke-width:5px;stroke-linejoin:round;`,
          },
          translateTerm(region.name)
        );
        labelGroup.appendChild(text);
      });
    });
    const teachingOverlay = document.getElementById("teaching-overlay");
    if (teachingOverlay) {
      svgMap.insertBefore(labelGroup, teachingOverlay);
    } else if (labelGroup.parentNode !== svgMap) {
      svgMap.appendChild(labelGroup);
    }
  };

  openTeachingModal = function openTeachingModalLocalized(item) {
    if (!teachingModal) {
      return;
    }
    activeTeachingItem = item;
    const localizedItem = localizeTeachingItem(item);
    const isWarm = item.type === "warm";
    const isCold = item.type === "cold";
    if (teachingModalCard) {
      teachingModalCard.classList.remove("is-wide");
      if (localizedItem.modalClass) {
        teachingModalCard.classList.add(localizedItem.modalClass);
      }
    }
    teachingModalType.textContent = localizedItem.modalType;
    teachingModalType.style.background = isWarm ? "rgba(220, 38, 38, 0.08)" : isCold ? "rgba(37, 99, 235, 0.08)" : "rgba(180, 83, 9, 0.08)";
    teachingModalType.style.color = isWarm ? "#8f1426" : isCold ? "#18459d" : "#92400e";
    teachingModalTitle.textContent = localizedItem.name;
    teachingModalDescription.textContent = localizedItem.description;
    teachingModalTags.innerHTML = (localizedItem.tags || []).map((tag) => `<span>${tag}</span>`).join("");
    teachingModalExtra.innerHTML = typeof localizedItem.extraHtml === "function" ? localizedItem.extraHtml() : localizedItem.extraHtml || "";
    teachingModal.classList.add("is-open");
    teachingModal.setAttribute("aria-hidden", "false");
  };

  createCurrentLabel = function createCurrentLabelLocalized(current, labelPosition = current.labelAt, visualState = getCurrentVisualState(current)) {
    const colors = currentPalette[current.type];
    const localizedCurrent = localizeTeachingItem(current);
    const labelText = localizedCurrent.labelText || localizedCurrent.name;
    const { x, y } = projectPoint(labelPosition);
    const scaleFactor = currentLanguage === "zh" ? 1 : 0.5;
    const width = Math.max(92, labelText.length * (currentLanguage === "zh" ? 15 : 11) + 28);
    const fontSize = labelText.length > 16 ? 10.5 : labelText.length > 11 ? 11.5 : 13;
    const labelGroup = createSvgElement("g", {
      transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scaleFactor})`,
      style: "cursor:pointer;",
      "data-camera-interactive": "true",
    });
    const background = createSvgElement("rect", {
      x: `${(-width / 2).toFixed(1)}`,
      y: "-13",
      width: `${width.toFixed(1)}`,
      height: "26",
      rx: "13",
      fill: colors.labelFill,
      stroke: colors.labelStroke,
      "stroke-width": "1",
      opacity: String(visualState.labelOpacity),
    });
    const text = createSvgElement(
      "text",
      {
        x: "0",
        y: "1",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        style: `font-size:${fontSize}px;font-weight:600;fill:${colors.labelText};pointer-events:none;`,
      },
      labelText
    );
    labelGroup.appendChild(background);
    labelGroup.appendChild(text);
    labelGroup.addEventListener("click", () => openTeachingModal(current));
    return labelGroup;
  };

  createPressureLabel = function createPressureLabelLocalized(belt, xPosition) {
    const localizedName = translateTerm(belt.name);
    const { y } = projectPoint([belt.centerLat, 0]);
    const width = Math.max(116, localizedName.length * 10 + 24);
    const group = createSvgElement("g", {
      transform: `translate(${xPosition.toFixed(1)} ${y.toFixed(1)})`,
      "pointer-events": "none",
    });
    const rect = createSvgElement("rect", {
      x: `${(-width / 2).toFixed(1)}`,
      y: "-14",
      width: `${width.toFixed(1)}`,
      height: "28",
      rx: "14",
      fill: "rgba(255, 255, 255, 0.74)",
      stroke: belt.stroke,
      "stroke-width": "1",
    });
    const text = createSvgElement(
      "text",
      {
        x: "0",
        y: "1",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        style: `font-size:${localizedName.length > 18 ? 10.5 : 12.5}px;font-weight:600;fill:${belt.textColor};`,
      },
      localizedName
    );
    group.appendChild(rect);
    group.appendChild(text);
    return group;
  };

  createWindLabel = function createWindLabelLocalized(belt, longitude) {
    const localizedName = translateTerm(belt.name);
    const { x, y } = projectPoint([belt.lat, longitude]);
    const width = Math.max(126, localizedName.length * 10 + 32);
    const group = createSvgElement("g", {
      transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
      "pointer-events": "none",
    });
    const rect = createSvgElement("rect", {
      x: `${(-width / 2).toFixed(1)}`,
      y: "-14",
      width: `${width.toFixed(1)}`,
      height: "28",
      rx: "14",
      fill: "rgba(255, 255, 255, 0.72)",
      stroke: belt.stroke,
      "stroke-width": "1",
    });
    const arrow = createSvgElement(
      "text",
      {
        x: `${(-width / 2 + 18).toFixed(1)}`,
        y: "1",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        style: `font-size:14px;font-weight:700;fill:${belt.textColor};`,
      },
      belt.direction
    );
    const label = createSvgElement(
      "text",
      {
        x: "10",
        y: "1",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        style: `font-size:${localizedName.length > 18 ? 10.5 : 12}px;font-weight:600;fill:${belt.textColor};`,
      },
      localizedName
    );
    group.appendChild(rect);
    group.appendChild(arrow);
    group.appendChild(label);
    return group;
  };

  const setLanguage = (language) => {
    currentLanguage = language;
    try {
      localStorage.setItem("geo-map-language", language);
    } catch (error) {}
    document.documentElement.lang = language;
    updateStaticText();
    localizeCountryLabels();
    updateMonthDisplay();
    updateEnsoIndicator();
    renderOceanRegionLabels();
    renderTeachingOverlay();
    const modalIsOpen = teachingModal?.classList.contains("is-open");
    if (modalIsOpen && activeTeachingItem) {
      openTeachingModal(activeTeachingItem);
    }
    languageToggle.textContent = languageUi[currentLanguage].showLanguage;
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
    languageOptions.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.languageOption === currentLanguage);
    });
  };

  languageToggle.addEventListener("click", () => {
    const isOpen = !languageMenu.hidden;
    languageMenu.hidden = isOpen;
    languageToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  languageOptions.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.languageOption || "zh");
    });
  });

  if (paletteToggleButton && palettesDiv) {
    paletteToggleButton.addEventListener("click", () => {
      const ui = languageUi[currentLanguage];
      paletteToggleButton.textContent = palettesDiv.classList.contains("is-open")
        ? ui.paletteOpen
        : ui.paletteClosed;
    });
  }

  const baseCloseTeachingModal = closeTeachingModal;
  closeTeachingModal = function closeTeachingModalLocalized() {
    baseCloseTeachingModal();
    activeTeachingItem = null;
  };

  document.addEventListener("click", (event) => {
    if (!switcher.contains(event.target)) {
      languageMenu.hidden = true;
      languageToggle.setAttribute("aria-expanded", "false");
    }
  });

  circulationDiagramTeachingItem.id = "circulation-diagram";
  circulationDiagramTeachingItem.name = "三圈环流示意图";
  circulationDiagramTeachingItem.modalType = "示意图";
  circulationDiagramTeachingItem.tags = ["气压带风带", "三圈环流"];

  try {
    const savedLanguage = localStorage.getItem("geo-map-language");
    if (savedLanguage && ["zh", "en", "de"].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    }
  } catch (error) {}

  setLanguage(currentLanguage);
})();
