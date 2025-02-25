import { http } from "./http";

const getAreaList = (params = null) => {
    return new Promise((resolve, reject) => {
        http.get("/tms-app/common/list-area", params)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getAllAreaList = () => {
    return new Promise((resolve, reject) => {
        // 第一个 请求获取中国全部地区数据
        // 后续需要请求什么数据就根据业务需求添加 传递参数即可
        Promise.all([getAreaList(), getAreaList({ lang: "en", level: 1 })])
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getCustomerInfo = () => {
    return new Promise((resolve, reject) => {
        http.get("/tms-app/customer/info")
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export { getAreaList, getAllAreaList, getCustomerInfo };
