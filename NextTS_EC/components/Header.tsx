import React from 'react';
import { createStyles,makeStyles } from '@material-ui/styles'; //materialUI

const useStyle = makeStyles(()=> {  // 1. 変数「useStyle」を生成、makeStylesメソッドを呼び出して代入する！
    return createStyles({           // 2. createStylesメソッドで、styleの設定をする！ => styleオブジェクトを作成してreturnする！

      "header": {
        background:"#FF6633",
      },
      "title": {
        width:"100%",
        textAlign:"center",
        color:"white",
        fontSize:"40px"
      },
      "pic":{
        textAlign:"center",
        backgroundColor:"#FF6633",
      }

    });
});


const Header = ()=> {

    const classes = useStyle();

    return (
        <React.Fragment>
          <header className={ classes.header } >
              <div className={classes.pic}>
                  <img src={`/pic/header_logo.png`} alt="Logo" className={classes.header} />
              </div>
              <h1 className={ classes.title } >Next-TS-EX-MySQLで作成するECサイト</h1>
              
          </header>
        </React.Fragment>
    );
};

export default Header;