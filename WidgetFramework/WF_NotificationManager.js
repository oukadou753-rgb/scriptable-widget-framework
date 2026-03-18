// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationManager
 * UTF-8 日本語コメント
 **/
module.exports = class WF_NotificationManager {

  constructor(appId, storage) {
    this.appId = appId
    this.storage = storage

    this.key = "wf_notifications"
    this.history = this._load()
  }

  // =========================
  // Public
  // =========================

  /**
   * 一度だけ通知（重複防止）
   * payload.cooldown により再通知を抑制
   */
  async notifyOnce(payload) {
    const id = payload.id
    if (!id) throw new Error("notifyOnce: payload.id is required")

    const last = this.history[id]?.lastSent
    const cooldown = payload.cooldown ?? 300_000 // デフォルト5分

    if (last && Date.now() - last < cooldown) return false

    await this._send(payload)
    return true
  }

  /**
   * 即時通知（重複なし制限なし）
   */
  async notify(payload) {
    await this._send(payload)
    return true
  }

  /**
   * 予約通知
   */
  async schedule(payload) {
    const id = payload.id
    if (!id) throw new Error("schedule: payload.id is required")
    if (!payload.date || !(payload.date instanceof Date)) throw new Error("schedule: payload.date must be Date")

    const n = this._createNotification(payload)
    n.identifier = id

    // Scriptable 1.7.19 互換
    if (typeof n.setTriggerDate === "function") {
      n.setTriggerDate(payload.date)
    } else {
      n.triggerDate = payload.date
    }

    await n.schedule()

    // history に記録（送信前の予約）
    this.history[id] = {
      lastSent: this.history[id]?.lastSent || null, // 即時通知用の lastSent を保持
      status: "pending",
      fireAt: payload.date.getTime(),
      title: payload.title || "",
      subtitle: payload.subtitle || "",
      body: payload.body || "",
      meta: payload.meta || {}
    }
    this._save()
    return true
  }

  /**
   * 通知削除（予約含む）
   */
  async remove(id) {
    await Notification.removePending([id])
    await Notification.removeDelivered([id])

    delete this.history[id]
    this._save()
  }

  /**
   * 全通知削除
   */
  async clearAll() {
    const ids = Object.keys(this.history)

    await Notification.removePending(ids)
    await Notification.removeDelivered(ids)

    this.history = {}
    this._save()
  }

  /**
   * 一覧取得（UI用）
   */
  list() {
    return this.history
  }

  // =========================
  // Private
  // =========================

  async _send(payload) {
    const id = payload.id
    if (!id) throw new Error("_send: payload.id required")

    const n = this._createNotification(payload)
    await n.schedule()

    // 送信後に lastSent を更新
    if (!this.history[id]) this.history[id] = {}
    this.history[id].lastSent = Date.now()
    this.history[id].status = "sent"
    this.history[id].title = payload.title || ""
    this.history[id].subtitle = payload.subtitle || ""
    this.history[id].body = payload.body || ""
    this.history[id].meta = payload.meta || {}

    this._save()
  }

  _createNotification(payload) {
    const n = new Notification()

    n.title = payload.title || ""
    n.subtitle = payload.subtitle || ""
    n.body = payload.body || ""

    if (payload.sound !== undefined) n.sound = payload.sound

    // Scriptable 起動 URL
    const params = payload.meta?.params || {}
    params.id = payload.id
    const query = Object.entries(params)
      .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
      .join("&")
    n.openURL = payload.meta?.url
      ? payload.meta.url
      : `scriptable:///run?scriptName=${encodeURIComponent(Script.name())}&${query}`

    // userInfo に payload.meta をそのまま渡す
    n.userInfo = {
      id: payload.id,
      ...payload.meta
    }

    return n
  }

  _load() {
    return this.storage.readJSON(this.key) || {}
  }

  _save() {
    this.storage.writeJSON(this.key, this.history)
  }
}