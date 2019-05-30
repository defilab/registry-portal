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
    authority: ['requester', 'provider', 'admin'],
    routes: [
      // dashboard
      {
        path: '/',
        component: './Root'
      },
      {
        path: '/organizations',
        name: 'organizations',
        icon: 'user',
        component: './Organization/Layout',
        authority: ['admin'],
        routes: [
          {
            path: '/organizations',
            component: './Organization/List',
            authority: ['admin']
          },
          {
            path: '/organizations/create',
            component: './Organization/Create',
            authority: ['admin']
          },
          {
            path: '/organizations/:namespace/edit',
            component: './Organization/Edit',
            authority: ['admin']
          },
          {
            path: '/organizations/:namespace',
            component: './Organization/Info'
          },
          {
            path: '/organizations/:namespace/users',
            component: './Organization/Users'
          },
          {
            path: '/organizations/:namespace/users/create',
            component: './Organization/UserCreate'
          },
          {
            path: '/organizations/:namespace/users/:user_id/edit',
            component: './Organization/UserEdit'
          },
        ]
      },
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account',
        authority: ['requester', 'provider']
      },
      {
        path: '/data',
        name: 'data',
        icon: 'api',
        routes: [
          {
            path: '/data/fields',
            name: 'fields',
            component: './Field/Layout',
            authority: ['provider', 'admin'],
            routes: [
              {
                path: '/data/fields',
                component: './Field/List',
                authority: ['provider', 'admin']
              },
              {
                path: '/data/fields/create',
                component: './Field/Create',
                authority: ['provider', 'admin']
              },
              {
                path: '/data/fields/:id',
                component: './Field/View',
                authority: ['requester', 'provider', 'admin']
              },
              {
                path: '/data/fields/:id/edit',
                component: './Field/Edit',
                authority: ['provider', 'admin']
              } 
            ]
          },
          {
            path: '/data/specs',
            name: 'specs',
            component: './DataSpec/Layout',
            authority: ['requester', 'provider', 'admin'],
            routes: [
              {
                path: '/data/specs',
                component: './DataSpec/List',
                authority: ['requester', 'provider', 'admin'], 
              },
              {
                path: '/data/specs/create',
                component: './DataSpec/Create',
                authority: ['provider', 'admin'],
              },
              {
                path: '/data/specs/:spec',
                component: './DataSpec/View',
                authority: ['requester', 'provider', 'admin'],
              },
              {
                path: '/data/specs/:spec/edit',
                component: './DataSpec/Edit',
                authority: ['provider', 'admin'],
              }
            ]
          },
          {
            path: '/data/all-specs',
            name: 'all-specs',
            component: './DataSpec/Layout',
            authority: ['requester', 'provider', 'admin'],
            routes: [
              {
                path: '/data/all-specs',
                component: './DataSpec/All',
                authority: ['requester', 'provider', 'admin'], 
              },
              {
                path: '/data/all-specs/:spec',
                component: './DataSpec/View',
                authority: ['requester', 'provider', 'admin'],
              },
            ]
          },
        ]
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
