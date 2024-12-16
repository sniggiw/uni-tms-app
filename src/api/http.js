import request from "./request";

const http = {
    get(url) {
        return request.get(url);
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
