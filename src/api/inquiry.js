import { http } from "./http";

const getBannerData = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/common/list-banner?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const inquiryHotToday = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/common/inquiry/hot/today?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 起运地/目的地
const inquiryAddr = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/common/inquiry/addr?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 起运地/目的地
const getInquiryZxData = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/zx/inquiry?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 起运地/目的地
const inquiryHistory = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/common/inquiry/history?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getInquiryZxDetail = (params) => {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `/tms-app/zx/inquiry/detail?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const postinquiryHistory = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/common/inquiry/history`;
        http.post(url, params) // 直接将 params 作为请求体传递
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const listReceiverCity = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/zx/inquiry/country/list-receiver-city?${queryString}`;
        http.get(url) // 直接将 params 作为请求体传递
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getChannelCode = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/zx/inquiry/list-channel-code?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 快捷下单
const submitQuick = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/zx/order/submit-quick`;
        http.post(url, params) // 直接将 params 作为请求体传递
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export { getBannerData,inquiryHotToday,inquiryAddr,getInquiryZxData,inquiryHistory,getInquiryZxDetail,postinquiryHistory,listReceiverCity,getChannelCode,submitQuick };