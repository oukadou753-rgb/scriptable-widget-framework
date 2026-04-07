// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_TableUI
 * UTF-8 日本語コメント
 */

// =========================
// Export
// =======================
module.exports = {

  // =========================
  // Presets
  // =======================
  TABLE_PRESETS: {

    tap: {
      rowHeight: 60,
      cellSpacing: 10,

      fontTitle: Font.semiboldSystemFont(16),
      fontSubtitle: Font.systemFont(14),

      fontRightTitle: Font.semiboldSystemFont(14),
      fontRightSubtitle: Font.systemFont(12),

      leftColor: null,
      rightColor: null,
      backgroundColor: null
    }

  },

  // =========================
  // 基本Row
  // =========================
  createRow(height = 0) {
    const row = new UITableRow()
    row.dismissOnSelect = false
    row.cellSpacing = this.TABLE_PRESETS.tap.cellSpacing
    if (height > 0) row.height = height || this.TABLE_PRESETS.tap.rowHeight
    return row
  },

  // =========================
  // Key-Value（基本）
  // =========================
  createKeyValueRow(title, value, options = {}) {
    const row = this.createRow(options.height)

    const left = row.addText(String(title || ""))
    left.widthWeight = options.leftWeight || 30
    left.titleFont = options.leftFont || Font.semiboldSystemFont(14)

    const right = row.addText(String(value || ""))
    right.widthWeight = options.rightWeight || 70
    right.rightAligned()
    right.titleFont = options.rightFont || Font.systemFont(14)

    if (options.rightColor) right.titleColor = options.rightColor
    if (options.leftColor) left.titleColor = options.leftColor

    return { row, left, right }
  },

  // =========================
  // 2段表示（Notification向け）
  // =========================
  createListRow({
    title,
    subtitle,
    rightTitle,
    rightSubtitle,
    height = 0,
    preset = "tap",
    meta = {}
  }) {
    const style = {
      ...this.TABLE_PRESETS[preset],
      ...meta
    }

    const titleLineCount = (title.match(new RegExp("\n", "g")) || []).length + 1
    const subtitleLineCount = (subtitle.match(new RegExp("\n", "g")) || []).length + 1
    const lineHeight = ((16 * 1.6) * titleLineCount) + ((14 * 1.6) * subtitleLineCount)
    height = Math.ceil(Math.max(style.rowHeight, lineHeight))

    const row = this.createRow(height || style.rowHeight)
    row.cellSpacing = style.cellSpacing

    if (style.backgroundColor) {
      row.backgroundColor = style.backgroundColor
    }

    const left = row.addText(
      String(title || ""),
      String(subtitle || "")
    )
    left.widthWeight = 70
    left.titleFont = style.fontTitle
    left.subtitleFont = style.fontSubtitle

    if (style.leftColor) left.titleColor = style.leftColor

    const right = row.addText(
      String(rightTitle || ""),
      String(rightSubtitle || "")
    )
    right.widthWeight = 30
    right.rightAligned()
    right.titleFont = style.fontRightTitle
    right.subtitleFont = style.fontRightSubtitle

    if (style.rightColor) right.titleColor = style.rightColor

    return { row, left, right }
  },

  // =========================
  // ボタンRow
  // =========================
  createButtonRow(buttons = []) {
    const row = this.createRow()

    const btns = buttons.map(btn => {
      const b = row.addButton(btn.label)

      if (btn.onTap) b.onTap = btn.onTap
      if (btn.dismiss) b.dismissOnTap = true
      if (btn.align === "center") b.centerAligned()

      return b
    })

    return { row, buttons: btns }
  },

  // =========================
  // セクションヘッダ
  // =========================
  createSectionHeader(title, isOpen = true) {
    const row = this.createRow()

    const icon = isOpen ? "▼" : "▶"

    const text = row.addText(`${icon} ${title}`)
    text.titleFont = Font.mediumSystemFont(12)

    return { row, text }
  },

  // =========================
  // スペーサー
  // =========================
  createSpacer(height = 12) {
    const row = new UITableRow()
    row.height = height
    return row
  }

}