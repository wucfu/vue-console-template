import service from '@/utils/request'

/**
 * 分页列表
 * @param params 条件
 */
export function fetchPage(params) {
  return service.get('/sys/resource', params)
}

/**
 * 新增
 * @param params 参数
 */
export function createResource(params) {
  return service.post('/sys/resource', {}, params)
}

/**
 * 修改
 * @param id 修改ID
 * @param params 参数
 */
export function updateResource(id, params) {
  return service.put('/sys/resource/{id}', { id }, params)
}

/**
 * 删除
 * @param id 删除ID
 */
export function deleteResource(id) {
  return service.del('/sys/resource/{id}', { id })
}

