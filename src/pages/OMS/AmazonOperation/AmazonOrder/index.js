import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import _ from 'lodash';
import { 
	Divider,
	Button,
	Modal,
	Form,
	Input,
	message,
	Collapse,
	Col,
} from 'antd';
import {
	CardForm,
	CardTable,
	ButtonField,
} from '@/common/components';
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

const confirm = Modal.confirm;
const Panel = Collapse.Panel;
function callback (key){
	console.log(key);
}
class OrderList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			visible: false,
			dialogTitle: '新增',
			rowData: {},
		}
		this.columns = [
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '年龄',
				dataIndex: 'age',
				key: 'age',
			},
			{
				title: '地址',
				dataIndex: 'address',
				key: 'address',
			},
			{
				title: '操作',
				key: 'action',
				render: (text, rowData, index) => {
					return (
						<div>
							<a href="javascript:;" onClick={() => this.handleEdit(rowData)}>编辑</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => this.handleDelete(rowData)}>删除</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => this.handleJumpDetail(rowData)}>详情</a>
						</div>
						
					)
				}
			}
		]
	}
	componentDidMount () {
		this.props.dispatch({
			type: 'todo/init',
			payload: {
				tableData: data
			}
		})
	}
	handleAdd = () => {
		this.setState(_.assign(this.state, { 
			visible: true,
			dialogTitle: '新增',
			rowData: {},
		 }))
	}
	handleEdit = (rowData) => {
		this.setState(_.assign(this.state, { 
			visible: true,
			dialogTitle: '编辑',
			rowData: rowData,
		 }))
	}
	handleDelete = (rowData) => {
		confirm({
			title: '删除',
			content: '确认删除？',
			onOk () {
				console.log('ok');
			},
			onCancel () {
				console.log('onCancel');
			}
		})
	}
	handleOk = () => {
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.setState({
					visible: false
				});
				value.key = this.props.todo.tableData.length + 1;
				// 新增
				this.props.dispatch({
					type: 'todo/newAdd',
					payload: value,
					callback: (info) => {
						message.success(info);
					}
				})
			}
		});
	}
	handleCancel = () => {
		this.setState({
			visible: false
		})
	}
	handleJumpDetail = (rowData) => {
		this.props.history.push({ pathname:'/OMS/AmazonOperation/AmazonOrder/detail', state: { age: rowData.age } });
	}
	render () {
		const { getFieldDecorator } = this.props.form;
		const { todo } = this.props;
		const { rowData } = this.state;
		return (
			<div>
				<CardForm title="查询" layout="inline">
					<div style={{ overflow: 'hidden' }}>
						<Col span={8}>
							<Form.Item label="條件1">
								{getFieldDecorator('condition1', {

								})(
									<Input placeholder="placeholder" />
								)}
							</Form.Item>
						</Col>
					</div>
					<ButtonField>
						<Button htmlType="submit" type="primary" size="small" icon="search">查詢</Button>
					</ButtonField>
				</CardForm>
				<CardTable
					title="列表"
					ref={(ref) => { this.table = ref; }}
					style={{ marginTop: '20px' }}
					columns={this.columns}
					dataSource={todo.tableData || data}
					rowKey={rowData => rowData.key}
					actionstop={
						[
							<Button key="add_btn" onClick={this.handleAdd} icon="plus" type="primary">新增</Button>
						]
					}
				/>
				<Modal
					title={this.state.dialogTitle}
					visible={this.state.visible}
					maskClosable={false}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					<Form>
						<Form.Item>
							{getFieldDecorator('name', {
								initialValue: rowData.name,
								rules: [{ required: true, message: '请输入姓名' }],
							})(
								<Input placeholder="name" />
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('age', {
								initialValue: rowData.age,
								rules: [{ required: true, message: '请输入年龄' }],
							})(
								<Input placeholder="age" />
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('address', {
								initialValue: rowData.address,
								rules: [{ required: true, message: '请输入地址' }],
							})(
								<Input placeholder="address" />
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default connect(state => ({ ...state }))(Form.create()(withRouter(OrderList)));