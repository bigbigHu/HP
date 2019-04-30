import React, { PureComponent } from 'react';

class ButtonField extends PureComponent {
  render () {
    const {
      children,
      prefix,
      style,
      textAlign,
    } = this.props;
    return (
      <div style={{ marginTop: '30px' }}>
        {children}
      </div>
    )
  }
}

export default ButtonField;