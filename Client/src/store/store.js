// src/redux/index.js
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice/index'
import adminProductSlice from './admin-slice/Product-slice'
import shopProductSlice from './Product-slice/index'
import shopCartSlice from './Cart-slice/index'
import shopAddressSlice from './Address-slice/index'
import shopOrderSlice from './Order-slice/index'
import adminOrderSlice from './admin-slice/Order-Slice'
import shopSearchSlice from './Search-slice/index'
import shopReviewSlice from './Review-Slice/index'
import FeatureSlice from "./admin-slice/DashBoard-Slice/index"
import chatbotSlice from "./ChatBot-slice/index"
import ContactSlice from "./Contact-Slice/index"
import AdminUserSlice from "./AdminUser-Slice/index"


const store =configureStore({
reducer:{
    auth:authReducer,
    adminProducts:adminProductSlice,
    shopProducts:shopProductSlice,
    shopCart:shopCartSlice,
    shopAddress:shopAddressSlice,
    shopOrder:shopOrderSlice,
    adminOrders:adminOrderSlice,
    shopSearch:shopSearchSlice,
    shopReview:shopReviewSlice,
    commonFeature:FeatureSlice,
    ChatBot:chatbotSlice,
    Contact:ContactSlice,
    AdminUser:AdminUserSlice
}
});

export default store;