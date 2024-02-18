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
export const findconnects = (data)=> {
    return request({
        url: '/connect/search',
        method: 'get',
        params:data
    })
}
export const deleteconnect = (id) => {
    return request({
        url: '/connect/' + id,
        method: 'delete',
    })
}

 