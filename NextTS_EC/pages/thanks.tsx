import React from "react";
import { useSelector } from "react-redux";
import router from "next/router";
import { createStyles, makeStyles } from '@material-ui/styles';
import { loginUserSelector } from '../redux/Selector';
import { Button } from '@material-ui/core';

const useStyle = makeStyles(() =>
    createStyles({
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
            marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },
	}),
);

const Thanks = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    return (
        <React.Fragment>
            <div className={ classes.text} >		
                <div>

                    <h2 className={ classes.title} >Thank You✨</h2>

                    {
                        user && user.name === '' ? 
                        <div>
                            <h2>ラクラクラーメンをご利用頂きましてありがとうございます。</h2>
                            <h3>決済は正常に完了しました。</h3>
                        </div>:
                        <div>
                            <h2>{user.name}さん、ラクラクラーメンをご利用頂きましてありがとうございます。</h2>
                            <h3>決済は正常に完了しました。</h3>
                        </div>
                    }

                    <div>
                        <button className={classes.button}  onClick={ ()=>router.push('/') } >Homeに戻る</button>			
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
};

export default Thanks;