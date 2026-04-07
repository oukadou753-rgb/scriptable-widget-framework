// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationUI
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = {

  // =========================
  // 状態
  // =========================
  view: "list",
  mode: "scheduled",
  currentItem: null,
  table: null,

  // =========================
  // present
  // =========================
  async present(core, options = {}) {

    this.core = core
    this.tableUI = core.tableUI

    const table = new UITable()
    table.showSeparators = true
    table.dismissOnSelect = false

    this.table = table

    this.view = "list"
    this.currentItem = null

    if (options.mode) {

      this.mode = options.mode

    }

    if (options.openId) {

      const item = core.notification
        .getUIList("all")
        .find(v => v.id === options.openId)

      if (item) {

        this.view = "detail"
        this.currentItem = item

      }

    }

    await this.createTable(table, core)
    await table.present(true)

  },

  // =========================
  // createTable
  // =========================
  async createTable(table, core) {

    table.removeAllRows()

    core.notification.refresh()

    if (this.view === "list") {

      const list = this.getList(core)

      this.renderTabs(table, core)
      this.renderCount(table, list)
      this.renderList(table, list, core)
      this.renderFooter(table, core)

    }

    if (this.view === "detail") {

      this.renderDetail(table, core)

    }

    table.reload()

  },

  // =========================
  // 共通部品
  // =========================

  // =========================
  // データ取得
  // =========================
  getList(core) {

    if (this.mode === "history") {

      return core.notification.getUIList("history")

    }

    return core.notification.getUIList("scheduled")

  },

  // =========================
  // タブ
  // =========================
  renderTabs(table, core) {

    table.addRow(this.tableUI.createButtonRow([
      {
        label: this.mode === "scheduled" ? "●予定" : "予定",
        onTap: async () => {

          this.mode = "scheduled"
          await this.reload(core)

        }

      },
      {
        label: this.mode === "history" ? "●履歴" : "履歴",
        onTap: async () => {

          this.mode = "history"
          await this.reload(core)

        }

      },
      {
        label: "↺",
        onTap: async () => {

          await this.reload(core)

        }

      }
    ]).row)

  },

  // =========================
  // 件数
  // =========================
  renderCount(table, list) {
    table.addRow(this.tableUI.createKeyValueRow("件数", list.length).row)

  },

  // =========================
  // リスト
  // =========================
  renderList(table, list, core) {

    if (!Array.isArray(list) || list.length === 0) {

      table.addRow(this.tableUI.createKeyValueRow("状態", "通知はありません").row)
      return

    }

    list.sort((a, b) => {

      if (a.meta?.isPinned && !b.meta?.isPinned) return -1
      if (!a.meta?.isPinned && b.meta?.isPinned) return 1
      return (b.date || 0) - (a.date || 0)

    })

    for (const item of list) {

      const { row, left, right } = this.tableUI.createListRow({
        title: `${item.title || ""}${item.subtitle ? "\n" + item.subtitle : ""}`,
        subtitle: `${item.body || ""}`,
        rightTitle: this.formatTimeAgo(item.date),
        rightSubtitle: this.formatDate(item.date)
      })

      if (item.meta?.isPinned) {
        left.titleColor = Color.orange()
      }

      if (item.isExpired) {
        left.titleColor = Color.gray()
      }

      row.onSelect = async () => {
        this.view = "detail"
        this.currentItem = item
        await this.reload(core)
      }

      table.addRow(row)

    }

  },

  // =========================
  // 詳細
  // =========================
  renderDetail(table, core) {
  
    const item = this.currentItem
    if (!item) return

    // 戻る
    table.addRow(this.tableUI.createButtonRow([
      {
        label: "← 一覧",
        onTap: async () => {

          this.view = "list"
          this.currentItem = null
          await this.reload(core)

        }

      }
    ]).row)

    // 内容
    table.addRow(this.tableUI.createKeyValueRow("Title", item.title).row)

    if (item.subtitle) {
  
      table.addRow(this.tableUI.createKeyValueRow("Subtitle", item.subtitle).row)

    }

    if (item.body) {
  
      const lineCount = (item.body.match(new RegExp("\n", "g")) || []).length + 1
      const { row } = this.tableUI.createKeyValueRow("Body", item.body)
      row.height = Math.ceil((16 * 1.6) * lineCount)
      table.addRow(row)

    }

    table.addRow(this.tableUI.createKeyValueRow(
      "状態",
      item.isPending ? "予約中" : "送信済み"
    ).row)

    table.addRow(this.tableUI.createKeyValueRow(
      "Pinned",
      item.meta?.isPinned ? "ON" : "OFF"
    ).row)

    table.addRow(this.tableUI.createKeyValueRow(
      "時刻",
      this.formatDate(item.date)
    ).row)

    table.addRow(this.tableUI.createSpacer(16))

    // Pin / Unpin / 削除
    table.addRow(this.tableUI.createButtonRow([
      {
        label: item.meta?.isPinned ? "Unpin" : "Pin",
        onTap: async () => {

          await this.togglePin(item, core)

        }
      },
      {
        label: "削除",
        onTap: async () => {

          await core.notification.remove(item.id)
          this.view = "list"
          await this.reload(core)

        }

      }
    ]).row)

    // スヌーズ
    if (item.isPending) {
  
      table.addRow(this.tableUI.createButtonRow([
        {
          label: "+5分",
          onTap: async () => {
    
            await this.snooze(item, core, 5 * 60 * 1000)

          }

        },
        {
          label: "+1時間",
          onTap: async () => {

            await this.snooze(item, core, 60 * 60 * 1000)

          }

        },
        {
          label: "カスタム",
          onTap: async () => {

            await this.snoozeCustom(item, core)

          }

        }
      ]).row)

    }

  },

  // =========================
  // フッター
  // =========================
  renderFooter(table, core) {

    table.addRow(this.tableUI.createSpacer(16))

    table.addRow(
      this.tableUI.createButtonRow([
        {
          label: "全削除",
          onTap: async () => {

            const a = new Alert()
            a.title = "全削除しますか？"
            a.addDestructiveAction("削除")
            a.addCancelAction("キャンセル")

            const r = await a.presentAlert()
            if (r === -1) return

            await core.notification.clearAll()
            await this.reload(core)

          }

        },
        { label: "Close", dismiss: true }
      ]).row)
  },

  // =========================
  // reload
  // =========================
  async reload(core) {

    await this.createTable(this.table, core)
    this.table.reload()

  },

  // =========================
  // snooze
  // =========================
  async snooze(item, core, diffMs) {

    const base = item.date || Date.now()
    const newTime = base + diffMs

    await core.notification.schedule(
      item.id,
      new Date(newTime),
      item
    )

    this.view = "list"
    await this.reload(core)

  },

  async snoozeCustom(item, core) {

    const a = new Alert()
    a.title = "スヌーズ（分）"

    a.addTextField("例: 10", "5")
    a.addAction("OK")
    a.addCancelAction("キャンセル")

    const r = await a.presentAlert()
    if (r === -1) return

    const minutes = parseInt(a.textFieldValue(0), 10)
    if (!minutes || minutes <= 0) return

    await this.snooze(item, core, minutes * 60 * 1000)

  },

  // =========================
  // 時刻
  // =========================
  formatDate(ts) {

    if (!ts) return ""

    const d = new Date(ts)
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`

  },

  formatTimeAgo(ts) {

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

  },

  // =========================
  // togglePin
  // =========================
  async togglePin(item, core) {

    // 最新状態取得
    const history = core.notification.history

    const target = history[item.id]
    if (!target) return

    if (!target.meta) target.meta = {}

    // トグル
    target.meta.isPinned = !target.meta.isPinned

    core.notification._save()

    // UI更新
    this.currentItem = {
      ...item,
      meta: target.meta
    }

    await this.reload(core)

  }

}