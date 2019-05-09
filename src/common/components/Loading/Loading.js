import React, { PureComponent } from 'react';
import { Spin, Alert } from 'antd';

class Loading extends PureComponent {
  render () {
    return (
      <Spin tip="Loading...">
      </Spin>
    );
  }
}

export default Loading;