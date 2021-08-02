const Mock = require('mockjs')

const data = Mock.mock({
  'item': {
    'records|10': [
      {
        id: '@id',
        'value1|1-5': '★',
        value2: '@cparagraph(1, 3)',
        'value3|1': ['published', 'draft', 'deleted'],
        display_time: '@datetime',
        pageviews: '@integer(300, 5000)'
      }
    ],
    current: '@integer(1, 10)',
    size: '@integer(10, 100)',
    total: '@integer(100, 5000)',
    pages: '@integer(10, 100)'
  }
})

module.exports = [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const item = data.item
      return {
        code: 'success',
        message: null,
        data: item
      }
    }
  }
]
