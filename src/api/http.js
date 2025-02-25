import request from "./request";

const objectToQueryString = (obj = null) => {
    if (!obj) return "";

    // 创建一个数组来存储键值对
    const pairs = [];

    // 遍历对象的每一个键值对
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 将键值对转换为字符串并添加到数组中
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        }
    }

    // 将数组中的所有键值对用 '&' 连接起来并返回
    return pairs.join("&");
};

const http = {
    get(url, params) {
        return request.get(url + `?${objectToQueryString(params)}`);
    },
    post(url, data) {
        return request.post(url, data);
    },
    put(url, data) {
        return request.put(url, data);
    },
    delete(url, params) {
        return request.delete(url, { params });
    },
};

export { http };
