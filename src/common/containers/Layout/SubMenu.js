import React, { Component } from 'react';
import { Route, Link } from 'dva/router';
import dynamic from 'dva/dynamic';
import routers from '@/config/routers';
import {
  Layout, Menu, Breadcrumb, Icon, Divider,
} from 'antd';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

function dynamicComponent({ app }, item) {
  return dynamic({
    app,
    component: routers[item.routeId].component
  });
}

export default class SubMenuNav extends Component {
	constructor (props) {
		super(props);
		this.state = {
			crumbs: []
		}
	}
	componentWillReceiveProps () {
		const { location } = this.props.history;
		const crumbs = location.pathname.split('/').slice(1);
		this.setState({
			crumbs
		});
	}
	render() {
		const { childMenu, match } = this.props;
		const { crumbs } = this.state;
		return (
			<Layout>
				<Sider width={200} style={{ background: '#fff' }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={['1']}
						defaultOpenKeys={['sub1']}
						style={{ height: '100%', borderRight: 0 }}
					>
						{
							childMenu && childMenu.map((v, i) => {
								return (
									<SubMenu key={v.path} title={<span><Icon type={v.icon} />{v.id}</span>}>
										{
											v.child && v.child.map((item, index) => {
												return (
													<Menu.Item key={item.path}><Link to={`${match.path}/${v.path}/${item.path}`}>{item.id}</Link></Menu.Item>
												)
											})
										}
									</SubMenu>
								)
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
						{
							childMenu && childMenu.map((v, i) => {
								return v.child && v.child.map((item, index) => {
									const PageComponent = dynamicComponent(this.props, item);
									return <Route key={item.routeId} path={`${match.path}/${v.path}/${item.path}`} render={(props) => <PageComponent {...props} />}></Route>
								})
							})
						}
					</Content>
				</Layout>
			</Layout>
		)
	}
}