/**
 * 
 * I made a global state named User
 * All compoenent will access and modified this object user
 */



const initUserObject = {
    userId: null,
    email: null,
    firstname: null,
    lastname: null,
    isAdmin:null,
    isDefPwd:null,
    defaultSelectedProject: null,
    defaultSelectedPeriod:null,
    isDefaultPwd:null,
    country:null,
    minImageUrl: null,
    bigImageUrl:null
}


const UserReducer = (state=initUserObject, {type, value}) => {
    switch(type) {
        case "SAVE_USER":
            state = {
                userId: value.userId,
                email: value.email,
                firstname: value.firstname,
                lastname: value.lastname,
                isAdmin:value.isAdmin,
                isDefPwd:null,
                defaultSelectedProject: value.defaultSelectedProject,
                defaultSelectedPeriod:value.defaultSelectedPeriod,
                isDefaultPwd:value.isDefaultPwd,
                country:value.country,
                minImageUrl: value.minImageUrl,
                bigImageUrl:value.bigImageUrl
            }
        break

        case "UPDATE_USER_PROJECT_TYPE":
            state= {
                ...state,
                defaultSelectedProject: value
            }
        break

        case "UPDATE_USER_PROJECT_PERIOD":
            state= {
                ...state,
                defaultSelectedPeriod: value
            }
        break


        case "UPDATE_USER_PROFILE_PICTURE":
            state= {
                ...state,
                minImageUrl: value.minImageUrl,
                bigImageUrl: value.bigImageUrl
            }
        break


        case "RESET_USER":
            state = initUserObject
        break
        

        default:
        break
    }

    return state
}


export default UserReducer