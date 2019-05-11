import { createStore,combineReducers,compose } from "redux"
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import ProjectReducer from "../stateManagement/ProjectManagement/projectReducer"
import ArticleReducer from "../stateManagement/articleMangement/articleReducer"
import UserReducer from "../stateManagement/userManagement/userReducer"
import AuthReducer from "../stateManagement/authManagement/authReducer"

const persistConfig = {
    key: "root",
    storage: storage
}

const combinedReducers = combineReducers({
    project: ProjectReducer,
    auth: AuthReducer,
    article: ArticleReducer,
    user: UserReducer
})
const persistedReducer = persistReducer(persistConfig,combinedReducers)

export const Store = createStore(
    persistedReducer,
    {},
    compose()
)
export const persistor = persistStore(Store)
persistor.subscribe(() => {})

