<template>
	<div class="pay">
		<h4>{{title}}</h4>
		<van-row class="payHead">
			<van-col span="5">{{account}}</van-col>
			<van-col span="10"></van-col>
			<van-col span="9">
				<van-button
					type="info"
					size="mini"
					@click="refresh"
					:disabled="delayRefresh"
				>刷新</van-button>
				<van-button
					type="info"
					size="mini"
					@click="logout"
				>退出</van-button>
			</van-col>
		</van-row>
		<van-cell-group>
			<van-cell
				title="可用余额"
				:value="availableAmount"
			/>
			<van-cell
				title="冻结余额"
				:value="freezeAmount"
			/>
		</van-cell-group>
		<van-row class="loginAccount">
			<van-col
				span="6"
				class="title"
			>{{loginAccount}}</van-col>
			<van-col span="12"></van-col>
			<van-col span="6">
				<van-button
					type="info"
					size="mini"
					@click="grabTransOrder"
				>付款抢单</van-button>
			</van-col>
		</van-row>
		<van-grid
			:border="true"
			:column-num="5"
			class="tableHead"
		>
			<van-grid-item class="bgcolor narrow"></van-grid-item>
			<van-grid-item class="bgcolor">账户别名</van-grid-item>
			<van-grid-item class="bgcolor width">银行名称</van-grid-item>
			<van-grid-item class="bgcolor">开户姓名</van-grid-item>
			<van-grid-item class="bgcolor">余额</van-grid-item>
		</van-grid>
		<van-grid
			:border="true"
			:column-num="5"
			class="tableHead"
			v-for="item in dlsCodeList"
			:key="item.id"
			v-show="showLoginAccounts"
		>
			<van-grid-item class="narrow">
				<van-checkbox
					v-model="item.check"
					icon-size="16px"
				></van-checkbox>
			</van-grid-item>
			<van-grid-item style="width:20%;">{{item.acctAliasName}}</van-grid-item>
			<van-grid-item class="width">{{item.bankName}}</van-grid-item>
			<van-grid-item style="width:20%;">{{item.acctName}}</van-grid-item>
			<van-grid-item style="width:20%;">{{item.acctBanlance}}</van-grid-item>
		</van-grid>
		<van-row
			style="margin-bottom:10px;margin-top:10px;"
			v-show="!showLoginAccounts"
		>
			<van-col span="24">无</van-col>
		</van-row>
		<van-row class="loginAccount">
			<van-col
				span="6"
				class="title"
				v-show="showPayOrder"
			>{{payAccount}}</van-col>
			<van-col span="12"></van-col>
			<van-col span="6">
				<van-button
					type="danger"
					size="mini"
					@click="showPayDialog"
					v-show="showPayOrder"
				>无法付款</van-button>
			</van-col>
		</van-row>
		<van-overlay :show="showOverlay" />
		<van-grid
			:column-num="2"
			class="tableHead payOrders"
			style="margin-bottom:10px;"
			v-show="showPayOrder"
		>
			<van-grid-item class="odd">抢单时间</van-grid-item>
			<van-grid-item class="even">{{payOrderInfo.createTime}}</van-grid-item>
			<van-grid-item
				style="color:red"
				class="odd"
			>付款账户别名</van-grid-item>
			<van-grid-item
				style="color:red"
				class="even"
			>{{payOrderInfo.payAcctAliasName}}</van-grid-item>
			<van-grid-item class="odd">支付金额</van-grid-item>
			<van-grid-item class="copyParent even">
				<span>{{payOrderInfo.payAmt}}</span>
				<span
					v-clipboard:copy="payOrderInfo.payAmt"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					class="copy"
				>复制</span>
			</van-grid-item>
			<van-grid-item class="odd">收款银行</van-grid-item>
			<van-grid-item class="copyParent even">
				{{payOrderInfo.recBankName}}
				<span
					v-clipboard:copy="payOrderInfo.recBankName"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					class="copy"
				>复制</span>
			</van-grid-item>
			<van-grid-item class="copyParent odd">收款卡号</van-grid-item>
			<van-grid-item class="even">
				{{payOrderInfo.recAcctNo}}
				<span
					v-clipboard:copy="payOrderInfo.recAcctNo"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					class="copy"
				>复制</span>
			</van-grid-item>
			<van-grid-item class="copyParent odd">收款人</van-grid-item>
			<van-grid-item class="even">
				{{payOrderInfo.recAcctName}}
				<span
					v-clipboard:copy="payOrderInfo.recAcctName"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					class="copy"
				>复制</span>
			</van-grid-item>
			<van-grid-item class="odd">付款银行</van-grid-item>
			<van-grid-item class="even">{{payOrderInfo.payBankName}}</van-grid-item>
			<van-grid-item class="odd">付款卡号</van-grid-item>
			<van-grid-item class="even">{{payOrderInfo.payAcctNo}}</van-grid-item>
			<van-grid-item class="odd">付款人</van-grid-item>
			<van-grid-item class="even">{{payOrderInfo.payAcctName}}</van-grid-item>
			<van-grid-item class="odd">订单号</van-grid-item>
			<van-grid-item class="even">{{payOrderInfo.orderNo}}</van-grid-item>
		</van-grid>
		<van-dialog
			v-model="paynotShow"
			title="无法付款"
			show-cancel-button
			:before-close="beforeClose"
		>
			<van-row class="red">
				请确认该订单未付款
				<br />按实际情况填写失败原因
			</van-row>
			<van-field
				v-model="failureReason"
				autosize
				label="失败原因"
				type="textarea"
				placeholder="请输入失败原因"
				show-word-limit
				maxlength="20"
			/>
		</van-dialog>
	</div>
