import React, { PureComponent } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import { removeToken, getToken } from '@/common/utils/storage';
import { withRouter } from 'dva/router';
import {
  Menu,
  Spin,
  Avatar,
  Icon,
} from 'antd';
import styles from './index.less';
console.log(styles);

class RightHeader extends PureComponent {

  onMenuClick = () => {
    console.log(this);
  }

  signOut = () => {
    removeToken();
    console.log(this);
    this.props.history.push('/Login');
  }

  render () {
    const currentUser = {
      name: getToken(),
    };
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span onClick={this.signOut}>登出</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div style={{ float: 'right' }}>
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="avatar"
              />
              <span className={styles.name} style={{ color: '#fff' }}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang />
      </div>
    )
  }
}

export default withRouter(RightHeader);