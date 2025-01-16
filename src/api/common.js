import {
    http
} from "./http";

const getDictTypes = (params, callback) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/dic/titles/${params.dicTitles}/?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
                if (response.code === 200) {
                    if (callback) callback(response.data)
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const login = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/customer/login`;
        http.post(url, params) // 直接将 params 作为请求体传递
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getWarehouseList = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/common/list-warehouse?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const commonListArgeement = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/common/list-argeement/${params.contentKind}?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getOrderTemplate = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/template/${params.title}?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const commonUpload = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        http.post({
            url: `/tms-app/common/upload?${queryString}`,
            data: params,
            headers: {
                'Content-Type': 'multipart/form-data;'
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const getCustomerInfoData = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/customer/info?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export {
    getDictTypes,
    login,
    getWarehouseList,
    commonListArgeement,
    getOrderTemplate,
    commonUpload,
    getCustomerInfoData
};