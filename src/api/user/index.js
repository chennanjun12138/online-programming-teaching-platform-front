/**
 * 用户模块
 */
import request from "../../utils/request";

/** 登录 */
export const login = (data) => {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

/** 注册 */
export const register = (data)=> {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}
/** 获取用户信息 */
export const findusers = (data)=> {
    return request({
        url: '/user/search',
        method: 'get',
        params:data
    })
}
export const getusers = (data)=> {
    return request({
        url: '/user/find',
        method: 'get',
        params:data
    })
}
export const changeuser = (data)=> {
    return request({
        url: '/user',
        method: 'post',
        data:data
    })
}

export const deleteuser = (id) => {
    return request({
        url: '/user/' + id,
        method: 'delete',
    })
}

export const delBatchuser = (data) => {
    return request({
        url: '/user/delBatch',
        method: 'put',
        data:data
    })
}

export const findByid = (id) => {
    return request({
        url: '/user/' + id,
        method: 'get',
       
    })
}

export const findByname = (name) => {
    return request({
        url: '/user/name/' + name,
        method: 'get',
       
    })
}