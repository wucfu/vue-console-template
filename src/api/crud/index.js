import service from '@/utils/request'

export function initData(url, params) {
  return service.get(url, params)
}

export function download(url) {
  return service.get(url)
}
