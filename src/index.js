import React from 'react';
import dva from 'dva';
import App from './router';
import 'antd/dist/antd.css';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/example').default);

// 4. Router
// app.router(require('./router').default);
app.router(props => <App {...props} />);

// 5. Start
app.start('#root');

