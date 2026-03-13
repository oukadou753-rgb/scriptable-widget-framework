// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: download;
/**
 * Main
 **/
const DEFAULT_APP_ID = "Weather"
const DEFAULT_STRAGE_TYPE = "icloud" // "icloud", "local", "bookmark"

const APP_DEV_MODE = false
const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"

const APP_INFO = {
  debug: APP_DEV_MODE,
  id: APP_ID,
  version: APP_VERSION,
  storageType: DEFAULT_STRAGE_TYPE,
}

const ModuleLoader = importModule("ModuleLoader")
const moduleLoader = new ModuleLoader(DEFAULT_STRAGE_TYPE)

// =========================
// Export
// =========================
const Main = {

  // =========================
  // loadAppConfig
  // =========================
  loadAppConfig(appId) {

    try {

      return importModule(`App_${appId}Config`)

    } catch (e) {

      console.error(`App config not found: ${appId}`)
      return importModule(`WidgetFramework/App_${DEFAULT_APP_ID}Config`)

    }
  },

  // =========================
  // start
  // =========================
  async start(storageType) {

    APP_INFO.storageType = storageType
    const APP_CONFIG = Main.loadAppConfig(APP_ID)

    try {

      const WF_StorageEngine = moduleLoader.load("WidgetFramework/WF_StorageEngine")
      const WF_WidgetRenderer = moduleLoader.load("WidgetFramework/WF_WidgetRenderer")
      const WF_ProfileEngine = moduleLoader.load("WidgetFramework/WF_ProfileEngine")
      const WF_DataProvider = moduleLoader.load("WidgetFramework/WF_DataProvider")
      const WF_CoreBase = moduleLoader.load("WidgetFramework/WF_CoreBase")

      if ((config.runsInWidget && !config.runsInApp)) {

        const WF_WidgetCore = moduleLoader.load("WidgetFramework/WF_WidgetCore")

        const MODULE_CACHE = {
          ModuleLoader,
          moduleLoader,

          WF_StorageEngine,
          WF_WidgetRenderer,
          WF_ProfileEngine,
          WF_DataProvider,
          WF_CoreBase,
          WF_WidgetCore
        }

        const widgetCore = new WF_WidgetCore(APP_INFO, APP_CONFIG, MODULE_CACHE)
        await widgetCore.start();

      } else {

        const WF_MenuEngine = moduleLoader.load("WidgetFramework/WF_MenuEngine")
        const WF_ConfigUI = moduleLoader.load("WidgetFramework/WF_ConfigUI")

        const WF_AppCore = moduleLoader.load("WidgetFramework/WF_AppCore")

        const MODULE_CACHE = {
          ModuleLoader,
          moduleLoader,

          WF_StorageEngine,
          WF_WidgetRenderer,
          WF_MenuEngine,
          WF_ProfileEngine,
          WF_ConfigUI,
          WF_DataProvider,
          WF_CoreBase,
          WF_AppCore
        }

        const appCore = new WF_AppCore(APP_INFO, APP_CONFIG, MODULE_CACHE)
        await appCore.start()

      }
      
    } catch(e) {

      console.error("Error: " + e.message)
      this.errorWidget(e)

    } finally {

      Script.complete()

    }
  },

  // =========================
  // errorWidget
  // =========================
  errorWidget(e) {

    const color = [ Color.yellow(), Color.black(), Color.red() ]

    let w = new ListWidget()
    w.setPadding(10, 10, 10, 10)
    w.backgroundColor = color[0]

    this._addText(w, "WidgetFramework", Font.semiboldSystemFont(13), color[1], "left")
    w.addSpacer()
    this._addText(w, "Script Stopped", Font.boldSystemFont(18), color[1], "center")
    w.addSpacer(10)
    this._addText(w, e.message, Font.boldSystemFont(16), color[2], "center")
    w.addSpacer()
    this._addText(w, new Date().toLocaleString(), Font.semiboldSystemFont(11), color[1], "right")

    if (config.runsInWidget) Script.setWidget(w)
    else w.presentLarge()
  },

  // =========================
  // _addText
  // =========================
  _addText(w, text, font, color, aling) {

    let t = w.addText(text)
    if (font) t.font = font
    if (color) t.textColor = color
    if (aling == "right") t.rightAlignText()
    else if (aling == "center") t.centerAlignText()
  }

}

module.exports = Main

// =========================
// Module Test
// =========================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    console.log("USING: " + DEFAULT_STRAGE_TYPE)
    await Main.start(DEFAULT_STRAGE_TYPE)
  })()
}