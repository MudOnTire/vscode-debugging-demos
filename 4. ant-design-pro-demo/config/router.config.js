export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' }
    ],
  },
  // pages
  {
    path: '/pages',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/pages/news-detail/:id', component: './News/Detail', hideInMenu: true },
      { path: '/pages/privacy', component: './Common/Privacy', hideInMenu: true },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      { path: '/', redirect: '/news/list' },
      {
        path: '/news',
        name: 'news',
        icon: 'read',
        routes: [
          {
            path: '/news/category',
            name: 'category',
            component: './News/Category'
          },
          {
            path: '/news/list',
            name: 'list',
            component: './News/List'
          },
          {
            path: '/news/create',
            name: 'create',
            component: './News/Edit'
          },
          {
            path: '/news/edit/:id',
            name: 'edit',
            component: './News/Edit',
            hideInMenu: true
          }
        ]
      },
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/UserSetting'
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  }
];
