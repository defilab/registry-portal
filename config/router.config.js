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
        path: '/organization/:organization/edit',
        component: './Organization/Edit'
      },
      {
        path: '/organization/:organization',
        component: './Organization/View',
        hideInMenu: true,
        name:'view',
        routes:[
          {
            path: '/organization/:organization',

            redirect: '/organization/:organization/info',
          },
          {
            path: '/organization/:organization/info',
            name:'info',
            hideInMenu: true,
            component: './Organization/Info'
          },
          {
            path: '/organization/:organization/management',
            name:'management',
            hideInMenu: true,
            component: './Organization/Edit'
          },

        ]
      },
    
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account'
      },
      {
        path: '/fields',
        name: 'fields',
        icon: 'api',
        component: './Field/List'
      },
      {
        path: '/fields/create',
        component: './Field/Create'
      },
      {
        path: '/data-specs',
        name: 'data-specs',
        icon: 'api',
        component: './DataSpec/List',
      },
      {
        path: '/data-specs/create',
        component: './DataSpec/Create',
      },
      {
        path: '/data-specs/:spec',
        component: './DataSpec/View',
      },
      {
        path: '/data-specs/:spec/edit',
        component: './DataSpec/Edit',
      },
      {
        path: '/downloads',
        name: 'downloads',
        icon: 'file',
        component: './Downloads',
      },
      {
        component: '404',
      },
    ],
  },
];
