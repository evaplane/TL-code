<template>
	<div @keydown.enter="login">
		<div class="homehead">
			<van-row>
				<van-col
					span="24"
					style="line-height:55px;height:55px;text-align:center;"
				>{{ title }}</van-col>
			</van-row>
		</div>
		<div class="classContent">
			<van-cell-group>
				<van-field
					v-model="name"
					placeholder="请输入账号"
					:readonly="onLogining"
					maxlength="20"
					:error-message="nameError"
					@input="nameChange"
					left-icon="manager"
				></van-field>
				<van-field
					v-model="passWord"
					:type="passType"
					maxlength="32"
					:readonly="onLogining"
					placeholder="请输入密码"
					@click-right-icon="changeType"
					:error-message="passError"
					@input="passChange"
					:right-icon="eye"
					left-icon="lock"
				></van-field>
				<van-row class="randomBox">
					<van-col span="12">
						<van-field
							v-model="randomCode"
							:readonly="onLogining"
							placeholder="请输入验证码"
							:error-message="randomError"
							@input="randomChange"
							class="iconfont icon-key randomCode"
						></van-field>
					</van-col>
					<van-col span="12">
						<img
							class="randomImage"
							:src="randomCodeSrc"
							@click="getRandomCode"
						/>
					</van-col>
				</van-row>
				<van-row class="rememberLoginName">
					<van-col span="1"></van-col>
					<van-col span="6">
						<van-checkbox
							v-model="rememberLoginName"
							shape="square"
							icon-size="12px"
						>记住账号</van-checkbox>
					</van-col>
				</van-row>
			</van-cell-group>
			<div class="btn">
				<van-button
					type="info"
					block
					@click="login"
					:loading="onLogining"
					loading-text="登录中..."
				>{{ onLogining ? "登录中" : "登录" }}</van-button>
			</div>
		</div>
		<van-row class="version">
			<van-col span="24">{{versions}}</van-col>
		</van-row>
	</div>
</template>
<script>
import { login, getRandomCode, getSysConstans } from "../axios/api";
import MD5 from "md5";
export default {
	name: "login",
	data() {
		return {
			title: "代理登录",
			name: "D",
			nameError: "",
			passWord: "",
			passType: "password",
			passError: "",
			onLogining: false,
			eye: "closed-eye",
			randomCode: "",
			passRandom: "",
			randomError: "",
			randomCode: "",
			randomCodeSrc: "",
			versions: "V1.0.0",
			rememberLoginName: false,
		};
	},
	created() {
		let loginName = JSON.parse(
			window.localStorage.getItem("rememberLoginName")
		);
		if (loginName) {
			this.rememberLoginName = true;
			this.name = loginName;
		}
	},
	mounted() {
		this.getRandomCode();
		// 禁止后退
		history.pushState(null, null, "/");
		window.addEventListener("popstate", function () {
			history.pushState(null, null, "/");
		});
	},
	methods: {
		changeType() {
			if (this.passType == "password") {
				this.passType = "text";
				this.eye = "eye-o";
			} else {
				this.passType = "password";
				this.eye = "closed-eye";
			}
		},
		nameChange(val) {
			if (!val) {
				this.nameError = "请输入账号";
			} else {
				var reg = /^[A-Za-z0-9]{6,20}$/;
				if (!reg.test(val)) {
					this.nameError = "只能输入6-20位数字、字母";
				} else {
					this.nameError = "";
				}
			}
		},
		passChange(val) {
			if (!val) {
				this.passError = "请输入密码";
			} else {
				// var reg = /^*{6,32}$/;
				if (val.length > 32 || val.length < 6) {
					this.passError = "只能输入6-32位";
				} else {
					this.passError = "";
				}
			}
		},
		randomChange(val) {
			if (!val) {
				this.randomError = "请输入验证码";
			} else {
				this.randomError = "";
			}
		},
		async login() {
			if (!this.name) {
				this.nameError = "请输入账号";
				if (!this.passWord) {
					this.passError = "请输入密码";
				}

				if (!this.randomCode) {
					this.randomError = "请输入验证码";
				}
				return;
			} else {
				if (this.nameError) return;
			}
			if (!this.passWord) {
				this.passError = "请输入密码";
				if (!this.randomCode) {
					this.randomError = "请输入验证码";
				}
				return;
			} else {
				if (this.passError) return;
			}

			if (!this.randomCode) {
				this.randomError = "请输入验证码";
				return;
			} else {
				if (this.randomError) return;
			}
			this.onLogining = true;

			let data = {
				loginName: this.name,
				password: MD5(this.passWord),
				loginChannel: 20,
				randomCode: this.randomCode,
			};
			const res = await login(data);
			if (res.retCode == "000000") {
				const res1 = await getSysConstans({
					paramCode: "OWN_AGENT_SIGN_OPEN_FLAG",
				});
				if (res1.retCode == "000000") {
					window.sessionStorage.setItem(
						"agentParamValue",
						JSON.stringify(res1.rows)
					);
					this.$router.push("/pay/pay");
					this.onLogining = false;
					window.sessionStorage.setItem(
						"userInfo",
						JSON.stringify(res.rows)
					);
					window.sessionStorage.setItem(
						"clientTime",
						JSON.stringify(new Date().getTime())
					);
					this.rememberLoginName &&
						window.localStorage.setItem(
							"rememberLoginName",
							JSON.stringify(res.rows.loginName)
						);
					if (!this.rememberLoginName) {
						window.localStorage.removeItem("rememberLoginName");
					}
				}
			} else {
				this.onLogining = false;
				this.getRandomCode();
				this.$notify({
					type: "danger",
					message: res.retMsg,
				});
			}
		},
		// 获取验证码
		getRandomCode() {
			var timestamp = new Date().valueOf();
			getRandomCode({ timestamp: timestamp })
				.then(res => {
					return (
						"data:image/png;base64," +
						btoa(
							new Uint8Array(res).reduce(
								(data, byte) =>
									data + String.fromCharCode(byte),
								""
							)
						)
					);
				})
				.then(data => {
					this.randomCodeSrc = data;
				});
		},
	},
};
</script>
<style lang="scss">
.version {
	position: absolute;
	bottom: 0;
	right: 50%;
	font-size: 12px;
	margin-right: -7px;
}
.randomCode {
	.van-field__control {
		margin-left: 5px;
	}
}
.randomImage {
	img {
		width: 100%;
		height: 44px;
	}
}
.classContent {
	.van-cell-group {
		padding-top: 20px;
		padding-bottom: 30px;
	}

	.randomBox {
		border-bottom: 1px solid #ebedf0;
	}

	.van-field__left-icon {
		color: #00a4ff;
	}

	.iconfont {
		color: #00a4ff;
	}
	.rememberLoginName {
		font-size: 12px;
		margin-top: 10px;
	}
}
</style>
