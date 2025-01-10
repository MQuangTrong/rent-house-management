import * as services from '../services/room.service'
export const getRoomLasted = async (req, res) => {
    try {
        const response = await services.getRoomLastedService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at room controller: ' + error
        })
    }

}

export const getRoomFilterSorted = async (req, res) => {
    try {
        const filters = {
            district: req.query.district || "",
            ward: req.query.ward || "",
            price: req.query.price || "",
            area: req.query.area || "",
        };
        const sort = req.query.sort || "tenPhong";

        const response = await services.getRoomsFilterSortService(filters, sort);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};


export const getRoomDetail = async (req, res) => {
    const { id } = req.params
    try {
        const response = await services.getRoomDetailService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at room controller: ' + error
        })
    }
}

export const getPenddingApprovePost = async (req, res) => {
    try {
        const response = await services.getPenddingApprovePostService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const approvePost = async (req, res) => {
    const {id} = req.params
    try {
        const response = await services.approvePostService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const rejectPost = async (req, res) => {
    const {id} = req.params
    try {
        const response = await services.rejectPostService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const getAllPostFilter = async (req, res) => {
    try {
        const filters = {
            district: req.query.district || "",
            ward: req.query.ward || "",
            price: req.query.price || "",
            area: req.query.area || "",
        };       
        const response = await services.getAllPostFilterService(filters);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};


export const getPostDetail = async (req, res) => {
    const { id } = req.params
    try {
        const response = await services.getPostDetailService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at room controller: ' + error
        })
    }
}

export const getRoomListFilter = async (req, res) => {
    try {
        const filters = {
            district: req.query.district || "",
            ward: req.query.ward || "",
            price: req.query.price || "",
            area: req.query.area || "",
        };    
        const id = req.user.id   
        const response = await services.getRoomListFilterService(filters, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const getRoomListDeleteFilter = async (req, res) => {
    try {
        const filters = {
            district: req.query.district || "",
            ward: req.query.ward || "",
            price: req.query.price || "",
            area: req.query.area || "",
        };    
        const id = req.user.id   
        const response = await services.getRoomListDeletedFilterService(filters, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const addRoom = async (req, res) => {
    try {  
        const id = req.user.id   
        const response = await services.addRoomService(req.body, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at add room controller: " + error.message,
        });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const {id} = req.params 
        const response = await services.deleteRoomService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const recoverRoom = async (req, res) => {
    try {
        const {id} = req.params 
        const response = await services.recoverRoomService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const getRoomEdit = async (req, res) => {
    try {
        const {id} = req.params 
        const response = await services.getRoomEditService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};

export const EditRoom = async (req, res) => {
    try {
        const {id} = req.params 
        const response = await services.EditRoomService(id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "fail at room controller: " + error.message,
        });
    }
};