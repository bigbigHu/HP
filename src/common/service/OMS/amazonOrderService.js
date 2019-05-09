import serviceFactory from '@/common/service/BaseService/baseService';

export default serviceFactory (
  'amazonOrderService',
  [
    'queryList',
    'add',
    'remove',
    'edit',
  ],
  ''
);