import Mock from 'mockjs';
import amazonOrderService from './service/oms/amazonOrderService';

Mock.setup({
  timeout: '100-800',
});

Mock.mock('/api?amazonOrderService/queryList', 'post', amazonOrderService.queryList);
Mock.mock('/api?amazonOrderService/add', 'post', amazonOrderService.add);
Mock.mock('/api?amazonOrderService/remove', 'post', amazonOrderService.remove);
Mock.mock('/api?amazonOrderService/edit', 'post', amazonOrderService.edit);

