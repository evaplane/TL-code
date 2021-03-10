import { getPublicKey } from '@/api/common';

interface IEncryptPwd {
  publicKey: string;
  encryptPwd: string;
}

// 加密密码
export const encryptPwd = async (password: string): Promise<string> => {
  let res = await getPublicKey();
  let jsEncryptModule = await import(/* webpackChunkName: 'jsencrypt' */ 'jsencrypt');
  const encrypt = new jsEncryptModule.JSEncrypt();
  encrypt.setPublicKey(res.publicKey);
  return encrypt.encrypt(password);
};

// 加密密码，同时返回publicKey
export const encryptPwdObj = async (password: string): Promise<any> => {
  let res = await getPublicKey();
  let jsEncryptModule = await import(/* webpackChunkName: 'jsencrypt' */ 'jsencrypt');
  const encrypt = new jsEncryptModule.JSEncrypt();
  encrypt.setPublicKey(res.publicKey);
  let obj: IEncryptPwd = {
    publicKey: res.publicKey,
    encryptPwd: encrypt.encrypt(password)
  };
  return obj;
};
