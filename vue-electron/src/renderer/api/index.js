import axios from 'axios';
let http = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    transformRequest: [data => {
        let newData = '';
        for (let k in data) {
            if (data.hasOwnProperty(k) === true) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
        }
        return newData;
    }]
});

function apiAxios(method, url, params) {
    return http({
        method: method,
        url: 'http://localhost:9080/' + url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(res => {
        return res.data
    });
}

export default {
    get (url, params) {
        return apiAxios('GET', url, params);
    },
    post(url, params) {
        return apiAxios('POST', url, params);
    },
    put(url, params) {
        return apiAxios('PUT', url, params);
    },
    delete(url, params) {
        return apiAxios('DELETE', url, params);
    },
}