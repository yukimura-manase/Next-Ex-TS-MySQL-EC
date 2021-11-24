import React, { useState } from "react";
import { loginUserSelector } from "../redux/Selector";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from '@material-ui/styles';
import { useRouter } from "next/router";
import axios from "axios";
import { setLoginUser, fetchCartItem, feachHistoryCart } from "../redux/ActionCreator";
import Link from "next/link";


const useStyle = makeStyles( ()=> {
    return createStyles({
        "text":{
            textAlign:"center",
            fontWeight:600
        },
        "title":{
            width:"100%",
            textAlign:"center",
            color:"#FF6633",
            fontSize:"40px"
        },
        "button": {
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            marginTop: "12px",
            marginRight: "12px",
            marginLeft:"12px",
            marginBottom: "12px",
            backgroundColor: "white",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "white"
            }
        },
        "h3":{
            fontSize:"25px"
        },
        "input": {
            width: "30%",
        },
        "serverMsg": {
            color: "blue",
            margin: "30px",
            fontSize:"25px"
        },
        "error1": {
            color:"black",
            fontSize:"22px"
        },
        "error2": {
            color:"blue",
            fontSize:"20px"
        }

    });
});

const Login = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    const dispatch = useDispatch();

    const router = useRouter();

    const [ userName, setUser ] = useState<string>('');
    const inputUser = (e:React.ChangeEvent<HTMLInputElement>)=>{
        //console.log(e.target.value);
        setUser(e.target.value);
    };

    const [ pass, setPass ] = useState<string>('');
    const inputPass = (e:React.ChangeEvent<HTMLInputElement>)=>{
        //console.log(e.target.value);
        setPass(e.target.value);
    };

    const [ pass2, setPass2 ] = useState<string>('');
    const inputPass2 = (e:React.ChangeEvent<HTMLInputElement>)=>{
        //console.log(e.target.value);
        setPass2(e.target.value);
    };

    // サーバー側からのユーザーデータ登録状況の結果メッセージ
    const [msg, setMsg] = useState<string>('');

    // ユーザー名のバリデーション
    const inputUserValidate = (userName: string)=> {
        let pattern = /^[\s\S\d]{1,20}$/;  // 正規表現パターン(法則性)の作成  //「行頭から行末まで文字列・数字が1文字以上20以内のパターン」
        return pattern.test(userName);
    };

    const inputPassValidate = (pass: string)=> {
        let pattern = /^[\s\S\d]{1,20}$/;  // 正規表現パターン(法則性)の作成  //「行頭から行末まで文字列・数字が1文字以上20以内のパターン」
        return pattern.test(pass);
    };

    const [ errors, setError ] = useState<string[]>([]);

    // userのログイン
    const login = ()=> {
        //console.log('ログイン処理起動！');

        setMsg('');

        let errorlist = [];

        if(userName === ''){
            errorlist.push('ユーザー名が入力されていません');
        } else if(!inputUserValidate(userName)){
            errorlist.push('ユーザー名は、1文字以上20文字以内で入力をしてください');
        };

        if(pass === ''){
            errorlist.push('パスワードが入力されていません');
        } else if(!inputPassValidate(pass)){
            errorlist.push('パスワードは、1文字以上20文字以内で入力をしてください');
        };

        if(pass2 === ''){
            errorlist.push('パスワードが再入力されていません');
        };

        if( pass !== pass2){
            errorlist.push('パスワードが一致しません');
        };

        setError(errorlist);

        //console.log(errorlist);

        const serverLogin = `http://localhost:8000/api/login`;
        
        if(errorlist.length === 0){

            const submitUser = {
                name: userName,
                password: pass
            };
            //console.log(submitUser);

            axios.get(serverLogin,{params:submitUser})
                .then( (response: any)=> {
                    // console.log('レスポンスデータ！');
                    // console.log(response);
                    // console.log(response.data);
                    // console.log(response.data.shift()); // ユーザーデータを取得できる！
                    // console.log(...response.data);
                    // console.log(response.config.params);

                    if(response.data === 'ユーザー登録がありません！'){
                        alert('ユーザー登録がありません！');
                        setMsg('ユーザー登録がありません！');
                    } else {
                        let axiosUserData:any = response.data.shift();
                        //console.log(axiosUserData);

                        let JsonParseData = { ...axiosUserData, likeItemList: JSON.parse(axiosUserData.likeItemList) };
                        //console.log(JsonParseData);

                        dispatch(
                            setLoginUser(JsonParseData)
                        );
                        //console.log('ログイン処理完了');

                        // ユーザーログイン時に、ローカルストレージにデータを保存 => ローカルストレージにkey名と値の保存
                        localStorage.setItem('EcLoginUser',axiosUserData.name); 
                        localStorage.setItem('EcLoginId',axiosUserData.user_id);
                        console.log('ローカルストレージ');
                        console.log(localStorage);


                        // ログイン処理が完了した後に、カート情報を取得する！
                        // 1. カート情報がなければ、initCartをPostして新規作成する！
                        // 2. カート情報があるのなら、Stateに保存する処理をする！

                        let user_id = axiosUserData.user_id;
                        // console.log(user_id);
                        // console.log('ユーザーのカートを取得する！');

                        const serverCart = `http://localhost:8000/api/cart/${user_id}`;

                        
                        axios.post(serverCart).then( (res)=> {
                            //console.log(res);
                            //console.log(res.data);

                            if(res.data === 'カート情報が見つかりませんでした！初回ログインユーザーです！'){

                                // ExpressサーバーにinitCart送信！
                                let initCart = {
                                        cart_id: user_id, // cart_idは、user_idと一緒で生成する！
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

                                const serverNewCart = `http://localhost:8000/api/newcart`;

                                axios.post(serverNewCart, initCart).then( (res)=> {
                                    console.log('NewCart');
                                    console.log(res);
                                    console.log(res.data);
                                    console.log(res.config.data);
                                    console.log(JSON.parse(res.config.data));

                                    let axiosData = JSON.parse(res.config.data);
                                    console.log(axiosData);

                                    dispatch( fetchCartItem(axiosData) );

                                    router.push('/');
                                });

                            } else { // 初回ログインユーザーでなければ、カートがある！ => カート情報を送信

                                console.log('Cart発見、dispatch！');

                                // console.log(res);
                                // console.log(res.data); // 配列の形式

                                let NobuyCart = res.data.find( (cart)=> { // findで単体を取得
                                     return cart.status === 0;
                                });
                                //console.log(NobuyCart);
                               
                                let parseCartItemLIst = JSON.parse(NobuyCart.cartItemList);
                                //console.log(parseCartItemLIst);
                                let dispatchCart = { ...NobuyCart, cartItemList: parseCartItemLIst};
                                console.log(dispatchCart);

                                dispatch( fetchCartItem(dispatchCart) );

                                let HistoryCart = res.data.filter( (cart)=> { // filterで複数を取得
                                   return cart.status !== 0;
                                });
                                console.log(HistoryCart);

                                let dispatchHistory = [];

                                if(HistoryCart.length !== 0){
                                    HistoryCart.forEach( (cart)=> {
                                        let parseCartItemLIst = JSON.parse(cart.cartItemList);
                                        let mergeCart = { ...cart, cartItemList: parseCartItemLIst };
                                        dispatchHistory.push(mergeCart);
                                    });
                                    console.log(dispatchHistory);
                                    dispatch( feachHistoryCart(dispatchHistory) );
                                };
                                
                                router.push('/');
                            };

                        });
                        
                    };
                    
                })
                .catch( (error)=>{
                    console.log(error);
                });
        };
        
    };



    return (
        <div className={ classes.text} >

            <h2 className={ classes.title } >ユーザーログイン・ページ</h2>

            <h3 className={ classes.h3} >ユーザー名</h3>
            <input required type="text" placeholder='ユーザー名を入力' aria-required onChange={ (e)=>{inputUser(e)} } className={ classes.input } />
            <h3 className={ classes.h3} >パスワード</h3>
            <input required type="password" placeholder='パスワードを入力' aria-required onChange={ (e)=>{inputPass(e)} } className={ classes.input } />
            <h3 className={ classes.h3} >パスワード再入力</h3>
            <input required type="password" placeholder='パスワードを再入力' aria-required onChange={ (e)=>{inputPass2(e)} } className={ classes.input } />

            <div className={ classes.serverMsg } >{msg}</div>

            <div>
                <button onClick={ ()=>{ login() } } className={ classes.button } >ログイン</button>
            </div>

            <div>
                <button className={ classes.button } onClick={ ()=> { router.push('/entry') } } >新規ユーザー登録はこちらから！</button>
            </div>

            <div>{errors.map( (error, index)=> {
                return (
                    <React.Fragment key={index} >
                        <h4 className={classes.error1} >入力エラー{index + 1}</h4>
                        <h5 className={ classes.error2 } >{error}</h5>
                    </React.Fragment>
                );
            })
            }</div>
            
        </div>
    );
};

export default Login;