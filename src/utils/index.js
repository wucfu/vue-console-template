/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * 参数为null时，转换为空字符串
 * @param params
 */
export function transformParams(params) {
  for (const key in params) {
    if (params[key] === null) {
      params[key] = ''
    }
  }
}

/**
 * 转换url
 * @param url
 * @param params
 * @returns {{params: *, url: *}}
 */
export function transform(url, params) {
  if (typeof params === 'object') {
    for (const key in params) {
      const index = url.indexOf(`{${key}}`)
      if (index > -1) {
        url = url.replace(`{${key}}`, params[key])
        delete params[key]
      }

      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    }
    return { url, params }
  }
  return { url, params }
}

/**
 * 文件下载通用方法
 * @param fileName 文件名称
 * @param data 文件二进制内容
 */
export function fileDownload(fileName, data) {
  if (!data) {
    this.$message.error('下载内容为空')
    return
  }
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)

  document.body.appendChild(link)
  link.click()
  // 释放URL对象所占资源
  window.URL.revokeObjectURL(url)
  // 用完即删
  document.body.removeChild(link)
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * PDF预览
 * @param data 文件二进制内容
 */
export function filePreview(data) {
  if (!data) {
    this.$message.error('下载内容为空')
    return
  }
  const blob = new Blob([data], {
    type: 'application/pdf;chartset=UTF-8'
  })
  return URL.createObjectURL(blob)
}

/**
 * 同步读取文件
 * @param blob
 * @returns {Promise<unknown>}
 */
export async function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const blobReader = new Response(blob).json()
    blobReader.then(res => { return resolve(res) }).catch(err => { reject(err) })
  })
}
