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
      { path: '/', redirect: '/organization' },
      {
        path: '/organization',
        name: 'organization',
        icon: 'user',
        component: './Organization/List'
      },
      {
        path: '/organization/create',
        component: './Organization/Create'
      },
      {
        path: '/organization/:namespace/edit',
        component: './Organization/Edit'
      },
      {
        path: '/organization/:namespace',
        component: './Organization/View',
        hideInMenu: true,
        name: 'view',
        routes: [
          {
            path: '/organization/:namespace',

            redirect: '/organization/:namespace/info',
          },
          {
            path: '/organization/:namespace/info',
            name: 'info',
            hideInMenu: true,
            component: './Organization/Info'
          },
          {
            path: '/organization/:namespace/users',
            name: 'users',
            hideInMenu: true,
            component: './Organization/Users'
          },
          {
            path: '/organization/:namespace/users/create',
            name: 'userscreate',
            hideInMenu: true,
            component: './Organization/UserCreate'
          },
          {
            path: '/organization/:namespace/users/:userId/edit',
            name: 'usersedit',
            hideInMenu: true,
            component: './Organization/UserEdit'
          },
        ]
      },


      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account',
        authority: ['requester', 'provider', 'admin']
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
        path: '/data-specs/all',
        name: 'data-specs-all',
        icon: 'api',
        component: './DataSpec/All',
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
        authority: ['requester', 'provider', 'admin'],
      },
      {
        component: '404',
      },
    ],
  },
];
