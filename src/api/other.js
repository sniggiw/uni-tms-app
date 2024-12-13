import { http } from "./http";

export const getCity = () => {
    return new Promise((resolve, reject) => {
        http({
            method: "get",
            url: "/common/list-area",
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
