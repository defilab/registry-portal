export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['requester', 'both'],
    routes: [
      // dashboard
      { path: '/', redirect: '/account' },
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account'
      },
      {
        path: '/requests',
        name: 'requests',
        icon: 'bars',
        component: './Request/List'
      },
      {
        path: '/transactions',
        name: 'transactions',
        icon: 'bars',
        component: './Transaction/List'
      },
      {
        path: '/data-specs',
        name: 'data-specs',
        icon: 'api',
        component: './DataSpec/List',
        authority: ['both'],
      },
      {
        path: '/data-specs/new',
        component: './DataSpec/Form',
        authority: ['both'],
      },
      {
        path: '/data-usage',
        name: 'data-usage',
        icon: 'bars',
        component: './DataUsage/List',
        authority: ['both'],
      },
      {
        component: '404',
      },
    ],
  },
];
