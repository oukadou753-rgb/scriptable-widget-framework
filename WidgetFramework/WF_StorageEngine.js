// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_StorageEngine
 * UTF-8 日本語コメント
 **/

// ======================
// Export
// ======================
module.exports = class WF_StorageEngine {

  constructor(appId, storageType) {

    this.appId = appId
    this.storageType = storageType

    this.initStorage()

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

    // Main Root
    this.root = this._ensureDirs(this.baseDir, "WF_Data", true)

    // App Root
    this.appRoot = this._ensureDirs(this.root, this.appId, true)

    // Sub Dir
    this.cacheRoot = this._ensureDirs(this.appRoot, "caches", true)
    this.profileRoot = this._ensureDirs(this.appRoot, "profiles", true)
    this.snapshotRoot = this._ensureDirs(this.appRoot, "snapshots", true)

    // System File
    this.activeFile = this._ensureDirs(this.appRoot, "active.txt", false)
    this.profilesFile = this._ensureDirs(this.appRoot, "profiles.json", false)

  }

  // =========================
  // _ensureDirs
  // =========================
  _ensureDirs(root, dir, isDir) {

    const path = this.fm.joinPath(root, dir)

    if (!this.fm.fileExists(path)) {
      if (isDir) this.fm.createDirectory(path)
    }

    return path

  }

  // =========================
  // get Path
  // =========================

  // =========================
  // get Path
  // =========================
  getActivePath() {

    return this.activeFile

  }

  // =========================
  // get Path
  // =========================
  getProfilesPath() {

    return this.profilesFile

  }

  // =========================
  // get Path
  // =========================
  getProfileDir(name) {

    if (!name) {
      console.warn("getProfileDir: name undefined")
      return null
    }

    return this.fm.joinPath(this.profileRoot, name)

  }

  // =========================
  // get Path
  // =========================
  getProfileConfigPath(name) {

    const dir = this.getProfileDir(name)

    if (!dir) return null

    if (!this.fm.fileExists(dir)) {
      this.fm.createDirectory(dir)
    }

    return this.fm.joinPath(dir, "config.json")

  }

  // =========================
  // Basics IO
  // =========================

  // =========================
  // read
  // =========================
  read(path) {

    try {

      if (!path) {

        console.warn("READ: path undefined")
        return null

      }

      if (!this.fm.fileExists(path)) return null

      const txt = this.fm.readString(path)

      if (!txt || txt.trim() === "") return null
      if (txt === "undefined") return null

      return txt

    }

    catch (e) {

      console.warn("READ ERROR: " + e)
      return null

    }

  }

  // =========================
  // write
  // =========================
  write(path, content) {

    try {

      if (!path) {

        console.warn("WRITE: path undefined")
        return

      }

      // ディレクトリ保証
      const dir = path.split("/").slice(0, -1).join("/")

      if (!this.fm.fileExists(dir)) {
        this.fm.createDirectory(dir, true)
      }

      // undefined 防止
      if (content === undefined) {

        console.warn("WRITE BLOCKED: undefined " + path)
        return

      }

      if (content === null) {
        content = "null"
      }

      if (typeof content === "object") {

        try {

          content = JSON.stringify(content)

        }

        catch (e) {

          console.warn("STRINGIFY ERROR: " + e)
          return

        }

      }

      const str = String(content)

      if (str === "undefined") {

        console.warn("WRITE BLOCKED: string undefined " + path)
        return

      }

      this.fm.writeString(path, str)

    }

    catch (e) {

      console.warn("WRITE ERROR: " + e)

    }

  }

  // =========================
  // remove
  // =========================
  remove(path) {

    try {

      if (path && this.fm.fileExists(path)) {
        this.fm.remove(path)
      }

    }

    catch (e) {

      console.warn("REMOVE ERROR: " +  e)

    }

  }

  // =========================
  // exists
  // =========================
  exists(path) {

    if (!path) return false
    return this.fm.fileExists(path)

  }

  // =========================
  // getCachePath
  // =========================
  getCachePath(key) {

    return this.fm.joinPath(this.cacheRoot, key + ".json")

  }

  // =========================
  // renameProfile
  // =========================
  renameProfile(oldName, newName) {

    const oldDir = this.getProfileDir(oldName)
    const newDir = this.getProfileDir(newName)

    if (!oldDir || !newDir) return

    if (!this.fm.fileExists(oldDir)) return
    if (this.fm.fileExists(newDir)) return

    this.fm.move(oldDir, newDir)

  }

  // =========================
  // Snapshot
  // =========================

  // =========================
  // saveSnapshot
  // =========================
  saveSnapshot(name, data) {

    if (!name) return
    if (!data) return

    const path = this.fm.joinPath(
      this.snapshotRoot,
      name + ".json"
    )

    try {

      const safeData = JSON.parse(JSON.stringify(data))

      if (safeData.layout !== undefined) {

        delete safeData.layout

      }

      this.write(
        path,
        JSON.stringify(safeData, null, 2)
      )

    }

    catch (e) {

      console.warn("SNAPSHOT SAVE ERROR: " + e)
      console.warn("DATA: " + data)

    }

  }

  // =========================
  // listSnapshots
  // =========================
  listSnapshots() {

    if (!this.fm.fileExists(this.snapshotRoot)) return []

    return this.fm
      .listContents(this.snapshotRoot)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""))
  }

  // =========================
  // loadSnapshot
  // =========================
  loadSnapshot(name) {

    if (!name) return null

    const path = this.fm.joinPath(
      this.snapshotRoot,
      name + ".json"
    )

    const txt = this.read(path)

    if (!txt) return null

    try {

      return JSON.parse(txt)

    }

    catch {

      return null

    }

  }

  // =========================
  // JSON
  // =========================

  // =========================
  // writeJSON
  // =========================
  writeJSON(key, value) {

    const path = this.getCachePath(key)
    this.write(path, JSON.stringify(value))

  }

  // =========================
  // readJSON
  // =========================
  readJSON(key) {

    const path = this.getCachePath(key)
    const data = this.read(path)
    if (!data) return null
  
    try {

      return JSON.parse(data)

    }

    catch (e) {

      console.warn("JSON parse error: " + e)
      return null

    }

  }

}