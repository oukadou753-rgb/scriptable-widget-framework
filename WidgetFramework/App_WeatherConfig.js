// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_Config
 * UTF-8 日本語コメント
 **/
// ======================
// Constat
// ======================
const APP_VERSION = "2.0.0"
const APP_MAIN = "Main"
const APP_ID = "Weather"
const DEFAULT_STRAGE_TYPE = "local" // "icloud", "local", "bookmark"

// ======================
// Color
// ======================
const PALETTE = Object.freeze({

  red: "#ff4d4d",
  orange: "#ff9a3c",
  amber: "#ffb347",
  yellow: "#ffd84d",
  green: "#9de24f",

  sky: "#66d1ff",
  cyan: "#3ddcff",
  blue: "#4d8dff",
  purple: "#7a4dff",

  white: "#ffffff",
  gray: "#7f8fa6",
  litegGray: "#acb6c5",
  darkGray: "#596980",
  black: "#000000"

})

const ROLE = Object.freeze({

  danger: PALETTE.red,
  warning: PALETTE.orange,
  caution: PALETTE.yellow,
  success: PALETTE.green,

  info: PALETTE.sky,
  accent: PALETTE.blue,

  strongWeather: PALETTE.purple,
  neutral: PALETTE.gray

})

const COLORS = {

  theme: {
    textPrimary: "#d1cdda",    // メイン文字
    textSecondary: "#a8b2c7",  // サブ文字
    divider: "#2c4a72",        // 仕切り

    accent: PALETTE.blue,      // 強調
    info: PALETTE.sky,         // 情報
    highlight: PALETTE.purple  // 特殊
  },

  background: {
    base: "#003366",           // 単色
    top: "#000000",            // グラデーション・上
    bottom: "#003366"          // グラデーション・下
  },

  pressure: {
    rising: PALETTE.sky,       // 上昇
    steady: "#d1cdda",         // 変化なし
    falling: PALETTE.amber,    //下降
    alert: PALETTE.red         // 警戒
  },

  temp: {
    extremeHot: PALETTE.red,    // 35℃以上
    hot: PALETTE.orange,        // 30〜34℃
    warm: PALETTE.amber,        // 25〜29℃
    mild: PALETTE.yellow,       // 20〜24℃

    cool: PALETTE.sky,          // 15〜19℃
    cold: PALETTE.blue,         // 5〜14℃
    freezing: PALETTE.purple    // 4℃以下
  },

  humidity: {
    dry: PALETTE.sky,           // 30%未満
    comfortable: PALETTE.sky,   // 30〜50%
    humid: PALETTE.cyan,        // 50〜70%
    wet: PALETTE.cyan           // 70%以上
  },

  wind: {
    calm: PALETTE.green,        // 無風〜微風
    breeze: PALETTE.sky,        // 弱風
    windy: PALETTE.yellow,      // やや強い
    strong: PALETTE.orange,     // 強風
    storm: PALETTE.red          // 暴風
  },

  rain: {
    none: PALETTE.gray,         // 0mm
    light: PALETTE.sky,         // 0.1〜1mm
    moderate: PALETTE.cyan,     // 1〜5mm
    heavy: PALETTE.blue,        // 5〜20mm
    storm: PALETTE.purple       // 20mm+
  },

  pop: {
    none: PALETTE.gray,         // 0%
    low: PALETTE.sky,           // 10〜30%
    medium: PALETTE.cyan,       // 40〜60%
    high: PALETTE.blue,         // 70〜80%
    veryHigh: PALETTE.purple    // 90〜100%
  },

  discomfort: {
    soHot: PALETTE.red,         // "暑くてたまらない"
    hot: PALETTE.orange,        // "暑くて汗が出る"
    littleHot: PALETTE.amber,   // "やや暑い"
    notHot: PALETTE.yellow,     // "暑くない"
    pleasant: PALETTE.green,    // "快い"
    none: PALETTE.sky,          // "何も感じない"
    chilly: PALETTE.blue,       // "肌寒い"
    cold: PALETTE.purple        // "寒い"
  },

  level: {
    normal: ROLE.success,       // 普通
    caution: ROLE.caution,      // 注意
    alert: ROLE.warning,        // 警戒
    danger: ROLE.danger         // 危険
  },

  status: {
    ok: ROLE.success,           // 正常
    info: ROLE.info,            // 情報
    notice: ROLE.caution,       // 軽注意
    warning: ROLE.warning,      // 注意
    danger: ROLE.danger,        // 危険
    critical: ROLE.danger       // 最危険
  },

  extra: {
    temp: PALETTE.red,
    humidity: PALETTE.cyan,
    rain: PALETTE.sky,
    snow: "#cfe9ff",
    cloud: PALETTE.gray,
    pressureHigh: PALETTE.orange,
    pressureLow: PALETTE.purple
  }

}

const PRESETS_COLORS = {
  theme: Object.values(COLORS.theme),
  background: Object.values(COLORS.background)
}

const LEVEL_THRESHOLDS = {

  temp: [
    [35, COLORS.temp.extremeHot],
    [30, COLORS.temp.hot],
    [25, COLORS.temp.warm],
    [20, COLORS.temp.mild],
    [15, COLORS.temp.cool],
    [5, COLORS.temp.cold]
  ],
  tempDef: COLORS.temp.freezing,

  rain: [
    [20, COLORS.rain.storm],
    [5, COLORS.rain.heavy],
    [1, COLORS.rain.moderate],
    [0.1, COLORS.rain.light]
  ],
  rainDef: COLORS.theme.textPrimary,

  pop: [
    [90, COLORS.pop.veryHigh],
    [70, COLORS.pop.high],
    [40, COLORS.pop.medium],
    [10, COLORS.pop.low]
  ],
  popDef: COLORS.theme.textPrimary,

  wind: [
    [15, COLORS.wind.storm],
    [10, COLORS.wind.strong],
    [6, COLORS.wind.windy],
    [3, COLORS.wind.breeze]
  ],
  windDef: COLORS.theme.textPrimary,

  discomfort: [
    [85, [COLORS.discomfort.soHot, "暑くてたまらない"]],
    [80, [COLORS.discomfort.hot, "暑くて汗が出る"]],
    [75, [COLORS.discomfort.littleHot, "やや暑い"]],
    [70, [COLORS.discomfort.notHot, "暑くない"]],
    [65, [COLORS.discomfort.pleasant, "快い"]],
    [60, [COLORS.discomfort.none, "何も感じない"]],
    [54, [COLORS.discomfort.chilly, "肌寒い"]]
  ],
  discomfortDef: [COLORS.discomfort.cold, "寒い"]

}

