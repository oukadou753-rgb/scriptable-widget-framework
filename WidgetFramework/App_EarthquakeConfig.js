// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_Config
 * UTF-8 日本語コメント
 **/

const APP_VERSION = "2.0.0"
const APP_MAIN = "Main"
const APP_ID = "Earthquake"
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
    divider: "#ff642d",        // 仕切り

    accent: PALETTE.blue,      // 強調
    info: PALETTE.sky,         // 情報
    highlight: PALETTE.purple  // 特殊
  },

  background: {
    base: "#660000",           // 単色
    top: "#000000",            // グラデーション・上
    bottom: "#660000"          // グラデーション・下
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

  extra: {}

}

const PRESETS_COLORS = {
  theme: Object.values(COLORS.theme),
  background: Object.values(COLORS.background)
}

const SCALE_THRESHOLDS = {

  shindo: [
    [70, [PALETTE.red, "７"]],
    [60, [PALETTE.red, "６強"]],
    [55, [PALETTE.red, "６弱"]],
    [50, [PALETTE.orange, "５強"]],
    [45, [PALETTE.orange, "５弱"]],
    [40, [PALETTE.yellow, "４"]],
    [30, [PALETTE.yellow, "３"]],
    [20, [PALETTE.white, "２"]],
    [10, [PALETTE.litegGray, "１"]]
  ],
  def: [Color.darkGray().hex, "不明"]

}

