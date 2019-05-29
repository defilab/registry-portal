import moment from 'moment';

export function formatDate(str) {
  return moment(str).format('YYYY-MM-DD');
}

export function formatDatetime(str) {
  return moment(str).format('YYYY-MM-DD HH:mm:ss');
}