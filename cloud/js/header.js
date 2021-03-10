var menuList = [],allMenuList=[];
window.memuLists = '';
$(function () {
	if(_loginJsonObj != undefined){
		$('.user').html(_loginJsonObj.userName);
	}	
	
    //左侧菜单展示隐藏
    $('.sidebar-toggle-box').on('click', function () {
        $(document.body).toggleClass('is-sidebar-nav-open');
        if($(document.body).attr('class') == 'is-sidebar-nav-open'){
        	$('.header_content .container-fluid').prepend('<span class="header_content_logo">云记账-管理系统</span>');
        }else{
        	$('.header_content .container-fluid .header_content_logo').remove();
        }
    });
	if(_loginJsonObj == undefined){
		Ewin.alert({
		    message: "会话超时，请重新登录"
		}).on(function(e) {
		    if (e) {
		        sessionStorage.clear();
		        sessionStorage.setItem('memuLists', '');
		        sessionStorage.setItem('tabLists', '');
		        window.location.href = '../../../html/login/login.html';
		        return;
		    }
		});
		return;
	}
    //公共左侧菜单
	sendAjax('post',  host_url + "/cloud-web/ownSsoUser/loadUserAuth",{'userCode':_loginJsonObj.userCode}, function(res){
			allMenuList = res.rows;
	    	hearderList(res.rows);
			
			if(sessionStorage.getItem('memuLists')){
				memuLists = sessionStorage.getItem('memuLists');
				hearderList(memuLists);
				if (sessionStorage.getItem('tabLists') && sessionStorage.getItem('tabLists') !== '{}') {
					var obj = JSON.parse(sessionStorage.getItem('tabLists'));
					var active;
					for (var i in obj) {
						if(obj[i].active){
							active = obj[i].id
						}
						$("#tabContainer").data("tabs").addTab(obj[i]);
					}
					$("#tabContainer").data("tabs").$element.find(".nav-tabs li a[href='#" + active + "']").click();
	// 				setTimeout(function() {
	   					$("#menuUl li[data-tab='" + memuLists + "']").click();
	   					$(".account_children li[data-tab='" + active + "']").click();
	// 					tabLists = obj;
	// 					sessionStorage.setItem('tabLists')
	// 				}, 100);
				}
			}
		});
	var resizeTimer = null;
	$(window).bind('resize', function (){
		if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			$('.wrapper').css({
				'height':document.documentElement.clientHeight +'px'
			})
		} , 100);
	});
});

function hearderList(obj) {
	$(".sidebar-menu").html('');
	if(obj == 'index'){
		menuLists = [{"id":'index','menuName': '首页', 'img': "ModularTypeImg1", 'menuUrl': '#','menuCode':"12345678910","nodes":[
			{"id":11,'menuName': '首页', 'img': "ModularTypeImg1", 'menuUrl': '#','menuCode':"12345678910",}
			],
		}];
		menuList = [];
	    left('index');
	} else {
		memuLists = obj;
		sessionStorage.setItem('memuLists', memuLists);
		menuList = [];
		menuList.push(allMenuList);
		left();
	}
}

