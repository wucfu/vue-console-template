// eslint-disable-next-line no-extend-native
Date.prototype.Format = function(fmt) {
  if (fmt === undefined || fmt == null || fmt === '') { return '' }
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

export const format_1 = 'yyyy-MM-dd hh:mm:ss'
export const format_2 = 'yyyy-MM-dd'
export const format_3 = 'yyyyMMdd'

// 时间相差值-秒
export function dateTimeSubtractToSec(date1, date2) {
  const time1 = formatterDateTime(date1)
  const time2 = formatterDateTime(date2)
  return (new Date(time1).valueOf() - new Date(time2).valueOf()) / 1000
}

// 时间格式化
export function formatterDateTime(date) {
  let d
  if (date === undefined || date === null || date.length === 0) {
    d = new Date()
  } else {
    d = new Date(date)
  }
  return d.Format(format_1)
}

// 日期格式化
export function formatterDate(date) {
  let d
  if (date === undefined || date === null || date.length === 0) {
    d = new Date()
  } else {
    d = new Date(date)
  }
  return d.Format(format_2)
}

/**
 * 格式化日期
 * @param times
 * @param pattern
 * @returns {string}
 */
export function formatTimeToStr(times, pattern) {
  let d = new Date(times).Format(format_1)
  if (pattern) {
    d = new Date(times).Format(pattern)
  }
  return d.toLocaleString()
}

// eslint-disable-next-line no-extend-native
String.prototype.toDateTimeString = function() {
  if (this != null) {
    const d = new Date(this)
    return (d.Format(format_1))
    // return (
    //     this.substring(0, 4) + "-" + this.substring(4, 6) + "-" + this.substring(6, 8) + " " + this.substring(8, 10) + ":" + this.substring(10, 12) + ":" + this.substring(12, 14)
    // );
  } else {
    return ''
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.toDateString = function() {
  if (this != null && this.length !== 0 && this !== undefined) { return this.substring(0, 4) + '-' + this.substring(4, 6) + '-' + this.substring(6, 8) } else { return '' }
}

// eslint-disable-next-line no-extend-native
String.prototype.toTimeString = function() {
  if (this != null && this.length !== 0 && this !== undefined) { return this.substring(0, 2) + ':' + this.substring(2, 4) + ':' + this.substring(4, 6) } else { return '' }
}

// eslint-disable-next-line no-extend-native
String.prototype.toMoneyString = function() {
  if (this != null) { return parseFloat(this.toString()).toFixed(2).toString() } else return 0.00
}

// eslint-disable-next-line no-extend-native
Number.prototype.toMoneyString = function() {
  if (this != null) { return this.toFixed(2).toString() } else return 0.00
}

// eslint-disable-next-line no-extend-native
Number.prototype.toPercentString = function() {
  if (this != null) {
    return (this * 100).toFixed(2).toString() + '%'
  } else {
    return 0.00 + '%'
  }
}
