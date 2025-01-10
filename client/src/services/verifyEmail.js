import axiosConfig from '../axiosConfig';

export const apiVerifyEmail = (token) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/auth/verifyEmail?token=${token}`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
