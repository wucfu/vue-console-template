export const activeStatusList = [
  { key: 0, value: '禁用' },
  { key: 1, value: '启用' }
]

export function getValue(key, dict) {
  for (let i = 0; i < dict.length; i++) {
    if (dict[i].key === key) {
      return dict[i].value
    }
  }
}
