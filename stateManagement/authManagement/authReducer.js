import {isAdmin,isAuth} from "../../utilities/utils"

const initAuth = {
    isAuth: isAuth() || false,
    isAdmin: isAdmin() || false
}

const AuthReducer = (state=initAuth, action) => {
    switch(action.type) {

        case "UPDATE_AUTH_STATUS": 
        state = {
            ...state,
            isAuth:action.value
        }
        break;

        case "UPDATE_ADMIN_STATUS": 
        state = {
            ...state,
            isAdmin:action.value
        }
        break;

        default:
        break
    }

    return state
}

export default AuthReducer