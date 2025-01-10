import axiosConfig from '../axiosConfig'

export const apiRoomLasted = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/room/rooms-lasted',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiRoomFilterSorted = (filter, sort) => new Promise(async (resolve, reject) => {
    try {
        // Lọc các giá trị undefined/null khỏi query parameters
        const queryParams = new URLSearchParams({
            ...filter,
            ...(sort && { sort }), // Chỉ thêm sort nếu tồn tại
        }).toString();

        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/rooms-filter-sorted?${queryParams}`,
        });

        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiRoomDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/room-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiPenddingApprovePost= () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/room/pendding-approve-post',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiApprovePost= (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/room/approve-post/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiRejectPost= (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/room/reject-post/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetAllPostFilter = (filter) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = new URLSearchParams({
            ...filter,
        }).toString();

        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/all-post-filter?${queryParams}`,
        });

        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiPostDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/post-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetRoomListFilter = (filter) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = new URLSearchParams({
            ...filter,
        }).toString();

        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/room-list-filter?${queryParams}`,
        });

        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetRoomListDeletedFilter = (filter) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = new URLSearchParams({
            ...filter,
        }).toString();

        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/room-list-deleted-filter?${queryParams}`,
        });

        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiAddRoom = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/room/add-room',
            data: payload
        });

        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiDeleteRoom = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/room/delete-room/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiRecoverRoom = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/room/recover-room/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetRoomEdit = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/room/get-room-edit/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiEditRoom = (id, payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/room/edit-room/${id}`,
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})