// ======================
// Sizes
// ======================
const SIZES = {
  text: {
    header: 16,
    body: 14,
    footer: 9,

    extraLarge: 20,
    large: 14,
    medium: 12,
    small: 10,
    extraSmall: 9
  },

  column: {
    extraLarge: 18,
    large: 13,
    medium: 12,
    small: 10,
    extraSmall: 9
  },

  row: {
    extraLarge: 20,
    large: 16,
    medium: 12,
    small: 10,
    extraSmall: 9
  },

  image: {
    extraLarge: 28,
    large: 20,
    medium: 16,
    small: 12,
    extraSmall: 10
  }
}

const TEXT_ICON = {
  // 基本
  mark: "■",
  empty: "□",

  // 矢印
  up: "▲",
  down: "▼",
  right: "▶",
  left: "◀",

  // 状態
  circle: "●",
  circleEmpty: "○",

  // 補助
  dot: "・",
  dash: "—",

  // 数値
  plus: "+",
  minus: "−"
}

// ======================
// Helper
// ======================
function betweenHelper(left, right) {
  return {
    justify:"space-between",
    h:[left, right]
  }
}

function textHelper(text, style) {
  return { text, style }
}

function imageHelper(image, size = 14, tint = "", opacity = 1) {
  return {
    type: "image",
    src: image,
    size,
    tint,
    opacity
  }
}

function unitHelper(text, unit, options = {}) {
  return {
    justify: "end",
    spacing: 2,
    h: [
      textHelper(text, "dataText"),
      textHelper(unit, "dataSmallText"),
      ...(options.mark ? [
        textHelper(TEXT_ICON.mark, {
          base: "dataSmallText",
          color: options.color
        })
      ] : [])
    ]
  }
}


function columnHelper(text, subText) {
  return {
    h: [
      textHelper(text, "columnText"),
      (subText != "") ? textHelper(subText, "columnSmallText") : ""
    ]
  }
}

function rowHelper(text, trend, color) {
  return {
    justify: "end",
    h: [
      textHelper(trend ? trend + " " : "", { base: "dataSmallText", color: color }),
      textHelper(text, "dataText")
    ]
  }
}

// ======================
// Header Block
// ======================
const headerBlock = [
  betweenHelper(
    { size: new Size(0, 24), spacing:3,
      h: [
        imageHelper("{{header_titleIcon_src}}", SIZES.text.extraLarge, "{{header_titleIcon_tint}}"),
        textHelper("{{header_titleStr}}", "largeText")
      ]
    },
    { spacing:3, show: "{{ui_isMediumUp}}",
      h: [
        textHelper(TEXT_ICON.mark, { base: "smallText", color: "{{current_discomfortIndexColor}}" }),
        textHelper("{{current_discomfortStr}}", "mediumText"),
        imageHelper("{{onlineIcon_name}}", SIZES.image.medium, "{{onlineIcon_color}}", "{{onlineIcon_opacity}}")
      ]
    }
  )
]

// ======================
// Footer Block
// ======================
// Location Name
const locationBlock = [
  { show: "{{ui_isMediumUp}}",
    h: [
      textHelper("{{location_name}}", { base: "largeText", color: "{{highlightTextColor}}" }),
    ]
  }
]

// Update + Location.lat/lon
const updateBlock = [
  betweenHelper(
    { show: "{{ui_showForecast}}",
      h: [
//         textHelper("{{strageType}} mode", "smallText")
      ]
    },
    {
      h: [
        textHelper("Update: ", { base: "smallText", color: "{{highlightTextColor}}" }),
        textHelper("{{footer_updateStr}}", "smallText")
      ]
    }
  )
]

// ======================
// Body Block
// ======================
// currentDataBlockSmall
const currentDataBlockSmall = [
  { size: new Size(0, 0), show: "{{ui_isSmall}}",
    v: [
      { size: new Size(0, 30), padding: pos(0, 5, 0, 0), justify: "center",
        h: [
          textHelper("{{current_pressure}}", { base: "dataText", fontSize: 30, color: "{{current_pressureColor}}" })
        ]
      },
      { size: new Size(0, 25), justify: "center",
        h: [
          textHelper("{{current_tempStr}}", { base: "dataLargeText", color: COLORS.extra.temp }),
          textHelper("°C", { base: "dataText", color: COLORS.extra.temp }),
          { spacer: 10 },
          textHelper("{{current_humidityStr}}", { base: "dataLargeText", color: COLORS.extra.humidity }),
          textHelper("％", { base: "dataText", color: COLORS.extra.humidity })
        ]
      },
      { justify: "center",
        h: [
          { size: new Size(0, 0), justify: "start",
            v: [
              textHelper("不快指数", "columnSmallText"),
              textHelper("降水確立", "columnSmallText")
            ]
          },
          {
            v: [
              unitHelper("{{current_discomfortIndexStr}}", "　", { mark: true, color: "{{current_discomfortIndexColor}}" }),
              unitHelper("{{current_popStr}}", "％", { mark: true, color: "{{current_popColor}}" })
            ]
          }
        ]
      }
    ]
  }
]

// CurrentData Details Block 1
const currentDataBlock1 = [
  { size: new Size(135, 0), padding: pos(0, 0, 0, -5), justify: "center",
    h: [
      textHelper("{{current_pressure}}", { base: "dataText", fontSize: 45, color: "{{current_pressureColor}}" })
    ]
  }
]

const currentDataBlock2 = [
  { size: new Size(125, 0),
    v: [
      { size: new Size(0, 25), justify: "center", spacing: 2,
        h: [
          textHelper("{{current_tempStr}}", { base: "dataExtraLargeText", color: COLORS.extra.temp }),
          textHelper("°C", { base: "dataText", color: COLORS.extra.temp }),
          { spacer: 5 },
          textHelper("{{current_humidityStr}}", { base: "dataExtraLargeText", color: COLORS.extra.humidity }),
          textHelper("％", { base: "dataText", color: COLORS.extra.humidity })
        ]
      },
      {
        h: [
          { size: new Size(60, 0),
            v: [
              textHelper("不快指数：", "columnText"),
              textHelper("降水確率：", "columnText"),
              textHelper("雨　　量：", "columnText")
            ]
          },
          {
            v: [
              unitHelper("{{current_discomfortIndexStr}}", "　", { mark: true, color: "{{current_discomfortIndexColor}}" }),
              unitHelper("{{current_popStr}}", "％", { mark: true, color: "{{current_popColor}}" }),
              unitHelper("{{current_rainStr}}", "㎜", { mark: true, color: "{{current_rainColor}}" })
            ]
          }
        ]
      }
    ]
  }
]

