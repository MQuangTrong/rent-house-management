import actionTypes from "../actions/actionTypes";

const initState = {
    userData: {},
    msg: null
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CURRENT:
            return {
                ...state,
                currentData: action.currentData || {}
            }

        case actionTypes.RESET_MESSAGE:
            return {
                ...state,
                msg: null
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                currentData: {}
            }


        default:
            return state;
    }

}

export default userReducer