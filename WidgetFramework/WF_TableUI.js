// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_TableUI
 * UTF-8 日本語コメント
 */
module.exports = {

  // =========================
  // 基本Row
  // =========================
  createRow(height = 0) {
    const row = new UITableRow()
    row.dismissOnSelect = false
    row.cellSpacing = 10
    if (height > 0) row.height = height
    return row
  },

  // =========================
  // Key-Value（基本）
  // =========================
  createKeyValueRow(title, value, options = {}) {
    const row = this.createRow(options.height)

    const left = row.addText(String(title || ""))
    left.widthWeight = options.leftWeight || 70
    left.titleFont = options.leftFont || Font.semiboldSystemFont(14)

    const right = row.addText(String(value || ""))
    right.widthWeight = options.rightWeight || 30
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
    height = 60
  }) {
    const row = this.createRow(height)

    const left = row.addText(
      String(title || ""),
      String(subtitle || "")
    )
    left.widthWeight = 70
    left.titleFont = Font.semiboldSystemFont(16)
    left.subtitleFont = Font.systemFont(14)

    const right = row.addText(
      String(rightTitle || ""),
      String(rightSubtitle || "")
    )
    right.widthWeight = 30
    right.rightAligned()
    right.titleFont = Font.semiboldSystemFont(14)
    right.subtitleFont = Font.systemFont(12)

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