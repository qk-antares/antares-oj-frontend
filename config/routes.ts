export default [
  {
    path: '/problemset/all',
    name: '题库',
    icon: 'profile',
    component: './Problem/ProblemSet'
  },
  {
    path: '/problemset',
    routes: [
      { name: '题目详情', path: '/problemset/:id', component: './Problem/ProblemDetail', hideInMenu: true},
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin'
  },
  { path: '/', redirect: '/problemset/all' },
  { path: '*', layout: false, component: './404' },
];
