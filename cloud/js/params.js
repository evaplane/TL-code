/**
 * 平台前段，参数列表
 */
/**********************common(开始)************************/
//系统状态
var SYS_STATUS = [
	{ id: "", text: "全部" },
	{ id: 100, text: "启用" },
	{ id: -100, text: "停用" }
];

var CORE_STATUS = [{ id: 100, text: "启用" }, { id: -100, text: "停用" }];

var USER_STATUS = [{ id: 100, text: "启用" }, { id: -100, text: "停用" }];
var SYS_CACHE_NAME = [
	{ id: "Cloud:Pub", text: "参数配置系统" }
	//	{ "id": 'Cloud:Core', "text": '核心交易系统' }
];
var IS_STATUS = [{ id: 100, text: "是" }, { id: -100, text: "否" }];
// 激活状态
var REF_STATUS = [{ id: 100, text: "可用" }, { id: -100, text: "不可用" }];
// 账号用途
var CARD_USETYPE = [{ id: 10, text: "入" }, { id: 20, text: "出" }];
// 入款订单状态
var PAY_STATUS = [
	{ id: 10, text: "发起" },
	{ id: 20, text: "处理中" },
	{ id: 30, text: "审核中" },
	{ id: 50, text: "支付中" },
	{ id: 100, text: "交易成功" },
	{ id: -100, text: "交易失败" },
	{ id: -110, text: "订单超时" }
];

// 出款订单状态
var OUT_STATUS = [
	{ id: 10, text: "发起" },
	{ id: 20, text: "处理中" },
	{ id: 30, text: "审核中" },
	{ id: 50, text: "支付中" },
	{ id: 100, text: "交易成功" },
	{ id: -100, text: "交易失败" },
	{ id: -110, text: "订单超时" }
];

// 归集订单状态
var COLLECT_STATUS = [
	{ id: 10, text: "发起" },
	{ id: 20, text: "处理中" },
	{ id: 50, text: "支付中" },
	{ id: 100, text: "交易成功" },
	{ id: -100, text: "交易失败" }
];
// 归集对象
var MERGE_TYPE = [
	{ id: 10, text: "出金人员" },
	{ id: 20, text: "归集人员" }
];

//提款订单状态 /结算方式
var TRANS_STATUS = [{ id: 10, text: "手工结算" }, { id: 20, text: "API结算" }];

// 出金限额
var PAY_QUOTA = [
	{ id: 10, text: "小额卡" },
	{ id: 20, text: "中额卡" },
	{ id: 30, text: "大额卡" },
	{ id: 40, text: "超大额卡" }
];
/**********************common(结束)************************/

/*************channel****************/

var CUS_VOUCHER_TYPE = [
	{ id: 10, text: "入金" },
	{ id: 20, text: "出金" },
	{ id: 30, text: "归集" },
	{ id: 40, text: "冲账" },
	{ id: 45, text: "退汇" }
];

var CARD_VOUCHER_TYPE = [
	{ id: 10, text: "入金" },
	{ id: 20, text: "出金" },
	{ id: 30, text: "归集" },
	{ id: 40, text: "冲账" },
	{ id: 60, text: "调账" }
];

var DEBIT_CARD = [
	{ id: 10, text: "入款卡" },
	{ id: 20, text: "出款卡" },
	{ id: 30, text: "归集卡" }
];

var ACCT_TYPE = [{ id: 1, text: "对私" }, { id: 2, text: "对公" }];

var ACCT_CARD_TYPE = [
	{ id: 1, text: "借记卡" },
	{ id: 2, text: "信用卡" },
	{ id: 3, text: "对公" }
];

//短信渠道类型
var SMS_CHANNEL_TYPE = [{ id: 10, text: "国内" }, { id: 20, text: "国际" }];

//  会员状态
var MEMBER_COMMON_STATUS = [
	{ id: 100, text: "正常" },
	{ id: -100, text: "停用" }
];

//  入款状态
var MEMBER_COMMON_RECSTATUS = [
	{ id: 100, text: "开通" },
	{ id: -100, text: "关闭" }
];

//  出款状态
var MEMBER_COMMON_PAYSTATUS = [
	{ id: 100, text: "开通" },
	{ id: -100, text: "关闭" }
];

// 借贷标识
var MEMBER_DEBIT_CREDIT = [
	{ id: 1, text: "收款_借" },
	{ id: 2, text: "付款_贷" },
	{ id: 3, text: "收付款_借贷" }
];

//审核状态
var MEMBER_AUDIT_STATUS = [
	{ id: "10", text: "待审核" },
	{ id: "100", text: "审核成功" },
	{ id: "-100", text: "审核失败" }
];
//审核状态
var MEMBER_AUDIT_STATUS_NoSUC = [
	{ id: "10", text: "待审核" },
	{ id: "-100", text: "审核失败" }
];
// 冲账状态
var C_STATUS = [
	{ id: "10", text: "待审核" },
	{ id: "100", text: "冲账成功" },
	{ id: "-100", text: "冲账失败" }
];
// 会员管理  结束

//系统管理 菜单管理
var MEANU_LEVEL = [
	{ id: 1, text: "一级菜单" },
	{ id: 2, text: "二级菜单" },
	{ id: 3, text: "三级菜单" }
];

//堡垒机状态
var BLJ_STATUS = [{ id: "100", text: "允许" }, { id: "-100", text: "拒绝" }];
