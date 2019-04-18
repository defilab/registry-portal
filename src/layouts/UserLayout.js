import React from 'react';
import Link from 'umi/link';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import targets from '../targets';
import styles from './UserLayout.less';
import logo from '../assets/logo_dark.png';
import authBg from '../assets/auth_bg.png';

const links = [];

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container} style={{ backgroundImage: `url(${authBg})` }}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
          </div>
          {children}
        </div>
        <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <GlobalFooter links={links} copyright={targets.target.copyright} />
        </div>
      </div>
    );
  }
}

export default UserLayout;
