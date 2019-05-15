import jwtDecode from 'jwt-decode';
import { getToken } from './token';

export function getAuthority() {
  let authority = null;
  const token = getToken();
  if (token) {
    authority = jwtDecode(token).organization.roles;
  }

  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
