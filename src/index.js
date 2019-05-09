import React from 'react';
import dva from 'dva';
import App from './router';
import createLoading from '@/common/utils/create-loading';

import 'antd/dist/antd.css';
import './index.less';

// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/amazonOrder').default);

// 4. Router
// app.router(require('./router').default);
app.router(props => <App {...props} />);

// 5. Start
app.start('#root');

export default app._store;

