import request from "../../utils/request";
export const addconnect = (data)=> {
    return request({
        url: '/connect',
        method: 'post',
        data:data
    })
}

export const findteachers = (data)=> {
    return request({
        url: '/connect/findteachers',
        method: 'get',
        params:data
    })
}