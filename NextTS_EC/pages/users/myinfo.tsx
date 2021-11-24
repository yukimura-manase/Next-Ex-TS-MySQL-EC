import React,{ useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUserSelector } from "../../redux/Selector";
import { makeStyles, createStyles } from "@material-ui/styles";
import router from "next/router";
import axios from "axios";
import { deleteLoginUser, initCart, setLoginUser } from "../../redux/ActionCreator";

const useStyle = makeStyles( () => {
    return createStyles(
        {
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
        }
    )
});

const MyInfo = ()=> {

    const classes = useStyle();

    const dispatch = useDispatch();

    const user = useSelector(loginUserSelector);

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

    useEffect( ()=>{
        //console.log('useEffect起動1');

        if(user && user.name !== ''){
            //console.log('useEffect起動2');
            setUser(user.name);
            setPass(user.password);
            setPass2(user.password);
            setMail(user.mail);
            setPhone(user.phoneNumber);
            setAN(user.addressNumber);
            setAddress(user.address);
        };

    },[user]);


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

    // ユーザー情報の更新処理
    const updateMyInfo = ()=> {

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

        
        if(errorlist.length === 0){

            const user_id = user.user_id;

            const server = `http://localhost:8000/api/myinfo/update/${user_id}`;

            const submitUser = {
                name: userName,
                password: pass,
                mail: mail,
                phoneNumber: phoneNumber,
                addressNumber: addressNumber,
                address: address,
            };
            console.log(submitUser);

            axios.post(server,submitUser)
            .then( (response: any)=> {

                console.log('サーバーレスポンス');
                console.log(response);
                console.log(response.data);

                if(response.data === '他のユーザーがすでに使用している名前です！'){
                    alert('他のユーザーがすでに使用している名前です！');
                    setMsg('他のユーザーがすでに使用している名前です！');
                } else if(response.data.message === 'ユーザー情報の更新完了！') {
                    alert('ユーザー情報の更新完了！');
                    setMsg('ユーザー情報の更新完了！');

                    console.log(response.data.parseResult);
                    localStorage.setItem('EcLoginUser',response.data.parseResult.name); 

                    dispatch( setLoginUser(response.data.parseResult) );

                };

            })
            .catch( (error)=>{
                console.log(error);
            });



        };

    };

    const deleteMyInfo = ()=> {
        console.log('deleteMyInfo起動！');

        let confirm = window.confirm(`${user.name}さんのアカウントを削除してよろしいですか？`);

       if(confirm){
        //console.log(confirm);

        let reconfirm = window.confirm(`アカウントの復元はできませんが、それでも削除しますか？`);
        if(reconfirm){
            //console.log(reconfirm);

            let userPass = window.prompt(`${user.name}さんのパスワードを入力してください！`);
            console.log(userPass);
            console.log(user.password);

            if(userPass === user.password){

                const user_id = user.user_id; // idだけはユーザーが操作できないので、それをもとにユーザー情報 & カート情報を削除する！
                console.log(user_id);

                const server = `http://localhost:8000/api/myinfo/delete/${user_id}`;

                axios.post(server, user)
                .then( (res)=> {
                    console.log(res);

                    if(res.data === 'ユーザーアカウントの削除が完了しました！'){
                        alert(res.data);

                        window.localStorage.removeItem('EcLoginUser');
                        window.localStorage.removeItem('EcLoginId');
                        
                        dispatch(deleteLoginUser());
                        dispatch(initCart());
                    };
                })
                .catch( (error)=>{ console.log(error) });

            } else {
                alert(`パスワードが違います！`);
            };

        };
        
       };

    };

    return (
        <div className={ classes.text} >
            <h2 className={ classes.title } >ユーザー情報編集画面</h2>

                {
                    user && user.name !== '' ?
                    <div>
                        <h3 className={ classes.h3} >ユーザー名 (入力必須)</h3>
                        <input type='text' required placeholder='ユーザー名を入力' aria-required value={ userName } onChange={ (e)=>{inputUser(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >パスワード (入力必須)</h3>
                        <input type='password' required placeholder='パスワードを入力' aria-required value={ pass } onChange={ (e)=>{inputPass(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >パスワード再入力 (入力必須)</h3>
                        <input type='password' required placeholder='パスワードを再入力' aria-required value={ pass2 } onChange={ (e)=>{inputPass2(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >メールアドレス</h3>
                        <input type='email' placeholder='メールアドレスを入力' value={ mail } onChange={ (e)=>{inputMail(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >電話番号(ハイフンあり)</h3>
                        <input type='text' placeholder='電話番号を入力' value={ phoneNumber } onChange={ (e)=>{inputPhone(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >郵便番号(ハイフンあり)</h3>
                        <input type='text' placeholder='郵便番号を入力' value={ addressNumber } onChange={ (e)=>{inputAN(e)} } className={ classes.input } />

                        <h3 className={ classes.h3} >住所</h3>
                        <input type='text' placeholder='住所を入力' value={ address } onChange={ (e)=>{inputAddress(e)} } className={ classes.input } />

                        <h4 className={ classes.h4 } >必須項目以外も入力していただくと、ご注文が楽になります✨</h4>

                        <div className={ classes.serverMsg } >{msg}</div>

                            {
                            msg === 'ユーザー情報の更新完了！ 再度、ログインをしてください！' ? 
                            <button onClick={ ()=>{ router.push('/login') } } className={ classes.buttonStyle } >ログインへ</button>
                            :false
                            }

                            <div>
                                <button onClick={ ()=>{ updateMyInfo()} } className={ classes.buttonStyle } >ユーザー情報・更新</button>
                                <button onClick={ ()=>{ router.push('/users/mypage') } } className={ classes.buttonStyle } >更新せず戻る</button>
                                <button onClick={ ()=>{ deleteMyInfo() }} className={ classes.buttonStyle } >アカウントの削除</button>
                            </div>

                        

                        

                        <div>
                        { errors.map( (error, index)=> {
                            return (
                                <React.Fragment key={index} >
                                    <h4 className={classes.error1} >入力エラー{index + 1}</h4>
                                    <h5 className={ classes.error2 } >{error}</h5>
                                </React.Fragment>
                            );
                        })
                        }
                        </div>

                    </div>
                    : <h3 className={ classes.h3 } >ユーザー登録をするとマイページが作られます✨</h3>
                }

                    

            
        </div>
    );
    
};

export default MyInfo;