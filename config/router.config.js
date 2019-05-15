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
    authority: ['requester', 'both', 'none'],
    routes: [
      // dashboard
      { path: '/', redirect: '/organization' },
      {
        path: '/organization',
        name: 'organization',
        icon: 'profile',
        component: './Organization/Organization',
      },
      {
        path: '/organization/:namespace/info',
        component: './Organization/Info/View',
      },
      {
        path: '/account',
        name: 'account',
        icon: 'user',
        component: './Account/Account',
        authority: ['both', 'none'],
      },
      // {
      //   path: '/requests',
      //   name: 'requests',
      //   icon: 'bars',
      //   component: './Request/List'
      // },
      // {
      //   path: '/transactions',
      //   name: 'transactions',
      //   icon: 'bars',
      //   component: './Transaction/List',
      // },
      {
        path: '/data-management',
        name: 'data-management',
        icon: 'api',
        authority: ['both', 'none'],
        hideChildrenInMenu: false,
        routes: [
          {
            path: '/data-management/data-spec',
            name: 'data-spec',
            icon: 'profile',
            component: './DataSpec/List',
          },
          {
            path: '/data-management/data-spec/create',
            component: './DataSpec/Create',
            authority: ['both', 'none'],
          },
          {
            path: '/data-management/data-spec/:spec',
            component: './DataSpec/View',
            authority: ['both', 'none'],
          },
          {
            path: '/data-management/data-spec/:spec/edit',
            component: './DataSpec/Edit',
            authority: ['both', 'none'],
          },
          {
            path: '/data-management/spec-field',
            name: 'spec-field',
            icon: 'profile',
            component: './DataSpec/List',
          },
        ],
      },
      // {
      //   path: '/data-specs/create',
      //   component: './DataSpec/Create',
      //   authority: ['both','none'],
      // },
      // {
      //   path: '/data-specs/:spec',
      //   component: './DataSpec/View',
      //   authority: ['both','none'],
      // },
      // {
      //   path: '/data-specs/:spec/edit',
      //   component: './DataSpec/Edit',
      //   authority: ['both','none'],
      // },
      // {
      //   path: '/data-usage',
      //   name: 'data-usage',
      //   icon: 'bars',
      //   component: './DataUsage/List',
      //   authority: ['both'],
      // },
      {
        path: '/downloads',
        name: 'downloads',
        icon: 'file',
        component: './Downloads',
        authority: ['both', 'none'],
      },
      {
        component: '404',
      },
    ],
  },
];
