import service from '@/utils/request'

/**
 * 登录
 * @param params
 */
export function login(params) {
  return service.post('/rest/login', {}, params)
}

/**
 * 使用refresh token 刷新token
 * @param refreshToken
 */
export function refreshToken(refreshToken) {
  return service.post('/public/token/refresh?refreshToken={refreshToken}', { refreshToken })
}

/**
 * 重置密码
 * @param params
 */
export function resetPassword(params) {
  return service.put('/sys/user/reset-password', {}, params)
}

/**
 * 分页查询用户列表
 * @param params
 */
export function fetchUserPage(params) {
  return service.get('/sys/user/page', params)
}

/**
 * 创建用户
 * @param params
 */
export function createUser(params) {
  return service.post('/sys/user', {}, params)
}

/**
 * 重设密码
 * @param userId
 */
export function rebuildPassword(userId) {
  return service.put('/sys/user/rebuild-password/{userId}', { userId })
}

/**
 * 更新用户
 * @param id
 * @param params
 */
export function updateUser(id, params) {
  return service.put('/sys/user/{id}', { id }, params)
}

/**
 * 启用用户
 * @param userId
 */
export function enableUser(userId) {
  return service.put('/sys/user/enable/{userId}', { userId })
}

/**
 * 禁用用户
 * @param userId
 */
export function disableUser(userId) {
  return service.put('/sys/user/disable/{userId}', { userId })
}
