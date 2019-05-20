export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/account' },
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account',
        authority: ['requester', 'provider']
      },
      {
        path: '/fields',
        name: 'fields',
        icon: 'api',
        component: './Field/List',
        authority: ['provider', 'admin']
      },
      {
        path: '/fields/create',
        component: './Field/Create',
        authority: ['provider', 'admin']
      },
      {
        path: '/fields/:id',
        component: './Field/View',
        authority: ['requester', 'provider', 'admin']
      },
      {
        path: '/fields/:id/edit',
        component: './Field/Edit',
        authority: ['provider', 'admin']
      },
      {
        path: '/data-specs',
        name: 'data-specs',
        icon: 'api',
        component: './DataSpec/List',
        authority: ['requester', 'provider', 'admin'],
      },
      {
        path: '/data-specs/create',
        component: './DataSpec/Create',
        authority: ['provider', 'admin'],
      },
      {
        path: '/data-specs/:spec',
        component: './DataSpec/View',
        authority: ['requester', 'provider', 'admin'],
      },
      {
        path: '/data-specs/:spec/edit',
        component: './DataSpec/Edit',
        authority: ['provider', 'admin'],
      },
      {
        path: '/downloads',
        name: 'downloads',
        icon: 'file',
        component: './Downloads',
        authority: ['requester', 'provider'],
      },
      {
        component: '404',
      },
    ],
  },
];
