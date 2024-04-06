import request from "../../utils/request";
export const sendmessage = (data)=> {
    return request({
        url: '/message/addBatch',
        method: 'post',
        data:data
    })
}
 
export const findmessage = (data)=> {
    return request({
        url: '/message/search',
        method: 'get',
        params:data
    })
}

export const findallmessage = ()=> {
    return request({
        url: '/message/getAll',
        method: 'get',
      
    })
}

export const changemessage = (data)=> {
    return request({
        url: '/message',
        method: 'post',
        data:data
    })
}