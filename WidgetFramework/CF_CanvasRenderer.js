// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * CF_CanvasRenderer
 * UTF-8 日本語コメント
 **/

// ======================
// Export
// ======================
module.exports = class CF_CanvasRenderer {

  constructor(size, options = {}) {
    this.ctx = new DrawContext()
    this.ctx.opaque = options?.opaque ?? false
    this.ctx.respectScreenScale = options?.respectScreenScale ?? true
    this.ctx.size = size ?? new Size(300, 300)
  }

  // ======================
  // getImage
  // ======================
  getImage() {

    return this.ctx.getImage()
  }

  // ======================
  // drawBox
  // ======================
  drawBox(rect, options = {}) {
    const corner = options?.corner ?? 0
    const path = new Path()
    path.addRoundedRect(rect, corner, corner)
    this.ctx.addPath(path)
    if (options?.color) this.ctx.setFillColor(options.color)
    this.ctx.fillPath(path)
  }

  // ======================
  // drawText
  // ======================
  drawText(point, text, options = {}) {
    if (options?.font) this.ctx.setFont(options.font)
    if (options?.color) this.ctx.setFillColor(options.color)
    this.ctx.drawText(new String(text).toString(), point)
  }

  // ======================
  // drawTextC
  // ======================
  drawTextC(rect, text, options = {}) {
    if (options?.align == "rigth") {
      this.ctx.setTextAlignedRight()
    } else if (options?.align == "center") {
      this.ctx.setTextAlignedCenter()
    }
    if (options?.font) this.ctx.setFont(options.font)
    if (options?.color) this.ctx.setTextColor(options.color)
    this.ctx.drawTextInRect(new String(text).toString(), rect)
  }

  // ======================
  // drawLine
  // ======================
  drawLine(point1, point2, options = {}) {
    const path = new Path()
    path.move(point1)
    path.addLine(point2)
    this.ctx.addPath(path)
    if (options?.color) this.ctx.setStrokeColor(options.color)
    if (options?.width) this.ctx.setLineWidth(options.width)
    this.ctx.strokePath()
  }

  // ======================
  // drawBoxLine
  // ======================
  drawBoxLine(rect, options = {}) {
    const {x, y, width, heigth} = rect
    this.drawLine(new Point(x, y), new Point(x+width, y), options)
    this.drawLine(new Point(x+width, y), new Point(x+width, y+heigth), options)
    this.drawLine(new Point(x+width, y+heigth), new Point(x, y+heigth), options)
    this.drawLine(new Point(x, y+heigth), new Point(x, y), options)
  }

  // ======================
  // drawImage
  // ======================
  drawImage(image, point) {
    this.ctx.drawImageInRect(image, 
      new Rect (
        point.x,
        point.y,
        image.size.width,
        image.size.height
      )
    )
  }

  // ======================
  // drawCircle
  // ======================
  drawCircle(point, options = {}) {
    const {x, y} = point
    const radius = options?.radius ?? 25
    const steps = options?.steps ?? 100

    let path = new Path()
    let paths = []

    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2
      const nextX = x + radius * Math.cos(angle)
      const nextY = y + radius * Math.sin(angle)
      paths.push(new Point(nextX, nextY))
    }

    path.addLines(paths)
    path.closeSubpath()

    if (options?.color) this.ctx.setStrokeColor(options.color)
    if (options?.width) this.ctx.setLineWidth(options.width)
    if (options?.color) this.ctx.setFillColor(options.color)

    this.ctx.addPath(path)
    this.ctx.strokePath()
  }
}