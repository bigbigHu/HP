import React, { Component } from 'react';
import { connect } from 'dva';
import { Router, Route, Switch, Link, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import _ from 'lodash';
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  LocaleProvider,
  Spin,
} from 'antd';

import routers from '@/config/routers';
import Home from '@/pages/Home';
import menuConfig from '@/config/menu.json';
import NoFound from '@/common/containers/404';
import Login from '@/common/containers/Login';
import Footer from '@/common/containers/Layout/Footer';
import { getToken } from '@/common/utils/storage';
import logoImage from './logo.png';
import { RightHeader } from '@/common/components/RightHeader';
import styles from './index.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

// 主导航布局
function HocHeader (IncomComponent) {
  return connect (state => ({...state})) (class FactoryComponent extends Component {
    constructor (props) {
      super(props);
      this.state = {
        basicLayoutSelectRow: [],
        siderLayoutSelectRow: [],
        itemLayoutSelectRow: [],
      };
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
      const isLoading = this.props.loading.global;
      return (
        <LocaleProvider locale={zh_CN}>
          <Spin tip="Loading..." spinning={isLoading}>
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
          </Spin>
        </LocaleProvider>
      );
    }
  });
}

// 侧边导航布局
function HocSider (IncomComponent, childMenu, crumbs = []) {
  return class WrappingComponent extends Component {
    constructor (props) {
      super(props);
      this.state = {
        collapsed: false,
        siderOpenChange: this.props.siderOpenChange,
      };
    }

    onCollapse = (collapsed) => {
      if (collapsed) {
        this.state.siderOpenChange();
      }
      this.setState({ collapsed });
    }

    render () {
      const { propsState, siderOpenChange } = this.props;
      return (
        <Layout>
          <Sider
            width={200}
            style={{ background: '#fff', minHeight: '100vh' }}
            collapsible
            breakpoint
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            >
            <Menu
              theme="dark"
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              openKeys={propsState.siderLayoutSelectRow}
              onOpenChange={siderOpenChange}
              selectedKeys={propsState.itemLayoutSelectRow}
            >
              {
                childMenu && childMenu.map((v, i) => {
                  return (
                    <SubMenu key={v.path} title={<span><Icon type={v.icon} /><span>{v.id}</span></span>}>
                      {
                        v.child && v.child.map((item) => {
                          return (
                            <Menu.Item key={item.path}><Link replace to={item.permission}>{item.id}</Link></Menu.Item>
                          );
                        })
                      }
                    </SubMenu>
                  );
                })
              }
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
            {
              crumbs.map((v, i) => {
                return <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>;
              })
            }
            </Breadcrumb>
            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 280,
              }}
            >
              <IncomComponent />
            </Content>
            <Footer />
          </Layout>
        </Layout> 
      );
    }
  };
}

// 动态加载路由
function dynamicComponent ({ app }, item) {
  return dynamic({
    app,
    models: routers[item.routeId].models,
    component: routers[item.routeId].component,
  });
}

const NewHome = HocHeader(Home);
const NewNoFound = HocHeader(NoFound);
class RouterConfig extends Component {
  constructor (props) {
    super(props);
  }
  menuAnalysis = () => {
    let routerMenu = [];
    menuConfig.forEach(v => {
      // 访问一级路由
      v.child && routerMenu.push({
        key: v.path,
        redirect: true,
        from: `/${v.path}`,
        to: `/${v.path}/${v.child[0].path}/${v.child[0].child[0].path}`,
      });
      v.child && v.child.forEach(sider => {
        routerMenu.push({
          key: sider.path,
          redirect: true,
          from: `/${v.path}/${sider.path}`,
          to: `/${v.path}/${sider.path}/${sider.child[0].path}`,
        });
        sider.child.forEach(item => {
          routerMenu.push({
            key: item.path,
            redirect: false,
            path: `/${v.path}/${sider.path}/${item.path}`,
            component: HocHeader(HocSider(dynamicComponent(this.props, item), v.child, [v.id, sider.id, item.id])),
          });
          item.child && item.child.forEach(detail => {
            routerMenu.push({
              key: detail.path,
              redirect: false,
              path: `/${v.path}/${sider.path}/${item.path}/${detail.path}`,
              component: HocHeader(HocSider(dynamicComponent(this.props, detail), v.child, [v.id, sider.id, item.id, detail.id])),
            });
          });
        });
      });
    });
    return routerMenu;
  }
  render () {
    const { history } = this.props;
    const isLogin = getToken();
    return (
      <Router history={history}>
        <Switch>
          <Route path="/Login" exact component={Login} />
          <Route path="/" exact component={NewHome} />
          <Redirect exact from="/" to="/Home" />
          {
            this.menuAnalysis().map(v => {
              const Components = v.component;
              return v.redirect ? <Redirect exact key={v.key} from={v.from} to={v.to} /> : <Route exact key={v.key} path={v.path} render={props => {
                return isLogin
                ? <Components {...props} />
                : <Redirect to="/login" />;
                }} />;
            })
          }
          <Route component={NewNoFound} />
        </Switch>
      </Router>
    );
  }
}

export default RouterConfig;