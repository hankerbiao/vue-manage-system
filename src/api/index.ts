import request from '../utils/request';

export const fetchDatas = (url) => {
    // const url = `/api/v1/athlete/`;
    return request({
        url,
        method: 'get'
    }).then(response => {
        // 可以在这里处理响应
        return response;
    }).catch(error => {
        // 处理请求错误
        console.error('Error fetching athletes:', error);
        throw error; // 可以选择重新抛出错误或返回错误信息
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
