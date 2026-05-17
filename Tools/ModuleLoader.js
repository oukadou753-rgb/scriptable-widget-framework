// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * ModuleLoader
 * UTF-8 日本語コメント
 * 2026/05/17 09:00
 **/

// =========================
// Export
// =========================
module.exports = class ModuleLoader {

  constructor(storageType = "local", debug = false) {

    this.storageType = storageType
    this.debug = debug
    this.cache = {}

    this.initStorage()

    console.log("MODULE LOADER" + "\n")
    if (this.debug) console.warn("DEBUG MODE: " + this.debug)
    console.log("STORAGE: " + this.storageType)
    console.log("BASE: " + this.baseDir + "\n")

  }

  // =========================
  // load module
  // =========================
  load(path) {

    // =========================
    // キー正規化（超重要）
    // =========================
    const key = String(path).replace(/\.js$/, "")

    // =========================
    // cache hit
    // =========================
    if (this.cache[key]) {
      return this.cache[key]
    }

    let module

    try {

      // =========================
      // フルパス解決
      // =========================
      const fullPath = this.getFilePath(key)

      // =========================
      // import
      // =========================
      module = importModule(fullPath)

      if (module) {
        console.log("ModuleLoader: " + key)
      }

    }

    catch (e) {

      // =========================
      // fallback（直接import）
      // =========================
      try {

        module = importModule(key)

        if (module) {
          console.warn("importModule fallback: " + key)
        }

      }

      catch (e2) {

        console.warn("Module load failed: " + key)
//         throw new Error("Module load failed: " + key)

      }

    }

    // =========================
    // cache保存（必ず）
    // =========================
    this.cache[key] = module

    return module
  }

  // =========================
  // resolve path
  // =========================
  getFilePath(path) {

    const file = path.endsWith(".js") ? path : path + ".js"

    const fullPath = this.fm.joinPath(this.baseDir, file)

    if (!this.fm.fileExists(fullPath)) {

      throw new Error("Module not found:\n" + fullPath)

    }

    // iCloud auto download
    if (this.storageType === "icloud") {

      if (!this.fm.isFileDownloaded(fullPath)) {

        this.fm.downloadFileFromiCloud(fullPath)

      }

    }

    return fullPath

  }

  // =========================
  // initStorage
  // =========================
  initStorage(){

    switch (this.storageType) {

      case "icloud":
        this.fm = FileManager.iCloud()
        this.baseDir = this.fm.documentsDirectory()
        break

      case "bookmark":
        this.fm = FileManager.local()
        this.baseDir = this.fm.bookmarkedPath("Scriptable")
        break

      default:
        this.fm = FileManager.local()
        this.baseDir = this.fm.documentsDirectory()

    }

    this._ensureDirs()

  }
  
  // =========================
  // _ensureDirs
  // =========================
  _ensureDirs() {

  }

  // =========================
  // static shortcut
  // =========================
  static import(path, storageType = "local") {

    const loader = new ModuleLoader(storageType)

    return loader.load(path)
  }

}