// CurrentData Details Block 3
const currentDataBlock3 = [
  { size: new Size(0, 50), show: "{{ui_isLargeUp}}",
    v: [
      { justify: "center", spacing: 2,
        h: [
          textHelper("日較差：", "columnLargeText"),
          textHelper("{{current_tempMaxStr}}", { base: "dataLargeText", color: "{{current_tempMaxColor}}" }),
          textHelper("°C", "dataText"),
          textHelper(" / ", "columnText"),
          textHelper("{{current_tempMinStr}}", { base: "dataLargeText", color: "{{current_tempMinColor}}" }),
          textHelper("°C", "dataText"),
          { spacer: 10 },
          textHelper("体感温度：", "columnLargeText"),
          textHelper("{{current_feelslikeStr}}", { base: "dataLargeText", color: "{{current_feelslikeColor}}" }),
          textHelper("°C", "dataText")
        ]
      },
      { justify: "center", spacing: 2,
        h: [
          textHelper("風速：", "columnLargeText"),
          textHelper("{{current_windStr}}", { base: "dataLargeText", color: "{{current_windColor}}" }),
          textHelper("m/s", "dataText"),
          { spacer: 10 },
          textHelper("風向き：", "columnLargeText"),
          imageHelper("{{current_windIcon}}", SIZES.image.large, "{{highlightTextColor}}"),
          { spacer: 2 },
          textHelper("{{current_winDirStr}}", "dataLargeText"),
        ]
      }
    ]
  }
]

// ForecastData Block
const forecastDataBlock = [
  { size: new Size(0, 75), justify: "center", show: "{{ui_isLargeUp}}",
    h: [

      // Column
      { justify: "start",
        v: [
          textHelper("時間予報", "columnExtraSmallText"),
          columnHelper("気　圧", ""),
          columnHelper("風　速", ""),
          columnHelper("気　温", ""),
          columnHelper("降　水", ""),
        ]
      },

      // Repeat
      {
        type: "repeat",
        items: "{{items}}",
        direction: "horizontal",
        spacing: 2,
        align: "center",
        limit: "{{limit}}",
        template: {
          size: new Size(53, 0),
          v: [
            { justify: "end",
              h: [
                textHelper("{{hourStr}}", "columnExtraSmallText")
              ]
            },
            rowHelper("{{pressureStr}}", "{{pressureTrend}}", "{{pressureColor}}"),
            { justify: "end",
              h: [
                imageHelper("{{windIcon}}", SIZES.image.medium, "{{highlightTextColor}}"),
                { spacer: 3 },
                textHelper("{{windTrend}} ", { base: "dataSmallText", color: "{{windSpeedColor}}" }),
                textHelper("{{windStr}}", "dataText")
              ]
            },
            rowHelper("{{tempStr}}", "{{tempTrend}}", "{{tempColor}}"),
            rowHelper("{{popStr}}", "{{popTrend}}", "{{popColor}}")
          ]
        }
      }
    ]
  }
]

// Astro Block
const astroBlock = [
  { size: new Size(0, 35), padding: pos(5, 0, 0, 0), justify: "center", spacing: 3, show: "{{ui_isLargeUp}}",
    h: [
      imageHelper("{{current_sunriseIcon}}", SIZES.image.extraLarge, "{{current_sunriseColor}}", "{{current_sunriseOpacity}}"),
      textHelper("{{current_sunriseTimeStr}}", { base: "dataText", fontSize: 24, color: "{{current_sunriseColor}}", opacity: "{{current_sunriseOpacity}}" }),
      { spacer: 5 },
      textHelper("{{current_moonphaseTextIcon}}", { base: "dataExtraLargeText", shadowColor: "#d1cdda", shadowRadius: 3, shadowOffset: { x: 0, y: 0 } }),
      { spacer: 5 },
      imageHelper("{{current_sunsetIcon}}", SIZES.image.extraLarge, "{{current_sunsetColor}}", "{{current_sunsetOpacity}}"),
      textHelper("{{current_sunsetTimeStr}}", { base: "dataText", fontSize: 24, color: "{{current_sunsetColor}}", opacity: "{{current_sunsetOpacity}}" })
    ]
  }
]

