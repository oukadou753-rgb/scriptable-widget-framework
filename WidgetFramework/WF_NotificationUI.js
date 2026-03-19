// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationUI
 * UTF-8 日本語コメント
 **/
module.exports = {

  async present(core) {
    const table = new UITable()
    table.showSeparators = true
    table.dismissOnSelect = false

    await this.createTable(table, core)

    await table.present()
  },

  async createTable(table, core) {
    table.removeAllRows()

    const row = new UITableRow()
    row.addText("Notification UI (empty)")
    table.addRow(row)

    table.reload()
  }
}