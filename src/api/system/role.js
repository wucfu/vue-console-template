import service from '@/utils/request'

/**
 * 分页列表
 * @param params 条件
 */
export function fetchPage(params) {
  return service.get('/sys/role', params)
}

/**
 * 新增
 * @param params 参数
 */
export function createRole(params) {
  return service.post('/sys/role', {}, params)
}

/**
 * 修改
 * @param id 修改ID
 * @param params 参数
 */
export function updateRole(id, params) {
  return service.put('/sys/role/{id}', { id }, params)
}

/**
 * 删除
 * @param id 删除ID
 */
export function deleteRole(id) {
  return service.del('/sys/role/{id}', { id })
}

/**
 * 通过角色ID查询对应权限
 * @param roleId
 */
export function fetchResourceIdsByRole(roleId) {
  return service.get('/sys/role/{roleId}/resource-ids', { roleId })
}

/**
 * 分配权限
 * @param roleId  角色ID
 * @param resourceIds 权限ID
 */
export function allocateResources(roleId, resourceIds) {
  return service.put('/sys/role/{roleId}/divide/resource', { roleId }, resourceIds)
}

