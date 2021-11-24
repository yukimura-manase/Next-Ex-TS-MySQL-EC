import { SETNOLOGINUSER, SETLOGINUSER, DELETELOGINUSER, FETCHRAMEN, FETCHCARTITEM, FETCHHISTORYCART, DETAILRAMEN, ADDLIKE, REMOVECART, REMOVELIKE, BUYCART, INITCART, INITHISTORY } from './ActionCreator';


let initialState = {
    user: {
        user_id: null,
        name: '',
        user_image: '',
        password: '',
        mail : '',
        phoneNumber: '',
        addressNumber: '',
        address: '',
        point: 0,
        likeItemList: []
    },
    ramen: [],
    cart: {
            cart_id: null,
            status: 0,
            orderDate: '',
            userName: '',
            mail: '',
            addressNumber: '',
            address: '',
            phoneNumber: '',
            deliveryDate: '',
            deliveryTime: '',
            cartItemList: []
    },
    historyCart: []
};

export default (state = initialState, action )=> {
    switch(action.type){

        case SETNOLOGINUSER: {
            return { ...state, user:action.user };
        };

        case SETLOGINUSER: {
            return { ...state, user:action.user };
        };

        case DELETELOGINUSER: {
            let NoLoginUser = {
                user_id: null,
                name: '',
                user_image: '',
                password: '',
                mail : '',
                phoneNumber: '',
                addressNumber: '',
                address: '',
                point: 0,
                likeItemList: []
            };

            return { ...state, user: NoLoginUser };
        };

        case FETCHRAMEN: {
            return { ...state, ramen:action.ramenProducts };
        };

        case FETCHCARTITEM: {
            return { ...state, cart:action.cartItem };
        };

        case FETCHHISTORYCART: {
            return { ...state, historyCart: action.historyCartList };
        };

        case ADDLIKE: {
            let copyUser= { ...state.user };
            copyUser.likeItemList.push(action.likeRamen);

            return { ...state, user: copyUser };
        };

        case DETAILRAMEN: {
            let copyCart = { ...state.cart };
            copyCart.cartItemList.push(action.selectRamen);

            return { ...state, cart: copyCart };
        };

        case REMOVECART: {
            let copyCart = { ...state.cart }
            copyCart.cartItemList.splice(action.index, 1);

            return { ...state, cart: copyCart };
        };

        case REMOVELIKE: {
            let copyUser= { ...state.user };
            copyUser.likeItemList.splice(action.index, 1);

            return { ...state, user: copyUser };
        };

        case BUYCART: {
            let copyHistoryCart = state.historyCart.slice();
            copyHistoryCart.push(action.buyCart);

            return { ...state, historyCart: copyHistoryCart }
        };

        case INITCART: {

            let initCart = {
                cart_id: null,
                status: 0,
                orderDate: '',
                userName: '',
                mail: '',
                addressNumber: '',
                address: '',
                phoneNumber: '',
                deliveryDate: '',
                deliveryTime: '',
                cartItemList: []
            };
            return { ...state, cart: initCart };
        };

        case INITHISTORY: {
            return { ...state, historyCart: [] };
        };
        

        default: return state;
    };
};