</template>

<script>
import {
	logout,
	getDlsAcctInfo,
	getDlsBankList,
	getPayOrder,
	grabTransOrder,
	doManualFailOrder,
} from "../../axios/api";
export default {
	name: "pay",
	data() {
		return {
			title: "云助手",
			account: "",
			availableAmount: "",
			freezeAmount: "",
			loginAccount: "已登录账号",
			radio: "",
			dlsCodeList: [
				{
					id: 1,
					check: false,
					acctAliasName: "",
					bankName: "",
					acctName: "",
					acctBanlance: "",
				},
			],
			payAccount: "付款订单",
			payOrderInfo: {
				createTime: "",
				payAcctAliasName: "",
				payAmt: "",
				recBankName: "",
				recAcctNo: "",
				recAcctName: "",
				payBankName: "",
				payAcctNo: "",
				payAcctName: "",
				orderNo: "",
			},
			paynotShow: false,
			failureReason: "",
			userInfo: "",
			showPayOrder: true,
			showLoginAccounts: true,
			timer: null,
			delayRefresh: false,
			isfailureOrder: false,
			showOverlay: false,
		};
	},
	created() {
		const userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
		if (userInfo) {
			this.userInfo = userInfo;
		} else {
			this.$router.push("/");
		}
	},
	mounted() {
		if (this.userInfo) {
			this.account = this.userInfo.loginName;
			this.queryDlsAcctInfo();
			this.queryDlsBankList();
			this.getPayOrder();
		}

		// 定时刷新
		if (this.timer) {
			clearInterval(this.timer);
		} else {
			this.timer = setInterval(() => {
				this.refresh();
			}, 60000);
		}
	},
	methods: {
		showPayDialog() {
			this.paynotShow = true;
			this.failureReason = "卡号与户名不符";
		},
		logout() {
			this.$dialog
				.confirm({
					title: "是否确认退出",
				})
				.then(async () => {
					// on confirm
					let userInfo = JSON.parse(
						window.sessionStorage.getItem("userInfo")
					);
					if (userInfo) {
						const res = await logout({
							loginToken: userInfo.loginToken,
						});
						if (res.retCode == "000000") {
							window.sessionStorage.removeItem("userInfo");
							window.sessionStorage.removeItem("clientTime");
							sessionStorage.removeItem("agentParamValue");
							this.$router.push("/");
						} else if (res.retCode == "888888") {
							this.$router.push("/");
						} else if (res.retCode == "000032") {
							this.$router.push("/");
						}
					}
				})
				.catch(() => {
					// on cancel
				});
		},
		// 可用余额
		async queryDlsAcctInfo() {
			const res = await getDlsAcctInfo({
				dlsCode: this.userInfo.dlsCode,
			});
			if (res.retCode == "000000") {
				this.availableAmount = (res.rows.surplusAmt / 100).toFixed(2);
				this.freezeAmount = (res.rows.freeAmt / 100).toFixed(2);
			} else if (res.retCode == "888888") {
				this.$router.push("/");
			} else if (res.retCode == "000032") {
				this.$router.push("/");
			}
		},
		// 获取已登录账号
		async queryDlsBankList() {
			const res = await getDlsBankList({
				dlsCode: this.userInfo.dlsCode,
				status: 100,
			});
			if (res.retCode == "000000") {
				if (res.rows.length > 0) {
					this.showLoginAccounts = true;
					res.rows.forEach(bank => {
						bank.check = false;
						bank.acctBanlance = (bank.acctBanlance / 100).toFixed(
							2
						);
					});
					this.dlsCodeList = res.rows;
				} else {
					this.showLoginAccounts = false;
					this.dlsCodeList = [];
				}
			} else if (res.retCode == "888888") {
				this.$router.push("/");
			} else if (res.retCode == "000032") {
				this.$router.push("/");
			}
		},
		// 付款订单查询
		async getPayOrder() {
			const res = await getPayOrder({
				page: 1,
				pageSize: 1,
				orderStatus: 10,
				status: 10,
				dlsCode: this.userInfo.dlsCode,
				loginChannel: 20,
			});

			if (res.retCode == "000000") {
				if (res.total > 0) {
					if (this.isfailureOrder) {
						this.$toast.success("已加载最新订单");
					}
					this.showPayOrder = true;
					this.payOrderInfo = res.rows[0];
					this.payOrderInfo.payAmt = (
						res.rows[0].payAmt / 100
					).toFixed(2);
					this.payOrderInfo.createTime = this.$utils.formatterDateTime(
						res.rows[0].createTime
					);
				} else {
					this.showPayOrder = false;
				}
			} else if (res.retCode == "888888") {
				this.$router.push("/");
			} else if (res.retCode == "000032") {
				this.$router.push("/");
			}
		},
		// 抢单
		async grabTransOrder() {
			this.refresh();
			let flag = false;
			let checkOrder = null;
			let checkNum = 0;
			this.dlsCodeList.forEach(item => {
				if (item.check) {
					flag = true;
					checkNum++;
					checkOrder = item;
				}
			});
			if (flag && checkNum == 1) {
				let data = {
					dlsCode: this.userInfo.dlsCode,
					payAcctNo: checkOrder.acctNo,
					payAcctAliasName: checkOrder.acctAliasName,
					payAcctName: checkOrder.acctName,
					payBankName: checkOrder.bankName,
					payBankCode: checkOrder.bankCode,
					banlanceAmt: (checkOrder.acctBanlance * 100).toFixed(0),
					loginChannel: 20,
				};

				const res = await grabTransOrder(data);
				if (res.retCode == "000000") {
					this.refresh();
					this.$notify({
						type: "success",
						message: res.retMsg,
					});
				} else {
					this.refresh();
					this.$notify({
						type: "danger",
						message: res.retMsg,
					});
					if (res.retCode == "888888") {
						this.$router.push("/");
					} else if (res.retCode == "000032") {
						this.$router.push("/");
					}
				}
			} else {
				this.$notify({
					type: "danger",
					message: "请选择一个账号,只能选择一个账号!",
				});
			}
		},
		// 确认无法付款
		async beforeClose(action, done) {
			if (action == "confirm") {
				if (this.failureReason == "") {
					this.$notify({
						type: "danger",
						message: "请输入失败原因",
					});
					done(false);
					return;
				} else {
					this.showOverlay = true;
					let data = {
						orderNo: this.payOrderInfo.orderNo,
						returnMsg: this.failureReason,
					};
					const res = await doManualFailOrder(data);
					if (res.retCode == "000000") {
						this.showOverlay = false;
						this.paynotShow = false;
						this.isfailureOrder = true;
						this.refresh();
						done();
					} else if (res.retCode == "888888") {
						this.$router.push("/");
					} else if (res.retCode == "000032") {
						this.$router.push("/");
					} else {
						this.showOverlay = false;
						this.refresh();
						this.$notify({
							type: "danger",
							message: res.retMsg,
						});
						done(false);
					}
				}
			} else {
				done();
			}
		},
		// 刷新
		refresh() {
			this.isfailureOrder = false;
			this.getPayOrder();
			this.queryDlsBankList();
			this.queryDlsAcctInfo();
			this.delayRefresh = true;
			setTimeout(() => {
				this.delayRefresh = false;
			}, 3000);
		},
		onCopy: function (e) {
			this.$notify({
				type: "success",
				message: "复制成功",
			});
		},
		onError: function (e) {
			this.$notify({
				type: "danger",
				message: "复制失败",
			});
		},
	},
	destroyed() {
		clearInterval(this.timer);
	},
};
</script>

