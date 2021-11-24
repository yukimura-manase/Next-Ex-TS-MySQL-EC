import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteLoginUser, initCart, initHistory, setLoginUser, fetchRamen, fetchCartItem, feachHistoryCart } from '../redux/ActionCreator';
import { useSelector, useDispatch } from 'react-redux';
import { createStyles,makeStyles } from '@material-ui/styles';
import { cartSelector, loginUserSelector, ramenSelector } from '../redux/Selector';
import axios from 'axios';

// スタイルの関数
const useStyle = makeStyles( () => {
    return createStyles(
        {
            "right":{
            textAlign:"left",
            },
            "buttonStyle":{
                fontWeight:700,
                fontSize:"25px",
                color: "white",
                borderColor: "#FF6633",
                backgroundColor:"#FF6633",
                margin:"5px 5px",
                outline: "none", /* クリックしたときに表示される枠線を消す */
                background:"transparent", /* 背景の灰色を消す */
                "&:hover":{
                backgroundColor:"white",
                color:"#FF6633",
                }
            },
        }
    )
});

const Nav = ()=> {

    const classes = useStyle();

    const ramen = useSelector(ramenSelector);

    const user = useSelector(loginUserSelector);

    const [ userData, setUser ] = useState( {name: ''} );

    const cart = useSelector(cartSelector);

    const router = useRouter();

    const dispatch = useDispatch();

    const [ logoutSwitch, setSwich ] = useState(true);

    const logout = ()=> {

        setSwich(false);

        // ログアウト時には、ローカルストレージ情報をkeyごと削除
        window.localStorage.removeItem('EcLoginUser');
        window.localStorage.removeItem('EcLoginId');

        dispatch( deleteLoginUser() );

        dispatch( initCart() );

        dispatch( initHistory() );
    };

    const getLocalStorage = ()=> {

        const storageUser = window.localStorage.getItem('EcLoginUser'); // ローカルストレージにkey名でアクセスして、値を取得する！
        const storageId = window.localStorage.getItem('EcLoginId');
    
        let storageData = { storageUser, storageId };
    
        return storageData;
    };

    const getSessionStorage = ()=> {

        const storageLikeItemList = window.sessionStorage.getItem('likeItemList');
        const storageCartItemList = window.sessionStorage.getItem('cartItemList');

        let sessionStorageData = { storageLikeItemList, storageCartItemList };

        return sessionStorageData;
    };

    // 'Nav生成時起動 or ユーザー情報の変更検知'
    useEffect( ()=> {
        
        const server = `http://localhost:8000/api/products`;

        axios.get(server)
        .then( (res)=> {

            let axiosData = [];

            axiosData = res.data;

            dispatch( fetchRamen(axiosData));

        });

        user && setUser(user);

        // ログアウトボタンが押されずuser情報がinitされた時に起動 => StoreStateがリロードによってinitされたら作動！
        if ( logoutSwitch && user.name === '' ){

            const storage = getLocalStorage();

            // ログインしていれば、ローカルストレージにデータがある！ => ノーログイン状態または、ログアウトだとnull => ログイン時にリロードした時だけ動く！
            if(storage.storageUser && storage.storageId){

                let submitData = {
                    name: storage.storageUser,
                    user_id: Number(storage.storageId)
                };

                const server2 = `http://localhost:8000/api/session`;

                axios.post(server2, submitData)
                .then( (res)=> {

                    let axiosUserData = res.data.parseUserData;
                    let axiosCartList = res.data.cartList;

                    dispatch( setLoginUser(axiosUserData) );

                    let NobuyCart = axiosCartList.find( (cart)=> { // findで単体を取得
                        return cart.status === 0;
                   });
                  
                   let parseCartItemLIst = JSON.parse(NobuyCart.cartItemList);

                   let dispatchCart = { ...NobuyCart, cartItemList: parseCartItemLIst};

                   dispatch( fetchCartItem(dispatchCart) );

                   let HistoryCart = axiosCartList.filter( (cart)=> { // filterで複数を取得
                      return cart.status !== 0;
                   });

                   let dispatchHistory = [];

                   if(HistoryCart.length !== 0){
                       HistoryCart.forEach( (cart)=> {
                           let parseCartItemLIst = JSON.parse(cart.cartItemList);
                           let mergeCart = { ...cart, cartItemList: parseCartItemLIst };
                           dispatchHistory.push(mergeCart);
                       });
                       dispatch( feachHistoryCart(dispatchHistory) );
                   };

                })
                .catch( (error)=>{ console.log(error) });

            } else if(user.name === ''){ // ただのノーログインユーザーであるためセッションストレージを確認する！

                const sessionStorage = getSessionStorage();

                if(user.likeItemList.length === 0 && sessionStorage.storageLikeItemList){

                    let parseLikeItemList = JSON.parse(sessionStorage.storageLikeItemList);

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
                        likeItemList: parseLikeItemList
                    };

                    dispatch( setLoginUser(NoLoginUser) );
                };

                if(cart.cartItemList.length === 0 && sessionStorage.storageCartItemList){

                    let parseCartItemLIst = JSON.parse(sessionStorage.storageCartItemList);

                    let NoLoginCart = {
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
                        cartItemList: parseCartItemLIst
                    };

                    dispatch( fetchCartItem(NoLoginCart) );
                };

                

            };

        };

    },[user]); // user(StoreState値に変動があったら作動する！)

    
    return (
        <div>
            <button onClick={ ()=>{router.push('/')} } className={ classes.buttonStyle } >商品一覧</button>
            <button onClick={ ()=>{router.push('/cart')} } className={ classes.buttonStyle } >ショッピングカート</button>
            <button onClick={ ()=>{router.push('/like')} } className={ classes.buttonStyle } >お気に入り</button>
            { userData && userData.name === '' ? <button onClick={ ()=>{router.push('/login')} } className={ classes.buttonStyle } >ログイン・新規登録</button> : false }
            { userData && userData.name !== '' ? <button onClick={ ()=>{ logout() } } className={ classes.buttonStyle } >ログアウト</button> : false }
            { userData && userData.name !== '' ? <button onClick={ ()=>{router.push('/users/mypage')} } className={ classes.buttonStyle } >{user.name}さんのマイページ</button> : false }
            { userData && userData.name !== '' ? <button onClick={ ()=> { router.push('/users/buyhistory') } } className={ classes.buttonStyle} >注文履歴</button> : false }
        </div>
    );
};

export default Nav;