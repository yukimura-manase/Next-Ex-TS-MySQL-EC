const createError = require('http-errors');
const express = require('express');
const mysql = require('mysql');
const session = require('express-session'); // ① express専用のセッション機能を利用するためのモジュール

const app = express();

// ② セッション機能の設定
const session_config = {
    secret: 'robotama', // 秘密キーとなるテキスト => 暗号化(ハッシュ化)の時に使用する
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours => 24 * 60 * 60 * 1000 = 86400000 (ミリ秒) = 24時間を指定
};

// ③ セッション機能を利用する
app.use(session(session_config));

// CORSの解決！
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
    next();
});

// app.useメソッドによる関数の組み込み => アプリケーションに必要な機能を組み込んでいる！
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // フォームの値を受け取るために必要な定型文


// mysqlとの接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'masahiro5271',
    database: 'next_ts_ec'
});

// ラーメンの商品情報を取得する！
app.get(`/api/products`, (req, res)=> {

    console.log('get通信！ラーメンデータ取得！');
    //console.log(req);

    connection.query('select * from products;', (error, results)=> {
        // console.log(error);
        // console.log(results);

        res.json(results);
    });


});

// ユーザーの新規登録
app.post(`/api/entry`, (req, res)=> {
    console.log('post通信！ユーザー新規登録！');
    console.log(req.body);

    const name = req.body.name;
    const user_image = req.body.user_image;
    const password = req.body.password;
    const mail = req.body.mail;
    const phoneNumber = req.body.phoneNumber;
    const addressNumber = req.body.addressNumber;
    const address = req.body.address;
    const point = req.body.point;
    const likeItemList = JSON.stringify(req.body.likeItemList); // JSONテキストにして登録
    //const likeItemList = JSON.stringify(req.body.likeItemList);

    connection.query(`select * from users where name = '${name}';`, (error, results)=> {
        // console.log(error);
        // console.log(results);

        if(results.length === 0){ // results配列の中身が空っぽだったら新規登録
            connection.query(`insert into users(name, user_image, password, mail, phoneNumber, addressNumber, address, point, likeItemList) values('${name}','${user_image}','${password}','${mail}','${phoneNumber}','${addressNumber}','${address}','${point}','${likeItemList}');`,
            (error, results)=>{
                // console.log(error);
                // console.log(results);
                console.log('ユーザー登録完了！');
                res.json(results); // JSON形式でレスポンスを返す！
            });
        } else if(results.length !== 0){ // results配列に中身が存在したら登録済みユーザー
            console.log('このユーザー名は使用されています！');
            let message = 'このユーザー名は使用されています！';
            res.json(message);
        };
        
    });

});

// ユーザーのログイン
app.get(`/api/login`,(req, res)=> {
    console.log('get通信！ ユーザー・ログイン');
    // console.log(req);
    // console.log(req.params);
    // console.log(req.body);
    //console.log(req.query);

    const name = req.query.name;
    const password = req.query.password;

    // ④ ログインのタイミングでセッションを生成 & 保存する！
    //  req.session.user = name; // sessionオブジェクトにuserキーを設定 & 変数userを代入
    //  req.session.password = password; // sessionオブジェクトにpasswordキーを設定 & 変数passwordを代入
 
    //  console.log('セッション情報1');
    //  console.log(req.session);

    connection.query(`select * from users where name = '${name}' and password = '${password}';`,(error, results)=> {

        // console.log(error);
        console.log(results);

        if(results.length !== 0){ // ユーザー登録があったら、resultsにはデータが入る
            console.log('ユーザーログイン実行！');

            // req.session.userSessionId = results[0].user_id;
            // console.log('セッション情報2');
            // console.log(req.session);

            res.json(results); // JSON形式でレスポンスを返す！ => { results, session_data } (key:value 同一形)を返す！

        } else if(results.length === 0){
            console.log('ユーザー登録がありません！');
            res.json('ユーザー登録がありません！');
        };

    });

});

// ユーザーのカート情報を取得する！
app.post(`/api/cart/:user_id`, (req, res)=> {
    console.log('ユーザーのカート情報を取得する！');
    //console.log(req.params);

    connection.query(`select * from carts where cart_id = ?;`,
    [ req.params.user_id ],
    (error, results)=> {
        console.log(error);
        console.log(results);
        
        if(results.length === 0){ // 空っぽなら初回ログインユーザー！
            console.log('初回ログインユーザー！');
            res.json('カート情報が見つかりませんでした！初回ログインユーザーです！');
        } else if(results.length !== 0){
            console.log('カート発見！');
            res.json(results);
        };
        
    });

});

