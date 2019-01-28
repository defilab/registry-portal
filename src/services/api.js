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
  return Promise.resolve({
    status: 'ok',
    type: params.type,
    currentAuthority: 'admin',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjcmVhdGVkX2F0IjoiMjAxOS0wMS0yMlQxMjoyMzo1MyswMDowMCIsInBhc3N3b3JkX2hhc2giOiJwYmtkZjI6c2hhMjU2OjUwMDAwJEFxZGEydGpMJGFmNDMxMTAzYTVhNjgxNTMwYmFiZTc3YWIyZDViMGUyNjFlYzI0NmU3ZTYzMGFhNTZiNDMxOTgzMWIwMjNkYTIiLCJmaXJzdF9uYW1lIjpudWxsLCJ1c2VybmFtZSI6ImFkbWluIiwibGFzdF9uYW1lIjpudWxsLCJuYW1lc3BhY2UiOiJwdHMiLCJpZCI6MSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic3ViIjoxLCJpc3MiOiJodHRwczovL3BvaW50cy5vcmciLCJpYXQiOjE1NDg2NDM5MzksImV4cCI6MTU0OTI0ODczOSwiYXVkIjoicmVnaXN0cnktcG9ydGFsIn0.vuYKAcMV-_o5ShUZqGtWjAenkW_14QCKO3M0UmxNT1x2gdViawtjPR6GRzxraueVm0D2QKkYU_mWZsRxdkUDkABwhGQ_5tOyGaP-sDslDNedjIFvAutcHIkk3ZNTctm4DvAT3b346Mqqg_Zk0n85HYvJxKYVKamO8wKyMu-nlJo-vrMzbZhSxxeX4-m6dUa4nkF5m0a7Sz7yP9BdlhgUyGFWRaBkZRIwh_7cMTpO_a5v9r4CDjVuvsj3srhnh3ViKoUt_kP6eOqq6APuWwsgvNxyAEY-K20mPpSjt5t77vcaPceQsVVJdneFK6ZLyG5T5RIFl05CUaK1htQL7Bb2jw'
  });
  // const body = new FormData();
  // body.append('grant_type', 'password');
  // body.append('username', params.userName);
  // body.append('password', params.password);
  //
  // return request('http://127.0.0.1:5000/oauth/tokens', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Basic ${Base64.encode('admin:secret')}`,
  //   },
  //   body,
  // }).then((data) => {
  //   if (data) {
  //     return {
  //       status: 'ok',
  //       type: params.type,
  //       currentAuthority: 'admin',
  //       token: data.access_token
  //     };
  //   }
  //   throw new Error('Login failed');
  // });
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
