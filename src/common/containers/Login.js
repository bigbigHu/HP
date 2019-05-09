import React, { Component } from 'react';
import { setToken } from '@/common/utils/storage';
import { withRouter } from 'dva/router';
import styles from './login.less';
import {
    Form,
    Input,
    Icon,
    Button,
    Checkbox,
} from 'antd';
const { Item } = Form;
class LoginPage extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    console.log(this.props.history);
    this.props.form.validateFields();
	}
	
	hasErrors = (fieldsError) => {
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}
	
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        setToken(values.userName);
        // this.props.history.push('/');
        location.href = '/';
      }
    });
  }

  render () {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 26 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className={styles.container}>
        <div className={styles.login} >
          <div className={styles.top}>Welcome Bids</div>
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <Item
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
              className={styles.center}
            >
              {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </Item>
            <Item
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
              className={styles.center}
              >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Item>
            <Item
              className={styles.center}
            >
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
            </Item>
            <Item
              className={styles.center}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%'}}
                disabled={this.hasErrors(getFieldsError())}
              >
                登录
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    );
  }
}
const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(LoginPage);

export default withRouter(WrappedHorizontalLoginForm);