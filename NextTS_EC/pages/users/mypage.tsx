import React from "react";
import { useSelector } from "react-redux";
import { loginUserSelector } from "../../redux/Selector";
import { makeStyles, createStyles } from "@material-ui/styles";
import router from "next/router";
import Link from "next/link";

const useStyle = makeStyles( () => {
    return createStyles(
        {
            "text":{
            textAlign:"center",
            },
            "title":{
                width:"100%",
                textAlign:"center",
                color:"#FF6633",
                fontSize:"40px"
            },
            "likeList":{
                "&:hover":{
                    color: "#FF6633",
                    cursor: "pointer"
                }
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

const MyPage = ()=> {

    const user = useSelector(loginUserSelector);
    //console.log(user);

    const classes = useStyle();

    return (
        <div className={ classes.text}>
            {
                user && user.name !== '' ? 
                <div>
                    <h1 className={ classes.title} >{user.name}さんのマイページ✨</h1>

                    <h2>1. ユーザー名：{user.name}</h2>

                    <h2>2. メールアドレス：
                        {
                            user.mail === '' ? 'メールアドレスが登録されていません' : `${user.mail}`
                        }
                    </h2>
                    

                    <h2>3. 電話番号：
                        {
                            user.phoneNumber === '' ? '電話番号が登録されていません' : `${user.phoneNumber}`
                        }
                    </h2>
                    
                    
                    <h2>4. 住所：
                        {
                            user.addressNumber === '' && user.address === '' ? '住所情報が登録されていません' : `〒${user.addressNumber}　${user.address}` 
                        }
                    </h2>

                        
                    
                    
                    <h2>5. 保有ポイント：{user.point}ポイント</h2>

                    <h2>6. お気に入りラーメン：
                        {
                            user.likeItemList.length === 0 ? 'お気に入り登録はありません' :
                            <Link href='/like'>
                                <span className={ classes.likeList} >{ `${user.likeItemList.length}個のお気に入りがあります！(詳細はクリック)` }</span>
                            </Link>
                        }
                    </h2>
                    
                    <div>
                        <button onClick={ ()=>{ router.push('/users/myinfo') } } className={ classes.buttonStyle} >登録情報の編集・更新</button>
                    </div>

                </div> :
                <h1 className={ classes.title} >ユーザー登録をするとマイページが作られます✨</h1>
            }
            
        </div>
    );
};

export default MyPage;