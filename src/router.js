import React, { Component } from 'react';
import { Router, Route, Switch, Link, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon
} from 'antd';

import routers from '@/config/routers';
import Home from '@/pages/Home';
import menuConfig from '@/config/menu.json';
import NoFound from '@/common/containers/404';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
function HocHeader (IncomComponent) {
  return class FactoryComponent extends Component {
    constructor (props) {
      super(props);
      this.state = {
        basicLayoutSelectRow: [],
        sliderLayoutSelectRow: [],
        itemLayoutSelectRow: []
      }
    }
    componentDidMount () {
      // 主导航解析
      const { location } = this.props.history;
      const mainName = location.pathname.split('/')[1];
      const sliderName = location.pathname.split('/')[2];
      const itemName = location.pathname.split('/')[3];
      this.setState({
        basicLayoutSelectRow: [mainName],
        sliderLayoutSelectRow: [sliderName],
        itemLayoutSelectRow: [itemName]
      }, () => {
        console.log(this.state.sliderLayoutSelectRow, 1111);
      });
    }
    basicLayoutSelect = ({ selectedKeys }) => {
      this.setState({
        basicLayoutSelectRow: selectedKeys
      });
    }
    sliderOpenChange = (selectedKeys) => {
      this.setState({
        sliderLayoutSelectRow: selectedKeys
      });
    }
    render() {
      const { basicLayoutSelectRow } = this.state;
      return (
        <Layout>
          <Layout>
            <Header className="header">
              <div className="logo" />
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
            </Header>
          </Layout>
          <Layout>
            <IncomComponent sliderOpenChange={this.sliderOpenChange} propsState={this.state} {...this.props} />
          </Layout>
        </Layout>
      )
    }
  }
}

function HocSider (IncomComponent, childMenu, crumbs = []) {
  return class WrappingComponent extends Component {
    componentDidMount () {
      console.log(this);
    }
    render () {
      const { match, propsState, sliderOpenChange } = this.props;
      return (
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              theme="dark"
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              openKeys={propsState.sliderLayoutSelectRow}
              onOpenChange={sliderOpenChange}
              selectedKeys={propsState.itemLayoutSelectRow}
            >
              {
                childMenu && childMenu.map((v, i) => {
                  return (
                    <SubMenu key={v.path} title={<span><Icon type={v.icon} />{v.id}</span>}>
                      {
                        v.child && v.child.map((item) => {
                          return (
                            <Menu.Item key={item.path}><Link replace to={match.path}>{item.id}</Link></Menu.Item>
                          )
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
                return <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>
              })
            }
            </Breadcrumb>
            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 280,
              }}
            >
              <IncomComponent />
            </Content>
          </Layout>
        </Layout>
        
      )
    }
  }
}

function dynamicComponent({ app }, item) {
  return dynamic({
    app,
    component: routers[item.routeId].component
  });
}

const NewHome = HocHeader(Home);
const NewNoFound = HocHeader(NoFound);
class RouterConfig extends Component {
  menuAnalysis = () => {
    let routerMenu = [];
    menuConfig.forEach(v => {
      // 访问一级路由
      v.child && routerMenu.push({
        key: v.path,
        redirect: true,
        from: `/${v.path}`,
        to: `/${v.path}/${v.child[0].path}/${v.child[0].child[0].path}`
      });
      v.child && v.child.forEach(slider => {
        routerMenu.push({
          key: slider.path,
          redirect: true,
          from: `/${v.path}/${slider.path}`,
          to: `/${v.path}/${slider.path}/${slider.child[0].path}`
        });
        slider.child.forEach(item => {
          routerMenu.push({
            key: item.path,
            redirect: false,
            path: `/${v.path}/${slider.path}/${item.path}`,
            component: HocHeader(HocSider(dynamicComponent(this.props, item), v.child, [v.id, slider.id, item.id]))
          });
        })
      });
    });
    return routerMenu;
  }
  render() {
    const { history } = this.props;
    console.log(this);
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={NewHome} />
          <Redirect exact from="/" to="/Home" />
          {
            this.menuAnalysis().map(v => {
              return v.redirect ? <Redirect exact key={v.key} from={v.from} to={v.to} /> : <Route exact key={v.key} path={v.path} component={v.component} />
            })
          }
          <Route component={NewNoFound} />
        </Switch>
      </Router>
    )
  }
}

export default RouterConfig;
