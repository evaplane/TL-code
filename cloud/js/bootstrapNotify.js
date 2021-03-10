$(function() {
	let localRoleType = JSON.parse(window.localStorage.getItem("sybJsonLocal")).roleType;
	if (localRoleType == 60) {//出金财务
		$("#showNewsTipsBox").show();
		$("#showCollectNewsTipsBox").show();
		showMessage60();
	} else {
		$("#showNewsTipsBox").hide();
		$("#showCollectNewsTipsBox").hide();
	}
	if (localRoleType == 62) {//归集人员
		$("#showCollectNewsTipsBox_1").show();
		showMessage62();
	} else {
		$("#showCollectNewsTipsBox_1").hide();
	}
	if (localRoleType == 40) {//入金人员
		$("#showCollectNewsOverTimeTipsBox").show();
		$("#showCollectNewsTransactTipsBox").show();
		showMessage40();
	} else {
		$("#showCollectNewsOverTimeTipsBox").hide();
		$("#showCollectNewsTransactTipsBox").hide();
	}
	
	window.setInterval(function() {
		showNotify();
		if (localRoleType == 60) {
			showMessage60();
		}
		if (localRoleType == 40) {
			showMessage40();
		}
		if (localRoleType == 62) {
			showMessage62();
		}
	}, 10000);
});

/**
 * 入金人员消息
 */
function showMessage40() {
	sendAjax(
		"POST",
		host_url + "cloud-web/coreMessageNotify/getMergeMessageList",
		{ notifyType: 62 },
		function(res) {
			var data = res.rows;
			$("#overTime_header_tip").html(data.length);
		}
	);
	sendAjax(
		"POST",
		host_url + "cloud-web/coreMessageNotify/getMergeMessageList",
		{ notifyType: 65 },
		function(res) {
			var data = res.rows;
			$("#transact_header_tip").html(data.length);
		}
	);
}

/**
 * 出金人员消息
 */
function showMessage60() {
	sendAjax(
		"POST",
		host_url + "cloud-web/coreMessageNotify/getCoreMessageList",
		{},
		function(res) {
			var data = res.rows;
			$("#header_tip").html(data.length);
		}
	);
	sendAjax(
		"POST",
		host_url + "cloud-web/coreMessageNotify/getMergeMessageList",
		{ notifyType: 60 },
		function(res) {
			var data = res.rows;
			$("#collect_header_tip").html(data.length);
		}
	);
}
/**
 *  归集人员归集通知
 */
function showMessage62() {
	sendAjax(
		"POST",
		host_url + "cloud-web/coreMessageNotify/getMergeMessageList",
		{ notifyType: 55 },
		function(res) {
			var data = res.rows;
			$("#collect_header_tip_1").html(data.length);
		}
	);
}

/**
 * 入金、出金人员显示通知
 */
function showNotify() {
	sendAjax("POST",host_url + "cloud-web/coreMessageNotify/getCoreMessageNotify",{},
		function(res) {
			var data = res.rows;
			window.sessionStorage.setItem("notifyRows", JSON.stringify(data));
			if (data.length > 0) {
				$.each(data, function(i, item) {
					let notify = "";
					if (item.notifyType == 10) {
						notify = "入款";
					} else if (item.notifyType == 20) {
						notify = "提款";
					} else if (item.notifyType == 30) {
						notify = "审核";
					} else if (item.notifyType == 40) {
						notify = "转单";
					} else if (item.notifyType == 50) {
						notify = "拆单";
					} else if (item.notifyType == 55) {
						notify = "归集";
					}
					if (i < 3) {
						//每次最多展示3条
						var msg = formatterMoney(item.payAmt);
						if (item.notifyType == 20 || item.notifyType == 40 || item.notifyType == 50) {
							msg = "***元";
						}
						notifyMsg(notify, msg, "#" + JSON.stringify(item));
					}
				});
			}
		}
	);
}

function notifyMsg(title, msg, item) {
	var notify = $.notify(
		{
			title: "<strong>订单通知</strong>",
			icon: "star",
			message:
				"一笔新的" +
				title +
				"订单 金额：" +
				msg +
				'待领取<span class="blue">进入工作台</span>快速处理',
			url: item
		},
		{
			type: "info",
			animate: {
				enter: "animated fadeInUp",
				exit: "animated fadeOutRight"
			},
			placement: {
				from: "bottom",
				align: "right"
			},
			offset: 20,
			spacing: 10,
			z_index: 1031,
			delay: 5000,
			// timer: 1000,
			onClosed: function() {}
		}
	);
	return notify;
}
