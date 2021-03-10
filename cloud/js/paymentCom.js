function getAddRuleObj(ruleName,value,name,ruleType,checked){
		if(ruleType==1){
			let cusCheck = {"ruleName":ruleName , "ruleCode":value  , "ruleAttr":transfer(CUS_RULE_ATTR,name), "ruleType": 1 };
    		if(checked) {
    			addRuleObj.allProductRule.push(cusCheck);
    		}else{
    			for(var i=0;i<addRuleObj.allProductRule.length;i++){
	                if(addRuleObj.allProductRule[i].ruleCode === value && addRuleObj.allProductRule[i].ruleAttr === transfer(CUS_RULE_ATTR,name)){
	                    addRuleObj.allProductRule.splice(i,1);
	                }
	            }
    		}
		}else if(ruleType==2){
			let channelCheck = {"ruleName":ruleName , "ruleCode":value  , "ruleAttr":transfer(CHANNEL_RULE_ATTR,name), "ruleType": 2 };
	        if (checked){
	            addRuleObj.allProductRule.push(channelCheck)
	        }else{
	            for(var i=0;i<addRuleObj.allProductRule.length;i++){
	                if(addRuleObj.allProductRule[i].ruleCode === value && addRuleObj.allProductRule[i].ruleAttr === transfer(CHANNEL_RULE_ATTR,name)){
	                    addRuleObj.allProductRule.splice(i,1);
	                }
	            }
	        }
		}
	}
    //保存产品规则
    function _doSubmit(obj) {
    	var bv = $('.form-horizontal').data('bootstrapValidator').validate();
	    if (!bv.isValid()) {//验证不通过
	        return;
		}
	    addRuleObj.allProductRule=[];
	    $('select  option:selected').each(function(i,item){
			let ruleName=$(item).text();
			let value=$(item).attr('data-value');
			let name=$(item).attr('name');
			let ruleType=$(item).attr('data-ruleType');
			
			getAddRuleObj(ruleName,value,name,ruleType,true);
		});
	    
	    
		var parentArr = $(obj).closest('.paramList').find('.list');
        addRuleObj.productCode = $(".proNo").html();
        addRuleObj.productName = $(".proName").html();
        addRuleObj.productType = transfer(PRODUCT_TYPE,$(".proGroup").html());

        sendAjax('POST', host_url + "/channel-web/channelProductRule/addSubmit", addRuleObj, function (resp) {
            Ewin.alert({message: '恭喜你，操作成功！'}).on(function (e) {
                if (e) {
                    $('#add_form').parents('.modal').modal('hide');
                    $(".table").bootstrapTable('refresh');
                    //保存成功清空对象属性
                    addRuleObj = { productCode: "", productName: "", productType: "", allProductRule: []};
                    $('.modal').modal('hide');
                }
            });
        });
    }
    /**
     * 转换常量参数数组中text为id
     * @param paramArr 常量参数数组
     * @param value 需要格式化的id
     */
    function transfer(paramArr, value) {
        if (!paramArr || !(paramArr instanceof Array) || paramArr.length == 0) {
            return "-";
        }
        var str = '-';
        for (var i = 0; i < paramArr.length; i++) {
            if (paramArr[i].text == value) {
                str = paramArr[i].id;
            }
        }
        return str;
    }