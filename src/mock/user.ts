import Mock from 'mockjs'

// 示例：模拟获取用户信息的接口
Mock.mock('/user/current', 'get', {
  code: 200,
  msg: '操作成功',
  data: {
    uid: 1848653149812953088,
    username: null,
    email: '1716607668@qq.com',
    userRole: 'admin',
    tags: [],
    signature: null,
    sex: 1,
    avatar: null,
  },
})
