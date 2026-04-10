// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: download;
/**
 * Main
 * UTF-8 日本語コメント
 * 2026/04/11 00:10
 */

const DEFAULT_APP_ID = "Weather"
const DEFAULT_STRAGE_TYPE = "local"

const APP_DEV_MODE = true
const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"
const APP_CONFIG = `App_${APP_ID}Config`

const WF_MODULE_DIR = "WidgetFramework/"
const WF_REPO = "oukadou753-rgb/scriptable-widget-framework"

const APP_INFO = {
  debug: APP_DEV_MODE,
  id: APP_ID,
  version: APP_VERSION,
  storageType: DEFAULT_STRAGE_TYPE,
  moduleDir: WF_MODULE_DIR,
  frameworkRepo: WF_REPO,
}

module.exports = {
  
  // =========================
  // start
  // =========================
  async start(appInfo = APP_INFO) {

    try {

      // =========================
      // ★ runtime取得（最優先）
      // =========================
      let notifParam = args.notification?.userInfo || {}

      let shortcutParam = {}

      try {
        shortcutParam =
          typeof args.shortcutParameter === "string"
            ? JSON.parse(args.shortcutParameter)
            : args.shortcutParameter || {}
      } catch {}

      const runtime = {
        ...notifParam,
        ...shortcutParam,
        ...(args.queryParameters || {})
      }

      // =========================
      // ★ appId上書き
      // =========================
      if (runtime.appId) {
        this.setAppInfo("id", runtime.appId)
      }

      // =========================
      // Notification
      // =========================
      if (config.runsInNotification) {
        await handleNotificationUI(runtime)
        return
      }

      appInfo.appConfig = `App_${appInfo.id}Config`

      const modules = {
        WF_StorageEngine: { type: "both", path: WF_MODULE_DIR },
        WF_DataProvider: { type: "both", path: WF_MODULE_DIR },
        WF_ProfileEngine: { type: "both", path: WF_MODULE_DIR },
        WF_WidgetRenderer: { type: "both", path: WF_MODULE_DIR },
        WF_NotificationManager: { type: "both", path: WF_MODULE_DIR },
        WF_CoreBase: { type: "both", path: WF_MODULE_DIR },

        WF_MenuEngine: { type: "app", path: WF_MODULE_DIR },
        WF_NotificationHandlers: { type: "app", path: WF_MODULE_DIR },

        WF_TableUI: { type: "app", path: WF_MODULE_DIR },
        WF_ConfigUI: { type: "app", path: WF_MODULE_DIR },
        WF_NotificationUI: { type: "app", path: WF_MODULE_DIR },

        WF_AppCore: { type: "app", path: WF_MODULE_DIR },
        WF_WidgetCore: { type: "widget", path: WF_MODULE_DIR },

        [appInfo.appConfig]: { type: "both", path: "" },
      }

      const core = await this.init(appInfo, modules)

      // =========================
      // Shortcut
      // =========================
      if (runtime.mode === "buildContext") {
        const cfg = core.profile.getConfig()
        cfg.values.forceRefresh = runtime.forceRefresh ?? true
        await core.buildContext({ cfg }) // await core.getDataProvider().fetchAll(core.appConfig.api)
        return
      }

      // =========================
      // 通常処理
      // =========================
      await core.start()

    } catch(e) {

      this.catch(e)

    } finally {

      this.terminate()

    }

  },

  // =========================
  // init
  // =========================
  async init(appInfo, modules) {

    const ModuleLoader = importModule("ModuleLoader")
    const moduleLoader = new ModuleLoader(appInfo.storageType)

    let obj = {}

    for (key in modules) {

      const value = modules[key]
      const path = value.path + key
      const type = value.type

      if (this.isImport(type)) {
        obj[key] = moduleLoader.load(path)
      }

    }

    if (obj[appInfo.appConfig].version)
      appInfo.version = obj[appInfo.appConfig].version

    if (config.runsInWidget) {
      return new obj.WF_WidgetCore(appInfo, obj[appInfo.appConfig], obj)
    } else {
      return new obj.WF_AppCore(appInfo, obj[appInfo.appConfig], obj)
    }

  },

  // =========================
  // catch
  // =========================
  catch(e) {

    console.error(e.message)
    errorWidget(e)

  },

  // =========================
  // terminate
  // =========================
  terminate() {

    Script.complete()

  },

  // =========================
  // isImport
  // =========================
  isImport(type) {
    if (config.runsInWidget) {
      if(type == "widget" || type == "both") return true
    } else {
      if(type == "app" || type == "both") return true
    }
    return false
  },

  // =========================
  // setAppInfo
  // =========================
  setAppInfo(key, values) {

    APP_INFO[key] = values

  }

}

// =========================
// errorWidget
// =========================
function errorWidget(e) {

  const color = [ Color.black(), Color.red() ]
  const bgColor = Color.yellow()

  let w = new ListWidget()
  w.setPadding(10, 10, 10, 10)
  w.backgroundColor = bgColor

  addText(w, "WidgetFramework", Font.semiboldSystemFont(13), color[0], "left")
  w.addSpacer()
  addText(w, "Script Stopped", Font.boldSystemFont(18), color[0], "center")
  w.addSpacer(10)
  addText(w, e.message, Font.boldSystemFont(16), color[1], "center")
  if (e.stack) {
    w.addSpacer(6)
    addText(w, e.stack.slice(0, 120), Font.systemFont(10), color[1], "left")
  }
  w.addSpacer()
  addText(w, APP_INFO.storageType + " " + new Date().toLocaleTimeString(), Font.semiboldSystemFont(11), color[1], "right")

  if (config.runsInWidget) Script.setWidget(w)
  else w.presentLarge()

}

// =========================
// addText
// =========================
function addText(w, text, font, color, aling) {

  let t = w.addText(text)
  if (font) t.font = font
  if (color) t.textColor = color
  if (aling == "right") t.rightAlignText()
  else if (aling == "center") t.centerAlignText()

}

// =========================
// handleNotificationUI
// =========================
async function handleNotificationUI(info) {

  if (info.lp_type === "image") {

    let img

    if (info.src?.startsWith("http")) {
      const req = new Request(info.src)
      img = await req.loadImage()
    } else {
      img = Image.fromFile(info.src)
    }

    if (img) QuickLook.present(img)
    return
  }

  if (info.lp_type === "list") {

    const items = JSON.parse(info.lp_items || "[]")

    const table = new UITable()

    for (const v of items) {

      const row = new UITableRow()
      const text = row.addText(String(v.text || ""))

      if (v.color)
        text.titleColor = new Color(v.color)

      if (v.bgColor)
        row.backgroundColor = new Color(v.bgColor)

      if (v.fontSize)
        text.titleFont = Font.systemFont(Number(v.fontSize))

      if (v.align)
        text.centerAligned()

      row.height = v.height || 44

      table.addRow(row)
    }

    await table.present()
    return

  }

}

// =========================
// Module Test
// =========================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '')
if (module_name == Script.name()) {
  (async() => {
    await module.exports.start()
  })()
}