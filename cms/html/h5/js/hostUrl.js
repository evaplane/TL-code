var host_url = window.location.protocol + "//" + window.location.host + "/cms";

// var uploadImg_url = "/images/";
// 文件路径
// var folder_Url = "/usr/havi/static/folder/";



// $(function() {
//     $('.wrapper .content').height(window.innerHeight - 60);
//     $('.wrapper .main-content').css('min-height', window.innerHeight - 150);
//     $('.wrapper .forgetPassword').height(window.innerHeight - 60);
//     $('.loading').height(window.innerHeight);
// });

//设置cookie
function setCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};
//获取cookie
function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};
//删除cookie
function delCookie(name) {
    setCookie(name, null, -1);
};



//bootstrap 防止模态窗口未全部加载时，按回车键出现多个重叠窗口
// $(document).keydown(function(event) {
//     if (event.keyCode == 13) {
//         $('.modal-content').each(function() {
//             event.preventDefault();
//         });
//     }
// });