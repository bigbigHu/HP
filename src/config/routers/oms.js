// 平台运营
export default {
  // 亚马逊运营
  'OMS_ORDERLIST_AMAZON_OPERATION_MANAGE': { // 订单
    component: () => import('@/pages/OMS/AmazonOperation/AmazonOrder/index'),
    models: () => [
      import('@/pages/OMS/AmazonOperation/AmazonOrder/model/amazonOrder'),
    ],
  },
  'OMS_ORDER_DETAIL_AMAZON_OPERATION_MANAGE': { // 订单详情
    component: () => import('@/pages/OMS/AmazonOperation/AmazonOrder/detail'),
  },
  'OMS_INVENTORY_ANALYSIS_AMAZON_OPERATION_MANAGE': { // 库存分析
    component: () => import('@/pages/OMS/AmazonOperation/AmazonInventory/index'),
  },
  'OMS_INVENTORY_DETAIL_AMAZON_OPERATION_MANAGE': { // 库存分析详情
    component: () => import('@/pages/OMS/AmazonOperation/AmazonInventory/detail'),
  },
};