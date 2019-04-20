import React, { Component } from 'react';
import { connect } from 'dva';
import { 
	Table,
	Divider,
	Button,
	Tag,
	Menu,
	Dropdown,
	Icon,
	Modal,
	Form,
	Input,
	message
} from 'antd';

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


class OrderList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			visible: false
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
				render: text => {
					return (
						<div>
							<a onClick={this.handleEdit}>编辑</a>
							<Divider type="vertical" />
							<a onClick={this.handleClose}>删除</a>
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
		this.setState({
			visible: true
		})
	}
	handleEdit = () => {

	}
	handleClose = () => {

	}
	handleOk = () => {
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.setState({
					visible: false
				});
				value.key = this.props.todo.tableData.length + 1;
				const self = this;
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
		console.log(11);
		this.setState({
			visible: false
		})
	}
	render () {
		const { getFieldDecorator } = this.props.form;
		const { todo } = this.props;
		return (
			<div>
				<Button onClick={this.handleAdd} type="primary">新增</Button>
				<Table
					bordered
					columns={this.columns}
					dataSource={todo.tableData || data}
					rowKey={record => record.key}
				/>
				<Modal
					title="新增"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					<Form>
						<Form.Item>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: '请输入姓名' }],
							})(
								<Input placeholder="name" />
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('age', {
								rules: [{ required: true, message: '请输入年龄' }],
							})(
								<Input placeholder="age" />
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('address', {
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

export default connect(state => ({ ...state }))(Form.create()(OrderList));