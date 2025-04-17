import { http } from "./http";

// 图形验证码
const commonCaptchaImage = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/common/captcha-image?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 手机验证码
const commonCaptchaPhone = (params) => {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/tms-app/common/captcha-phone?${queryString}`;
      http.get(url)
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

// 注册提交表单
const registerSubmit = (params) => {
  return new Promise((resolve, reject) => {
      const url = `/tms-app/customer/register`;
      http.post(url, params) // 直接将 params 作为请求体传递
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};




export { commonCaptchaImage,commonCaptchaPhone,registerSubmit };