<style lang="scss" scoped>
.pay {
	padding: 10px;
	font-size: 12px;
	h4 {
		margin-bottom: 5px;
		margin-top: 0;
		color: #00a4ff;
		font-size: 16px;
	}
	.title {
		color: #00a4ff;
		font-size: 14px;
	}
	.red {
		color: red;
		font-weight: 700;
		text-align: center;
		margin: 10px 0;
	}
	.van-cell {
		padding: 5px 10px;
		.van-cell__title {
			text-align: left;
			font-size: 12px;
		}
	}
	.payHead {
		line-height: 30px;
		margin-bottom: 5px;
		border: 1px solid #ebedf0;
		border-left: 0;
		border-right: 0;
	}
	.loginAccount {
		line-height: 30px;
	}
	.tableHead {
		border-left: 0.5px solid #ebedf0;
	}
	.van-checkbox {
		overflow: initial;
	}
	.copy {
		position: absolute;
		right: 5px;
		color: #1989fa;
	}
	.copyParent {
		position: relative;
	}
	.bgcolor {
		font-weight: 700;
	}
	.narrow {
		flex-basis: 10% !important;
	}
	.width {
		flex-basis: 30% !important;
	}
	.payOrders {
		.odd {
			flex-basis: 30% !important;
		}
		.even {
			flex-basis: 70% !important;
		}
	}
}
/deep/.over.van-grid-item {
	.van-grid-item__content--center {
		overflow: auto !important;
		align-items: baseline !important;
	}
	.van-grid-item__content:after {
		border-width: 0 0 1px 1px;
	}
}
</style>
