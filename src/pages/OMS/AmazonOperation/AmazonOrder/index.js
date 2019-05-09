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
	Col,
} from 'antd';
import {
	CardForm,
	CardTable,
  ButtonField,
} from '@/common/components';

const confirm = Modal.confirm;
const ModalForm = Form.create()(
	class M extends Component {
		render () {
			const {
				dialogTitle,
				visible,
				handleOk,
				handleCancel,
				form,
				rowData,
			} = this.props;
			return (
				<Modal
				title={dialogTitle}
				visible={visible}
				maskClosable={false}
				onOk={handleOk}
				onCancel={handleCancel}
				>
					<Form>
						<Form.Item>
							{form.getFieldDecorator('name', {
								initialValue: rowData.name,
								rules: [{ required: true, message: '请输入姓名' }],
							})(
								<Input placeholder="name" autoComplete="off" />
							)}
						</Form.Item>
						<Form.Item>
							{form.getFieldDecorator('age', {
								initialValue: rowData.age,
								rules: [{ required: true, message: '请输入年龄' }],
							})(
								<Input placeholder="age" autoComplete="off" />
							)}
						</Form.Item>
						<Form.Item>
							{form.getFieldDecorator('address', {
								initialValue: rowData.address,
								rules: [{ required: true, message: '请输入地址' }],
							})(
								<Input placeholder="address" autoComplete="off" />
							)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	}
);

class OrderList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			visible: false,
			dialogTitle: '新增',
			rowData: {},
			pageVo: {
				pageNo: '1',
				pageSize: '10',
			},
			formValues: {},
		};
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
				render: (text, rowData) => {
					return (
						<div>
							<a href="javascript:;" onClick={() => this.handleEdit(rowData)}>编辑</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => this.handleDelete(rowData)}>删除</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => this.handleJumpDetail(rowData)}>详情</a>
						</div>	
					);
				},
			},
		];
  }
	componentDidMount () {
		let formData = this.props.form.getFieldsValue();
		this.props.dispatch({
			type: 'amazonOrder/query',
			payload: {
				params: _.assign(
					formData,
					{ pageVo: this.state.pageVo }
				),
			},
		});
	}
	handleAdd = () => {
		this.setState(_.assign(this.state, { 
			visible: true,
			dialogTitle: '新增',
			rowData: {},
		}));
	}
	handleEdit = (rowData) => {
		this.setState(_.assign(this.state, { 
			visible: true,
			dialogTitle: '编辑',
			rowData: rowData,
		}));
	}
	handleDelete = (rowData) => {
		const _this = this;
		confirm({
			title: '删除',
			content: '确认删除？',
			onOk () {
				_this.props.dispatch({
					type: 'amazonOrder/remove',
					payload: {
						params: {
							id: rowData.id,
						},
					},
				});
			},
			onCancel () {
				console.log('onCancel');
			},
		});
	}
	handleOk = (e) => {
		e.preventDefault();
		this.modalForm.props.form.validateFields((err, value) => {
			console.log(value);
			if (!err) {
				if (_.isEmpty(this.state.rowData)) {
					value.key = this.props.amazonOrder.content.length + 1;
				}
				// 新增、编辑
				this.props.dispatch({
					type: _.isEmpty(this.state.rowData)  ? 'amazonOrder/add' : 'amazonOrder/edit',
					payload: {
						params: _.assign({}, this.state.rowData, value),
					},
					callback: (info) => {
						message.success(info);
						this.setState(_.assign(this.state,{
							visible: false,
							formValues: value,
						}));
						setTimeout(this.modalForm.props.form.resetFields,300);
					},
				});
			}
		});
	}
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	}
	handleJumpDetail = (rowData) => {
		this.props.history.push({ pathname:'/OMS/AmazonOperation/AmazonOrder/detail', state: { age: rowData.age } });
	}
	handleSearch = (e) => {
		e.preventDefault();
		console.log();
		// 这里为什么不能使用this.searchForm.props.form.getFieldsValue()
		let formData = this.props.form.getFieldsValue();
		console.log(formData);
		this.props.dispatch({
			type: 'amazonOrder/query',
			payload: {
				params: _.assign(
					formData,
					{ pageVo: this.state.pageVo }
				),
			},
		});
	}

	handleTableChange = (pagination, filters, sorter) => {
		const { formValues } = this.state;
		this.setState(_.assign(this.state, {
			pageVo: {
				pageSize: pagination.pageSize,
				pageNo: pagination.current,
			},
		}));

		this.props.dispatch({
			type: 'amazonOrder/query',
			payload: {
				params: _.assign(
					formValues,
					{ pageVo: this.state.pageVo }
				),
			},
		});
	}
	
	render () {
		const { getFieldDecorator } = this.props.form;
		const { amazonOrder:{ content, pageVo, total } } = this.props;
		const { rowData, visible, dialogTitle } = this.state;
		console.log(this);
		const methods = {
			handleOk: this.handleOk,
			handleCancel: this.handleCancel,
		};

		return (
      <div>
				<CardForm
          title="查询"
          layout="inline"
          onSubmit={this.handleSearch}
          wrappedComponentRef={ref => { this.searchForm = ref; }}
				>
					<div style={{ overflow: 'hidden' }}>
						<Col span={8}>
							<Form.Item label="名称">
								{getFieldDecorator('name', {
								
								})(
									<Input placeholder="" autoComplete="off" />
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="年龄">
								{getFieldDecorator('age', {

								})(
									<Input placeholder="" autoComplete="off" />
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="地址">
								{getFieldDecorator('address', {

								})(
									<Input placeholder="" autoComplete="off" />
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
					dataSource={content||[]}
					rowKey={rowData => rowData.key}
					onChange={this.handleTableChange}
					showTotal={total}
					total={total}
					pageVo={pageVo}
					actionstop={
						[
							<Button key="add_btn" onClick={this.handleAdd} icon="plus" type="primary">新增</Button>,
						]
          }
				/>
				<ModalForm {...methods} {...this.state}
				wrappedComponentRef={ref => { this.modalForm = ref; }}
				/>
			</div>
		);
	}
}

export default connect(state => ({ ...state }))(Form.create()(withRouter(OrderList)));