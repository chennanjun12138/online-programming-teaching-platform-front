import axios from 'axios'

// 创建一个axios对象出来
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    const user = localStorage.getItem("user");
    if (user) {
        config.headers['token'] = JSON.parse(user).token;
    }
    // config.headers['token'] = user.token;  // 设置请求头
    return config
}, error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // response.data即为后端返回的Result
        let res = response.data;
        console.log(response)
        // // 兼容服务端返回的字符串数据
        // if (typeof res === 'string') {
        //     res = res ? JSON.parse(res) : res
        // }
        // return res;
        // 简化全局
       
        if (res.code === '0' || res instanceof Blob) {
            // 兼容服务端返回的字符串数据
            if (typeof res === 'string') {
                res = res ? JSON.parse(res) : res
            }
            return res;
        }
        else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
            if(res.msg=='token验证失败，请重新登录')
            {
                localStorage.removeItem("user");
                router.push("/login");
            }
        }

    },
    error => {
        window.$message({
            message: "超时",
            type: 'error'
        });
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request