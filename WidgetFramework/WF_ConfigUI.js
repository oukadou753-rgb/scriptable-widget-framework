// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_ConfigUI
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = {

  // =========================
  // 状態
  // =========================
  table: null,

  // =========================
  // present
  // =========================
  async present(core, options = {}) {

    this.core = core
    this.result = "back"
    this.tableUI = core.tableUI

    const profileEngine = core.profile
    const activeProfile = profileEngine.getActive()
    const activeCfg = options.config || profileEngine.getConfig()

    const table = new UITable()
    table.dismissOnSelect = false
    table.showSeparators = true

    this.table = table

    await this.createTable(table, activeCfg, profileEngine, activeProfile)
    await table.present(true)
    return this.result

  },

  // =========================
  // createTable
  // =========================
  async createTable(table, activeCfg, profileEngine, activeProfile) {

    table.removeAllRows()
    await this.renderContent(table, activeCfg, profileEngine, activeProfile)
    table.reload()

  },

  // =========================
  // 共通UI部品
  // =========================
  applyColor(row, left, right, value) {

    try {

      const color = new Color(value)

      row.backgroundColor = color

      const brightness =
        color.red * 0.299 +
        color.green * 0.587 +
        color.blue * 0.114

      const textColor =
        brightness > 0.55
          ? Color.black()
          : Color.white()

      left.titleColor = textColor
      right.titleColor = textColor

    }

    catch {}

  },

  // =========================
  // メイン描画
  // =========================
  async renderContent(table, activeCfg, profileEngine, activeProfile) {

    const schemaObj = activeCfg.schema
    const values = activeCfg.values
    const defaultOpenSections = activeCfg.defaultOpenSections

    // -------------------------
    // セクション構築
    // -------------------------
    const sections = {}
    for (const key in schemaObj) {

      const item = schemaObj[key]
      const sec = item.section || "General"
      if (!sections[sec]) sections[sec] = []
      sections[sec].push({ key, ...item })

    }

    // -------------------------
    // セクション状態
    // -------------------------
    let sectionState = {}
    for (const sec in sections) {

      sectionState[sec] = values[`section_${sec}`] === true

    }

    // -------------------------
    // Profile 行
    // -------------------------
    const { row, left, right } = this.tableUI.createKeyValueRow(
      "▼ Profile",
      `${activeProfile} ›`
    )
    right.titleColor = Color.blue()

    row.onSelect = async () => {

      const list = profileEngine.list()

      const a = new Alert()
      a.title = "Select Profile"

      list.forEach(o => {
        const mark = (o === activeProfile) ? "● " : ""
        a.addAction(mark + String(o))
      })

      a.addCancelAction("Cancel")

      const r = await a.present()

      if (r !== -1) {

        const selected = list[r]

        profileEngine.setActive(selected)
        const cfg = profileEngine.getConfig()

        await this.createTable(this.table, {...cfg}, profileEngine, selected)

      }

    }

    table.addRow(row)

    // -------------------------
    // 操作行
    // -------------------------
    const allOpen = Object.values(sectionState).every(v => v)

    table.addRow(this.tableUI.createButtonRow([
      {
        label: allOpen ? "▶ Close All" : "▼ Open All",
        onTap: async () => {

          for (const sec in sections) {

            const state = !allOpen
            sectionState[sec] = state
            values[`section_${sec}`] = state

          }

          await this.reload(activeCfg, profileEngine, activeProfile)

        }

      },
      {
        label: "↺ Default",
        onTap: async () => {

          for (const sec in sections) {

            const isOpen = defaultOpenSections.includes(sec)
            sectionState[sec] = isOpen
            values[`section_${sec}`] = isOpen

          }

          await this.reload(activeCfg, profileEngine, activeProfile)

        }
      }
    ]).row)

    // -------------------------
    // セクション描画
    // -------------------------
    for (const sectionName in sections) {

      const isOpen = sectionState[sectionName]

      const { row: headerRow } = this.tableUI.createSectionHeader(sectionName, isOpen)
      headerRow.onSelect = async () => {

        values[`section_${sectionName}`] = !isOpen
        await this.reload(activeCfg, profileEngine, activeProfile)

      }

      table.addRow(headerRow)

      if (!isOpen) continue

      for (const item of sections[sectionName]) {

        if (item.hidden) continue

        const current =
          values[item.key] ??
          item.default ??
          ""

        const indent = "    " // スペースでもOK

        const icon = item.readonly ? "□" : "■"
        const label = item.label || item.key

        const display =
          (item.type === "bool" || item.type === "boolean")
            ? (current ? "ON" : "OFF")
            : current

        const { row, left, right } = this.tableUI.createKeyValueRow(`${indent}${icon} ${label}`, display)

        // COLOR
        if (item.type === "color") {

          this.applyColor(row, left, right, current)

        }

        // BOOL色分け
        if (item.type === "bool" || item.type === "boolean") {

          right.titleColor = current ? Color.green() : Color.red()

        }

        // SELECT
        if (item.type === "select") {

          right.titleColor = Color.blue()

        }

        row.onSelect = async () => {

          // BOOL
          if (item.type === "bool" || item.type === "boolean") {

            values[item.key] = !Boolean(current)
            await this.reload(activeCfg, profileEngine, activeProfile)
            return

          }

          // SELECT
          if (item.type === "select") {

            const opts = item.options || []

            const a = new Alert()
            a.title = item.label || item.key

            opts.forEach(o => {
              const mark = (o === current) ? "● " : ""
              a.addAction(mark + String(o))
            })

            a.addCancelAction("Cancel")

            const r = await a.present()
            if (r !== -1) values[item.key] = opts[r]

            await this.reload(activeCfg, profileEngine, activeProfile)
            return

          }

          // COLOR
          if (item.type === "color") {

            const presets = item.presets || [
              "#ffffff", "#000000", "#ff3b30",
              "#34c759", "#007aff", "#ffcc00"
            ]

            const a = new Alert()
            a.title = item.label || item.key

            presets.forEach(c => a.addAction(c))
            a.addAction("Custom HEX")
            a.addCancelAction("Cancel")

            const r = await a.present()
            if (r === -1) return

            if (r < presets.length) {

              values[item.key] = presets[r]

            } else {

              const input = await this.prompt("HEX Color", current)
              if (input !== null) values[item.key] = input

            }

            await this.reload(activeCfg, profileEngine, activeProfile)
            return

          }

          // DEFAULT
          const input = await this.prompt(item.label, current)
          if (input !== null) {

            values[item.key] = this.castSafe(input, item.type, current)
            await this.reload(activeCfg, profileEngine, activeProfile)

          }

        }

        table.addRow(row)

      }

    }

    table.addRow(this.tableUI.createSpacer(16))

    // -------------------------
    // フッター
    // -------------------------
    table.addRow(this.tableUI.createButtonRow([
      { 
        label: "Cancel", 
        dismiss: true 
      },
      {
        label: "Save & Close",
        dismiss: true,
        onTap: async () => {

          const cfg = profileEngine.getConfig()
          cfg.values = JSON.parse(JSON.stringify(values))
          profileEngine.saveConfig(activeProfile, cfg)
          this.result = "reload"

        }
      }
    ]).row)
  },

  // =========================
  // reload
  // =========================
  async reload(activeCfg, profileEngine, activeProfile) {

    await this.createTable(this.table, {...activeCfg}, profileEngine, activeProfile)

  },

  // =========================
  // prompt
  // =========================
  async prompt(title, def) {

    const a = new Alert()
    a.title = title

    a.addTextField("", String(def ?? ""))
    a.addAction("OK")
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r === -1) return null

    return a.textFieldValue(0)

  },

  // =========================
  // cast
  // =========================
  castSafe(val, type, fallback) {

    if (type === "number") {

      const n = Number(val)
      return isNaN(n) ? Number(fallback || 0) : n

    }

    if (type === "bool" || type === "boolean") {

      return val === "true" || val === true

    }

    return val

  }

}