import axiosConfig from '../axiosConfig';

export const apiGeneralStatistic = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/statistic/general-statistic',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetRevenueStatistic = (year, month) => 
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: '/api/v1/statistic/revenue-statistic',
        params: { year, month },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  }); 