import { getToken } from './token';
import jwtDecode from 'jwt-decode';

export function getAuthority() {
  let authority = null;
  const token = getToken();
  if (token) {
    authority = jwtDecode(token).organization_role;
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
