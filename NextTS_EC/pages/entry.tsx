import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from '@material-ui/styles';
import axios from "axios";
import router from "next/router";
import { loginUserSelector } from "../redux/Selector";

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
        "h4": {
            fontSize: "20px"
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


const Entry = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);
    //console.log(user);

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

    const [ mail, setMail] = useState<string>('');
    const inputMail = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setMail(e.target.value);
    };
    //console.log(mail);

    const [ phoneNumber, setPhone ] = useState<string>('');
    const inputPhone = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setPhone(e.target.value);
    };
    //console.log(phoneNumber);

    const [ addressNumber, setAN ] = useState<string>('');
    const inputAN = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setAN(e.target.value);
    };
    //console.log(addressNumber);

    const [ address, setAddress ] = useState<string>('');
    const inputAddress = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setAddress(e.target.value);
    };
    //console.log(address);

    // サーバー側からのユーザーデータ登録状況の結果メッセージ
    const [msg, setMsg] = useState<string>('');
    //console.log(msg);

    // ユーザー名のバリデーション
    const inputUserValidate = (userName: string)=> {
        let pattern = /^[\s\S\d]{1,20}$/;  // 正規表現パターン(法則性)の作成  //「行頭から行末まで文字列・数字が1文字以上20以内のパターン」
        return pattern.test(userName);
    };

    // パスワードのバリデーション
    const inputPassValidate = (pass: string)=> {
        let pattern = /^[\s\S\d]{1,20}$/;  // 正規表現パターン(法則性)の作成  //「行頭から行末まで文字列・数字が1文字以上20以内のパターン」
        return pattern.test(pass);
    };

    // メールアドレスのバリデーション
    const inputMailValidata = (mail: string)=> {
        let pattern = /^[\s\S\d]+@[\s\S\d]+\.[\s\S\d]+$/;
        return pattern.test(mail);
    };

    // 電話番号のバリデーション
    const inputPhoneValidata = (phoneNumber: string)=> {
        let pattern = /^0\d{1,3}-\d{1,4}-\d{4}$/;
        return pattern.test(phoneNumber);
    };

    // 郵便番号のバリデーション
    const inputAddressNumberValidata = (addressNumber: string)=> {
        let pattern = /^\d{3}-\d{4}$/;
        return pattern.test(addressNumber);

    };



    const [ errors, setError ] = useState<string[]>([]);

    // userの新規登録
    const newUser = ()=> {
        //console.log('新規登録の処理、起動！');

        setMsg('');

        let errorlist = [];

        // 必須項目バリデート結果
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

        if(pass !== pass2){
            errorlist.push('パスワードが一致しません');
        };

       if(mail !== ''){
           if(!inputMailValidata(mail)){
                errorlist.push('メールアドレスの形式が正しくありません( @ や . を入力したか確認してください)');
           };
       };

       if(phoneNumber !== ''){
           if(!inputPhoneValidata(phoneNumber)){
                errorlist.push('電話番号の形式が正しくありません( - を入力したか確認してください)');
           };
       };

       if(addressNumber !== ''){
           if(!inputAddressNumberValidata(addressNumber)){
                errorlist.push('郵便番号の形式が正しくありません( - を入力したか確認してください)');
           };
       };



        setError(errorlist);

        const server = `http://localhost:8000/api/entry`;
        
        if(errorlist.length === 0){

            const submitUser = {
                name: userName,
                user_image: '',
                password: pass,
                mail: mail,
                phoneNumber: phoneNumber,
                addressNumber: addressNumber,
                address: address,
                point: 0,
                likeItemList: []
            };
            //console.log(submitUser);

            axios.post(server,submitUser)
                .then( (response: any)=> {

                    // console.log('サーバーレスポンス');
                    // console.log(response);
                    // console.log(response.data);

                    if(response.data === 'このユーザー名は使用されています！'){
                        alert('このユーザー名は使用されています！');
                        setMsg('このユーザー名は使用されています！');
                    } else {
                        alert('新規登録完了！ ログインをしてください！');
                        setMsg('新規登録完了！ ログインをしてください！');

                        // console.log(response.config.data); // JSONデータ
                        // console.log(JSON.parse(response.config.data));
                        // この時点では、user_idがないので、ログインしてもらってuser_idを取得する必要がある！
                        // user_idに合わせたcart_idを生成したいから！                        
                    };

                })
                .catch( (error)=>{
                    console.log(error);
                });
        };

    };

    // const switchButton = (msg)=> {

    //     if(msg === '' || 'このユーザー名は使用されています！'){
    //         return (
    //             <div>
    //                 <button onClick={ ()=>{ newUser() } } className={ classes.button } >新規登録</button>
    //             </div>
    //         );
    //     } else if (msg === '新規登録完了！ ログインをしてください！'){
    //         return (
    //             <div>
    //                 <button onClick={ ()=>{ router.push('/login') } } className={ classes.button } >ログインへ</button>
    //             </div>
    //         );
    //     };
        
    // };

    return (
        <div className={ classes.text} >
            {
                user && user.name !== '' ? <h2 className={ classes.title } >すでにログイン済みです</h2> :
                <React.Fragment>
                    <h2 className={ classes.title } >新規登録ページ</h2>

                    <h3 className={ classes.h3} >ユーザー名 (入力必須)</h3>
                    <input type='text' required placeholder='ユーザー名を入力' aria-required onChange={ (e)=>{inputUser(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >パスワード (入力必須)</h3>
                    <input type='password' required placeholder='パスワードを入力' aria-required onChange={ (e)=>{inputPass(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >パスワード再入力 (入力必須)</h3>
                    <input type='password' required placeholder='パスワードを再入力' aria-required onChange={ (e)=>{inputPass2(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >メールアドレス</h3>
                    <input type='email' placeholder='メールアドレスを入力' onChange={ (e)=>{inputMail(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >電話番号(ハイフンあり)</h3>
                    <input type='text' placeholder='電話番号を入力' onChange={ (e)=>{inputPhone(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >郵便番号(ハイフンあり)</h3>
                    <input type='text' placeholder='郵便番号を入力' onChange={ (e)=>{inputAN(e)} } className={ classes.input } />

                    <h3 className={ classes.h3} >住所</h3>
                    <input type='text' placeholder='住所を入力' onChange={ (e)=>{inputAddress(e)} } className={ classes.input } />

                    <h4 className={ classes.h4 } >必須項目以外も入力していただくと、ご注文が楽になります✨</h4>

                    <div className={ classes.serverMsg } >{msg}</div>

                
                    <div>
                        <button onClick={ ()=>{ newUser() } } className={ classes.button } >新規登録</button>
                        <button onClick={ ()=>{ router.push('/login') } } className={ classes.button } >ログインへ</button>
                    </div>

                    <div>{errors.map( (error, index)=> {
                        return (
                            <React.Fragment key={index} >
                                <h4 className={classes.error1} >入力エラー{index + 1}</h4>
                                <h5 className={ classes.error2 } >{error}</h5>
                            </React.Fragment>
                        )
                    })
                    }</div>
                </React.Fragment>
            }

            

        </div>

        
    );
};

export default Entry;