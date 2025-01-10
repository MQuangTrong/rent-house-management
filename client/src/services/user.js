import axiosConfig from '../axiosConfig'

export const apiGetCurrent = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/user/get-current',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiUpdateProfile = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: '/api/v1/user/update-profile',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiChangePassword = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: '/api/v1/user/change-password',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetAll = (search, roleId) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = new URLSearchParams();
        if (search) {
            queryParams.append('search', search); // Chỉ thêm search nếu tồn tại
        }
        if (roleId) {
            queryParams.append('roleId', roleId); // Chỉ thêm roleId nếu tồn tại
        }
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/user/get-all?${queryParams.toString()}`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetAllLocked = (search, roleId) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = new URLSearchParams();
        if (search) {
            queryParams.append('search', search); // Chỉ thêm search nếu tồn tại
        }
        if (roleId) {
            queryParams.append('roleId', roleId); // Chỉ thêm roleId nếu tồn tại
        }
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/user//get-all-locked?${queryParams.toString()}`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiLockUser = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/user/lock-user/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiUnLockUser = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/user/unlock-user/${id}`,        
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiUserDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/user/user-detail/${id}`,        
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiUpdateHostProfile = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: '/api/v1/user/update-host-profile',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

