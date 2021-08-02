import service from '@/utils/request'

/**
 * 获取权限列表
 */
export function fetchRoles() {
  return service.get('/common/roles')
}

/**
 * 获取用户权限菜单列表
 */
export function fetchResource() {
  return service.get('/common/resources')
}

/**
 * 查字典
 * @param dictName 字典名称
 */
export function fetchDictDetail(dictName) {
  return service.get('/common/dict-detail', { dictName })
}

