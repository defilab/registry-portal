import { message } from 'antd';
import { formatMessage } from 'umi/locale';

// Notify user if offline now
window.addEventListener('sw.offline', () => {
  message.warning(formatMessage({ id: 'app.pwa.offline' }));
});