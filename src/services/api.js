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

export async function fetchRequests () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/transactions/request`).then((data) => data.items);
}

export async function fetchResponses () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/transactions/response`).then((data) => data.items);
}

export async function fetchDataSpecs () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs`).then((data) => data.items);
}

export async function fetchDataSpec (canonicalName) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs/${canonicalName}`);
}

export async function fetchTransactions () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/transactions/balance`).then((data) => data.items);
}

export async function createDataSpec (data) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs`, {
    method: 'POST',
    body: data,
  });
}

export async function updateDataSpec (data) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs/blacklist`, {
    method: 'PATCH',
    body: data,
  });
}

export async function fetchPlatformDataSpecs () {
  return request(`/organizations/platform/specs`).then((data) => data.items);
}

export async function downloadFile (url) {
  return request(url);
}

export async function fetchActiveCert () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/certs`).then((data) => data.items)
}

export async function fetchFields () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/fields`).then((data) => data.items);
}

export async function createField (data) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState(); 
  return request(`/organizations/${namespace}/fields`, {
    method: 'POST',
    body: data
  })
}
