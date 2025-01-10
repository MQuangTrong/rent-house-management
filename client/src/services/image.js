import axiosConfig from '../axiosConfig';

export const apiUploadImageProfile = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/image/upload-image-profile',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiUploadImageCCCD = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/image/upload-image-cccd',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiUploadImageCCCDBack = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/image/upload-image-cccd-back',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});


export const apiUploadImages= (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/image/upload-images',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});