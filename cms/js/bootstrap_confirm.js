(function($) {

    window.Ewin = function() {
        var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel" data-backdrop="static">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        var dialogdHtml = '<div id="[Id]" class="modal fade dialog" role="dialog" aria-labelledby="modalLabel" data-backdrop="static">' +
            '<div class="modal-dialog" style="width:[Width]px;height:[Height]px">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="hidden"></div><div class="modal-body"  style="max-height:[Height]px">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function() {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function(options) {
            options = $.extend({}, {
                title: "温馨提示",
                message: "您确认进行此操作吗",
                btnok: "确定",
                btncl: "取消",
                width: 200,
                auto: false
            }, options || {});
            var modalId = generateId();
            var content = html.replace(reg, function(node, key) {
                return {
                    Id: modalId,
                    Title: options.title,
                    Message: options.message,
                    BtnOk: options.btnok,
                    BtnCancel: options.btncl
                }[key];
            });
            $('body').append(content);
            $('#' + modalId).modal({
                width: options.width,
                backdrop: 'static'
            });
            $('#' + modalId).on('hide.bs.modal', function(e) {
                $('body').find('#' + modalId).remove();
            });
            return modalId;
        }

        return {
            alert: function(options) {
                if (typeof options == 'string') {
                    options = {
                        message: options
                    };
                }
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
                modal.find('.cancel').hide();

                return {
                    id: id,
                    on: function(callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function() { callback(true); });
                            modal.find('.close').click(function() { callback(true); });
                        }
                    },
                    hide: function(callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function(e) {
                                callback(e);
                            });
                        }
                    }
                };
            },
            confirm: function(options) {
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-primary').addClass('btn-primary');
                modal.find('.cancel').show();
                return {
                    id: id,
                    on: function(callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function() { callback(true); });
                            modal.find('.cancel').click(function() { callback(false); });
                        }
                    },
                    hide: function(callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function(e) {
                                callback(e);
                            });
                        }
                    }
                };
            },
            dialog: function(options) {
                options = $.extend({}, {
                    title: '',
                    url: '',
                    width: '',
                    height: 430,
                    onReady: function() {},
                    onShown: function(e) {}
                }, options || {});
                var modalId = generateId();

                var content = dialogdHtml.replace(reg, function(node, key) {
                    return {
                        Id: modalId,
                        Width: options.width,
                        Height: options.height,
                        Title: options.title
                    }[key];
                });
                $('body').append(content);
                var target = $('#' + modalId);
                target.find('.modal-body').load(options.url);
                target.find('.hidden').html(options.url);
                if (options.onReady())
                    options.onReady.call(target);
                target.modal();
                target.on('shown.bs.modal', function(e) {
                    if (options.onReady(e))
                        options.onReady.call(target, e);
                });
                target.on('hide.bs.modal', function(e) {
                    $('body').find(target).remove();
                });
            }
        }
    }();
})(jQuery);