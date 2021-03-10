import { Locale as locale } from 'vant';
locale.add({
  name: '__("姓名")',
  tel: '__("电话")',
  save: '__("保存")',
  confirm: '__("确认")',
  cancel: '__("取消")',
  delete: '__("删除")',
  complete: '__("完成")',
  loading: '__("加载中...")',
  telEmpty: '__("请填写电话")',
  nameEmpty: '__("请填写姓名")',
  confirmDelete: '__("确定要删除么")',
  telInvalid: '__("请填写正确的电话")',
  vanContactCard: {
    addText: '__("添加联系人")'
  },
  vanContactList: {
    addText: '__("新建联系人")'
  },
  vanPagination: {
    prev: '__("上一页")',
    next: '__("下一页")'
  },
  vanPullRefresh: {
    pulling: '__("下拉即可刷新...")',
    loosing: '__("释放即可刷新...")'
  },
  vanSubmitBar: {
    label: '__("合计：")'
  },
  vanCoupon: {
    valid: '__("有效期")',
    unlimited: '__("无使用门槛")',
    discount: (discount: number): string => `${discount}__('折')`,
    condition: (condition: number): string => `__('满')${condition}__('元可用')`
  },
  vanCouponCell: {
    title: '__("优惠券")',
    tips: '__("使用优惠")',
    count: (count: number): string => `${count}__('张可用')`
  },
  vanCouponList: {
    empty: '__("暂无优惠券")',
    exchange: '__("兑换")',
    close: '__("不使用优惠")',
    enable: '__("可使用优惠券")',
    disabled: '__("不可使用优惠券")',
    placeholder: '__("请输入优惠码")'
  },
  vanAddressEdit: {
    area: '__("地区")',
    postal: '__("邮政编码")',
    areaEmpty: '__("请选择地区")',
    addressEmpty: '__("请填写详细地址")',
    postalEmpty: '__("邮政编码格式不正确")',
    defaultAddress: '__("设为默认收货地址")',
    telPlaceholder: '__("收货人手机号")',
    namePlaceholder: '__("收货人姓名")',
    areaPlaceholder: '__("选择省 / 市 / 区")'
  },
  vanAddressEditDetail: {
    label: '__("详细地址")',
    placeholder: '__("街道门牌、楼层房间号等信息")'
  },
  vanAddressList: {
    add: '__("新增地址")'
  }
});
