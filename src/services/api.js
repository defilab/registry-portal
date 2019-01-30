import request from '@/utils/request';
import { Base64 } from 'js-base64';

export async function login (params) {
  const body = new FormData();
  body.append('grant_type', 'password');
  body.append('username', params.userName);
  body.append('password', params.password);

  return request('/oauth/tokens', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Base64.encode('admin:secret')}`,
    },
    body,
  }).then((data) => {
    if (data) {
      return {
        status: 'ok',
        type: params.type,
        currentAuthority: 'admin',
        token: data.access_token,
      };
    }
    throw new Error('Login failed');
  });
}

export async function register () {
  return null;
}

export async function fetchOrganization () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}`);
}
