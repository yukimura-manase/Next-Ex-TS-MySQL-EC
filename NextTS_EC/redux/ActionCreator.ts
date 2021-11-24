export const SETNOLOGINUSER = 'setNoLoginUser';
export const SETLOGINUSER = 'setLoginUser';
export const DELETELOGINUSER = 'deleteLoginUser';
export const FETCHRAMEN = 'fetchRamen';
export const FETCHCARTITEM = 'fetchCartItem';
export const ADDLIKE = 'addLike';
export const DETAILRAMEN = 'detailRamen';
export const REMOVECART = 'removeCart';
export const REMOVELIKE = 'removeLike';
export const FETCHHISTORYCART = 'feachHistoryCart';
export const BUYCART = 'buyCart';
export const INITCART = 'initCart';
export const INITHISTORY = 'initHistory';

import { selectRamen, cartItem } from "./ReduxTypes";

export const setNoLoginUser = (userData)=> {
    return {
        type: SETNOLOGINUSER,
        user: userData
    };
};

export const setLoginUser = (userData)=> {
    return {
        type: SETLOGINUSER,
        user: userData
    };
};

export const deleteLoginUser = ()=> {
    return {
        type: DELETELOGINUSER
    };
};

export const fetchRamen = (apiData)=> {
    return {
        type: FETCHRAMEN,
        ramenProducts: apiData
    };
};

export const feachHistoryCart = (historyCartList)=> {
    return {
        type: FETCHHISTORYCART,
        historyCartList: historyCartList
    };
};

export const detailRamen = (selectRamen: selectRamen)=> {
    return {
        type: DETAILRAMEN,
        selectRamen: selectRamen
    };
};

export const fetchCartItem = (cartItem: any)=> {
    return {
        type: FETCHCARTITEM,
        cartItem: cartItem
    };
};

export const addLike = (likeRamen)=> {
    return {
        type: ADDLIKE,
        likeRamen: likeRamen
    };
};

export const removeCart = (removeIndex: number)=> {
    return {
        type:REMOVECART,
        index:removeIndex
    };
};

export const removeLike = (index: number)=> {
    return {
        type:REMOVELIKE,
        index:index
    };
};

export const buyCart = (buyCart: any)=> {
    return {
        type:BUYCART,
        buyCart: buyCart
    };
};

export const initCart = ()=> {
    return {
        type:INITCART
    };
};

export const initHistory = ()=> {
    return {
        type:INITHISTORY
    };
};