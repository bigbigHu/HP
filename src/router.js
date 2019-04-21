import React, { Component } from 'react';
import { Router, Route, Switch, Link, Redirect } from 'dva/router';

import Home from '@/pages/Home';
import menuConfig from '@/config/menu.json';
import SubMenu from '@/common/containers/Layout/SubMenu';


import {
	Layout,
	Menu
} from 'antd';
const { Header } = Layout;

function HocHeader (IncomComponent) {
  return class FactoryComponent extends Component {
    constructor (props) {
      super(props);
      this.state = {
        basicLayoutSelectRow: []
      }
    }
    componentDidMount () {
      // 主导航解析
      const { location } = this.props.history;
      const mainName = location.pathname.split('/')[1];
      this.setState({
        basicLayoutSelectRow: [mainName]
      });
    }
    basicLayoutSelect = ({ selectedKeys }) => {
      this.setState({
        basicLayoutSelectRow: selectedKeys
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
                  menuConfig.map((v, i) => {
                    return v.child && <Menu.Item key={v.path}><Link to={`/${v.path}`}>{v.id}</Link></Menu.Item>;
                  })
                }
              </Menu>
            </Header>
          </Layout>
          <Layout>
            <IncomComponent {...this.props} />
          </Layout>
        </Layout>
      )
    }
  }
}

const NewHome = HocHeader(Home);
class RouterConfig extends Component {
  render() {
    const { history } = this.props;
    console.log(this);
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={NewHome} />
          <Redirect exact from="/" to="/Home" />
          {
            menuConfig.map((v, i) => {
              if (v.child) {
                const ChildrenLayout = HocHeader(SubMenu);
                return <Route key={v.path} path={`/${v.path}`} render={(props) => <ChildrenLayout {...props} {...this.props}  childMenu={v.child} />} />
              }
              return <Route key={v.path} path={`/${v.path}`} component={NewHome} />
            })
          }
        </Switch>
      </Router>
    )
  }
}

export default RouterConfig;
