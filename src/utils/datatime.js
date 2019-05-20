import moment from 'moment';

export function formatDate(str) {
  return moment(str).format('YYYY年MM月DD日');
}

export function formatDatetime(str) {
  return moment(str).format('YYYY年MM月DD日 HH:mm:ss');
}