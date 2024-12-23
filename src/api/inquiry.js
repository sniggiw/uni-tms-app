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

export { getBannerData,inquiryHotToday,inquiryAddr,getInquiryZxData };