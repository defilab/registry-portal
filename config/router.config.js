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
        path: '/data-specs/create',
        component: './DataSpec/Create',
        authority: ['both'],
      },
      {
        path: '/data-specs/:spec',
        component: './DataSpec/View',
        authority: ['both'],
      },
      {
        path: '/data-specs/:spec/edit',
        component: './DataSpec/Edit',
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
        path: '/downloads',
        name: 'downloads',
        icon: 'file',
        component: './Downloads',
        authority: ['both'],
      },
      {
        component: '404',
      },
    ],
  },
];
