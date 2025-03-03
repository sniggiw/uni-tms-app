import {
  http
} from "./http";

const getBillInfo = (params) => {
  return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/order/bills/info/${params.orderId}/?${queryString}`;
      http.get(url)
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

// 查询流水凭证
const getBillsVoucher = (params) => {
  return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/order/bills/voucher/${params.orderId}/?${queryString}`;
      http.get(url)
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

//专线入库流程信息
const zxIncomeInfo = (params) => {
  return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/zx/order-dtl/income/info/${params.orderId}/?${queryString}`;
      http.get(url)
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

// 账单确认-专线
const billConfirmZx = (params) => {
  return new Promise((resolve, reject) => {
      const url = `/tms-app/zx/order/bills/confirm/${params.orderId}`;
      http.post(url, params) // 直接将 params 作为请求体传递
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

// 我已完成付费
const billsPay = (params) => {
  return new Promise((resolve, reject) => {
      const url = `/tms-app/order/bills/pay/${params.orderId}`;
      http.post(url, params) // 直接将 params 作为请求体传递
          .then((response) => {
              resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
  });
};

// 下载excel账单-专线
const downloadBillsExcelZx = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/zx/order/bills/download/excel/${params.orderId}/?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 下载pdf账单-专线
const downloadBillsPdfZx = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/zx/order/bills/download/pdf/${params.orderId}/?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const downloadResource = (params) => {
    return new Promise((resolve, reject) => {
        // 使用 URLSearchParams 构建查询参数
        const queryParams = new URLSearchParams();
        if (params.resource) {
            queryParams.append('resource', params.resource);
        }
        if (params.delete) {
            queryParams.append('delete', params.delete);
        }
        if (params.downloadName) {
            queryParams.append('downloadName', params.downloadName);
        }

        // 构建完整的 URL
        const url = `/tms-app/common/download/resource?${queryParams.toString()}`;

        // 发起 GET 请求
        http.get(url)
            .then((response) => {
                resolve(response); // 请求成功，返回响应数据
            })
            .catch((error) => {
                reject(error); // 请求失败，返回错误信息
            });
    });
};

export {
  getBillInfo,
  getBillsVoucher,
  zxIncomeInfo,
  billConfirmZx,
  billsPay,
  downloadBillsExcelZx,
  downloadBillsPdfZx,
  downloadResource
};