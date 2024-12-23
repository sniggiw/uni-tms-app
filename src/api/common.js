import {
    http
} from "./http";

const getDictTypes = (params,callback) => {
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

export {
    getDictTypes
};