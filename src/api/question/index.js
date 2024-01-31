/**
 * 题目模块
 */
import request from "../../utils/request";

export const findbyhomework = (data)=> {
    return request({
        url: '/questionbank/homework',
        method: 'get',
        params:data
    })
}
export const findbyid = (data)=> {
    return request({
        url: '/questionbank/findbyid',
        method: 'get',
        params:data
    })
}
export const findquestion = (data)=> {
    return request({
        url: '/question/search',
        method: 'get',
        params:data
    })
}

export const findquestionbanks = (data)=> {
    return request({
        url: '/questionbank/search',
        method: 'get',
        params:data
    })
}


export const changequestionbank = (data)=> {
    return request({
        url: '/questionbank',
        method: 'post',
        data:data
    })
}
export const changequestion = (data)=> {
    return request({
        url: '/question',
        method: 'post',
        data:data
    })
}
export const updatequestionbank = (data)=> {
    return request({
        url: '/questionbank/update',
        method: 'post',
        params:data
    })
}
export const addquestion = (data)=> {
    return request({
        url: '/question/add',
        method: 'post',
        data:data
    })
}
export const deletequestionbank= (id) => {
    return request({
        url: '/questionbank/' + id,
        method: 'delete',
    })
}
export const deletequestion= (id) => {
    return request({
        url: '/question/' + id,
        method: 'delete',
    })
}

export const delBatchquestionbank = (data) => {
    return request({
        url: '/questionbank/delBatch',
        method: 'put',
        data:data
    })
}
export const delBatchquestion = (data) => {
    return request({
        url: '/question/delBatch',
        method: 'put',
        data:data
    })
}
