import {configureStore,combineReducers } from '@reduxjs/toolkit'

import {persistReducer, persistStore} from 'redux-persist';

import userReducer from './user/userSlice.js'
import themeReducer from './theme/themeSlice.js'

import storage from 'redux-persist/lib/storage';

//conbining reducers
const rootReducer = combineReducers({
    user:userReducer,
    theme:themeReducer,
});

const persistConfig = {
    key : 'root',
    storage,
    version:1,

}

const persistedReducer = persistReducer(persistConfig,rootReducer) ;

export const store = configureStore({
    reducer : persistedReducer ,
    //use middleware to reduce error 
    middleware: (getdefaultMiddleware)=>
        getdefaultMiddleware({serializableCheck:false}),
});

export const persistor = persistStore(store);