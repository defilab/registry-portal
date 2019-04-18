import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import settings from './defaultSettings';
import targets from './targets';

// Notify user if offline now
window.addEventListener('sw.offline', () => {
  message.warning(formatMessage({ id: 'app.pwa.offline' }));
});

import(`./targets/${BUILD_TARGET}`).then(module => {
  targets.target = module.default;
  settings.title = module.default.title;
});
