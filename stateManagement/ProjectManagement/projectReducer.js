const initProjectObject = {
    projectType: "JA",
    projectIntervale: "15min"
}



const ProjectReducer = (state=initProjectObject, action) => {
    switch(action.type){
        case "UPDATE_PROJECT_TYPE":
            state = {
                ...state,
                projectType: action.value
            }
        break

        case "UPDATE_PROJECT_INTERVALE":
            state = {
                ...state,
                projectIntervale: action.value
            }
        break

        default:
        break
    }

    return state
}

export default ProjectReducer