//公共左侧菜单
function left() {
	var html = '';
	for (var i = 0; i < menuList.length; i++) {
		$.each(menuList[i],function(z,itemz){
			html += '<li class="account">' +
			    '<img class="ModularTypeImg" src="../../../img/z2.png"/>' +
			    '<span>' + itemz.menuName + '</span><img class="ModularClickImg"src="../../../img/icon05.svg"/>' +
			    '<ul class="account_children">';
			
			if (menuList[i][z].nodes != undefined) {
				$.each(menuList[i][z].nodes,function(j,item){
					if(item.nodes.length!=0){
						$.each(item.nodes,function(j,items){
			        		html += '<li data-tab="' + items.id + '"><a class="'+items.iconCode+'" target="' + items.menuUrl + '">' + items.menuName + '</a></li>';
			        	});
			        	// html += '</ul></li>';
					}else{
						html += '<li data-tab="' + item.id + '"><a class="'+item.iconCode+'" target="' + item.menuUrl + '">' + item.menuName + '</a></li>';
					}
					
				});
				html += '</ul></li>';
			}
		});
		
	}
	$(".sidebar-menu").append(html);
	
	//右侧添加默认页签
//	if(allMenuList.length == 0){
//		$("#tabContainer").tabs({
//			data: [{
//				id: 'index',
//				text: '通知',
//				url: '../../../html/common/index/tips.html',
//				closeable: false
//			}],
//			showIndex: 1,
//			loadAll: false
//		});
//	}else{
		$("#tabContainer").tabs({
			data: [{
				id: 'index',
				text: '首页',
				url: '../../../html/common/index/admin_index.html',
				closeable: false
			}],
			showIndex: 1,
			loadAll: false
		});
//	}
	$('.tabContent>.tab-content>.tab-pane').css('height',window.innerHeight-100);
	$('.tabContent .tab-pane').eq(0).height(window.innerHeight-80);
	
	$('.wrapper').css('height',window.innerHeight);
	//添加页签
	$('.account_children li').click(function() {
		$('.account_children li').removeClass('active');
		$(this).addClass('active');
		var text = $(this).text().trim();
		var textid = $(this).attr('data-tab');
		
		var url = $(this).find('a').attr('target');
		if(url.indexOf('http')>=0 || url.indexOf('https')>=0){
			window.open(url,"_blank");
			return;
		}else{
			for (var i = 0; i < $('#tabContainer #myTab li a span:first-child').length; i++) {
				if ($('#tabContainer #myTab li a span:first-child').eq(i).text() == text) {
					for (var n in tabLists) {
						delete(tabLists[n].active)
					}
					tabLists[textid].active = true;
					
					sessionStorage.setItem('tabLists', JSON.stringify(tabLists));
					$('#tabContainer #myTab li a').eq(i).tab('show');
					$('aside #'+textid).find('.refreshBtn').click();
					
					var left = $('#tabContainer #myTab li').eq(i)[0].offsetLeft;
					var width = $('#tabContainer #myTab li').eq(i).width();
					var widthMax = $("#tabContainer").width();
					var obj = $('#tabContainer #myTab');
					var leftBox = Number($("#tabContainer #myTab").css('left').slice(0,-2))-29;
					if(left > widthMax){
						if(!(obj.is(":animated"))){
							$('#tabContainer #myTab').animate({left:29-(left-widthMax)-160},1000);
						}
					}
					if(left+leftBox < 0){
						if(!(obj.is(":animated"))){
							$('#tabContainer #myTab').animate({left:100-left},1000);
						}
					}
					// $("#tabContainer").data("tabs").refresh(tabLists[textid]);
					$('.alert.pull-right.col-sm-2').alert('close'); //关闭提示
					$("[data-toggle='popover']").popover('hide'); //关闭popover
					if($(".daterangepicker:visible").length > 0){
						$(".daterangepicker:visible").hide();
					}
					return false;
				}
			}
		}
		$("#tabContainer").data("tabs").addTab({
			id: textid,
			text: text,
			closeable: true,
			url: url
		});
		//页面右侧滚动条
		$("#tabContainer").data("tabs").$element.find(".nav-tabs li a[href='#" + textid + "']").tab('show');
		$('.tabContent>.tab-content>.tab-pane').css('height',window.innerHeight-100);
		var widthMax = $("#tabContainer").width();
		var width = $('#tabContainer #myTab li:last-child').width();
		var leftMax = $('#tabContainer #myTab li:last-child')[0].offsetLeft;
		var leftBox = Number($("#tabContainer #myTab").css('left').slice(0,-2));
		if(widthMax < leftMax){
			$('#tabContainer #myTab').animate({left:widthMax-leftMax-width},1000);
		}
		
		$('.alert.pull-right.col-sm-2').alert('close'); //关闭提示
		$("[data-toggle='popover']").popover('hide'); //关闭popover
		if($(".daterangepicker:visible").length > 0){
			$(".daterangepicker:visible").hide();
		}
	});
	
	//tab切换
	$('#myTab').unbind('click').on('click','li',function(e) {
		var href = $(this).find('a').attr('href').slice(1);
		var parentName;
		if(href !== 'index'){
			parentName = tabLists[href].url.split('../../html/')[1].split('/')[0];
		}else{
			parentName = 'index'
		}
		$("#menuUl li a."+parentName).click();
		$('.account_children li').each(function(i, item) {
			if (href == $(item).attr('data-tab')) {
				$(this).parents().find('li').removeClass('active');
				$(this).addClass('active');
				$('aside #'+href).find('.refreshBtn').click();
			}
		});
		$(this).find('a').tab('show');
		// $("#tabContainer").data("tabs").refresh(tabLists[href]);
		
		for (var m in tabLists) {
			delete(tabLists[m].active)
		}
		if(href !== 'index'){
			tabLists[href].active = true;
		}
		
		sessionStorage.setItem('tabLists', JSON.stringify(tabLists));
		$('.tabContent>.tab-content>.tab-pane').css('height',window.innerHeight-100);
		$('.tabContent .tab-pane').eq(0).height(window.innerHeight-80);
		
		$('.alert.pull-right.col-sm-2').alert('close'); //关闭提示
		$("[data-toggle='popover']").popover('hide'); //关闭popover
	});
}

//首页单击事件
function headerIndex(){
	$('#tabContainer #myTab li').eq(0).addClass('active').siblings().removeClass('active');
	$('.tabContent .tab-pane').eq(0).addClass('active in').siblings().removeClass('active in');
}

/**
 * 修改密码
 */
function updatePassword() {
	var data = {
		login_token: agentJsonLocal.login_token
	};
	window.location.href = '../../../html/comm/header/ModifyPassword.html';
}

/**
 * 退出登录
 */
function logout() {
	Ewin.confirm({
		message: '确定要退出吗？'
	}).on(function(e) {
		if (e) { //成功
			sendAjax('POST', host_url + "/cloud-web/ownUserLogin/logout", {}, function(res) {
				//跳转登录页面
				localStorage.setItem('sybJsonLocal ', '');
				window.location.href = '../../login/login.html';
				sessionStorage.clear();
			});
		}
	});
}
