/**
 * 文件下载
 */
import request from "../../utils/request";

/** 下载PDF */
export const downloadPDF = (fileId) => {
    return request({
        url: '/files/' + fileId,
        method: 'get',
        responseType: "blob"
    })
}