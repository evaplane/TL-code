export const dealFormData = <T>(obj: any): IObj<string> => {
  const paramsObj: IObj<string> = {};
  let dataForm = obj.entries();
  let result = dataForm.next();
  if (result.value) {
    if (result.value[0].indexOf('file') > -1) {
      paramsObj[result.value[0]] = result.value[1].name;
    } else {
      paramsObj[result.value[0]] = result.value[1];
    }
  }
  while (!result.done) {
    result = dataForm.next();
    if (result.value) {
      if (result.value[0].indexOf('file') > -1) {
        paramsObj[result.value[0]] = result.value[1].name;
      } else {
        paramsObj[result.value[0]] = result.value[1];
      }
    }
  }
  return paramsObj;
};
