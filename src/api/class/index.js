/**
 * 课程模块
 */
import request from "../../utils/request";
export const findclasss = (data)=> {
    return request({
        url: '/class/search',
        method: 'get',
        params:data
    })
}
export const findcourse = (data)=> {
    return request({
        url: '/class/getcourse',
        method: 'get',
        params:data
    })
}

export const findcontract = (data)=> {
    return request({
        url: '/class/getcontract',
        method: 'get',
        params:data
    })
}
export const addcontract = (data)=> {
    return request({
        url: '/class/contract',
        method: 'post',
        data:data
    })
}
export const addBatchcontract = (data) => {
    return request({
        url: '/class/addBatch',
        method: 'put',
        data:data
    })
}
export const changeclass = (data)=> {
    return request({
        url: '/class',
        method: 'post',
        data:data
    })
}
export const submitcourse = (data)=> {
    return request({
        url: '/class/course',
        method: 'post',
        data:data
    })
}
export const deleteclass = (id) => {
    return request({
        url: '/class/' + id,
        method: 'delete',
    })
}

export const delBatchclass = (data) => {
    return request({
        url: '/class/delBatch',
        method: 'put',
        data:data
    })
}