import actionTypes from './actionTypes'
import * as services from '../../services/auth'

export const register = (payload) => async (dispatch) => {
    try {
        const response = await services.apiRegister(payload)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                data: response.data.msg
            })
        } else {
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                data: response.data.msg
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.REGISTER_FAIL,
            data: null
        })
    }
}

export const login = (payload) => async (dispatch) => {
    try {
        const response = await services.apiLogin(payload)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data,
            })
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.data
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        })
    }
}

export const resetMessage = () => ({
    type: 'RESET_MESSAGE',
});

export const logout = () => ({
    type: actionTypes.LOGOUT
})