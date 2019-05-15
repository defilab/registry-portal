import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const { className } = this.props;
    const selectedLang = getLocale();
    const locales = ['en-US', 'zh-CN'];
    const languageLabels = {
      'en-US': 'English',
      'zh-CN': '简体中文',
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>{languageLabels[locale]}</Menu.Item>
        ))}
      </Menu>
    );
    return (
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)}>
          <Icon
            type="global"
            title={formatMessage({ id: 'navBar.lang' })}
            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
          />
        </span>
      </HeaderDropdown>
    );
  }
}
