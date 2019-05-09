import React, { Component } from 'react';
import _ from 'lodash';
import styles from './index.less';
import {
  Card,
  Table,
} from 'antd';

const cardProps = [
  'title',
  'style',
  'actions',
];
const tableProps = [
  'bordered',
  'columns',
  'dataSource',
  'rowKey',
  'pagination',
  'onChange',
  'total',
];

class CardTable extends Component {

  showTotal = (total) => {
    return `共${total}条数据`;
  }

  render () {
    const {
      children,
      ...props
    } = this.props;
    const card = _.pick(props, cardProps);
    const table = _.pick(props, tableProps);
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: table.total,
      showTotal: this.showTotal,
      loading: false,
    };
    table.pagination = _.assign(pagination, table.pagination);
    return (
      <Card {...card}>
        <div className={styles.actions}>
          {this.props.actionstop}
        </div>
        <Table {...table}/>
      </Card>
    );
  }
}

export default CardTable;
