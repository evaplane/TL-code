(function ($) {
    window.Ewin = function () {
        var html = '<div id="[Id]" class="modal fade confirm" role="dialog" aria-labelledby="modalLabel" data-backdrop="static">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="confirm_lib" style="word-break:break-all;line-height: 25px;">[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel btnDialog" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        var alertTipsBottom = '<div id="[Id]" class="alert alertBottom pull-right col-sm-2 [id]"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>[Message]</strong></div>';
        var alertTipsTop = '<div id="[Id]" class="alert alertTop pull-right col-sm-2 [id]"><a href="#" class="close" data-dismiss="alert">&times;</a><a href="[href]"><strong>[Message]</strong></a></div>';
        //通知
        var dialogdHtml = '<div id="[Id]" class="modal fade dialog" role="dialog" aria-labelledby="modalLabel" data-backdrop="static">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content" style="height:'+(window.innerHeight-89)+'px">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="hidden"></div><div class="modal-body">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var dialogdHtml_big = '<div id="[Id]" class="modal fade dialog big" role="dialog" aria-labelledby="modalLabel" data-backdrop="static">' +
            '<div class="modal-dialog" style="width:[Width]px;height:[Height]px">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="hidden"></div><div class="modal-body">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function () {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function (options) {
            options = $.extend({}, {
                title: "温馨提示",
                message: "您确认进行此操作吗",
                btnok: "确定",
                btncl: "取消",
                width: 200,
                auto: false
            }, options || {});
            var modalId = generateId();
            var content = html.replace(reg, function (node, key) {
                return {
                    Id: modalId,
                    Title: options.title,
                    Message: options.message,
                    BtnOk: options.btnok,
                    BtnCancel: options.btncl
                } [key];
            });
            $('body').append(content);
			// $('.modal-body').height(window.innerHeight-146-48);
			
            $('#' + modalId).modal({
                width: options.width,
				// height: window.innerHeight-146-48,
                backdrop: 'static'
            });
            $('#' + modalId).on('hide.bs.modal', function (e) {
                $('body').find('#' + modalId).remove();
            });
            return modalId;
        }
        var tips = function (options) {
            options = $.extend({}, {
                id: 'alert-success',
                message: "恭喜你，操作成功！",
                time: 2000
            }, options || {});
            var modalId = generateId();
            var content = alertTipsBottom.replace(reg, function (node, key) {
                return {
                    Message: options.message,
                    id: options.id,
                    Id: modalId
                } [key];
            });
            $('body').append(content);
            setTimeout(function(){
                $('body').find('#' + modalId).remove();
            },options.time)
            return modalId;
        }
		var tipsTop = function (options) {
		    options = $.extend({}, {
		        id: 'alert-success',
		        message: "恭喜你，操作成功！",
		        time: 2000
		    }, options || {});
		    var modalId = generateId();
		    var content = alertTipsTop.replace(reg, function (node, key) {
		        return {
		            Message: options.message,
					href: options.href,
		            id: options.id,
		            Id: modalId
		        } [key];
		    });
		    $('body').append(content);
		    setTimeout(function(){
		        $('body').find('#' + modalId).remove();
		    },options.time)
		    return modalId;
		}

        var flag = true; //防重复点击
        return {
            alert: function (options) {
                if (typeof options == 'string') {
                    options = {
                        message: options
                    };
                }
                if(options.message === '恭喜你，操作成功！'){
                    var length = $(".alert.alert-success").length;
                    if(length > 0){
                        $(".alert.alert-success").remove();
                        setTimeout(function(){
                            var id = tips(options);
                            var modal = $('#' + id);
                        },100)
                    }else{
                        var id = tips(options);
                        var modal = $('#' + id);
                    }
                    
                    return {
                        id: id,
                        on: function (callback) {
                            if (callback && callback instanceof Function) {
                                callback(true);
                            }
                        },
                        hide: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.on('hide.bs.modal', function (e) {
                                    callback(e);
                                });
                            }
                        }
                    };
                }else{
                    var id = init(options);
                    var modal = $('#' + id);
                    $('button').blur();
                    modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
                    modal.find('.cancel').remove();
                    $('#' + id).css('zIndex', 1061);
                    $('#' + id).next().css('zIndex', 1060);
    
                    return {
                        id: id,
                        on: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.find('.ok').click(function () {
                                    callback(true);
                                });
                                modal.find('.close').click(function () {
                                    callback(true);
                                });
                            }
                        },
                        hide: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.on('hide.bs.modal', function (e) {
                                    callback(e);
                                });
                            }
                        }
                    };
                }
            },
            confirm: function (options) {
                console.log(options);
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-primary').addClass('btn-primary');
                modal.find('.cancel').show();
                $('button').blur();
                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () {
                                callback(true);
                            });
                            modal.find('.cancel').click(function () {
                                callback(false);
                            });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                            });
                        }
                    }
                };
            },
            alertTipsBottom: function (options) {
                var length = $(".alert.alert-success").length;
                if(length > 0){
                    $(".alert.alert-success").remove();
                    setTimeout(function(){
                        tips(options);
                    },100)
                }else{
                    tips(options);
                }
            },
			alertTipsTop: function (options) {
			    var length = $(".alert.alert-success").length;
			    if(length > 0){
			        $(".alert.alert-success").remove();
			        setTimeout(function(){
			            tipsTop(options);
			        },100)
			    }else{
			        tipsTop(options);
			    }
			},
            dialog: function (options) {
                if (flag) {
                    flag = false;
                    $('button').blur();
                    options = $.extend({}, {
                        title: '',
                        url: '',
                        width: 550,
                        height: 430,
                        onReady: function () {},
                        onShown: function (e) {}
                    }, options || {});
                    var modalId = generateId();

                    var content = dialogdHtml.replace(reg, function (node, key) {
                        return {
                            Id: modalId,
                            Width: options.width,
                            Height: options.height,
                            bodyHeigth: options.height - 43,
                            Title: options.title
                        } [key];
                    });
                    $('body').append(content);
                    var target = $('#' + modalId);
                    target.find('.modal-body').load(options.url);
                    target.find('.hidden').html(options.url);
                    if (options.onReady())
                        options.onReady.call(target);
                    target.modal();
                    target.on('shown.bs.modal', function (e) {
                        if (options.onReady(e))
                            options.onReady.call(target, e);
							$('.modal.fade.dialog.in .modal-body .content_center_content').height(window.innerHeight-249);
                    });
                    target.on('hide.bs.modal', function (e) {
                        $('body').find(target).remove();
                    });
					
                    setTimeout(function () {
                        flag = true;
                    }, 300)
                    
                }

            },
            dialog_big: function (options) {
                if (flag) {
                    flag = false;
                    $('button').blur();
                    options = $.extend({}, {
                        title: '',
                        url: '',
                        width: 550,
                        height: 430,
                        onReady: function () {},
                        onShown: function (e) {}
                    }, options || {});
                    var modalId = generateId();
					
                    var content = dialogdHtml_big.replace(reg, function (node, key) {
                        return {
                            Id: modalId,
                            Width: options.width,
                            Height: options.height,
                            bodyHeigth: options.height - 43,
                            Title: options.title
                        } [key];
                    });
                    $('body').append(content);
                    var target = $('#' + modalId);
                    target.find('.modal-body').load(options.url);
                    target.find('.hidden').html(options.url);
                    if (options.onReady())
                        options.onReady.call(target);
                    target.modal();
                    target.on('shown.bs.modal', function (e) {
                        if (options.onReady(e))
                            options.onReady.call(target, e);
                    });
                    target.on('hide.bs.modal', function (e) {
                        $('body').find(target).remove();
                    });
                    setTimeout(function () {
                        flag = true;
                    }, 300)
                }
            },
            dialog_checked: function (options, obj) {
                if (flag) {
                    flag = false;
                    $('button').blur();
                    options = $.extend({}, {
                        title: '',
                        url: '',
                        width: 550,
                        height: 430,
                        onReady: function () {},
                        onShown: function (e) {}
                    }, options || {});
                    var modalId = generateId();
    
                    var content = dialogdHtml.replace(reg, function (node, key) {
                        return {
                            Id: modalId,
                            Width: options.width,
                            Height: options.height,
                            bodyHeigth: options.height - 43,
                            Title: options.title
                        } [key];
                    });
                    $('body').append(content);
                    var target = $('#' + modalId);
                    target.find('.modal-body').load(options.url);
                    target.find('.hidden').html(options.url);
                    if (options.onReady())
                        options.onReady.call(target);
                    target.modal();
                    target.on('shown.bs.modal', function (e) {
                        if (options.onReady(e))
                            options.onReady.call(target, e);
                    });
                    target.on('hide.bs.modal', function (e) {
                        // 用于特殊关闭当前的checkbox
                        $('#' + obj).attr('checked', false);
                        $('body').find(target).remove();
                    });
                    setTimeout(function () {
                        flag = true;
                    }, 300)
                }
            }
        }
    }();
})(jQuery);