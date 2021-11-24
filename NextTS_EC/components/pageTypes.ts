export type State = {
    StoreState:{
        user: null |
            { 
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
        ramen: [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [],
        cart: [
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
        ] | []
    }
};

export type ramenArray = [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [];

export type ramenObject = { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type select = { product_id:number, size:string, topping:string[], number:number, total:number | undefined };

export type initialCart = [
    {
      cart_id: number,
      status: number,
      orderDate: string,
      userName: string,
      mail: string,
      addressNumber: string,
      address: string,
      phoneNumber: string,
      deliveryDate: string,
      deliveryTime: string,
      cartItemList: [],
    }
  ];

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

export type cartObject = {
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
    cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ];
};

export type cartItemList = [ { product_id:number, size:string, topping:string[], number:number, total:number } ];

export type cartItemObject = { product_id:number, size:string, topping:string[], number:number, total:number };

export type likeItemListType = [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ];

export type likeItemListOneType = { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type mergeRamen = [ { product_id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ];

export type mergeRamenOne = { product_id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type newCartType = [
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
];

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
