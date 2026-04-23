// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * CF_JsonDataProvider
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = class CF_JsonDataProvider {

  constructor(key, storage) {
    this.storage = storage
    this.key = key
    this.history = this._load()
  }

  // =========================
  // UI 用一覧取得
  // =========================
  regist(payload, isSave = true) {
    if (!payload?.id) throw new Error(`${key}: payload.id is required`)
    this.history[payload.id] = {
      id: payload.id,
      date: payload.date,
      text: payload.text,
      meta: payload.meta
    }
    if(isSave) this._save()
  }
  
  list() {
    if (!this.history || typeof this.history !== "object") return []
    return Object.entries(this.history).map(([id, v]) => ({
      id,
      date: v?.date ?? id,
      text: v?.text ?? "",
      meta: v?.meta ?? {}
    })).sort()
  }

  // =========================
  // _load
  // =========================
  _load() {
    try {
      const json = this.storage.readJSON(this.key)
      return json.data && typeof json.data === "object" ? json.data : {}
    } catch {
      return {}
    }
  }

  // =========================
  // _save
  // =========================
  _save() {
    this._prune()
    const context = {
      data: this.history,
      timestamp: Date.now()
    }
    console.log(`Saved: ${this.key}.json`)
    this.storage.writeJSON(this.key, context)
  }

  // =========================
  // _getCacheSettings
  // =========================
  _getCacheSettings() {
    return {
      enabled: true,
      maxCount: 391
    }
  }

  // =========================
  // _prune
  // =========================
  _prune() {
    const settings = this._getCacheSettings()
    if (!settings.enabled) return
    let list = Object.entries(this.history)
    const now = Date.now()
    if (settings.maxCount > 0 && list.length > settings.maxCount) {
      list.sort((a, b) => {
        const va = a[0]
        const vb = b[0]
        return vb - va
      })
      const result = []
      for (const [key, v] of list) {
        if (result.length < settings.maxCount) {
          result.push([key, v])
        }
      }
      list = result
    }
    this.history = Object.fromEntries(list)
  }
}