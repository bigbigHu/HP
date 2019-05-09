import React, { PureComponent } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import { removeToken, getToken } from '@/common/utils/storage';
import { withRouter } from 'dva/router';
import {
  Menu,
  Spin,
  Avatar,
  Icon,
} from 'antd';
import styles from './index.less';

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
        <Menu.Item key="logout" onClick={this.signOut}>
          <Icon type="logout" />
          <span>登出</span>
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
      </div>
    );
  }
}

export default withRouter(RightHeader);