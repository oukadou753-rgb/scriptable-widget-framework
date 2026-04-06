// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_DataProvider
 * UTF-8 日本語コメント
 **/

// =========================
// Export
// ========================
module.exports = class WF_DataProvider {

  constructor(appId, storage, appConfig) {
    this.appId = appId
    this.storage = storage
    this.appConfig = appConfig
  }

  // =========================
  // ■ 公開：データ取得
  // =========================
  async fetchAll(apiConfig = {}) {

    const values = this.appConfig?.config?.values || {}

    const bindValue = (v) => {
      if (typeof v !== "string") return v
      const m = v.match(/^{{(.*?)}}$/)
      if (!m) return v
      return values[m[1].trim()]
    }

    const cacheKey = apiConfig.cache?.key || "api"
    const cache = this.storage.readJSON(cacheKey)

    const useCache = bindValue(apiConfig.cache?.useCache) ?? true
    const cacheMinutes = bindValue(apiConfig.cache?.minutes) ?? 0

    const forceRefresh =
      config.runsInApp &&
      (bindValue(apiConfig.cache?.forceRefreshInApp) ?? false)

    // =========================
    // ■ ① locationを先に解決（★ここが最重要）
    // =========================
    let location = null

    if (apiConfig.useLocation) {

      const useCurrent = values.useCurrentLocation !== false

      if (!useCurrent) {

        // ★UI変更は即反映される
        location = {
          lat: Number(values.lat ?? this.appConfig.location?.default?.lat),
          lon: Number(values.lon ?? this.appConfig.location?.default?.lon),
          alt: Number(values.alt ?? this.appConfig.location?.default?.alt),
          name: values.name ?? this.appConfig.location?.default?.name ?? "",
          full: values.full ?? this.appConfig.location?.default?.full ?? ""
        }

      } else {

        const cacheValid = this.getCachedLocationValid()

        if (cacheValid) {
          location = cacheValid
        } else {

          const newLoc = await this.getCurrentLocation()

        if (newLoc) {

          const cached = this.storage.readJSON("location")

          const shouldUpdate =
            !cached ||
            this.shouldUpdateLocation(newLoc, cached, 1)

          if (shouldUpdate) {

            const geo = await this.getLocationName(newLoc.lat, newLoc.lon)

            location = {
              lat: Number(newLoc.lat),
              lon: Number(newLoc.lon),
              alt: Number(newLoc.alt),
              name: geo?.name || "",
              full: geo?.full || ""
            }

            this.saveLocationCache(location)

          } else {

            location = cached

          }
        } else {

            // ① cached location
            const cached = this.storage.readJSON("location")

            if (cached) {
              location = cached
            }

            // ② default location
            else if (this.appConfig.location?.default) {

              const def = this.appConfig.location.default

              location = {
                lat: Number(def.lat),
                lon: Number(def.lon),
                alt: Number(def.alt),
                name: def.name || "",
                full: def.full || ""
              }
            }
        
          }
        }
      }

    }

    // =========================
    // ■ ② キャッシュ判定（後にする）
    // =========================
    const oncePerDay = apiConfig.oncePerDay === true
    const hours = apiConfig.refreshHours || null

    const isMultiRefresh =
      Array.isArray(hours) &&
      this.isAfterRefreshHours(cache, hours)

    const isDailyCache =
      oncePerDay &&
      !hours &&
      this.isTodayCache(cache)

    const isNormalCache =
      this.isCacheValid(cache, cacheMinutes)

    const shouldUseCache =
      useCache &&
      !forceRefresh &&
      (
        isMultiRefresh ||
        isDailyCache ||
        isNormalCache
      )

//     log("==== CACHE DEBUG ====")
//     log("useCache: " + useCache)
//     log("forceRefresh: " + forceRefresh)
//     log("isMultiRefresh: " + isMultiRefresh)
//     log("isDailyCache: " + isDailyCache)
//     log("isNormalCache: " + isNormalCache)
//     log("shouldUseCache: " + shouldUseCache)

    if (shouldUseCache) {
      return {
        data: cache.data || {},
        location
      }
    }

    // =========================
    // ■ ③ API取得
    // =========================
    try {

      const url = this.buildApiUrl(apiConfig, location)
      console.log("API URL: " + url)

      const data = await this.fetch(url, cache, apiConfig)

      // =========================
      // APIエラー判定
      // =========================
      if (
        !data ||
        data.cod && Number(data.cod) !== 200 ||
        data.error ||
        data.message === "error"
      ) {
        console.warn("API error response")

        if (cache && cache.data) {
          console.warn("Using cached data")
          return {
            data: cache.data || {},
            location: location ?? null
          }
        }

        throw new Error("API returned error JSON")
      }

      // =========================
      // 正常時のみキャッシュ保存
      // =========================
      this.storage.writeJSON(cacheKey, {
        data,
        timestamp: Date.now(),
        dateKey: this.getDateKey()
      })

      return {
        data: data || {},
        location: location ?? null
      }

    } catch (e) {
      console.warn("DataProvider error: " + e)

      if (cache && cache.data) {
        return {
          data: cache.data || {},
          location: location ?? null
        }
      }

      throw e
    }
  }

  // =========================
  // ■ URL構築
  // =========================
  buildApiUrl(apiConfig, location) {
    const base = apiConfig.baseURL || ""
    const endpoint = apiConfig.endpoint || ""

    const params = { ...(apiConfig.params || {}) }

    if (
      apiConfig.useLocationQuery &&
      location?.lat != null &&
      location?.lon != null
    ) {
      const key = apiConfig.locationQueryKey || "q"
      params[key] = `${location.lat},${location.lon}`
    }

    // ■ 動的パラメータ（位置情報以外）
    if (apiConfig.dynamicParams) {
      for (const key in apiConfig.dynamicParams) {

        const raw = apiConfig.dynamicParams[key]

        if (typeof raw === "function") {
          params[key] = raw({
            lat: location?.lat,
            lon: location?.lon,
            location,
            values: this.appConfig?.config?.values || {}
          })
          continue
        }

        if (typeof raw === "string") {
          const m = raw.match(/^{{(.*?)}}$/)

          if (m) {
            const valKey = m[1].trim()
            const val = this.appConfig?.config?.values?.[valKey]
            params[key] = val
            continue
          }
        }

        params[key] = raw
      }
    }

    // ■ クエリ文字列生成
    const query = Object.keys(params)
      .map(k => {

        let val = params[k]

        if (val == null) return null

        // =========================
        // bind対応
        // =========================
        if (typeof val === "string" && val.includes("{{")) {

          const m = val.match(/^{{(.*?)}}$/)

          if (m) {
            const keyName = m[1].trim()
            val = this.appConfig?.config?.values?.[keyName]
          }
        }

        if (val == null || val === "") return null

        return `${k}=${encodeURIComponent(val)}`
      })
      .filter(Boolean)
      .join("&")

    return query ? `${base}/${endpoint}?${query}` : `${base}/${endpoint}`
  }

  // =========================
  // ■ 位置情報解決
  // =========================
  async getCurrentLocation() {
    try {
      Location.setAccuracyToThreeKilometers()
      const loc = await Location.current()

      if (!loc || loc.latitude == null || loc.longitude == null) {
        return null
      }

      return {
        lat: loc.latitude,
        lon: loc.longitude,
        alt: loc.altitude
      }
  
    } catch (e) {
      console.warn("Location取得失敗 " + e)
      return null
    }
  }

  saveLocationCache(location) {
    try {
      this.storage.writeJSON("location", {
        lat: location.lat,
        lon: location.lon,
        alt: location.alt,
        name: location.name || "",
        full: location.full || "",
        timestamp: Date.now()
      })
    } catch (e) {
      console.warn("Locationキャッシュ保存失敗 " + e)
    }
  }

  getCachedLocationValid() {
    const cache = this.storage.readJSON("location")
    const cacheMinutes = this.appConfig.location?.cacheMinutes ?? 0

    if (!this.isCacheValid(cache, cacheMinutes)) return null

    return {
      lat: cache.lat,
      lon: cache.lon,
      alt: cache.alt,
      name: cache.name || "",
      full: cache.full || ""
    }
  }

  calcDistance(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // km
  }

  shouldUpdateLocation(newLoc, cachedLoc, thresholdKm = 1) {
    if (!newLoc || !cachedLoc) return true

    const dist = this.calcDistance(
      Number(newLoc.lat),
      Number(newLoc.lon),
      Number(cachedLoc.lat),
      Number(cachedLoc.lon)
    )

    return dist >= thresholdKm
  }

  async getLocationName(lat, lon) {
    try {
      const res = await Location.reverseGeocode(
        Number(lat),
        Number(lon)
      )

      if (!res || res.length === 0) return null

      const place = res[0]

      return {
        name: place.locality || place.subLocality || "",
        country: place.country || "",
        full:
          [
            place.administrativeArea,
            place.locality,
            place.subLocality
          ].filter(Boolean).join(" ")
      }

    } catch (e) {
      console.warn("Geocode失敗 " + e)
      return null
    }
  }

  // =========================
  // ■ getDateKey
  // =========================
  getDateKey() {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
  }

  // =========================
  // ■ hash
  // =========================
  hash(str){
    return encodeURIComponent(str)
  }

  // =========================
  // ■ fetch
  // =========================
  async fetch(url, cache, apiConfig = {}) {

    const req = new Request(url)
    req.method = "GET"

    // ★ timeout（秒指定）
    const timeoutSec = Number(apiConfig.timeout) / 1000 || 5
    req.timeoutInterval = timeoutSec

    const type = apiConfig.responseType || "json"

    try {

      let result

      if (type === "text") {

        result = await req.loadString()

      } else if (type === "image") {

        result = await req.loadImage()

      } else {

        result = await req.loadJSON()

      }

      return result

    }

    catch (e) {

      console.warn(`API error (${type}): ` + e)

      if (cache && cache.data) {
        console.warn("Using stale cache")
        return cache.data
      }

      throw e
    }
  }

  // =========================
  // ■ キャッシュ有効判定
  // =========================
  isCacheValid(cache, cacheMinutes = 0) {
    if (!cache || !cache.timestamp) return false
    if (!cacheMinutes) return false

    const diff = (Date.now() - cache.timestamp) / 1000 / 60
    return diff < cacheMinutes
  }

  isTodayCache(cache) {
    if (!cache || !cache.dateKey) return false
    return cache.dateKey === this.getDateKey()
  }

  isAfterRefreshHour(cache, hour = 0) {

    const now = new Date()
    const last = new Date(cache?.timestamp || 0)

    const todayRefresh = new Date()
    todayRefresh.setHours(hour, 0, 0, 0)

    // 今日の指定時刻をまだ迎えてない
    if (now < todayRefresh) {
      return this.isTodayCache(cache)
    }

    // 指定時刻後は再取得
    return last >= todayRefresh
  }

  isAfterRefreshHours(cache, hours = []) {

    if (!Array.isArray(hours) || hours.length === 0) {
      return false
    }

    const now = new Date()
    const last = new Date(cache?.timestamp || 0)

    // 今日の各refresh時刻を生成
    const todayPoints = hours
      .map(h => {
        const d = new Date()
        d.setHours(h, 0, 0, 0)
        return d
      })
      .sort((a, b) => a - b)

    // 今がどの区間にいるか判定
    let currentSlot = null

    for (const t of todayPoints) {
      if (now >= t) {
        currentSlot = t
      }
    }

    // まだ最初の時間前（例：0〜5時）
    if (!currentSlot) {
      return true // ★スルー（深夜は更新しない）
    }

    // その時間帯で既に取得済みならtrue（=キャッシュ使用）
    return last >= currentSlot
  }

}