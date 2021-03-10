$(function(){
	validateForm();
	$('.forgetPassword').height(window.innerHeight-100);
	$("#VerificationCodeBtn").attr('disabled',false);
	$("#VerificationCodeBtn").click(function (){
		$('#code_input').val('');
		$("#sms_code").val('');
		
		if($("#user_mobile").val() == ""){
			Ewin.alert({message: '手机号不能为空' }).on(function (e) {if (e) {return;}});
			return;
		}else{
			submitCode();
		}
	});
	//手机区号
	sendAjax( 'POST', host_url+"/base-web/baseTypeGroup/findBaseTypeGroupList", {"sysCode":"sys","groupName":"sys_mobile_type_group"}, function(res){
		$.each(res.rows,function(i,item){
			$('#tel').append('<option value="'+item.keyValue+'">'+item.keyName+' '+item.keyValue+'</option>')
		});
		$('#tel').comboSelect();
	});
});
//保存密码bug
function onInput(e){
	$("#newPassword").val(e.target.value);
}
function onSureInput(e){
	$("#newConfirmPassword").val(e.target.value);
}
$('#newConfirmPassword').focus(function(){
	$('#errorTip').hide();
});
var id = '';
/**
 * 获取验证码
 * @returns
 */
function submitCode(){
	var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	var user_mobile = $("#user_mobile").val();
	if(user_mobile == ""){
		Ewin.alert({message: '手机号不能为空' });
	}
	$("#VerificationCodeBtn").attr('disabled',true);
	sendAjax( 'POST', host_url+"/auth-web/authUser/getPhoneCode", {'phoneNumber':$('#tel').val()+$("#user_mobile").val()}, function(res){
		var sendBtn = document.getElementById('VerificationCodeBtn');
		var time = 61;
		var timer;
		id = res.rows;
		timer = setInterval(function() {
			time--;
			if(time <= 0) {
				sendBtn.value = '获取验证码';
				clearInterval(timer);
				time = 60;
				sendBtn.disabled = false;
				$(".Receivables_message").hide();
			} else {
				sendBtn.value = time + '秒后重新获取';
				sendBtn.disabled = true; // 禁用
				$(".Receivables_message").show();
			}
		}, 1000);
	});
	
}

/**
 * 提交确认
 * @returns
 */
function doSubmit(){
	var bv = $('#addForm').data('bootstrapValidator').validate();
	if (bv.isValid()) {
    	if($('#newPassword').val()!=$('#newConfirmPassword').val()){
    		$('#errorTip').attr("style","display:block;");
    		return;
    	}else{
    		$('#submit').attr('disabled',true);
    		var data={
    			userType: 10,
				phoneNumber:$('#tel').val()+$("#user_mobile").val(),
				code:$('#sms_code').val(),
				newPassword:$.md5($('#newPassword').val()),
				refTrValidId:id
			};
			sendAjax( 'POST', host_url+"/auth-web/authUser/forgetPass",data, function(res){
				$('#submit').attr('disabled',false);
				$('.Account_box_Assets').attr("style","display:none;");
				$('.Pass_ModifySuccess').attr("style","display:block;");
			});      
			
	        return ;
    	}
    	
	}
}

/**
 * 获取验证码时的判断
 */
function validateForm(){
	//进行表单验证
   	$('#addForm').bootstrapValidator({
		message: '输入值不合法',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	user_mobile: {
          	  message: '手机号码验证失败',
                validators: {
                    notEmpty: {
                        message: '手机号码不能为空'
                    },
					regexp: {
					    regexp: /^[1][3,4,5,7,8][0-9]{9}$/,
					    message: '代理手机号不正确'
					},
                }
            },
            sms_code: {
          	  message: '短信验证码验证失败',
                validators: {
                    notEmpty: {
                        message: '短信验证码不能为空'
                    },
                    stringLength: {//检测长度  
                        min: 6,  
                        max: 6,  
                        message: '长度必须是6位'  
                    },
                }
            },
        	newPassword: {
          	  message: '新密码验证失败',
                validators: {
                  notEmpty: {
                      message: '新密码不能为空'
                  },  
                  stringLength: {//检测长度  
                      min: 6,  
                      max: 32,  
                      message: '长度必须在6-32之间'  
                  },
                }   
            },
            newConfirmPassword: {
          	  message: '确认密码验证失败',
                validators: {
                  notEmpty: {
                      message: '确认密码不能为空'
                  },  
                  stringLength: {//检测长度  
                      min: 6,  
                      max: 32,  
                      message: '长度必须在6-32之间'  
                  },  
              }
            }
        	
        }  
     });   
}
