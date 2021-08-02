/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 密码正则表达式
 * @param password
 * @returns {boolean}
 */
export function passwordValidate(password) {
  return /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}/.test(password)
}

/**
 * 判断是否为纯数字
 * @param value
 * @returns {boolean}
 */
export function numberValidate(value) {
  return /^[0-9]*$/.test(value)
}