// ======================
// Export
// ======================
module.exports = {

  // ======================
  // getDefaultConfig
  // ======================
  getDefaultConfig() {

    return {

      version: APP_VERSION,

      colors: COLORS,

      styles: {
        defaultText: { fontSize: SIZES.text.default, bold: false, color: "{{defaultTextColor}}" },
        HighlightText: { fontSize: SIZES.text.default, bold: false, color: "{{highlightTextColor}}" },

        headerText: { fontSize: SIZES.text.header, bold: true, color: "{{headerTextColor}}" },
        bodyText: { fontSize: SIZES.text.body, bold: false, color: "{{bodyTextColor}}" },
        footerText: { fontSize: SIZES.text.footer, bold: false, color: "{{footerTextColor}}" },

        titleText: { fontSize: SIZES.text.header, bold: true, color: "{{highlightTextColor}}" },
        versionText: { fontSize: SIZES.text.footer, bold: false, color: "{{defaultTextColor}}" },
        updateText: { fontSize: SIZES.text.footer, bold: false, color: "{{highlightTextColor}}" },
        locationText: { fontSize: SIZES.text.body, bold: true, color: "{{highlightTextColor}}", lineLimit: 1 },

        columnText: { font:"monospace", fontSize: SIZES.column.medium, color: "{{highlightTextColor}}", lineLimit: 1 },
        columnExtraLargeText: { font:"monospace", fontSize: SIZES.column.extraLarge, color: "{{highlightTextColor}}", lineLimit: 1 },
        columnLargeText: { font:"monospace", fontSize: SIZES.column.large, color: "{{highlightTextColor}}", lineLimit: 1 },
        columnSmallText: { font:"monospace", fontSize: SIZES.column.small, color: "{{highlightTextColor}}", lineLimit: 1 },
        columnExtraSmallText: { font:"monospace", fontSize: SIZES.column.extraSmall, color: "{{highlightTextColor}}", lineLimit: 1 },

        dataText: { font:"monospace", fontSize: SIZES.row.medium, color: "{{defaultTextColor}}", lineLimit: 1 },
        dataExtraLargeText: { font:"monospace", fontSize: SIZES.row.extraLarge, color: "{{defaultTextColor}}", lineLimit: 1 },
        dataLargeText: { font:"monospace", fontSize: SIZES.row.large, color: "{{defaultTextColor}}", lineLimit: 1 },
        dataSmallText: { font:"monospace", fontSize: SIZES.row.small, color: "{{defaultTextColor}}", lineLimit: 1 },
        dataExtraSmallText: { font:"monospace", fontSize: SIZES.row.extraSmall, color: "{{defaultTextColor}}", lineLimit: 1 },

        extraLargeText: { font:"monospace", fontSize: SIZES.text.extraLarge, color: "{{defaultTextColor}}", lineLimit: 1 },
        largeText: { font:"monospace", fontSize: SIZES.text.large, color: "{{defaultTextColor}}", lineLimit: 1 },
        mediumText: { font:"monospace", fontSize: SIZES.text.medium, color: "{{defaultTextColor}}", lineLimit: 1 },
        smallText: { font:"monospace", fontSize: SIZES.text.small, color: "{{defaultTextColor}}", lineLimit: 1 },
        extraSmallText: { font:"monospace", fontSize: SIZES.text.extraSmall, color: "{{defaultTextColor}}", lineLimit: 1 }
      },

      defaultOpenSections: ["General", "Style"],

      schema: {
        titleStr: { type: "text", label: "Title", section: "General", default: "My Widget" },

        useBgGradient: { type: "bool", label: "Use Gradient Color", section: "BackgroundColor", default: true },
        bgColorTop: { type: "color", label: "Gradient Background Top Color", section: "BackgroundColor", default: COLORS.background.top, presets: PRESETS_COLORS.background },
        bgColorBottom: { type: "color", label: "Gradient Background Bottom Color", section: "BackgroundColor", default: COLORS.background.bottom, presets: PRESETS_COLORS.background },
        bgColor: { type: "color", label: "Background Color", section: "BackgroundColor", default: COLORS.background.base, presets: PRESETS_COLORS.background },

        defaultTextColor: { type: "color", label: "Default Text Color", section: "Style", default: COLORS.theme.textPrimary, presets: PRESETS_COLORS.theme },
        highlightTextColor: { type: "color", label: "Highlight Text Color", section: "Style", default: COLORS.theme.highlight, presets: PRESETS_COLORS.theme },
        headerTextColor: { type: "color", label: "Header Text Color", section: "Style", default: COLORS.theme.textPrimary, presets: PRESETS_COLORS.theme },
        bodyTextColor: { type: "color", label: "Body Text Color", section: "Style", default: COLORS.theme.textPrimary, presets: PRESETS_COLORS.theme },
        footerTextColor: { type: "color", label: "Footer Text Color", section: "Style", default: COLORS.theme.textPrimary, presets: PRESETS_COLORS.theme },

        useTestData: { type: "bool", label: "Use Test Data", section: "Debug", default: true },
        showStorageType: { type: "bool", label: "Show Storage Type", section: "Debug", default: true },
        showTableFullscreen: { type: "bool", label: "Show Table Fullscreen", section: "Debug", default: true },
        sort: { type: "select", label: "Sort", section: "Debug", default: "asc", options: ["asc", "desc"] },
        limit: { type: "number", label: "Limit", section: "Debug", default: 5 },
        minScore: { type: "number", label: "Min Score", section: "Debug", default: 80 },

        myApiKey: { type: "text", label: "API KEY", section: "API", default: "MY_APIKEY" },
        useCacheData: { type: "bool", label: "Use Cache Data", section: "API", default: true },
        refreshMinutes: { type: "number", label: "Refresh Minutes", section: "API", default: 5 },
        forceRefresh: { type: "bool", label: "Force Refresh in App", section: "API", default: false },
        intervalHours: { type: "number", label: "Interval Hours", section: "API", default: 2 },
        displayCount: { type: "number", label: "Display Count", section: "API", default: 4 },

        useNotification: { type: "bool", label: "Use Notification Data", section: "Notification", default: true },

        useCurrentLocation: { type: "bool", label: "現在地を使用", section: "Location", default: true },
        lat: { type: "number", label: "緯度（固定地点）", section: "Location", default: 35.6812, show: "{{!useCurrentLocation}}" },
        lon: { type: "number", label: "経度（固定地点）", section: "Location", default: 139.7671, show: "{{!useCurrentLocation}}" },
        name: { type: "text", label: "地名（固定地点）", section: "Location", default: "東京駅", show: "{{!name}}" },

        layoutId: {
          type: "select",
          label: "Layout",
          section: "Layout",
          default: "default",
          options: ["default", "testData"],
          readonly: false,
          hidden: false
        }
      },

      values: {}
    }
  },

  // API
  api: {
    baseURL: "https://api.weatherapi.com/v1",
    endpoint: "forecast.json",
    useLocation: true,

    cache: {
      key: "forecast",
      minutes: "{{refreshMinutes}}",
      useCache: "{{useCacheData}}",
      forceRefreshInApp: "{{forceRefresh}}"
    },

    params: {
      key: "{{myApiKey}}",
      days: "2",
      alerts: "no",
      lang: "ja"
    },
  
    dynamicParams: {
      q: (ctx) => {
        if (!ctx.location) return null
        return `${ctx.location.lat},${ctx.location.lon}`
      }
    }
  },

  // Location
  location: {
    get useCurrent() {
      return this.config?.values?.useCurrentLocation ?? true
    },

    get default() {
      return {
        lat: this.config?.values?.lat ?? 35.6812,
        lon: this.config?.values?.lon ?? 139.7671,
        name: "東京都",
        full: "東京都 千代田区 千代田"
      }
    },

    cacheMinutes: 60
  },

  // ======================
  // getLayout
  // ======================
  getLayout(layoutId = "default") {

    const layouts = {

      // Default Layout
      default: {
        padding: pos(10, 13, 16, 13),

        header: headerBlock,
        body: [
          ...currentDataBlockSmall,
          { justify: "space-between", show: "{{ui_isMediumUp}}",
            h: [
              ...currentDataBlock1,
              ...currentDataBlock2
            ]
          },
          ...currentDataBlock3,
          ...forecastDataBlock,
          ...astroBlock
        ],
        footer: [
          ...locationBlock,
          ...updateBlock
        ],

        // Spacing
        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      // Test Data Layout
      testData: {
        padding: pos(10, 16, 10, 16),

        header: [
          {
            size: new Size(0, 24),
            justify: "space-between",
            h: [
              { text: "{{header_titleStr}}", style: "title" },
              { image: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 16 }
            ]
          }
        ],

       body: [
        { spacer: 10 },
          {
            type: "repeat",
            items: "{{items}}",
            direction: "vertical",
            spacing: 8,
            align: "start",

//             filter: "{{value >= minScore}}",
            sortBy: "value",
            order: "{{sort}}",
            limit: "{{limit}}",
            empty: { text: "No Data", style: "bodyText" },
            template: {
              h: [
                { text: "{{index}}. {{titleStr}}", style: "bodyText" },
                { text: "{{value}} ({{sub}})", style: "bodyText" },
                { text: "🔥", style: "bodyText", show: "{{flag}}" }
              ]
            }
          }
        ],

        footer: [
          {
            justify: "end",
            h: [
              { text: "Update: ", style: "updateText" },
              { text: "{{footer_updateStr}}", style: "footerText" }
            ]
          }
        ],

        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      }
    }

    return layouts[layoutId] || layouts.default
  },

  // =========================
  // onNotificationTap
  // =========================
  onNotificationTap: async (info, core) => {
    const handler = core.notificationHandlers[info.action]
    if (handler) {
      await handler(info)
      return true
    }
    return false
  },

  // =========================
  // transform
  // =========================
  transform(data, ctx) {

    const v = ctx?.config?.values ?? {}

    const useTestData = v?.useTestData ?? false
    if (useTestData) return this.testDataTransform(data, ctx)

    const items = this.dataTransform(data, ctx)
    const meta = this.metaTransform(data, ctx)
    const notifications = this.notificationTranceform(data, ctx, {items, meta})

    return {
      items,
      ...flatObj(meta),
      notifications
    }
  },

  // =========================
  // secondaryData
  // =========================
  allHours: null,
  hours: null,
  secondaryData(data, ctx) {

    if (this.allHours != null && this.hours != null) 
      return {
        allHours: this.allHours,
        hours: this.hours
      }

    const v = ctx?.config?.values ?? {}

    const intervalHours = v?.intervalHours ?? 2
    const displayCount = v?.displayCount ?? 4
    const nowEpoch = Math.floor(Date.now() / 1000) + 3600

    const obj = data?.forecast?.forecastday ?? {}

    const allHours = obj.flatMap(day => day.hour) ?? []
    const hours = allHours
      .filter(h => h.time_epoch >= nowEpoch)
      .filter((h, i) => i % intervalHours === 0)
      .slice(0, displayCount) ?? []

    this.allHours = allHours
    this.hours = hours

    return {allHours, hours}
  },

  // =========================
  // dataTransform
  // =========================
  dataTransform(data, ctx) {

    const v = ctx?.config?.values ?? {}

    // hours
    const intervalHours = v?.intervalHours ?? 2
    const {allHours, hours} = this.secondaryData(data, ctx)

    // items
    const items = hours.map((h, idx) => {

      const prev = allHours.find(p =>
        p.time_epoch === h.time_epoch - intervalHours * 3600
      ) ?? h

      const hour = Number(h?.time.split(" ")[1].slice(0, 2))
      const timeEpoch = h?.time_epoch

      const pressure = h?.pressure_mb
      const wind = h?.wind_kph / 3.6
      const temp = h?.temp_c
      const pop = Math.max(...[ h?.chance_of_rain, h?.chance_of_snow ])

      const hourStr = `${hour}時`
      const pressureStr = Math.round(pressure)
      const windStr = Math.round(wind)
      const tempStr = Math.round(temp)
      const popStr = Math.ceil(pop / 5) * 5

      const pressureColor = getPressureColor(h?.pressure_mb, prev?.pressure_mb)
      const windColor = colorByThreshold(wind, LEVEL_THRESHOLDS.wind, LEVEL_THRESHOLDS.windDef)
      const tempColor = colorByThreshold(temp, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef)
      const popColor = colorByThreshold(pop, LEVEL_THRESHOLDS.pop, LEVEL_THRESHOLDS.popDef)

      const pressureTrend = trendIcon(pressure, prev.pressure_mb)
      const windTrend = trendIcon(wind, (prev?.wind_kph / 3.6))
      const tempTrend = trendIcon(temp, prev?.temp_c)
      const popTrend = trendIcon(pop, Math.max(...[ prev?.chance_of_rain, prev?.chance_of_snow ]))

      const windIcon = drawArrow(getDegString(h?.wind_degree), null, true)

      return {

        hour: hour,
        hourStr: hourStr,

        timeEpoch: timeEpoch,

        pressure: pressure,
        pressureStr: pressureStr,
        pressureColor: pressureColor,
        pressureTrend: pressureTrend,

        wind: wind,
        windStr: windStr,
        windColor: windColor,
        windTrend: windTrend,
        windIcon: windIcon,

        temp: temp,
        tempStr: tempStr,
        tempColor: tempColor,
        tempTrend: tempTrend,

        pop: pop,
        popStr: popStr,
        popColor: popColor,
        popTrend: popTrend

      }
    })

    return items
  },

  // =========================
  // metaTransform
  // =========================
  metaTransform(data, ctx) {

    const v = ctx?.config?.values ?? {}
    const env = ctx?.env ?? {}
    const runtime = ctx?.runtime ?? {}
    const appId = env?.appId ?? "WidgetFramework"

    // current
    const current = this.currentDataTransform(data, ctx)

    // titl
    const titleStr = current?.conditionStr ?? ""
    const titleIcon =  {
      src: current?.conditionIcon ?? "",
      tint: current?.isDay ? "" : "#ffffff"
    }

    // update
    const updateStr = formatTime(
      data?.current?.last_updated_epoch ??
      data?.last_updated_epoch,
      "HH時mm分"
    )

    // online
    const isOnline = runtime?.isOnline ?? false
    const onlineIcon = {
      name: "location.fill",
      color: "#d1cdda",
      opacity: isOnline ? 1.0 : 0.7
    }

    // location
    const l = runtime?.location ?? null
    const location = {
        lat: l?.lat ?? null,
        lon: l?.lon ?? null,
        latStr: l?.lat != null ? l.lat.toFixed(4) : "",
        lonStr: l?.lon != null ? l.lon.toFixed(4) : "",
        name: l?.full != null ? l.full.split(" ").slice(1).join("") : ""
      }

    // ui
    const levelMap = {
      small: 1,
      medium: 2,
      large: 3,
      extraLarge: 4
    }
    const level = levelMap[env?.size] ?? 2
    const isShow = true
    const ui = {
      isSmall: level === 1,
      isMediumUp: level >= 2,
      isLargeUp: level >= 3,

      showForecast: level >= 2 && isShow,
      showDetail: level >= 3
    }

    // メタ情報
    const meta = {
      header: {
        titleStr: titleStr,
        titleIcon: titleIcon
      },
      body: {
        
      },
      footer: {
        updateStr: updateStr
      },

      current: current,

      isOnline: isOnline,
      onlineIcon: onlineIcon,
      location: location,
      ui: ui
    }

    return meta
  },

  // =========================
  // currentDataTransform
  // =========================
  currentDataTransform(data, ctx) {

    const v = ctx?.config?.values ?? {}

    // hours
    const intervalHours = v?.intervalHours ?? 2
    const nowEpoch = Math.floor(Date.now() / 1000) - 3600 * 3
    const {allHours, hours} = this.secondaryData(data, ctx)

    // current
    const currentData = data?.current ?? {}
    const forecastData = data?.forecast?.forecastday ?? {}
    const dayData = forecastData?.flatMap(day => day?.day)[0]
    const astroData = forecastData?.flatMap(day => day?.astro)
    const prevData = allHours.find(h => h?.time_epoch >= nowEpoch) ?? allHours[allHours.length - 1]

    const pressure = currentData?.pressure_mb
    const pressureAfter = prevData?.pressure_mb ?? pressure

    const temp = currentData?.temp_c
    const tempMin = dayData?.mintemp_c
    const tempMax = dayData?.maxtemp_c
    const feelslike = currentData?.feelslike_c
    const humidity = currentData?.humidity
    const wind = currentData?.wind_kph / 3.6
    const winDir = currentData?.wind_dir
    const windDegree = currentData?.wind_degree
    const rain = currentData?.precip_mm
    const pop = Math.max(...[ prevData?.chance_of_rain, prevData?.chance_of_snow ])
    const discomfortIndex = getDiscomfortIndex(temp, humidity)

    const pressureStr = Math.round(pressure)
    const tempStr= Math.round(temp)
    const tempMinStr = Math.round(tempMin)
    const tempMaxStr = Math.round(tempMax)
    const feelslikeStr = Math.round(feelslike)
    const humidityStr = Math.round(humidity)
    const windStr = wind.toFixed(1)
    const winDirStr = getDegreeString(winDir)
    const windDegreeStr = getDegString(windDegree)
    const rainStr = rain.toFixed(rain > 1 ? 0 : 1)
    const popStr = Math.ceil(pop / 5) * 5
    const discomfortIndexStr = discomfortIndex.toFixed(0)
    const conditionStr = currentData?.condition?.text

    const pressureColor = getPressureColor(pressure, pressureAfter)
    const tempColor = colorByThreshold(temp, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef)
    const tempMinColor = colorByThreshold(tempMin, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef)
    const tempMaxColor = colorByThreshold(tempMax, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef)
    const feelslikeColor = colorByThreshold(feelslike, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef)
    const humidityColor = "#ffffff"
    const windColor = colorByThreshold(wind, LEVEL_THRESHOLDS.wind, LEVEL_THRESHOLDS.windDef)
    const rainColor = colorByThreshold(rain, LEVEL_THRESHOLDS.rain, LEVEL_THRESHOLDS.rainDef)
    const popColor = colorByThreshold(pop, LEVEL_THRESHOLDS.pop, LEVEL_THRESHOLDS.popDef)
    const [ discomfortIndexColor, discomfortStr ] = colorByThreshold(discomfortIndex, LEVEL_THRESHOLDS.discomfort, LEVEL_THRESHOLDS.discomfortDef)

    const windIcon = drawArrow(windDegreeStr, null, true)
    const conditionIcon = makeWeatherApiIcon(currentData?.condition?.icon)

    // astro
    const date = new Date()
    const isAm = date.getHours() < 12
    const moonphaseTextIcon = getMoonphaseImage(date, true)

    const sunriseIcon = "sunrise.fill"
    const sunsetIcon = "sunset.fill"
    const sunriseColor = isAm ? "" : "#999999"
    const sunsetColor = isAm ? "#999999" : ""
    const sunriseOpacity = isAm ? 1 : 0.7
    const sunsetOpacity = isAm ? 0.7 : 1

    const now = new Date()
    const nowStr = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`

    const todayAstro = astroData[0]
    const tomorrowAstro = astroData[1]

    const sunriseToday = convert12to24(todayAstro?.sunrise)
    const sunsetToday = convert12to24(todayAstro?.sunset)

    const isAfterSunset = !isTimeInRangeAcrossDay(nowStr, "00:00", sunsetToday)

    const sunriseTimeStr = isAfterSunset
      ? convert12to24(tomorrowAstro?.sunrise)
      : sunriseToday
    const sunsetTimeStr = sunsetToday

    const current = {

      isAfterSunset: isAfterSunset,

      pressure: pressure,
      temp: temp,
      tempMin: tempMin,
      tempMax: tempMax,
      feelslike: feelslike,
      humidity: humidity,
      wind: wind,
      winDir: winDir,
      windDegree: windDegree,
      rain: rain,
      pop: pop,
      discomfortIndex: discomfortIndex,

      pressureStr: pressureStr,
      tempStr: tempStr,
      tempMinStr: tempMinStr,
      tempMaxStr: tempMaxStr,
      feelslikeStr: feelslikeStr,
      humidityStr: humidityStr,
      windStr: windStr,
      winDirStr: winDirStr,
      windDegreeStr: windDegreeStr,
      rainStr: rainStr,
      popStr: popStr,
      discomfortIndexStr: discomfortIndexStr,
      discomfortStr: discomfortStr,
      conditionStr: conditionStr,
      sunriseTimeStr: sunriseTimeStr,
      sunsetTimeStr: sunsetTimeStr,

      pressureColor: pressureColor,
      tempColor: tempColor,
      tempMinColor: tempMinColor,
      tempMaxColor: tempMaxColor,
      feelslikeColor: feelslikeColor,
      humidityColor: humidityColor,
      windColor: windColor,
      rainColor: rainColor,
      popColor: popColor,
      discomfortIndexColor: discomfortIndexColor,
      sunriseColor: sunriseColor,
      sunsetColor: sunsetColor,

      sunriseOpacity: sunriseOpacity,
      sunsetOpacity: sunsetOpacity,

      windIcon: windIcon,
      conditionIcon: conditionIcon,
      moonphaseTextIcon: moonphaseTextIcon,
      sunriseIcon: sunriseIcon,
      sunsetIcon: sunsetIcon,

    }

    return current
  },

  // =========================
  // notificationTranceform
  // =========================
/*
{
  id: string,          // ★必須（グループID）
  title: string,       // 表示タイトル
  subtitle?: string,   // サブタイトル
  body?: string,       // 本文
  delay?: number,      // ms後に通知（schedule化）
  cooldown?: number,   // 再通知防止時間(ms)
  sound?: string,      // 通知音（任意）
  meta?: object        // ★拡張領域（重要）

  meta: {
    action: "openNotificationUI"
  }
  meta: {
    action: "openNotificationDetail"
  }
  meta: {
    action: "openProfile",
    profile: "default",
    widgetFamily: "large"
  }
  meta: {
    action: "openExternal",
    url: "https://example.com"
  }
}
*/
  notificationTranceform(data, ctx, {items, meta}) {

    const current = meta?.current ?? {}

    const notifications = []

    items.map((h, i) => {
      notifications.push({ 
        id: `forecast_${i}_${h.timeEpoch}`,
        delay: 10000,
        scheduleAt: new Date(h.timeEpoch * 1000),
        title: `${h.hourStr}の予報`,
        body: `［気圧］${h.pressureStr}hPa　［気温］${h.tempStr}°　［降水確率］${h.popStr}%`,
        sound: "default",
        cooldown: 25000
      })
    })

    return notifications
  },

  // ======================
  // Use Test Data
  // ======================

  // ======================
  // getTestData
  // ======================
  getTestData() {

    return {
      data: {
        news: [
          { title: "Apple releases new iOS", score: 98 },
          { title: "Scriptable Widget Update", score: 87 },
          { title: "Weather is sunny today", score: 76 },
          { title: "Breaking News Sample", score: 65 },
          { title: "Another Headline", score: 55 }
        ],
        last_updated_epoch: Math.floor(Date.now() / 1000),
      },
      location: {
        lat: 35.6812,
        lon: 139.7671,
        name: "東京都",
        full: "東京都 千代田区 千代田"
      }
    }
  },

  // ======================
  // testDataTransform
  // ======================
  testDataTransform(data, ctx) {

    const v = ctx?.config?.values ?? {}
    const env = ctx?.env ?? {}
    const runtime = ctx?.runtime ?? {}
    const appId = env?.appId ?? "WidgetFramework"

    const minScore = Number(v.minScore) || 0
    const limit = Number(v.limit) || 0

    // location
    const l = runtime?.location ?? null
    const location = {
        lat: l?.lat ?? null,
        lon: l?.lon ?? null,
        latStr: l?.lat != null ? l.lat.toFixed(4) : "",
        lonStr: l?.lon != null ? l.lon.toFixed(4) : "",
        name: l?.full != null ? l.full.split(" ").slice(1).join("") : ""
      }
    // 元データ正規化
    const rawList = Array.isArray(data?.news)
      ? data.news
      : []

    // データ整形（ここが本体）
    let items = rawList.map((item, i) => {

      const score = Number(item?.score) || 0

      return {
        // 共通キー
        titleStr: item?.title || "No Title",
        value: score,
        sub: this.getRank(score),
        flag: score >= minScore,

        // 追加情報
        index: i + 1,
        raw: item
      }
    })

    // Online判定
    const online = runtime?.isOnline ?? false
    const status = {
      icon: "location.fill",
      color: "#d1cdda",
      opacity: online ? 0.6 : 0.3
    }

    // 更新時間生成
    const updateStr = formatTime(data.last_updated_epoch, "yyyy/MM/dd HH:mm")

    // メタ情報
    const meta = {
      count: items.length,
      header: {
        titleStr: v.titleStr
      },
      body: {
        
      },
      footer: {
        updateStr: updateStr,
      },
        status: status,
        location: location
    }

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...flatObj(meta)
    }
  },

  // ======================
  // getRank
  // ======================
  getRank(score) {

    if (score >= 90) return "S"
    if (score >= 75) return "A"
    if (score >= 60) return "B"
    return "C"
  }
}

// ======================
// Function
// ======================

// ======================
// printf
// ======================
function printf(data) {
  return console.log(JSON.stringify(data, null, 2))
}

// ======================
// pos
// ======================
function pos(a,b,c,d){
  if (b === undefined)
    return {top:a,left:a,bottom:a,right:a}
  if (c === undefined)
    return {top:a,left:b,bottom:a,right:b}
  if (d === undefined)
    return {top:a,left:b,bottom:c,right:b}
  return {top:a,left:b,bottom:c,right:d}
}

// ======================
// DrawContext
// ======================
function getDegString(deg) { return Math.floor((deg + 11.25) / 22.5) * 22.5 + 180 }
function drawCircle(t,e,a,r,i,n,s,o,l){let c,u,d,$,m,h,p,g,f,w,y,_;d=e.width/2,$=e.height/2,r=r||0,i=i||0,n=n||0,o=o||0,p=1,w=l&&l.strokeColor?l.strokeColor:"#000",y=l&&l.strokeWidth?l.strokeWidth:0,_=l&&l.fillColor?l.fillColor:"#000";let S=new Path,T=[];for(let k=0;k<360;k++)g=(a-y/2)*Math.cos(m=(h=-90+p*k+o)*(Math.PI/180)),f=(a-y/2)*Math.sin(m),c=d+g,u=$+f,T.push(new Point(c,u));S.addLines(T),S.closeSubpath(),"transparent"!==_&&(t.addPath(S),t.setFillColor(new Color(_)),t.fillPath(S)),"transparent"!==w&&y>0&&(t.addPath(S),t.setStrokeColor(new Color(w)),t.setLineWidth(y),t.strokePath())}
function drawTriangle(t,e,a,r,i,n,s,o,l){let c,u,d,$,m,h,p,g,f,w,y,_;d=e.width/2,$=e.height/2,r=r||0,i=i||0,n=n||0,o=o||0,w=l&&l.strokeColor?l.strokeColor:"#000",y=l&&l.strokeWidth?l.strokeWidth:0,_=l&&l.fillColor?l.fillColor:"#000";let S=new Path,T=[],k=[];for(let F=0;F<4;F++)0==F?h=-90+o:1==F?h=-90+o+n:2==F?p=(h+(360-2*n)/2)*(Math.PI/180):3==F&&(h=-90+o+(360-n)),m=h*(Math.PI/180),2==F?(g=(a-i)*Math.cos(p),f=(a-i)*Math.sin(p)):(g=(a+r)*Math.cos(m),f=(a+r)*Math.sin(m)),c=d+g,u=$+f,T.push(new Point(c,u)),k.push([c,u]);S.addLines(T),S.closeSubpath(),"transparent"!==_&&(t.addPath(S),t.setFillColor(new Color(_)),t.fillPath(S)),"transparent"!==w&&y>0&&(t.addPath(S),t.setStrokeColor(new Color(w)),t.setLineWidth(y),t.strokePath())}
function drawArrow(t,e,a){let r=new Size(32,32),i=new DrawContext;i.opaque=!1,i.respectScreenScale=!0,i.size=r;let n={triangle:{strokeColor:e,strokeWidth:0,fillColor:e},circle:{strokeColor:e,strokeWidth:2,fillColor:"transparent"}};return a&&drawCircle(i,r,15,0,0,0,360,t,n.circle),drawTriangle(i,r,12,0,9,140,0,t,n.triangle),i.getImage()}

// ======================
// Object 平坦化
// ======================
function flatObj(obj, prefix = "") {
  const result = {}

  for (const key of Object.keys(obj)) {

    const value = obj[key]
    const newKey = prefix + key

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Image)
    ) {
      Object.assign(result, flatObj(value, newKey + "_"))
    }
    else {
      if (value !== undefined) {
        result[newKey] = value
      }
    }
  }

  return result
}

// ======================
// Epoch Date Formatter
// ======================
function formatTime(epoch, format = "HH:mm") {
  if (!epoch) return "--:--"
  const ts = new Date(
    epoch > 1e12 ? epoch : epoch * 1000
  )
  const df = new DateFormatter()
  df.dateFormat = format
  return df.string(ts)
}

// ======================
// parseURL 
// ======================
function parseURL(t){let e={href:t},a=["protocol host hostname port pathname query hash".split(" "),"directory filename query".split(" "),"basename extension".split(" ")];return[/^(?:(https?:)?(?:\/\/(([^\/:]+)(?::([0-9]+))?)))?(\/?[^?#]*)(\??[^?#]*)(#?.*)/,/^(?:[^:\/?#]+:)?(?:\/\/[^\/?#]*)?(?:([^?#]*\/)([^\/?#]*))?(\?[^#]*)?(?:#.*)?$/,/^([^/]*)\.([^.]+)?$/].map((r,i)=>{let n=String(2==i?e.filename:t).match(r);n&&a[i].forEach(function(t,a){e[t]=void 0===n[a+1]?null:n[a+1]})}),e}

// ======================
// makeWeatherApiIcon 
// ======================
function makeWeatherApiIcon(url) {
  let {  protocol, host, pathname, filename } = parseURL(url)
  url = (protocol || 'https') + '://' + host + pathname
  if (url.includes('day')) filename = filename.replace('.', 'd.')
  else if (url.includes('night')) filename = filename.replace('.', 'n.')
  return url
}

// ======================
// getDegreeString 
// ======================
function getDegreeString(wind_dir) { return [ ...wind_dir.replace(/E/g, '\u6771').replace(/W/g, '\u897f').replace(/S/g, '\u5357').replace(/N/g, '\u5317') + '\u3000\u3000' ].slice(0, 3).join('') }

// ======================
// trendIcon 
// ======================
function trendIcon(curr, prev) {
  const arr = TEXT_ICON
  if (curr > prev) return arr.up
  if (curr < prev) return arr.down
  return arr.right
}

// ======================
// colorByThreshold 
// ======================
function colorByThreshold(v, table, defaultColor) {
  for (const [limit, color] of table) {
    if (v >= limit) return color
  }
  return defaultColor
}

// ======================
// getPressureColor 
// ======================
function getPressureColor(curr, prev) {
  const diff = curr - prev
  const c = COLORS.pressure
  let color = "" // c.steady
  if (diff > 2 || diff < -2) color = c.alart
  else if (diff > 0.5) color = c.rising
  else if (diff < -0.5) color = c.falling
  return color
}

// ======================
// getDiscomfortIndex 
// ======================
function getDiscomfortIndex(temp, humidity) {
  const index = 0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3
  return Number(index)
}

// ======================
// timeToMinutes
// ======================
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// ======================
// convert12to24
// ======================
function convert12to24(time12h) {
  if (!time12h) return null
  const match = time12h.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return null
  const [_, hours, minutes, modifier] = match
  let hours24 = parseInt(hours, 10)
  if (modifier.toUpperCase() === 'PM' && hours24 < 12) {
    hours24 += 12
  } else if (modifier.toUpperCase() === 'AM' && hours24 === 12) {
    hours24 = 0
  }
  return `${String(hours24).padStart(2, '0')}:${minutes}`
}

// ======================
// isTimeInRangeAcrossDay
// ======================
function isTimeInRangeAcrossDay(checkTime, startTime, endTime) {
  let start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  let check = timeToMinutes(checkTime);
  if (end < start) {
    end += 24 * 60;
    if (check < start) {
      check += 24 * 60;
    }
  }
  return check >= start && check <= end;
}

// ======================
// Module Test
// ======================
function getMoonphaseImage( dt, isMoonUp = true ) {
  Date.prototype.getMoonphase=function(){let t=0,e=0,$=0,o=0,n=this.getFullYear(),h=this.getMonth()+1,r=this.getDate();return h<3&&(n--,h+=12),++h,$=(t=365.25*n)+(e=30.6*h)+r-694039.09,$/=29.5305882,o=parseInt($),$-=o,(o=Math.round(8*$))>=8&&(o=0),o}
  const sunIcon = '\ud83d\udfe0';
  const moonIcons = [ '\ud83c\udf11', '\ud83c\udf12', '\ud83c\udf13', '\ud83c\udf14', '\ud83c\udf15', '\ud83c\udf16', '\ud83c\udf17', '\ud83c\udf18' ];
  return isMoonUp ? moonIcons[ dt.getMoonphase() ] : sunIcon;
}

// ======================
// Module Test
// ======================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    const Main = importModule(APP_MAIN)
    Main.setAppInfo("id", APP_ID)
    Main.setAppInfo("storageType", DEFAULT_STRAGE_TYPE)
    await Main.start()
  })()
}