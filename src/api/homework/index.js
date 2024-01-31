import request from "../../utils/request";

export const findhomeworks = (data)=> {
    return request({
        url: '/homework/search',
        method: 'get',
        params:data
    })
}

export const changehomework= (data)=> {
    return request({
        url: '/homework',
        method: 'post',
        data:data
    })
}

export const deletehomework = (id) => {
    return request({
        url: '/homework/' + id,
        method: 'delete',
    })
}

export const delBatchhomework = (data) => {
    return request({
        url: '/homework/delBatch',
        method: 'put',
        data:data
    })
}

export const updatehomework = (data)=> {
    return request({
        url: '/homework/update',
        method: 'post',
        data:data
    })
}
export const changesubmit = (data)=> {
    return request({
        url: '/homework/changesubmit',
        method: 'post',
        data:data
    })
}
export const addsubmit = (data)=> {
    return request({
        url: '/homework/addsubmit',
        method: 'post',
        data:data
    })
}
export const findbyteacher = (data)=> {
    return request({
        url: '/homework/findteachers',
        method: 'get',
        params:data
    })
}
export const findsubmit = (data)=> {
    return request({
        url: '/homework/findsubmit',
        method: 'get',
        params:data
    })
}

export const findbystudent = (data)=> {
    return request({
        url: '/homework/findbystudent',
        method: 'get',
        params:data
    })
}