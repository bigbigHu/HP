import React, { Component } from 'react';
import pick from 'lodash/pick';
import {
  Card,
  Button,
  Table,
} from 'antd';

const cardProps = [
  'title',
  'style',
  'actions',
  'actionstop'
];
const tableProps = [
  'bordered',
  'columns',
  'dataSource',
  'rowKey',
];

class CardTable extends Component {
  render () {
    const {
      children,
      ...props
    } = this.props;
    const card = pick(props, cardProps);
    const table = pick(props, tableProps);
    console.log(this.props)
    return (
      <Card {...card}>
        <div style={{ position: 'absolute', right: '20px', zIndex: '1', top: '10px'}}>
          {this.props.actionstop}
        </div>
        <Table {...table}/>
      </Card>
    )
  }
}

export default CardTable;