// カートの新規作成(初回ログイン時と、購入完了の処理後に呼び出される！)
app.post(`/api/newcart`, (req, res)=> {
    console.log('カートの新規作成！');
    console.log(req.body);

    const cart_id = req.body.cart_id; // user_idをもとに生成している！
    const status = req.body.status;
    const orderDate = req.body.orderDate;
    const userName = req.body.userName;
    const mail = req.body.mail;
    const addressNumber = req.body.addressNumber;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const deliveryDate = req.body.deliveryDate;
    const deliveryTime = req.body.deliveryTime;
    const cartItemList = JSON.stringify(req.body.cartItemList);

    connection.query(`insert into carts(cart_id, status, orderDate, userName, mail, addressNumber, address, phoneNumber, deliveryDate, deliveryTime, cartItemList) values('${cart_id}','${status}','${orderDate}','${userName}','${mail}','${addressNumber}','${address}','${phoneNumber}','${deliveryDate}','${deliveryTime}','${cartItemList}');`,
    (error, results)=> {
        console.log('カート新規作成完了！');
        console.log(error);
        console.log(results);
        res.json(results);
    });

});

// ユーザーによる商品のお気に入り登録(更新処理:update)
app.post(`/api/likeadd/:user_id`, (req, res)=>{
    console.log('お気に入り登録！');
    console.log(req.params);
    console.log(req.body);

    // let likeArray = JSON.stringify(req.body.likelist);
    // console.log(likeArray);

    connection.query(`select likeItemList from users where user_id = ? ;`,
    [req.params.user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        console.log(results[0].likeItemList);

        let parseList = JSON.parse(results[0].likeItemList);
        console.log(parseList);
        parseList.push(req.body.likeadd);
        console.log(parseList);

        let changeJSON = JSON.stringify(parseList);
        console.log(changeJSON);


        connection.query(`update users set likeItemList = '${changeJSON}' where user_id = ? ;`,
        [ req.params.user_id ],
        (error, results)=> {
            console.log(error);
            console.log(results);

            res.send('お気に入り登録完了！');
        });

    });

    
});

// ユーザによる商品のお気に入り削除(更新:update)

app.post(`/api/likeremove/:user_id`, (req, res)=> {
    console.log('お気に入り削除！');
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.body.index);

    let index = req.body.index;

    connection.query(`select likeItemList from users where user_id = ? ;`,
    [req.params.user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        console.log(results[0].likeItemList);

        let parseList = JSON.parse(results[0].likeItemList);
        console.log(parseList);
        parseList.splice(index, 1);
        console.log(parseList);

        let changeJSON = JSON.stringify(parseList);
        console.log(changeJSON);

        
        connection.query(`update users set likeItemList = '${changeJSON}' where user_id = ? ;`,
        [ req.params.user_id ],
        (error, results)=> {
            console.log(error);
            console.log(results);

            res.send('お気に入り削除完了！');
        });


    });
    
});


// ユーザーがカートに商品情報を追加(更新:update) => カートの場合statusが0のものを指定してupdateする！

app.post(`/api/cartadd/:user_id`, (req, res)=>{
    console.log('カートに商品追加！');
    console.log(req.params);
    console.log(req.body);

    connection.query(`select cartItemList from carts where status = 0 and cart_id = ? ;`,
    [req.params.user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        console.log(results[0].cartItemList);

        let parseList = JSON.parse(results[0].cartItemList);
        parseList.push(req.body.cartadd);

        let changeJSON = JSON.stringify(parseList);
        console.log(changeJSON);

        connection.query(`update carts set cartItemList = '${changeJSON}' where status = 0 and cart_id = ? ;`,
        [req.params.user_id],
        (error, results)=> {
            console.log(error);
            console.log(results);

            res.send('カートに追加完了！');
        });

    });

});

// ユーザーがカートから商品情報を削除(更新処理:update)

