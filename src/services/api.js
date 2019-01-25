import { stringify } from 'qs';
import request from '@/utils/request';
import { Base64 } from 'js-base64';

export async function queryProjectNotice () {
  return request('/api/project/notice');
}

export async function queryActivities () {
  return request('/api/activities');
}

export async function queryRule (params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule (params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule (params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule (params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm (params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData () {
  return request('/api/fake_chart_data');
}

export async function queryTags () {
  return request('/api/tags');
}

export async function queryBasicProfile () {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile () {
  return request('/api/profile/advanced');
}

export async function queryFakeList (params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList (params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList (params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList (params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function login (params) {
  const body = new FormData();
  body.append('grant_type', 'password');
  body.append('username', params.userName);
  body.append('password', params.password);

  return request('http://127.0.0.1:5000/oauth/tokens', {
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
        token: data.access_token
      };
    }
    throw new Error('Login failed');
  });
}

export async function fakeRegister (params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices (params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha (mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
