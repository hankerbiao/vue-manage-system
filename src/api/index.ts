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


// 查询所有运动员姓名、单位、id
export const fetchAthleteData = async () => {
    let result = [];
    try {
        const res = await fetchDatas('/api/v1/athlete/');
        let data = res.data.data
        for (let key in data) {
            let obj = {}
            obj['value'] = data[key].name
            obj['id'] =  data[key].id
            obj['unit'] =  data[key].unit
            result.push(obj)
        }
        return result
    } catch (error) {
        console.error('Error in fetchAthleteData:', error);
    }
};

// 查询所有运动员姓名、单位、id
export const fetchScheduleData = async () => {
    let result = [];
    try {
        const res = await fetchDatas('/api/v1/schedules/schedules_name_list/');
        let data = res.data.data
        for (let key in data) {
            let obj = {}
            obj['value'] = data[key]
            result.push(obj)
        }
        console.log(result)
        return result
    } catch (error) {
        console.error('Error in fetchAthleteData:', error);
    }
};