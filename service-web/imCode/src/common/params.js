/**
 * 平台前端，参数列表
 */

/**********************odr(开始)************************/
const params = {};
// 问题状态
params.QS_STATUS = [
  { id: "true", text: '正常' },
  { id: "false", text: '停用' }
];

/* 参数回显
  id 需要格式化的id
  str 常量参数数组
  getText(10,'FROZEN_STATUS')
*/
params.getText = function (id, str) {
  id = id.toString();
  let json = this[str];
  if (id == "" || id == 0 || id == undefined) {
      return "-";
  }
  if (json != null && json.length > 0) {
      for (var i = 0, l = json.length; i < l; i++) {
          for (var key in json[i]) {
              if (key == "id" && json[i][key] == id) {
                  return json[i]['text'];
              }
          }
      }
  }
  return '-';
}
export default params;
