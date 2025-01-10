import * as authService from '../services/auth.service'

export const register = async (req, res) => {
    const { email, matKhau } = req.body;
    try {
        if (!email || !matKhau) {
            return res.status(500).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await authService.registerService(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at auth controller: ' + error
        })
    }

}

export const login = async (req, res) => {
    const { email, matKhau } = req.body;
    try {
        if (!email || !matKhau) {
            return res.status(500).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await authService.loginService(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at auth controller: ' + error
        })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(500).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await authService.forgotPasswordService(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at auth controller: ' + error
        })
    }

}

export const resetPassword = async (req, res) => {
    const token = req.params.token
    const {  matKhauMoi} = req.body;
    try {
        if (!matKhauMoi || !token) {
            return res.status(500).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await authService.resetPasswordService(req.body, token)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at auth controller: ' + error
        })
    }

}

export const verifyResetPasswordToken = async (req, res) => {
    const { token } = req.params;
    try {
        if (!token) {
            return res.status(400).json({
                err: -1,
                msg: 'Missing token',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                err: 1,
                msg: 'Invalid or expired token',
            });
        }

        return res.status(200).json({
            err: 0,
            msg: 'Token is valid',
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail to verify token: ' + error.message,
        });
    }
};