const PRESETS = {
  scale: SCALE_THRESHOLDS.shindo.map(v => String(v[0]))
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

// ======================
// Text Icon
// ======================
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
  return {
    type: "text",
    text,
    style
  }
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

function rowStackHelper(options = {size, justify, show}, data) {
  return {
    size: options?.size ?? new Size(0, 0),
    justify: options?.justify ?? "start",
    show: options?.show ?? true,
    h: [
      ...data
    ]
  }
}

// ======================
// Header Block
// ======================

// [small, medium, large]
const headerBlock = [
  betweenHelper(
    {
      size: new Size(0, 25),
      spacing: 3,

      h: [
        textHelper("地震：", { base: "largeText", color: "{{highlightTextColor}}" }),
        textHelper("{{header_titleStr}}", "largeText")
      ]
    },
    {
      spacing: 3,
      show: "{{ui_isMediumUp}}",

      h: [
        textHelper("{{location_pref}}{{location_city}}", "largeText"),
        imageHelper("{{onlineIcon_name}}", SIZES.image.medium, "{{onlineIcon_color}}", "{{onlineIcon_opacity}}")
      ]
    }
  )
]

// ======================
// Footer Block
// ======================

// [small, medium, large]
const footerBlock = [
  betweenHelper(
    {
      justify: "start",
      show: "{{ui_showForecast}}",

      h: [
        textHelper("{{footer_storageType}}", "smallText")
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

// [small]
const bodyBlock_1 = [
  {
    show: "{{ui_isSmall}}",

    v: [
      {
        padding: pos(0, 0, 5, 0),
        justify: "center",

        h: [
          textHelper("{{pinned_maxShindo}}", { base: "dataText", fontSize: 55, color: "{{pinned_maxColor}}" })
        ]
      },
      textHelper("{{pinned_place}}", "dataText")
    ]
  }
]

// [medium, large]
const bodyBlock_2 = [
  {
    size: new Size(130, 0),
    justify: "center",
    meta: {
      action: "copyText"
    },

    h: [
      textHelper("{{pinned_maxShindo}}", { base: "dataText", fontSize: 60, color: "{{pinned_maxColor}}" })
    ]
  }
]

// [medium, large]
const bodyBlock_3 = [
  {
    size: new Size(135, 0),

    v: [
      {
        h: [
          textHelper("規模：", "columnText"),
          textHelper("M", "dataText"),
          textHelper("{{pinned_magnitudeStr}}", "dataText")
        ]
      },
      {
        h: [
          textHelper("深さ：", "columnText"),
          textHelper("{{pinned_depthStr}}", "dataText"),
          textHelper("km", "dataText")
        ]
      },
      {
        h: [
          textHelper("津波：", "columnText"),
          { bgColor: "{{pinned_tsunamiBgColor}}",
            h: [
              textHelper("{{pinned_tsunamiStr}}", {base: "dataText", color: "{{pinned_tsunamiColor}}" })
            ]
          }
        ]
      },
      {
        h: [
          textHelper("現在の標高：", "columnText"),
          textHelper("{{location_altStr}}", "dataText"),
          textHelper("m", "dataText")
        ]
      }
    ]
  }
]

// [small, medium, large]
const bodyBlock_4 = [
  {
    show: "{{ui_isMediumUp}}",

    h: [
      textHelper("{{pinned_place}}", "dataLargeText"),
      textHelper(" ({{pinned_distanceStr}}km)", "dataSmallText")
    ]
  }
]

// [small, medium, large]
const bodyBlock_5 = [
  {
    show: "{{ui_isMediumUp}}",

    h: [
      textHelper("{{location_name}}", { base: "largeText", color: "{{highlightTextColor}}" }),
    ]
  }
]

// [large]
const repeatBlock = [
  {
    size: new Size(0, 160),
    padding: pos(5, 0, 0, 0),
    align: "top",
    spacing: 2,
    show: "{{ui_isLargeUp}}",
    url: 'https://www.data.jma.go.jp/multi/quake/index.html?lang=jp',

    v: [
      {
        spacing: 1,

        h: [
          rowStackHelper(
            {},
            [
              textHelper("震源地", "columnText"),
              textHelper("（距離）", "columnText"),
              { spacer: true }
            ]
          ),
          rowStackHelper(
            {size: new Size(80, 0), justify: "end"},
            [
              textHelper("震度", "columnText")
            ]
          ),
          rowStackHelper(
            {size: new Size(35, 0), justify: "end", show: "ui_isExtraLarge"},
            [
              textHelper("体感", "columnText")
            ]
          ),
          rowStackHelper(
            {size: new Size(80, 0), justify: "end"},
            [
              textHelper("発生日時", "columnText")
            ]
          )
        ]
      },
      {
        type: "repeat",
        items: "{{items}}",
        direction: "vertical",
        align: "top",
        spacing: 0,
        minRows: 9,
        rowHeight: 15,

        template: {
          size: new Size(0, 15),

          h: [
            rowStackHelper(
              {},
              [
                textHelper("{{badge}}{{place}}", {base: "dataText", color: "{{maxColor}}"}),
                textHelper(" ({{distanceStr}}km)", {base: "dataSmallText", color: "{{maxColor}}"}),
                { spacer: true }
              ]
            ),
            rowStackHelper(
              {size: new Size(35, 0), justify: "end"},
              [
                textHelper("{{maxShindo}}", {base: "dataText", color: "{{maxColor}}"})
              ]
            ),
            rowStackHelper(
              {size: new Size(35, 0), justify: "end", show: "ui_isExtraLarge"},
              [
                textHelper("{{localShindo}}", {base: "dataText", color: "{{localColor}}"})
              ]
            ),
            rowStackHelper(
              {size: new Size(80, 0), justify: "end"},
              [
                textHelper("{{timeStr}}", {base: "dataText", color: "{{maxColor}}"})
              ]
            )
          ]
        }
      }
    ]
  }
]

// [small]
const bodyBlock_small = [
  {
    show: "{{ui_isSmall}}",

    v: [
      ...bodyBlock_1,
    ]
  }
]

// [medium, large]
const bodyBlock_mediumUp = [
  {
    align: "top",
    show: "ui_isMediumUp",

    v: [
      {
        size: new Size(280, 0),
        justify: "space-between",

        h: [
          ...bodyBlock_2,
          ...bodyBlock_3
        ]
      },
      ...bodyBlock_4,
    ]
  },
  {
  show: "{{ui_isLargeUp}}",

    v: [
      ...repeatBlock
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
        refreshInterval: { type: "select", label: "Refresh Interval", section: "Debug", default: "15", options: ["15", "30", "45", "60"] },
//         sort: { type: "select", label: "Sort", section: "Debug", default: "asc", options: ["asc", "desc"], readonlyExpr: "{{!useTestData}}" },
//         limit: { type: "number", label: "Limit", section: "Debug", default: 5, readonlyExpr: "{{!useTestData}}" },
//         minScore: { type: "number", label: "Min Score", section: "Debug", default: 80, readonlyExpr: "{{!useTestData}}" },

        useCacheData: { type: "bool", label: "Use Cache Data", section: "API", default: true },
        refreshMinutes: { type: "number", label: "Refresh Minutes", section: "API", default: 5 },
        forceRefresh: { type: "bool", label: "Force Refresh in App", section: "API", default: false },
        limit: { type: "number", label: "Limit", section: "API", default: 15 },
        displayCount: { type: "number", label: "Display Count", section: "API", default: 9 },

        closeOnPreview: { type: "bool", label: "Close On Preview", section: "Menu", default: false },

        useNotification: { type: "bool", label: "Use Notification Data", section: "Notification", default: true },
        useCopyTextNotification: { type: "bool", label: "CopyText Notification", section: "Notification", default: true },
        pinScale: { type: "select", label: "Pin Scale", section: "Notification", default: 30, options: PRESETS.scale, readonlyExpr: "{{!useNotification}}" },
        pinHours: { type: "number", label: "Pin Hours ", section: "Notification", default: 6, readonlyExpr: "{{!useNotification}}" },
        notifyCooldown: { type: "number", label: "Notification Cooldown", section: "Notification", default: 300000, readonlyExpr: "{{!useNotification}}" },

        // Notification Cache
        notifyCacheEnabled: { type: "bool", label: "Enable Cache Prune", section: "Notification", default: true, readonlyExpr: "{{!useNotification}}" },
        notifyCacheMaxCount: { type: "number", label: "Cache Max Count", section: "Notification", default: 50, readonlyExpr: "{{!notifyCacheEnabled || !useNotification}}" },
        notifyCacheMaxHours: { type: "number", label: "Cache Max Hours", section: "Notification", default: 24, readonlyExpr: "{{!notifyCacheEnabled || !useNotification}}" },

        useCurrentLocation: { type: "bool", label: "現在地を使用", section: "Location", default: true },
        lat: { type: "number", label: "緯度（固定地点）", section: "Location", default: 35.6812, readonlyExpr: "{{useCurrentLocation}}" },
        lon: { type: "number", label: "経度（固定地点）", section: "Location", default: 139.7671, readonlyExpr: "{{useCurrentLocation}}" },
        alt: { type: "number", label: "標高（固定地点）", section: "Location", default: 3.5, readonlyExpr: "{{useCurrentLocation}}" },
        full: { type: "text", label: "地名（固定地点）", section: "Location", default: "東京都 千代田区 千代田", readonlyExpr: "{{useCurrentLocation}}" },

        layoutId: { type: "select", label: "Layout", section: "Layout", default: "default",
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
    baseURL: "https://api.p2pquake.net/v2",
    endpoint: "history",
    useLocation: true,
    useLocationQuery: false,
//     locationQueryKey: "q",

    cache: {
      key: "history",
      minutes: "{{refreshMinutes}}",
      useCache: "{{useCacheData}}",
      forceRefreshInApp: "{{forceRefresh}}"
    },

    params: {
      codes: '551',
      limit: "{{limit}}"
    },
  
    dynamicParams: {}
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
        alt: this.config?.values?.alt ?? 3.5,
        full: this.config?.values?.full ?? "東京都 千代田区 千代田"
      }
    },

    cacheMinutes: 60
  },

  // ======================
  // getLayout
  // ======================
  getLayout(layoutId = "default") {

    const layouts = {

      default: {
        padding: pos(16, 13, 16, 13),
        url: "",

        blocks: [
          ...headerBlock,
          ...bodyBlock_small,
          ...bodyBlock_mediumUp,
          ...footerBlock
        ],

        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      weather: {
        padding: pos(16, 13, 16, 13),

        blocks: [
          ...headerBlock,
          ...bodyBlock_small,
          ...bodyBlock_mediumUp,
          ...footerBlock
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

    const cfg = core.profile?.getConfig()

    switch (info.action) {

      case "copyText": {

        const isNotif = cfg?.values?.useCopyTextNotification ?? false

        core.profile.setActive(info.profile)
        await core.buildContext()

        const text = info.text || core.pinText || ""
        if (text) {
          await core.textCopy(text, isNotif)
          App.close()
          return true
        }
      }

    }

  
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

    const {items, notifyTargets} = this.dataTransform(data, ctx)
    const meta = this.metaTransform(data, ctx, {items})
    const notifications = this.notificationTranceform(data, ctx, {notifyTargets, meta})

    return {
      items,
      ...flatObj(meta),
      notifications
    }
  },

  // =========================
  // dataTransform
  // =========================
  dataTransform(data, ctx) {

    const v = ctx?.config?.values ?? {}
    const env = ctx?.env ?? {}
    const runtime = ctx?.runtime ?? {}

    const list = (data ?? [])
      .filter(d =>
        d?.code === 551 &&
        d?.issue?.type === "DetailScale"
      )

    // 重複除去
    const deduped = dedupeLatest(list)

    // point絞り
    const location = locationTransform(ctx)
    const filtered = deduped.map(eq => pickPoint(eq, location))

    // 最終ソート
    const sorted = filtered.sort((a, b) =>
      new Date(b.time) - new Date(a.time)
    )

    // 最終件数制限（ここだけでOK）
    const sliced = sorted.slice(0, v.displayCount ?? 9)

    // PIN止め用item
    const pinned =
      sliced.find(eq => isImportant(eq, v)) ||
      sliced[0] ||
      null

    // items生成
    const items = sliced.map((eq, idx) => {

      const isPinned = (eq === pinned)

      const p = eq.points?.[0] ?? {}

      const badge = isPinned ? "●" : ""
      const place = eq.earthquake?.hypocenter?.name ?? ""

      const time = eq.earthquake?.time ?? new Date()
      const timeAgo = formatTimeAgo(new Date(time))
      const timeRaw = time
        ? formatTime(
          Math.floor(new Date(time) / 1000),
          "yyyy年MM月dd日 HH時mm分頃"
        )
        : ""
      const timeStr = time
        ? formatTime(
          Math.floor(new Date(time) / 1000),
          "dd日 HH:mm"
        )
        : ""

      const maxScale = eq.earthquake?.maxScale ?? null
      const localScale = p?.scale ?? null

      const lat = eq.earthquake?.hypocenter?.latitude
      const lon = eq.earthquake?.hypocenter?.longitude

      const distance = (lat && lon && runtime?.location?.lat)
        ? calcDistanceKm(runtime?.location?.lat, runtime?.location?.lon, lat, lon)
        : null
      const distanceStr = distance ? `${distance}` : "--"
      const depth = eq.earthquake?.hypocenter?.depth ?? null
      const depthStr = depth ? `${depth}` : "--"
      const magnitude = eq.earthquake?.hypocenter?.magnitude ?? null
      const magnitudeStr = magnitude ? `${magnitude}` : "--"

      const [maxColor, maxShindo] = maxScale != null
        ? colorByThreshold(
          maxScale,
          SCALE_THRESHOLDS.shindo,
          SCALE_THRESHOLDS.def
        )
        : [Color.darkGray().hex, "0"]

      const [localColor, localShindo] = localScale != null
        ? colorByThreshold(
          localScale,
          SCALE_THRESHOLDS.shindo,
          SCALE_THRESHOLDS.def
        )
        : [Color.darkGray().hex, "0"]

      const tsunami = eq.earthquake?.domesticTsunami ?? ""
      const tsunamiStr = domesticTsunamiStr(tsunami)
      const [tsunamiBadge, tsunamiBgColor, tsunamiColor] =
        ["Watch","Warning","MajorWarning"].includes(tsunami)
          ? ["⚠️", PALETTE.yellow, PALETTE.black]
          : ["", "", ""]

      return {
        index: idx + 1,
        id: eq.id,
        isPinned: isPinned,

        badge: badge,
        tsunamiStr: tsunamiStr,
        tsunamiBadge: tsunamiBadge,
        tsunamiBgColor: tsunamiBgColor,
        tsunamiColor: tsunamiColor,

        place: place,
        time: time,
        timeAgo: timeAgo,
        timeRaw: timeRaw,
        timeStr: timeStr,

        distance: distance,
        distanceStr: distanceStr,
        depth: depth,
        depthStr: depthStr,
        magnitude: magnitude,
        magnitudeStr: magnitudeStr,

        maxScale: maxScale,
        maxShindo: maxShindo,
        maxColor: maxColor,

        localScale: localScale,
        localShindo: localShindo,
        localColor: localColor,

        tsunami: tsunami,
        tsunamiStr: tsunamiStr
      }
    })

    // 通知対象
    const stateMap = ctx?.services?.notification?.getStateMap?.() ?? {}

    const notifyTargets = items.filter(eq => {
      if (!eq.isPinned) return false
      if (!isImportant(eq, v)) return false
      const gid = `eq_alert_${eq.id}`
      const state = stateMap[gid]
      return !state || (!state.hasSent && !state.hasPending)
    })

    return {
      items,
      notifyTargets
    }
  },

  // =========================
  // metaTransform
  // =========================
  metaTransform(data, ctx, {items}) {

    const v = ctx?.config?.values ?? {}
    const env = ctx?.env ?? {}
    const runtime = ctx?.runtime ?? {}
    const appId = env?.appId ?? "WidgetFramework"
    const storageType = env?.storageType ?? "****"

    const pinned = items.filter(eq => eq.isPinned)[0]
    const timeRaw = pinned?.time
        ? formatTime(
          Math.floor(new Date(pinned.time) / 1000),
          "HH:mm"
        )
        : ""
    const pinText = `${timeRaw} ${pinned.place} 最大震度${pinned.maxShindo}`
    if (ctx.services?.core) ctx.services.core.pinText = pinText

    // titl
    const titleStr = pinned?.timeAgo ?? ""

    // update
    const updateStr = formatTime(
      Math.floor(Date.now() / 1000),
      "HH時mm分"
    )

    // online
    const isOnline = runtime?.isOnline ?? false
    const onlineIcon = {
      name: "location.fill",
      color: "#d1cdda",
      opacity: isOnline ? 1.0 : 0.5
    }

    // ui
    const levelMap = {
      small: 1,
      medium: 2,
      large: 3,
      extraLarge: 4
    }
    const level = levelMap[env?.size] ?? 2
    const ui = {
      isSmall: level === 1,
      isMediumUp: level >= 2,
      isLargeUp: level >= 3,
      isExtraLarge: level === 4,

      showForecast: level >= 2 && v.showStorageType,
      showDetail: level >= 3,
      isSpacer: items.length < v.displayCount ?? 9
    }

    // location
    const location = locationTransform(ctx)

    // メタ情報
    const meta = {
      header: {
        titleStr: titleStr
      },
      body: {
        
      },
      footer: {
        storageType: storageType,
        updateStr: updateStr
      },

      pinned: pinned,
      pinText: pinText,

      isOnline: isOnline,
      onlineIcon: onlineIcon,
      location: location,
      ui: ui
    }

    return meta
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
  notificationTranceform(data, ctx, {notifyTargets, meta}) {

    const v = ctx?.config?.values ?? {}

    const notifications = notifyTargets.map(eq => {

      return {
        id: `eq_alert_${eq.id}`,
        delay: 5000,
        title: `${eq.place}（${eq.distanceStr}km）最大震度${eq.maxShindo}`,
        body: `${eq.timeRaw}`,
        cooldown: v.notifyCooldown ?? 300000,
        meta: {
          action: "openPreview",
          lp_type: "list",
          lp_items: [
            {
              text: `津波：${eq.tsunamiBadge}${eq.tsunamiStr}`,
              fontSize: 16,
              bold: true,
              color: "#ffffff",
              bgColor: eq.tsunamiLevel === "warning" ? "#b00020" : "#333333",
              align: "center"
            }
          ]
        }
      }})

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
        alt: 3.5,
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
    const location = locationTransform(ctx)

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
// locationTransform
// ======================
function locationTransform(ctx) {
  const v = ctx?.config?.values ?? {}
  const runtime = ctx?.runtime ?? {}

  const lat = runtime?.location?.lat ?? null
  const lon = runtime?.location?.lon ?? null
  const alt = runtime?.location?.alt ?? null
  const address = runtime?.location?.full
    ? runtime.location.full.split(" ")
    : ["", "", ""]

  return {
    lat: lat,
    lon: lon,
    alt: alt,
    latStr: lat != null ? lat.toFixed(4) : "",
    lonStr: lon != null ? lon.toFixed(4) : "",
    altStr: alt != null ? alt.toFixed(1) : "",
    pref: address[0],
    city: address[1],
    town: address[2],
  }
}

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
// normalizeInfo
// ======================
function normalizeInfo(info, isLongPress) {

  if (isLongPress) {
    return {
      ...info,
      type: info.lp_type || info.type,
      items: info.lp_items || info.items
    }
  }

  return info
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
// colorByThreshold 
// ======================
function colorByThreshold(v, table, defaultColor) {
  for (const [limit, color] of table) {
    if (v >= limit) return color
  }
  return defaultColor
}

// ======================
// createEventKey 
// ======================
function createEventKey(eq) {

  const e = eq.earthquake || {}

  const t = (e.time || "").slice(0, 19)

  const name = (e.hypocenter?.name || "").replace(/\s/g, "")

  const lat = Number(e.hypocenter?.latitude?.toFixed(2) || 0)
  const lon = Number(e.hypocenter?.longitude?.toFixed(2) || 0)

  const depth = e.hypocenter?.depth ?? 0
  const mag = Number((e.hypocenter?.magnitude || 0).toFixed(1))

  return `${t}_${name}_${lat}_${lon}_${depth}_${mag}`
}

// ======================
// pickPoint 
// ======================
function pickPoint(eq, loc) {

  const points = eq?.points ?? []

  let filtered = points.filter(p => {
    const addr = (p.addr || "").replace(/\s/g, "")
    const city = (loc.city || "").replace(/\s/g, "")

    return addr.startsWith(city)
  })

  if (filtered.length === 0) {
    filtered = points.filter(p => p.pref === loc.pref)
  }

  return {
    ...eq,
    points: filtered.length ? [filtered[0]] : []
  }
}

// ======================
// dedupeLatest 
// ======================
function _dedupeLatest(list) {
  const map = new Map()

  for (const eq of list) {
    const prev = map.get(eq.id)

    if (!prev || new Date(eq.time) > new Date(prev.time)) {
      map.set(eq.id, eq)
    }
  }

  return Array.from(map.values())
}
function dedupeLatest(list) {

  const map = new Map()

  for (const eq of list) {

    const key = createEventKey(eq)

    const prev = map.get(key)

    if (!prev) {

      map.set(key, eq)

    } else {

      const prevTime = prev.timestamp?.register || ""
      const currTime = eq.timestamp?.register || ""

      if (currTime > prevTime) {
        map.set(key, eq)
      }

    }

  }

  return Array.from(map.values())
}

// ======================
// shouldNotify 
// ======================
// function shouldNotify(eq, v) {
//   const scale = eq.points?.[0]?.scale ?? 0
//   return scale >= (v.minScale ?? 0)
// }

// ======================
// calcDistanceKm 
// ======================
function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2

  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}

// ======================
// domesticTsunamiStr 
// ======================
function domesticTsunamiStr(tsunami) {
  var s = 'なし';
  if (tsunami == 'Unknown') s = '不明';
  if (tsunami == 'Checking') s = '調査中';
  if (tsunami == 'NonEffective') s = '若干の海面変動';
  if (tsunami == 'Watch') s = '津波注意報';
  if (tsunami == 'Warning') s = '津波警報';
  if (tsunami == 'MajorWarning') s = '大津波警報';
  return s;
}

// ======================
// isImportant 
// ======================
const PIN_TSUNAMI = ["Watch", "Warning", "MajorWarning"]

function isImportant(eq, v) {

  const maxScale =
    eq?.earthquake?.maxScale
    ?? eq?.maxScale
    ?? null
  const tsunami =
    eq?.earthquake?.domesticTsunami
    ?? eq?.domesticTsunami
    ?? ""

  const now = Date.now()
  const time =
    eq?.earthquake?.time
    ?? eq?.time
    ?? now

  const hours = v.pinHours ?? 6
  const eqTime = new Date(time).getTime()

  const withinTime = (now - eqTime) <= hours * 60 * 60 * 1000

  return (
    withinTime &&
    (
      maxScale >= (v.pinScale ?? 40) ||
      PIN_TSUNAMI.includes(tsunami)
    )
  )
}

// ======================
// formatTimeAgo 
// ======================
function formatTimeAgo(ts) {
  if (!ts) return ""

  const diff = Date.now() - ts
  const abs = Math.abs(diff)

  const sec = Math.floor(abs / 1000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)

  if (diff < 0) {
    if (sec < 60) return `${sec}秒後`
    if (min < 60) return `${min}分後`
    if (hour < 24) return `${hour}時間後`
    return `${day}日後`
  }

  if (sec < 60) return `${sec}秒前`
  if (min < 60) return `${min}分前`
  if (hour < 24) return `${hour}時間前`
  return `${day}日前`
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