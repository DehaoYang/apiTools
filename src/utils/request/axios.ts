import axios, { AxiosRequestConfig, Method } from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const request = axios.create({
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin-Type": '*'
    },
    cancelToken:source.token,
    // 请求时长
    timeout: 1000 * 30,
    // 表示跨域请求时是否需要使用凭证
    withCredentials: false,
})

request.interceptors.response.use(res => {
    return Promise.resolve(res);
},err=>{
    return Promise.reject(err)
})
export default request
