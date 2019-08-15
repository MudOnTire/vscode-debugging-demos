const testTypes = [
  { value: 'justice', label: '司法鉴定' },
  { value: 'law', label: '法律纠纷' }
];

const timingTypes = [
  { value: 'normal', label: '正常时效' },
  { value: 'threeDays', label: '加快3天' },
  { value: 'twoDays', label: '加快2天' },
  { value: 'oneDay', label: '加快24小时' }
];

const orderStaus = {
  'unpaid': '未付款',
  'paid': '已付款'
};

export { testTypes, timingTypes, orderStaus };