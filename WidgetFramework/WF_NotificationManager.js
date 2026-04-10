// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationManager
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = class WF_NotificationManager {

  constructor(appId, storage, profile) {

    this.appId = appId
    this.storage = storage
    this.profile = profile

    this.key = "wf_notifications"
    this.history = this._load()

  }

  // =========================
  // Public
  // =========================

  // =========================
  // 一度だけ通知（重複防止）
  // payload: { id, title, subtitle?, body, delay?, cooldown?, meta? }
  // =========================
  async notifyOnce(payload) {

    if (!payload?.id) throw new Error("notifyOnce: payload.id is required")

    const uid = `${payload.id}_${Date.now()}`

    const cooldown = payload.cooldown ?? 300_000
    const last = Object.values(this.history)
      .filter(v => v.groupId === payload.id && v.lastSent)
      .sort((a, b) => b.lastSent - a.lastSent)[0]?.lastSent

    if (last && Date.now() - last < cooldown) return false

    if (payload.delay) {
  
      const fireDate = new Date(Date.now() + payload.delay)
      await this.schedule(payload.id, fireDate, payload)

    }

    else {

      await this._send(payload)

      this.history[uid] = {
        groupId: payload.id,
        lastSent: Date.now(),
        status: "sent",
        title: payload.title,
        subtitle: payload.subtitle,
        body: payload.body
      }

      this._save()

    }

    return true

  }

  // =========================
  // 即時通知（delay があれば予約として扱う）
  // =========================
  async notify(payload) {

    if (payload.delay) {

      const fireDate = new Date(Date.now() + payload.delay)
      await this.schedule(payload.id || `temp_${Date.now()}`, fireDate, payload)

    } else {

      await this._send(payload)

    }

    return true

  }

  // =========================
  // 予約通知
  // =========================
  async schedule(id, date, payload) {

    if (!id) throw new Error("schedule: id is required")

    const cooldown = payload.cooldown ?? 0

    const last = Object.values(this.history)
      .filter(v => v.groupId === id && v.lastSent)
      .sort((a, b) => b.lastSent - a.lastSent)[0]?.lastSent

    if (last && Date.now() - last < cooldown) return false

    // ★ pending削除（JSON）
    for (const key in this.history) {

      const item = this.history[key]

      if (item.groupId === id && item.status === "pending") {

        delete this.history[key]

      }

    }

    // ★ iOS削除
    await Notification.removePending([id])

    const n = this._createNotification(payload)
    n.identifier = id

    if (typeof n.setTriggerDate === "function") {

      n.setTriggerDate(date)

    }

    else {

      n.triggerDate = date

    }

    await n.schedule()

    // ★ id固定保存
    this.history[id] = {
      groupId: id,
      fireAt: date.getTime(),
      status: "pending",
      title: payload.title,
      subtitle: payload.subtitle,
      body: payload.body,
      meta: payload.meta
    }

    this._save()

    return true

  }

  // =========================
  // 削除（予約含む）
  // =========================
  async remove(id) {

    if (!id) return false

    try {

      await Notification.removePending([id])
      await Notification.removeDelivered([id])

    }

    catch (e) {}

    // ★ groupIdで全削除
    let changed = false

    for (const key in this.history) {
  
      if (this.history[key].groupId === id) {
  
        delete this.history[key]
        changed = true
  
      }
  
    }

    if (changed) this._save()

    return true

  }

  // =========================
  // 全削除
  // =========================
  async clearAll() {

    const ids = Object.keys(this.history)
    await Notification.removePending(ids)
    await Notification.removeDelivered(ids)

    this.history = {}
    this._save()

  }

  // =========================
  // UI 用一覧取得
  // =========================
  list() {

    this.syncStatus()

    if (!this.history || typeof this.history !== "object") return []

    return Object.entries(this.history).map(([id, v]) => ({
      id,
      groupId: v?.groupId ?? id,
      title: v?.title ?? "",
      subtitle: v?.subtitle ?? "",
      body: v?.body ?? "",
      status: v?.status ?? "unknown",
      fireAt: v?.fireAt ?? null,
      lastSent: v?.lastSent ?? null,
      meta: v?.meta ?? {}
    }))

  }

  // =========================
  // getUIList
  // =========================
  getUIList(type = "all") {

    this.syncStatus()

    let list = this.list().map(item => {
      const now = Date.now()

      const isExpired =
        item.status === "pending" &&
        item.fireAt &&
        item.fireAt < now

      return {
        ...item,
        date: item.fireAt || item.lastSent || null,
        isExpired,
        isPending: item.status === "pending",
        isSent: item.status === "sent"
      }
    })

    if (type === "scheduled") {

      list = list.filter(v => v.isPending)
      list.sort((a, b) => (a.date || 0) - (b.date || 0))

    }

    if (type === "history") {

      list = list.filter(v => v.isSent)
      list.sort((a, b) => (b.date || 0) - (a.date || 0))

    }

    return list

  }

  // =========================
  // getScheduled
  // =========================
  getScheduled() {

    return this.list().filter(v => v.status === "pending")

  }

  // =========================
  // getHistory
  // =========================
  getHistory() {

    return this.list().filter(v => v.status === "sent")

  }

  // =========================
  // refresh
  // =========================
  refresh() {

    this.history = this._load()

    const before = JSON.stringify(this.history)

    this._prune()
    this.syncStatus()

    if (JSON.stringify(this.history) !== before) {
      this._save()
    }

  }

  // =========================
  // removeAndRefresh
  // =========================
  async removeAndRefresh(id) {

    await this.remove(id)
    this.refresh()

  }

  // =========================
  // syncStatus
  // =========================
  syncStatus() {

    const now = Date.now()
    let changed = false

    for (const id in this.history) {

      const item = this.history[id]

      if (item.status === "pending" && item.fireAt && item.fireAt <= now) {

        item.status = "sent"
        item.lastSent = item.fireAt
        changed = true

      }
    
    }

    if (changed) this._save()

  }

  // =========================
  // getStateMap
  // =========================
  getStateMap() {

    const map = {}

    for (const v of Object.values(this.history)) {

      const gid = v.groupId

      if (!gid) continue

      if (!map[gid]) {

        map[gid] = {
          hasPending: false,
          hasSent: false,
          pendingAt: null,
          lastSentAt: null
        }

      }

      // pending
      if (v.status === "pending") {

        map[gid].hasPending = true

        if (
          !map[gid].pendingAt ||
          v.fireAt > map[gid].pendingAt
        ) {

          map[gid].pendingAt = v.fireAt

        }

      }

      // sent
      if (v.status === "sent") {

        map[gid].hasSent = true

        if (
          !map[gid].lastSentAt ||
          v.lastSent > map[gid].lastSentAt
        ) {

          map[gid].lastSentAt = v.lastSent

        }

      }

    }

    return map

  }

  // =========================
  // Private
  // =========================

  // =========================
  // _send
  // =========================
  async _send(payload) {

    const n = this._createNotification(payload)

    if (payload.id) {

      n.identifier = payload.id

    }

    await n.schedule()

    const uid = `${payload.id}_${Date.now()}`

    if (payload?.id) {

      this.history[uid] = {
        groupId: payload.id, // ★修正
        lastSent: Date.now(),
        status: "sent",
        title: payload.title,
        subtitle: payload.subtitle,
        body: payload.body,
        meta: payload.meta
      }

      this._save()

    }

  }

  // =========================
  // _createNotification
  // =========================
  _createNotification(payload) {

    const n = new Notification()

    n.title = payload.title || ""
    n.subtitle = payload.subtitle || ""
    n.body = payload.body || ""
    if (payload.sound !== undefined) n.sound = payload.sound

    const scriptName = Script.name()

    // =========================
    // ★ 長押しUI有効化（最重要）
    // =========================
    n.identifier = `_${scriptName}_${payload.id || ""}`
    n.scriptName = scriptName
    n.threadIdentifier = scriptName

    // =========================
    // Scriptable 起動 URL（タップ用）
    // =========================
    if (payload.id) {

      const toQuery = (obj) =>
        Object.entries(obj)
          .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
          .join("&")

      n.openURL = `scriptable:///run?scriptName=${encodeURIComponent(
        scriptName
      )}&${toQuery({
        id: payload.id,
        appId: this.appId
      })}`

    }

    // =========================
    // userInfo（meta）
    // =========================
    const meta = {}

    for (const k in payload.meta || {}) {
      const v = payload.meta[k]

      // 配列・オブジェクトは文字列化
      if (typeof v === "object") {
        meta[k] = JSON.stringify(v)
      } else {
        meta[k] = v
      }
    }

    n.userInfo = { id: payload.id, ...meta }

    return n
  }

  // =========================
  // _load
  // =========================
  _load() {

    try {

      const data = this.storage.readJSON(this.key)
      const history = data && typeof data === "object" ? data : {}

      this.history = history
      this._prune()

      return this.history

    }

    catch {

      return {}

    }

  }

  // =========================
  // _save
  // =========================
  _save() {

    this._prune()
    this.storage.writeJSON(this.key, this.history)

  }

  // =========================
  // _getCacheSettings
  // =========================
  _getCacheSettings() {

    const v = this.profile?.getConfig().values || {}

    return {
      enabled: v.notifyCacheEnabled ?? true,
      maxCount: v.notifyCacheMaxCount ?? 50,
      maxAgeMs: (v.notifyCacheMaxHours ?? 24) * 60 * 60 * 1000
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

    // =========================
    // 期間制限
    // =========================
    if (settings.maxAgeMs > 0) {

      list = list.filter(([_, v]) => {

        // ★ 予約は削除しない
        if (v.status === "pending") return true

        // ★ Pinnedは削除しない
        if (v.meta?.isPinned) return true

        const t = v.lastSent || v.fireAt
        if (!t) return true

        return (now - t) <= settings.maxAgeMs
      })
    }

    // =========================
    // 件数制限
    // =========================
    if (settings.maxCount > 0 && list.length > settings.maxCount) {

      // 並び替え（新しい順）
      list.sort((a, b) => {

        const va = a[1]
        const vb = b[1]

        const ta = va.lastSent || va.fireAt || 0
        const tb = vb.lastSent || vb.fireAt || 0

        return tb - ta
      })

      const result = []

      for (const [key, v] of list) {

        // ★ pendingは必ず残す
        if (v.status === "pending") {
          result.push([key, v])
          continue
        }

        // ★ pinnedは必ず残す
        if (v.meta?.isPinned) {
          result.push([key, v])
          continue
        }

        // 通常枠
        if (result.length < settings.maxCount) {
          result.push([key, v])
        }

      }

      list = result
    }

    this.history = Object.fromEntries(list)
  }

}