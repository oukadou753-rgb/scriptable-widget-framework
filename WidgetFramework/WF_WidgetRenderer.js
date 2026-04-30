// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetRenderer
 * UTF-8 日本語コメント
 **/

const ALIAS = {
  backgroundColor: ["bgColor", "bg"],
  cornerRadius: ["radius"],
  borderWidth: ["bWidth"],
  borderColor: ["bColor"]
}

// ======================
// Export
// ======================
module.exports = class WF_WidgetRenderer {

  constructor(appId, storageType) {

    this.appId = appId
    this.storageType = storageType

    this.fontCache = {}
    this.styleCache = {}

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
    this.imageRoot = this._ensureDirs(this.appRoot, "images", true)

  }

  // =========================
  // _ensureDirs
  // =========================
  _ensureDirs(root, dir, isDir = false) {

    const path = this.fm.joinPath(root, dir)

    if (!this.fm.fileExists(path)) {
      if (isDir) this.fm.createDirectory(path)
    }

    return path

  }

  // =========================
  // render
  // =========================
  async render(context) {

    context = context || {}

    const cfg = context.config || {}
    const values = cfg.values || {}
    const layout = cfg.layout || {}

    const widget = new ListWidget()

    // =========================
    // ★ widgetタップ（全体）
    // =========================
    this.applyTapAction(widget, layout, context)

    // =========================
    // layout padding
    // =========================
    if (layout.padding) {
      const p = layout.padding
      widget.setPadding(p.top, p.left, p.bottom, p.right)
    }

    // =========================
    // refreshAfterDate
    // =========================
    if (values.refreshInterval >= 15) {
      let refreshInterval = Number(values.refreshInterval) * 60 * 1000
      widget.refreshAfterDate = new Date(Date.now() + refreshInterval)
    }

    // =========================
    // background
    // =========================
    const bg = layout.background
    const type = bg?.type ?? values.bgType

    if (type === "gradient") {
      const top = bg?.top ?? values.bgColorTop
      const bottom = bg?.bottom ?? values.bgColorBottom
      widget.backgroundGradient =
        await this.setGradientBackground(top, bottom)
    } else if (type === "color") {
      const color = bg?.color ?? values.bgColor
      widget.backgroundColor = new Color(String(color))
    }

    // =========================
    // ★ blocks（新方式）
    // =========================
    if (Array.isArray(layout.blocks) && layout.blocks.length) {

      await this.renderBlock(widget, layout.blocks, context)

    } else {

      // =========================
      // 従来方式（互換）
      // =========================

      if (Array.isArray(layout.header) && layout.header.length) {
        await this.renderBlock(widget, layout.header, context)
      }

      if (Array.isArray(layout.body) && layout.body.length) {
        await this.renderBlock(widget, layout.body, context)
      }

      if (Array.isArray(layout.footer) && layout.footer.length) {
        await this.renderBlock(widget, layout.footer, context)
      }

    }

    // =========================
    // 強制差分
    // =========================
    if (this.shouldForceRefresh(context)) {
      this.addForceRefresh(widget)
    }

    return widget
  }

  // =========================
  // shouldForceRefresh
  // =========================
  shouldForceRefresh(ctx) {

    const v = ctx?.config?.values ?? {}
    if (v.forceRenderDiff === false) return false
    return true
  }

  // =========================
  // addForceRefresh
  // =========================
  addForceRefresh(container) {

    const ctx = new DrawContext()
    ctx.size = new Size(1, 1)
    ctx.opaque = false
    ctx.respectScreenScale = false

    const alpha = Math.random() * 0.02
    ctx.setFillColor(new Color("#000000", alpha))
    ctx.fillRect(new Rect(0, 0, 1, 1))

    const img = ctx.getImage()

    const stack = container.addStack()
    stack.size = new Size(1, 1)

    const image = stack.addImage(img)
    image.imageSize = new Size(1, 1)
    image.imageOpacity = 0.01
  }

  // =========================
  // renderBlock
  // =========================
  async renderBlock(container, blocks, context) {

    if (!Array.isArray(blocks)) return

    for (const block of blocks) {
      if (!block || typeof block !== "object") continue

      // show
      if (block.show !== undefined && !this.evaluate(block.show, context)) continue

      // hidden
      if (block.hidden !== undefined && this.evaluate(block.hidden, context)) continue

      // =========================
      // repeat
      // =========================
      if (block.type === "repeat") {
        await this.renderRepeat(container, block, context)
        continue
      }

      // =========================
      // renderElement
      // =========================
      await this.renderElement(container, block, context)

    }

  }

  // =========================
  // renderElement
  // =========================
  async renderElement(container, el, context) {

    if (!el) return

    // show
    if (el.show !== undefined && !this.evaluate(el.show, context)) return

    // hidden
    if (el.hidden !== undefined && this.evaluate(el.hidden, context)) return

    // =========================
    // shorthand
    // =========================

    // text shorthand
    if (typeof el === "string") {
      el = { type: "text", text: el }
    }

    // spacer shorthand
    if (typeof el === "object" && el.spacer !== undefined) {
      el = {
        type: "spacer",
        size: el.spacer === true ? undefined : el.spacer
      }
    }

    // object shorthand
    if (typeof el === "object" && !el.type) {

      if (el.text !== undefined) {
        el.type = "text"
      }

      else if (el.image !== undefined) {
        el.type = "image"
        el.src = el.image
      }

      else if (el.h) {
        el.type = "hstack"
        el.children = el.h
      }

      else if (el.v) {
        el.type = "vstack"
        el.children = el.v
      }
    }

    // style shorthand
    if (el.s && !el.style) el.style = el.s

    if (!el.type) return

    // =========================
    // children repeat
    // =========================
//     if (el.type === "repeat") {
//       await this.renderRepeat(container, el, context)
//       return
//     }

    // =========================
    // renderText / renderStack / renderSpacer / renderImage
    // =========================
    switch (el.type) {
      case "repeat": return await this.renderRepeat(container, el, context)
      case "text": return this.renderText(container, el, context)
      case "hstack": return this.renderStack(container, el, context, true)
      case "vstack": return this.renderStack(container, el, context, false)
      case "spacer": return this.renderSpacer(container, el)
      case "image": return await this.renderImage(container, el, context)
    }

  }

  // =========================
  // renderRepeat
  // =========================
  async renderRepeat(container, block, context) {

    let items = this.resolveData(block.items, context)
    if (!Array.isArray(items)) items = []

    const repeatStack = container.addStack()

    if (block.direction === "vertical") repeatStack.layoutVertically()
    else repeatStack.layoutHorizontally()

    repeatStack.spacing = block.spacing ?? 6

    const align = block.align ?? "center"
    if (align === "top") repeatStack.topAlignContent()
    else if (align === "bottom") repeatStack.bottomAlignContent()
    else repeatStack.centerAlignContent()

    // 描画
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const newCtx = { ...context, item, index: i + 1 }
      if (block.template) {
        await this.renderBlock(repeatStack, [block.template], newCtx)
      }
    }

    // minRows
    if (block.minRows) {

      const min = Number(this.bind(block.minRows, context)) || 0
      const missing = min - items.length

      for (let i = 0; i < missing; i++) {

        const emptyStack = repeatStack.addStack()

        if (block.direction === "vertical") {
          emptyStack.layoutHorizontally()
        } else {
          emptyStack.layoutVertically()
        }

        if (block.rowHeight) {
          emptyStack.size = new Size(0, Number(block.rowHeight))
        }

        emptyStack.addSpacer()
      }
    }

    this.applyTapAction(repeatStack, block, context)

  }

  // =========================
  // renderText
  // =========================
  renderText(container, el, context) {

    const text = this.bind(el.text, context)
    const txt = container.addText(String(text ?? ""))

    this.applyStyle(txt, el.style, context)

    // URL
    this.applyTapAction(txt, el, context)

    return txt

  }

  // =========================
  // renderStack
  // =========================
  async renderStack(container, el, context, horizontal) {

    const stack = container.addStack()

    // background color
    const bg = this.resolveProp(el, "backgroundColor")

    if (bg !== undefined) {
      const color = this.resolveColor(this.bind(bg, context), context)
      stack.backgroundColor = this.toColor(color)
    }

    // size
    if (el.size) stack.size = new Size(el.size.width, el.size.height)

    // Padding
    if (el.padding) {
      const pad = el.padding
      stack.setPadding(pad.top ?? 0, pad.right ?? 0, pad.bottom ?? 0, pad.left ?? 0)
    }

    // Spacing
    if (el.spacing != null) stack.spacing = Number(el.spacing)

    // CornerRadius
    const cr = this.resolveProp(el, "cornerRadius")
    if (cr != null) stack.cornerRadius = Number(cr)

    // borderWidth
    const bw = this.resolveProp(el, "borderWidth")
    if (bw) {
      const width = this.bind(bw, context)
      stack.borderWidth = Number(width)
    }

    // borderColor
    const bc = this.resolveProp(el, "borderColor")
    if (bc != null) {
      const color = this.resolveColor(this.bind(bc, context), context)
      stack.borderColor = this.toColor(color)
    }

    // horizontal / vertical
    if (horizontal) stack.layoutHorizontally()
    else stack.layoutVertically()

    // alignContent
    if (el.align === "top") stack.topAlignContent()
    else if (el.align === "bottom") stack.bottomAlignContent()
    else stack.centerAlignContent()

    const children = Array.isArray(el.children) ? el.children : []

    // justify
    if (!el.justify || el.justify === "start") {
      for (const child of children) await this.renderElement(stack, child, context)
    }
    else if (el.justify === "center") {
      stack.addSpacer()
      for (const child of children) await this.renderElement(stack, child, context)
      stack.addSpacer()
    }
    else if (el.justify === "end") {
      stack.addSpacer()
      for (const child of children) await this.renderElement(stack, child, context)
    }
    else if (el.justify === "space-between") {
      for (let i = 0; i < children.length; i++) {
        await this.renderElement(stack, children[i], context)
        if (i < children.length - 1) stack.addSpacer()
      }
    }

    // URL
    this.applyTapAction(stack, el, context)

    return stack

  }

  // =========================
  // Spacer
  // =========================
  renderSpacer(container, el){

    if (el.size)
      container.addSpacer(el.size)
    else
      container.addSpacer()

  }

  // =========================
  // Image
  // =========================
  async renderImage(container, el, context){

    const rawSrc = this.resolveData(el.src, context)

    const size = el.size || 16
    const tint = this.bind(el.tint, context)
    const opacity = this.bind(el.opacity, context)

    let image

    // DrawContext Image
    if (
      rawSrc &&
      typeof rawSrc === "object" &&
      rawSrc.size &&
      typeof rawSrc.size.width === "number"
    ) {
      image = rawSrc
    }

    // URL
    else if (typeof rawSrc === "string" && rawSrc.startsWith("http")){

      try {
        image = await this.fetchImage(rawSrc)
      } catch(e) {
        console.warn("Failed to fetch image from URL: " + rawSrc)
        return
      }

    }

    // SF Symbol
    else if (
      typeof rawSrc === "string" &&
      /^[a-z0-9.\-]+$/i.test(rawSrc)
    ) {

      const sym = SFSymbol.named(rawSrc)
      if (sym) {
        sym.applyFont(Font.systemFont(size))
        image = sym.image
      } else {
        console.warn("SFSymbol not found: " + rawSrc)
        return
      }

    }

    // local image
    else if (typeof rawSrc === "string" && rawSrc !== "") {

      const fm = FileManager.local()
      if (fm.fileExists(rawSrc)) {
        image = fm.readImage(rawSrc)
      } else {
        console.warn("Local image not found: " + rawSrc)
        return
      }

    }

    else{

      console.warn("Invalid image src: " + rawSrc)
      return

    }

    const node = container.addImage(image)

    if (tint != "")
      node.tintColor = new Color(tint)

    // size解決
    let width = 16
    let height = 16

    if (typeof el.size === "number") {
      width = el.size
      height = el.size
    }
    else if (typeof el.size === "object") {
      width = el.size.width ?? 16
      height = el.size.height ?? width
    }

    if (size)
      node.imageSize = new Size(Number(width), Number(height))
  
    if (opacity)
      node.imageOpacity = Number(opacity)

    // URL
    this.applyTapAction(node, el, context)

  }

  // =========================
  // Style
  // =========================
  applyStyle(textItem, styleInput, context) {

    const styles = context.config?.styles || {}

    const cacheKey = JSON.stringify(styleInput)

    let style = this.styleCache[cacheKey]

    if (!style) {
      style = {}

      if (typeof styleInput === "string") {
        style = { ...(styles[styleInput] || styles.defaultText || {}) }
      }
      else if (typeof styleInput === "object") {
        // base style
        if (styleInput.base) {
          style = { ...(styles[styleInput.base] || {}) }
        }

        // Do not overwrite empty characters
        for (const k in styleInput) {
          if (k === "base") continue
          const v = styleInput[k]
          if (v !== "" && v !== null && v !== undefined) {
            style[k] = v
          }
        }
      }
      else {
        style = styles.defaultText || {}
      }

      this.styleCache[cacheKey] = style
    }

    textItem.font = this.getFont(style)

    const colorValue = this.bind(style.color, context)
    if (colorValue === "") {

      const baseColor = styles[styleInput?.base]?.color

      if (baseColor) {
        const baseBind = this.bind(baseColor, context)
        const finalColor = this.toColor(baseBind)

        if (finalColor) {
          textItem.textColor = finalColor
        }
      }

    }

    else if (colorValue) {

      const resolvedColor = this.resolveColor(colorValue, context)
      const finalColor = this.toColor(resolvedColor)

      if (finalColor) {
        textItem.textColor = finalColor
      }

    }

    // lineLimit
    const lineLimitValue = this.bind(style.lineLimit, context)
    if (lineLimitValue) {
      textItem.lineLimit = Number(lineLimitValue)
    }

    // minimumScaleFactor
    const minimumScaleFactor = this.bind(style.minimumScaleFactor, context)
    if (style.minimumScaleFactor) {
      textItem.minimumScaleFactor = Number(minimumScaleFactor)
    }

    // shadowColor
    const shadowColor = this.bind(style.shadowColor, context)
    if (shadowColor) {
      const finalColor = this.toColor(shadowColor)
      textItem.shadowColor = finalColor
    }

    // shadowRadius
    const shadowRadius = this.bind(style.shadowRadius, context)
    if (shadowRadius) {
      textItem.shadowRadius = Number(shadowRadius)
    }

    // shadowOffset
    const shadowOffset = this.bind(style.shadowOffset, context)
    if (shadowOffset) {
      const x = Number(shadowOffset.x || 0)
      const y = Number(shadowOffset.y || 0)
      textItem.shadowOffset = new Point(x, y)
    }

    // textOpacity
    const opacity = this.bind(style.opacity, context)
    if (opacity !== "" && !isNaN(opacity)) {
      textItem.textOpacity = Number(opacity)
    }

  }

  // =========================
  // applyTapAction
  // =========================
  applyTapAction(node, el, context) {

    if (!node || !el) return

    // =========================
    // meta（最優先）
    // =========================
    if (el.meta) {

      const resolvedMeta = {}

      for (const k in el.meta) {
        resolvedMeta[k] = this.bind(el.meta[k], context)
      }

      node.url = this.buildActionUrl(resolvedMeta)
  
      return

    }

    // =========================
    // URL
    // =========================
    const rawUrl = el.url || el.onTap
    if (!rawUrl) return

    try {
      const url = this.bind(rawUrl, context)
      if (url) node.url = url
    } catch (e) {
      console.warn("Invalid tap url")
    }

  }


  // =========================
  // buildActionUrl
  // =========================
  buildActionUrl(meta) {

    if (!meta) return null

    const base = "scriptable:///run"

    const query = Object.entries(meta)
      .map(([k, v]) =>
        encodeURIComponent(k) + "=" + encodeURIComponent(v)
      )
      .join("&")

    return `${base}?scriptName=${encodeURIComponent(Script.name())}&${query}`

  }

  // =========================
  // bind
  // =========================
  bind(text, context) {

    if (text === undefined || text === null)
      return ""

    const str = String(text)

    // Complete variable
    const m = str.match(/^{{\s*([^}]+?)\s*}}$/)

    if (m) {
      const key = m[1]
      const val = this.resolve(key, context)
      return val ?? ""
    }

    // template
    return str.replace(/{{\s*([^}]+?)\s*}}/g, (_, key) => {
      const val = this.resolve(key.trim(), context)
      return val ?? ""

    })
  }

  // =========================
  // evaluate
  // =========================
  evaluate(expr, context) {

    if (expr === undefined || expr === null) return true
    if (typeof expr === "boolean") return expr

    let raw = String(expr).trim()

    if (raw.startsWith("{{") && raw.endsWith("}}")) {
      raw = raw.slice(2, -2).trim()
    }

    // cache
    if (!this.evalCache) this.evalCache = {}

    let func = this.evalCache[raw]

    if (!func) {

      try {

        func = new Function("ctx", `
          with(ctx){
            return (${raw})
          }
        `)

        this.evalCache[raw] = func

      } catch (e) {

        console.warn("evaluate compile error: " + raw)
        return false

      }

    }

    try {
      const func = new Function("ctx", `
        with(ctx){
          return (${raw})
        }
      `)

      return !!func(this.buildEvalContext(context))

    } catch (e) {
      console.warn("evaluate error: " + raw)
      return false
    }
  }

  // =========================
  // context buildEval
  // =========================
  buildEvalContext(context) {

    return {
      ...(context.config?.values || {}),
      ...(context.data || {}),
      ...(context.location || {}),
      ...(context.item || {}),
      index: context.index,
      version: context.version,
      update: context.update
    }

  }

  // =========================
  // resolve
  // =========================
  resolve(key, context) {

    if (!key) return undefined

    // ネストパスも対応（将来用）
    if (key.includes(".")) return this.getByPath(context, key)

    const priority = context.item
      ? ["item", "location", "config.values", "data"]
      : ["location", "config.values", "data", "update"]

    for (const p of priority) {
      const base = p.includes(".") ? this.getByPath(context, p) : context[p]
      if (base && Object.prototype.hasOwnProperty.call(base, key)) {
        return base[key]
      }
    }

    if (key === "version") return context.version

    return undefined

  }

  // =========================
  // getByPath
  // =========================
  getByPath(obj, path) {

    if (!obj || !path) return undefined

    return path.replace(/\[(\d+)\]/g, '.$1')
              .split('.')
              .reduce((o, k) => (o ? o[k] : undefined), obj)

  }

  // =========================
  // resolveData
  // =========================
  resolveData(expr, context) {

    if (expr === null || expr === undefined) return expr
    if (typeof expr !== "string") return expr

    // 部分文字列置換も配列やオブジェクトを返さない
    const fullMatch = expr.match(/^{{\s*(.*?)\s*}}$/)
    if (fullMatch) {
      const key = fullMatch[1].trim()
      const val = this.resolve(key, context)
      return val !== undefined ? val : ""
    }

    // 文字列中に埋め込みがある場合は文字列化して返す
    return expr.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
      const val = this.resolve(key.trim(), context)
      if (val === undefined || val === null) return ""
      if (typeof val === "object") return ""  // 配列やオブジェクトは文字列化せず空文字に
      return String(val)
    })

  }

  // =========================
  // getFont
  // =========================
  getFont(style) {

    if (style.font instanceof Font) {
      return style.font
    }

    const size = Number(style.fontSize) || 14
    const type = style.font || "system"
    const bold = style.bold || false

    const key = `${type}_${size}_${bold}`

    if (this.fontCache[key]) {
      return this.fontCache[key]
    }

    let font

    if (type === "semibold") {
      font = Font.semiboldSystemFont(size)
    }
    else if (type === "monospace") {
      font = Font.boldMonospacedSystemFont(size)
    }
    else {

      font = bold
        ? Font.boldSystemFont(size)
        : Font.systemFont(size)

    }

    this.fontCache[key] = font

    return font

  }

  // =========================
  // getDefaultTextColor
  // =========================
  getDefaultTextColor() {

    return Device.isUsingDarkAppearance()
      ? Color.white()
      : Color.black()

  }

  // =========================
  // resolveColor
  // =========================
  resolveColor(color, context) {

    if (!color) return null
    if (typeof color === "string" && color.includes("{{")) {
      return this.bind(color, context)
    }

    return color

  }

  // =========================
  // resolveProp
  // =========================
  resolveProp(el, key) {

    if (el[key] !== undefined) return el[key]

    const aliases = ALIAS[key]
    if (!aliases) return undefined

    for (const a of aliases) {
      if (el[a] !== undefined) return el[a]
    }

  }

  // =========================
  // resolveStyleProp
  // =========================
  resolveStyleProp(el, style, key) {

    if (style && style[key] !== undefined) return style[key]
    return this.resolveProp(el, key)

  }

  // =========================
  // toColor
  // =========================
  toColor(value) {

    if (value === "" || value === null || value === undefined)
      return null

    if (value instanceof Color)

      return value

    try {

      return new Color(String(value))

    } catch (e) {

      return null

    }

  }

  // =========================
  // setGradientBackground
  // =========================
  async setGradientBackground(colorTop, colorBottom) {

    const bgColor = new LinearGradient();
    bgColor.colors = [new Color(colorTop), new Color(colorBottom)]
    bgColor.locations = [0, 1]

    return bgColor

  }

  // =========================
  // fetchImage
  // =========================
  async fetchImage(url) {

    if (!url) return null

    const fileName = this.hash(url) + ".png"
    const filePath = this.fm.joinPath(this.imageRoot, fileName)

    // キャッシュが存在する場合は読み込む
    if (this.fm.fileExists(filePath)) {

      try {

        const img = this.fm.readImage(filePath)

        if (img) return img

        console.warn("Cached image exists but failed to read: " + filePath)

      }

      catch (e) {

        console.warn("Error reading cached image: " + e)

      }

    }

    // ネットワーク取得
    try {

      const req = new Request(url)
      const img = await req.loadImage()

      if (img) {

        try {

          this.fm.writeImage(filePath, img)

        }

        catch (e) {

          console.warn("Failed to write image cache: " + e)

        }

        return img

      }

      console.warn("Fetched image is null: " + url)

    }

    catch (e) {

      console.warn("Failed to fetch image from URL: " + url + "\n" + e)

    }

    return null
  }

  // =========================
  // hash
  // =========================
  hash(str){

    return str.replace(/[^\w]/g,"_")

  }

}