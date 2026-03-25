// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_MenuEngine
 * UTF-8 日本語コメント
 **/
module.exports = class WF_MenuEngine {

  constructor() {

    this.menus = {}

    this.stack = []
  }

  // =========================
  // メニュー登録
  // =========================
  _register(name, items = [], options = {}) {

    if (!Array.isArray(items)) items = []

    this.menus[name] = {
      items,
      options
    }
  }

  register(name, items, options = {}, ctx = {}) {

    const processed = items
      .filter(item => this._eval(item.show, ctx, true))
      .map(item => {

        const label = this._eval(item.label, ctx, "")

        const disabled = this._eval(item.disabled, ctx, false)

        const badgeVal = this._eval(item.badge, ctx, null)

        return {
          ...item,
          label,
          disabled,
          badge: badgeVal
        }
      })

    this.menus[name] = {
      items: processed,
      options
    }
  }

  // =========================
  // 開始
  // =========================
  async start(name, overrideOptions = {}) {

    this.stack = [name]

    while (this.stack.length > 0) {

      const current = this.stack[this.stack.length - 1]

      const result = await this.present(current, overrideOptions)

      if (result === "reload" || result === "exit") {
        this.stack = []
        return result
      }

      if (result === "back") {
        if (this.stack.length > 1) {
          this.stack.pop()
        } else {
          return "exit"
        }
      }
    }

    return "exit"
  }

  // =========================
  // 評価関数
  // =========================
  _eval(val, ctx, def = true) {
    if (typeof val === "function") {
      try {
        return val(ctx)
      } catch (e) {
        console.warn("Menu eval error:", e)
        return def
      }
    }
    if (val === undefined) return def
    return val
  }

  // =========================
  // 表示（Alert版）
  // =========================
  async present(name, overrideOptions = {}) {

    const menu = this.menus[name]
    if (!menu) return "exit"

    const options = {
      ...(menu.options || {}),
      ...(overrideOptions || {})
    }

    let items = menu.items
    if (!Array.isArray(items)) items = []

    const a = new Alert()

    // タイトル
    if (options.title) {
      a.title = String(options.title)
    }

    // =========================
    // メニュー項目
    // =========================
    items.forEach(item => {

      const label = item?.label || "Item"

      a.addAction(String(label))
    })

    const isRoot = this.stack.length === 1
    a.addCancelAction(isRoot ? "Close" : "Back")

    const index = await a.present()

    // =========================
    // 戻る / 閉じる
    // =========================
    if (index === -1) {
      return "back"
    }

    const item = items[index]
    if (!item) return null

    // =========================
    // サブメニュー
    // =========================
    if (item.next) {
      this.stack.push(item.next)
      return null
    }

    // =========================
    // アクション
    // =========================
    if (item.action) {

      try {

        const result = await item.action()

        if (result === "reload") return "reload"
        if (result === "exit") return "exit"
        if (result === "back") return "back"

        if (item.close == true) return "exit"
        if (options.closeOnSelect == true) return "exit"

      } catch (e) {

        const err = new Alert()
        err.title = "Action Error"
        err.message = String(e)
        err.addAction("OK")
        await err.present()
      }

      return null
    }

    return null
  }
}
