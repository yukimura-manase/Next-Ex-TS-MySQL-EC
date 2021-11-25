// ① Productsテーブル

// { 
//     Products : [
//         {
//             product_id: number;
//             name: string;
//             detail: string;
//             Msizeprice: number;
//             Lsizeprice: number;
//             pic: string
//         }
//     ]
// }

// ② Usersテーブル
// {
//     user_id: number; // userのID (自動インクリーメント)
//     name: string; // ユーザー名(ユニーク)
//     user_image: string; // ユーザーの登録画像
//     password: string; // パスワード
//     mail :string; // メールアドレス
//     phoneNumber: string; // 電話番号
//     addressNumber: string; // 
//     address: string; // 
//     point: number; // ポイント
//     likeItemList: string; // お気に入り配列(JSONデータ)
// }

//     likeItemListのデータ構造

//     likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]

// ③ Cartsテーブル

// {
//     cart_id: number; // カートのid(user_idと紐づく)
//     status: number; // カートステータス => 未購入カート(status0)は1つのみ！他はhistoryカート
//     orderDate: string; // 注文日
//     userName // 購入者名
//     mail // メールアドレス
//     addressNumber: string; //　郵便番号
//     address: string;　// 住所
//     phoneNumber: string; // 電話番号
//     deliveryDate: string; // 配達日
//     deliveryTime: string; // 配達時間
//     cartItemList: string; // カート配列(JSONデータ)
// }

//     cartItemListのデータ構造

//     cartItemList: [] | [ { id:number, size:string, topping:string[], number:number, total:number } ]



export type ramen = { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type ramenProducts = [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ];

export type selectRamen = { product_id:number, size:string, topping:string[], number:number, total:number };

export type cartItem = [
    {
        cart_id : number | null,
        status: number,
        orderDate: string,
        userName: string,
        mail: string,
        addressNumber: string,
        address: string,
        phoneNumber: string,
        deliveryDate: string,
        deliveryTime: string,
        cartItemList: [] | [ { id:number, size:string, topping:string[], number:number, total:number } ]
    }
];


export type State = {
    StoreState:{
        user: {
            user_id: any;
            name: string;
            user_image: string;
            password: string;
            mail: string;
            phoneNumber: string;
            addressNumber: string;
            address: string;
            point: number;
            likeItemList: any[];
        };
        ramen: [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [],
        cart: {
            cart_id : number,
            status: number,
            orderDate: string,
            userName: string,
            mail: string,
            addressNumber: string,
            address: string,
            phoneNumber: string,
            deliveryDate: string,
            deliveryTime: string,
            cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ]
        };
        historyCart: [] | 
        [
            {
                cart_id : number,
                status: number,
                orderDate: string,
                userName: string,
                mail: string,
                addressNumber: string,
                address: string,
                phoneNumber: string,
                deliveryDate: string,
                deliveryTime: string,
                cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ]
            }
        ]
    }
};

export type Actions = {
    type: string,
    user: { 
            user_id: number,
            name: string,
            user_image: string,
            password: string,
            mail :string,
            phoneNumber: string,
            addressNumber: string,
            address: string,
            point: number,
            likeItemList: [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
        },
    ramenProducts : [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ],
    selectRamen : { product_id:number, size:string, topping:string[], number:number, total:number },
    cartItem :[
        {
            cart_id : string,
            status: number,
            orderDate: string,
            userName: string,
            mail: string,
            addressNumber: string,
            address: string,
            phoneNumber: string,
            deliveryDate: string,
            deliveryTime: string,
            cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ],
        }
    ],
    likeRamen: { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string },
    removeIndex: number,
    index: number,
    newCart: object
}

export type cartType = [
    {
        cart_id : number,
        status: number,
        orderDate: string,
        userName: string,
        mail: string,
        addressNumber: string,
        address: string,
        phoneNumber: string,
        deliveryDate: string,
        deliveryTime: string,
        cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ]
    }
] | [];


// ① Productsテーブル => 6カラム

// { 
//     Products : [
//         {
//             product_id: number;
//             name: string;
//             detail: string;
//             Msizeprice: number;
//             Lsizeprice: number;
//             pic: string
//         }
//     ]
// }

// ② Usersテーブル => 10カラム

// {
//     user_id: number; // userのID (自動インクリーメント)
//     name: string; // ユーザー名(ユニーク)
//     user_image: string; // ユーザーの登録画像
//     password: string; // パスワード
//     mail :string; // メールアドレス
//     phoneNumber: string; // 電話番号
//     addressNumber: string; // 
//     address: string; // 
//     point: number; // ポイント
//     likeItemList: string; // お気に入り配列(JSONデータ)
// }

// ③ Cartsテーブル => 11カラム

// {
//     cart_id: number; // カートのid(user_idと紐づく)
//     status: number; // カートステータス => 未購入カート(status0)は1つのみ！他はhistoryカート
//     orderDate: string; // 注文日
//     userName // 購入者名
//     mail // メールアドレス
//     addressNumber: string; //　郵便番号
//     address: string;　// 住所
//     phoneNumber: string; // 電話番号
//     deliveryDate: string; // 配達日
//     deliveryTime: string; // 配達時間
//     cartItemList: string; // カート配列(JSONデータ)
// }
