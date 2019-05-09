import React, { Component } from 'react';
import { Link } from 'dva/router';
import menuConfig from '@/config/menu.json';
import {
  Layout,
  Menu,
} from 'antd';
import logoImage from '@/logo.png';
import { RightHeader } from '@/common/components/RightHeader';
import styles from '@/index.less';

// 主导航布局
class FactoryComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      basicLayoutSelectRow: [],
      siderLayoutSelectRow: [],
      itemLayoutSelectRow: [],
    };
    console.log(this.props);
  }
  componentDidMount () {
    // 主导航解析
    const { location } = this.props.history;
    const [,mainName, siderName, itemName] = location.pathname.split('/');
    this.setState({
      basicLayoutSelectRow: [mainName],
      siderLayoutSelectRow: [siderName],
      itemLayoutSelectRow: [itemName],
    });
  }
  
  shouldComponentUpdate (nextProps, nextState) {
    return true; 
  }

  basicLayoutSelect = ({ selectedKeys }) => {
    this.setState({
      basicLayoutSelectRow: selectedKeys,
    });
  }
  siderOpenChange = (selectedKeys) => {
    this.setState({
      siderLayoutSelectRow: selectedKeys,
    });
  }
  render () {
    const { basicLayoutSelectRow } = this.state;
    return (
      <Layout>
        <Layout>
          <Header className="header">
            <div>
              <div style={{ float: 'left' }}>
                <div className={styles.logo}>
                  <img src={logoImage} className={styles.image} />
                </div>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={basicLayoutSelectRow}
                  style={{ lineHeight: '64px' }}
                  onSelect={this.basicLayoutSelect}
                >
                  {
                    menuConfig.map((v) => {
                      return v.child && <Menu.Item key={v.path}><Link to={`/${v.path}`}>{v.id}</Link></Menu.Item>;
                    })
                  }
                </Menu>
              </div>
              <RightHeader />
            </div>
          </Header>
        </Layout>
        <Layout>
          <IncomComponent siderOpenChange={this.siderOpenChange} propsState={this.state} {...this.props} />
        </Layout>
      </Layout>
    );
  }
}

export default function HocHeader (IncomComponent) {
  return <FactoryComponent component={IncomComponent} />;
}
