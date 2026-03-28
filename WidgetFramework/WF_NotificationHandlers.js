// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/*
 * WF_NotificationHandlers
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = (core) => ({

  // =========================
  // openProfile
  // ========================
  openProfile: async (info) => {

    core.profile.setActive(info.profile)
    await core.preview(info.widgetFamily)

  },

  // =========================
  // openNotificationUI
  // ========================
  openNotificationUI: async () => {

    await core.notificationUI.present(core)

  },

  // =========================
  // openNotificationDetail
  // ========================
  openNotificationDetail: async (info) => {

    await core.notificationUI.present(core, {
      openId: info.id
    })

  },

  // =========================
  // openPreview
  // ========================
  openPreview: async (info) => {

    if (info.type === "image") {

      let img

      if (info.src.startsWith("http")) {

        const req = new Request(info.src)
        img = await req.loadImage()

      } else {

        img = Image.fromFile(info.src)

      }

      if (img) QuickLook.present(img)

    }

    if (info.type === "list") {

      const table = new UITable()

      for (const item of info.items || []) {

        const row = new UITableRow()
        row.addText(String(item))
        table.addRow(row)

      }

      await table.present(true)

    }

  }

})