import * as services from '../services/host.service'

export const registerHost = async (req, res) => {
    const { email, SDT, hoTen, gioiTinh, CCCD } = req.body;
    try {
        if (!email || !hoTen || !SDT || !gioiTinh || !CCCD) {
            return res.status(400).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await services.registerHostService(req.body);
        return res.status(response.err === 0 ? 201 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'fail at host controller: ' + error
        });
    }

}

export const getHostsPendingApproval = async (req, res) => {
    try {
        const response = await services.getHostsPendingApprovalService();
        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            err: 1,
            msg: 'fail at host controller: ' + error
        });
    }

}

export const getHostsPendingApprovalDetail = async (req, res) => {
    const { id } = req.params
    try {
        const response = await services.getHostsPendingApprovalDetailService(id);
        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            err: 1,
            msg: 'fail at host controller: ' + error
        });
    }
}

export const approveHost = async (req, res) => {
    const { id } = req.params
    try {
        const response = await services.approveHostService(id);
        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            err: 1,
            msg: 'fail at host controller: ' + error
        });
    }

}

export const rejectHost = async (req, res) => {
    const { id } = req.params
    try {
        const response = await services.RejectHostService(id);
        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            err: 1,
            msg: 'fail at host controller: ' + error
        });
    }

}