app.post(`/api/cartremove/:user_id`, (req, res)=> {
    console.log('カート内の商品削除！');
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.body.index);

    let index = req.body.index;

    connection.query(`select cartItemList from carts where status = 0 and cart_id = ? ;`,
    [req.params.user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        console.log(results[0].cartItemList);

        let parseList = JSON.parse(results[0].cartItemList);
        console.log(parseList);
        parseList.splice(index, 1);
        console.log(parseList);

        let changeJSON = JSON.stringify(parseList);
        console.log(changeJSON);

        
        connection.query(`update carts set cartItemList = '${changeJSON}' where status = 0 and cart_id = ? ;`,
        [ req.params.user_id ],
        (error, results)=> {
            console.log(error);
            console.log(results);

            res.send('カート削除完了！');
        });


    });
    
});

// 商品の購入処理(更新:update) => 連動して、newCart(status0)を生成する！

app.post(`/api/order/:user_id`, (req, res)=> {
    console.log('オーダー入りましたぁぁぁ！！');
    // console.log(req.body);
    // console.log(req.params);

    let user_id = req.params.user_id;
    //console.log(user_id);

    const status = req.body.status;
    const orderDate = req.body.orderDate;
    const userName = req.body.userName;
    const mail = req.body.mail;
    const addressNumber = req.body.addressNumber;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const deliveryDate = req.body.deliveryDate;
    const deliveryTime = req.body.deliveryTime;
    const cartItemList = JSON.stringify(req.body.cartItemList); // JSONデータに変換する

    connection.query(`update carts set status = '${status}', orderDate = '${orderDate}', userName = '${userName}', mail = '${mail}', addressNumber = '${addressNumber}', address = '${address}', phoneNumber = '${phoneNumber}', deliveryDate = '${deliveryDate}', deliveryTime = '${deliveryTime}', cartItemList = '${cartItemList}' where status = 0 and cart_id = ? ;`,
    [user_id],
    (error, results)=> {
        console.log(error);
        console.log(results);
        res.send('購入処理完了！');
        
    });
    
});

// ユーザー情報の更新(update: 更新処理)

app.post(`/api/myinfo/update/:user_id`, (req, res)=> {
    console.log('ユーザー情報、更新！！');
    console.log(req.body);
    console.log(req.params);

    const user_id = req.params.user_id;
    console.log(typeof user_id);

    const name = req.body.name;
    const password = req.body.password;
    const mail = req.body.mail;
    const phoneNumber = req.body.phoneNumber;
    const addressNumber = req.body.addressNumber;
    const address = req.body.address;

    connection.query(`select * from users where name = '${name}' ; `,(error, results)=> {
        console.log(error);
        console.log(results);

        if(results.length === 0){   // ①まずユーザー名の重複がないかを確認して、重複なければ(results空配列)、そのままupdate！
            console.log('ユーザー名重複なし！update！');
            connection.query(`update users set name = '${name}', password = '${password}', mail = '${mail}', phoneNumber = '${phoneNumber}', addressNumber = '${addressNumber}', address = '${address}' where user_id = ? ;`,
            [user_id],
            (error, results)=> {
                console.log(error);
                console.log(results);

                connection.query(`select * from users where name = '${name}' and password = '${password}' ;`,
                (error, results)=> {
                    console.log('更新後のユーザー情報を再取得！');
                    console.log(error);
                    console.log(results); // 配列

                    let message = 'ユーザー情報の更新完了！';

                    let objectResult = results[0];
                    let likeItem = results[0].likeItemList;

                    let parseResult = { ...objectResult, likeItemList: JSON.parse(likeItem) };
                    
                    console.log(parseResult);

                    res.json( { parseResult, message } ); // json形式でデータ返却 => オブジェクトの形(key:value)でレスポンスを送信！

                });

                //res.send('ユーザー情報の更新完了！');
            });
        } else { // ②resultsにデータがある場合、重複のある名前なので、同一ユーザーが別ユーザーなのか、判断する必要がある！

            if(results[0].user_id){ // resultsは空っぽ(重複がない！)の可能性がある！ => 重複がある場合だけ、selectIdを用意する！
                let selectId = results[0].user_id;
                console.log(selectId);
                console.log(typeof selectId);

                // ③ユーザー名の重複があったとしても、user_idが一致すれば同一ユーザーなので、update！ 
                if( selectId === Number(user_id) ){
                    console.log('ユーザー名の重複あるけど、同一ユーザー！update！');
                    connection.query(`update users set name = '${name}', password = '${password}', mail = '${mail}', phoneNumber = '${phoneNumber}', addressNumber = '${addressNumber}', address = '${address}' where user_id = ? ;`,
                    [user_id],
                    (error, results)=> {
                        console.log(error);
                        console.log(results);

                        connection.query(`select * from users where name = '${name}' and password = '${password}' ;`,
                        (error, results)=> {
                            console.log('更新後のユーザー情報を再取得！');
                            console.log(error);
                            console.log(results);

                            let message = 'ユーザー情報の更新完了！';

                            let objectResult = results[0];
                            let likeItem = results[0].likeItemList;

                            let parseResult = { ...objectResult, likeItemList: JSON.parse(likeItem) };
                            
                            console.log(parseResult);

                            res.json( { parseResult, message } );

                        });

                        
                    });
                } else { // ④ユーザー名の重複があり && user_idも一致しないのは、別ユーザーなので、updateしない！
                    console.log('ユーザー名の重複あるが、user_idが一致しない！ No-update！');
                    res.send('他のユーザーがすでに使用している名前です！');
                };
            };

        };

    });

    


});


