import React, { Component } from "react";
import _ from 'lodash';
import {
  Card,
  Form,
} from 'antd';

const cardProps = [
  'title',
  'size',
  'type',
  'bordered',
  'bodyStyle',
  'headStyle',
  'actions',
];

const formProps = [
  'layout',
  'onSubmit',
];

class CardForm extends Component {
  render () {
    const { 
      children,
      ...props
     } = this.props;
    const card = _.pick(props, cardProps);
    const form = _.pick(props, formProps);
    return (
      <Card {...card}>
        <Form {...form}>
          {children}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(CardForm);