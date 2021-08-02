import service from '@/utils/request'

/**
 * 分页列表
 * @param params 条件
 */
export function fetchPage(params) {
  return service.get('/sys/dict', params)
}

/**
 * 新增
 * @param params 参数
 */
export function createDict(params) {
  return service.post('/sys/dict', {}, params)
}

/**
 * 修改
 * @param id 修改ID
 * @param params 参数
 */
export function updateDict(id, params) {
  return service.put('/sys/dict/{id}', { id }, params)
}

/**
 * 删除
 * @param id 删除ID
 */
export function deleteDict(id) {
  return service.del('/sys/dict/{id}', { id })
}

/**
 * 分页列表
 * @param params 条件
 */
export function fetchDetailPage(params) {
  return service.get('/sys/dict/detail', params)
}

/**
 * 新增
 * @param params 参数
 */
export function createDictDetail(params) {
  return service.post('/sys/dict/detail', {}, params)
}

/**
 * 修改
 * @param id 修改ID
 * @param params 参数
 */
export function updateDictDetail(id, params) {
  return service.put('/sys/dict/detail/{id}', { id }, params)
}

/**
 * 删除
 * @param id 删除ID
 */
export function deleteDictDetail(id) {
  return service.del('/sys/dict/detail/{id}', { id })
}