// ユーザーアカウントの削除 => idだけはユーザーが操作できないので、それをもとにユーザー情報 & カート情報を削除する！

app.post(`/api/myinfo/delete/:user_id`,(req, res)=> {
    console.log(`ユーザーアカウントの削除実施！`);

    console.log(req.body);

    const user_id = req.params.user_id;
    console.log(user_id);
    console.log(typeof user_id);
    
    connection.query(`delete from users where user_id = ? ;`,
    [ user_id ],
    (error, results)=> {
        console.log(error);
        console.log(results);

        connection.query(`delete from carts where cart_id = ? ;`,
        [ user_id ],
        (error, results)=> {
            console.log(error);
            console.log(results);

            res.send('ユーザーアカウントの削除が完了しました！');
        });
    });

});


// フロントルート内のコンポーネント(Nav)でリロード検知にともなって、実行される通信！！(ログイン中のリロード時に発動する通信)
// ローカルストレージ => session用の通信窓口

app.post(`/api/session`, (req, res)=> {

    // console.log(`セッション情報のチェック1`);
    // console.log(req.session);

    //console.log(req.body);

    // セッションを生成 & 保存する！
    req.session.userSessionId = req.body.user_id;
    req.session.name = req.body.name;

    // console.log(`セッション情報のチェック2`);
    // console.log(req.session);

    const userSessionId  = req.session.userSessionId;
    const userName = req.session.name;
    // console.log(userSessionId);
    // console.log(userName);

    connection.query(`select * from users where user_id = '${userSessionId}' and name = '${userName}' ;`,
    (error, results)=>{
        console.log('セッション情報からユーザーデータ取得');
        console.log(error);
        console.log(results);

        let objectResult = results[0];
        let likeItem = results[0].likeItemList;

        let parseUserData = { ...objectResult, likeItemList: JSON.parse(likeItem) };

        connection.query(`select * from carts where cart_id = '${userSessionId}' ;`,(error, results)=> {
            console.log(error);
            console.log(results);

            res.json( { parseUserData, cartList: results } );
        });


    });

});

app.post(`/api/point/:user_id`, (req, res)=>{
    console.log('ポイントupdate！！');
    console.log(req.body);

    let user_id = req.params.user_id;
    console.log(user_id);
    let point = req.body.point;
    console.log(point);

    connection.query(`update users set point = '${point}' where user_id = ? ;`,
    [user_id],
    (error, results)=> {
        console.log('ポイントupdate完了！');
        console.log(error);
        console.log(results);

        connection.query(`select * from users where user_id = '${user_id}' ;`,
        (error, results)=> {
            console.log('ユーザー情報を取得！');
            console.log(error);
            console.log(results);

            let userData = results[0];

            let likeItemList = userData.likeItemList;
            
            let parseList = JSON.parse(likeItemList);

            let parseResult = { ...userData, likeItemList: parseList };

            res.json(parseResult);
        });
    })


});

// エラーハンドリング

// // catch 404 and forward to error handler // エラー用の関数
// app.use((req, res, next)=> {
//     console.log('エラーハンドリング');
//     // console.log(req)
//     // console.log(res)
//     next(createError(404));
//   });
  
//   // error handler // エラー用の関数
//   app.use( (err, req, res, next)=> {
//     // set locals, only providing error in development
//     console.log('エラーハンドリング2');
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });

// 待ち受け状態の設定
app.listen(8000, () => {
    console.log(`listening on port ${8000}`);
});
