import {
    http
} from "./http";

// 字典数据
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

// 登录
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

// 仓库地址信息
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

// 运输协议
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

// 上传接口
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

// 通用上传接口
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

// 个人信息接口
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

// 发货/收货人地址信息
const getContractListData = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/customer/setting/contract/list?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const settingContract = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/customer/setting/contract`;
        http.put(url, params)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 修改密码
const changePwd = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/customer/setting/changePwd`;
        http.post(url, params) // 直接将 params 作为请求体传递
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 首页
const getNewIndex = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/index-new?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 首页统计数据
const orderIndex = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/index?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 首页待我处理汇总
const orderPendingIndex = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/pending/index?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};


const orderPendingList = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/pending?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 我的订单
const orderProcessing = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/processing?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 订单轨迹
const getOrderTracks = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/order/tracks?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 更新客户资料
const updateCustomer = (params) => {
    return new Promise((resolve, reject) => {
        const url = `/tms-app/customer/setting/update`;
        http.post(url, params) // 直接将 params 作为请求体传递
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
    getCustomerInfoData,
    getContractListData,
    settingContract,
    changePwd,
    getNewIndex,
    orderIndex,
    orderPendingIndex,
    orderPendingList,
    orderProcessing,
    getOrderTracks,
    updateCustomer
};