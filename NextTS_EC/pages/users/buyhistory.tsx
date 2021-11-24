import React,{ useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { loginUserSelector, historyCartSelector, ramenSelector } from "../../redux/Selector";
import { createStyles,makeStyles } from '@material-ui/styles';

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
        "pic":{
            width: "350px",
            height: "200px"
        },
        "tableWidth":{
            width:"95%",
            margin:"3px auto",
            paddingTop:"30px",
            paddingBottom:"30px"
        },
        "cartTitle":{
            background:"#FF6633",
            fontSize:"10px",
            color:"#fff"

        },
        "tableBody":{
            background:"#ffead6"
        },
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        },
        "price":{
            fontSize:"18px",
            paddingBottom:"15px"
        }

    }),
);

const BuyHistory = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    const ramen = useSelector(ramenSelector);
    
    const historyCart = useSelector(historyCartSelector);

    const [ historyCartList, setHistoryCarts ] = useState([]);

    
    // historyCart(配列) => historydata(オブジェクト) => cartItemList(key・配列) => cartItem(オブジェクト) => product_id(key・number)

    const makeNewHistoryCart = ()=> {

        historyCart.forEach( (historydata, index)=> {
            // console.log('ヒストリーデータ');
            // console.log(historydata);
    
            let newCartItemList = [];
    
            historydata.cartItemList.forEach( (cartItem)=> {
    
                // console.log('ヒストリーカートアイテム');
                // console.log(cartItem);
    
                let product_id = cartItem.product_id;
    
                let matchRamen = ramen.find( (ramendata)=> { // 条件にマッチする値を返す！ 
                    return ramendata.product_id === product_id;
                });
    
                let mergeCartItem = { ...cartItem, ...matchRamen };
                // console.log('マッチラーメン合成');
                // console.log(mergeCartItem);
                
                newCartItemList.push(mergeCartItem);
                // console.log('ニューカートアイテム');
                // console.log(newCartItemList);
    
            });
    
            historyCart[index].cartItemList = newCartItemList;
    
        });

        setHistoryCarts(historyCart);

    };

    useEffect( ()=> {
        makeNewHistoryCart();
    },[historyCart]);
    

    // ① buyRamenIdList(配列) => IdObject(オブジェクト・{ index番号:product_id } )
    // ② ramen(配列) => ramendata(オブジェクト) => product_idと一致するname(key・string)を取得して、buyRamenNameリストを作成する！

    // 並べ替え機能 => 注文日(昇順・降順),購入金額(昇順・降順)


    const sumTotalPlice = (cartItemList)=> {

        let includeTaxList = []; // 税込金額リスト

        cartItemList.forEach( (cartItem)=> {
            includeTaxList.push(cartItem.total * 1.1); // 税込金額に加工してpushする！
        });

        let sumPrice = includeTaxList.reduce( (sum, current)=> {
            return sum + current;
        }, 0);

        return Math.floor(sumPrice);
        
    };

    const sumPoint = (cartItemList)=> {

        const sumTotal = sumTotalPlice(cartItemList);

        return Math.floor(sumTotal / 10);
    };


    return (
        <div className={classes.text} >
            <h2 className={classes.title} >購入履歴画面</h2>
            {
                historyCart.length === 0 ? <h2>購入履歴はありません</h2> : 
                <div >
                    <table className={classes.tableWidth}>
                        <thead>
                            <tr className={classes.cartTitle}>
                                <th>
                                    <h2>注文日</h2>
                                </th>
                                <th>
                                    <h2>購入商品情報</h2>
                                </th>
                                <th>
                                    <h2>購入総額(税込)</h2>
                                </th>
                                <th>
                                    <h2>取得ポイント</h2>
                                </th>
                                <th>
                                    <h2>お届け先(住所)</h2>
                                </th>
                                <th>
                                    <h2>配達日時</h2>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={classes.tableBody} >
                                {
                                    historyCartList.map( (history, index)=> {
                                        return (
                                            <tr key={ index } >
                                                <td><h3>{ history.orderDate }</h3></td>

                                                <td>{ history.cartItemList.map( (cartItem)=> {
                                                        return (
                                                            <React.Fragment>
                                                                <h3>{ `商品名：${cartItem.name}` }</h3> 
                                                                <h3>{ `${cartItem.size}サイズ・${cartItem.number}個・${cartItem.topping}をトッピング` }</h3>
                                                                <h3>{`購入金額：${cartItem.total}円(税抜)`}</h3>
                                                                <span><img src={cartItem.pic} /></span>
                                                            </React.Fragment>
                                                        );
                                                    })
                                                 }</td>
                                                <td>
                                                    <h3>{ `合計${ sumTotalPlice(history.cartItemList) }円(税込)` }</h3>
                                                </td>
                                                <td><h3>{ `取得ポイントは${ sumPoint(history.cartItemList) }` }</h3></td>
                                                <td>{ history.address }</td>
                                                <td>{ `${history.deliveryDate}の${history.deliveryTime}時に配達` }</td>
                                            </tr>
                                        );
                                    })
                                }
                        </tbody>
                    </table>
                </div>
            }
            
        </div>
    );
};

export default BuyHistory;