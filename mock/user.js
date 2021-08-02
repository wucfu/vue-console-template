
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/rest/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 'failed',
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: 'success',
        message: '',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MtdG9rZW4iLCJyb2xlcyI6WyIqIl0sInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2Mjc1NDI1MzN9.AktWR3ms-Uu1wzkpWJphdlhhyQMOZ0cTXqmi0gAmRQ4',
          refreshToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoLXRva2VuIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTYyNzU0NzkzM30.ElwgryTXE1esJ3wFsSl-GYJcD-gtbPV0YMZvk9GUiig'
        }
      }
    }
  },

  {
    url: '/common/resources',
    type: 'get',
    response: {
      'code': 'success',
      'message': null,
      'data': [
        {
          'path': '/system',
          'component': 'Layout',
          'name': '系统管理',
          'meta': {
            'title': '系统管理',
            'icon': 'system'
          },
          'hidden': false,
          'cache': false,
          'children': [
            {
              'path': '/user',
              'component': 'system/user/index',
              'name': '用户管理',
              'meta': {
                'title': '用户管理',
                'icon': 'user'
              },
              'hidden': false,
              'cache': false,
              'children': []
            },
            {
              'path': '/dict',
              'component': 'system/dict/index',
              'name': '字典管理',
              'meta': {
                'title': '字典管理',
                'icon': 'dictionary'
              },
              'hidden': false,
              'cache': false,
              'children': []
            },
            {
              'path': '/resource',
              'component': 'system/resource/index',
              'name': '资源管理',
              'meta': {
                'title': '资源管理',
                'icon': 'menu'
              },
              'hidden': false,
              'cache': false,
              'children': []
            },
            {
              'path': '/role',
              'component': 'system/role/index',
              'name': '角色管理',
              'meta': {
                'title': '角色管理',
                'icon': 'role'
              },
              'hidden': false,
              'cache': false,
              'children': []
            }
          ]
        },
        {
          'path': '/demo',
          'component': 'Layout',
          'name': '示例',
          'meta': {
            'title': '示例',
            'icon': 'zujian'
          },
          'hidden': false,
          'cache': false,
          'children': [
            {
              'path': '/demo1',
              'component': 'demo/demo1/index',
              'name': '示例1',
              'meta': {
                'title': '示例1',
                'icon': 'app'
              },
              'hidden': false,
              'cache': false,
              'children': []
            },
            {
              'path': '/demo2',
              'component': 'demo/demo2/index',
              'name': '示例2',
              'meta': {
                'title': '示例2',
                'icon': 'app'
              },
              'hidden': false,
              'cache': false,
              'children': []
            }
          ]
        }
      ]
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
