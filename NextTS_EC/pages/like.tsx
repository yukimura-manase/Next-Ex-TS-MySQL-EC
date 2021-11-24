import React, {useState,useEffect} from 'react';
import { removeLike } from '../redux/ActionCreator';
import { useDispatch,useSelector } from 'react-redux';
import router from 'next/router';
import { createStyles, makeStyles } from '@material-ui/styles';
import { loginUserSelector, ramenSelector, cartSelector } from '../redux/Selector';
import { likeItemListType, likeItemListOneType } from '../components/pageTypes';
import axios from 'axios';

const useStyle = makeStyles(() =>
    createStyles({
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
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
        "dis":{
            textAlign:"center"
            
        },
        "tableWidth":{
            width:"80%",
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
            background:"#ffead6",
            textAlign:"center"
        },
        "randombutton": {
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },
        "lucky":{
            backgroundColor:"#ffead6",
            width:"50%",
            paddingTop:"15px",
            paddingRight:'15px',
            paddingLeft:'15px',
            paddingBottom:"15px",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:"50px",
            textAlign:"center"
        },
    }),
);


const Like = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);
    
    const ramenData = useSelector(ramenSelector);

    const cartData = useSelector(cartSelector);
    //console.log(cartData);

    const dispatch = useDispatch();

    const 
    //[ ramens, setRamen ] = useState<ramenArray>([]),
    [ likes, setLike ] = useState<likeItemListType | []>([]),
    [ randomramen, setRandom ] = useState<string>(''),
    [ randomramen2, setRandom2 ] = useState<string>('');

    useEffect( ()=>{
        //ramenData.length !== 0 && setRamen(ramenData)

        setLike(user.likeItemList);

    },[ramenData,user]);

    
    const happy = ['大吉','中吉','小吉',]
    const BestRamen = ()=>{
        let random = likes[Math.floor(Math.random() * likes.length )]
        let random2 = happy[Math.floor(Math.random() * happy.length )]
        //console.log(random)
        setRandom(`今日のハッピー・ラッキーラーメンは、「${random.name}」!! 　ラーメン・おみくじは「${random2}」`);
        setRandom2(random.pic);
    };

    const remove = (index: number)=>{

        console.log(index);

        if(user.user_id){

            const user_id = user.user_id;

            const server = `http://localhost:8000/api/likeremove/${user_id}`;

            axios.post(server, {index: index})
            .then( (res)=> {
                console.log(res);

                dispatch(removeLike(index));
            }).catch(console.error);

        } else {

            const likeItemList = window.sessionStorage.getItem('likeItemList');

            const parseLikeItemList = JSON.parse(likeItemList);
            parseLikeItemList.splice(index, 1);

            window.sessionStorage.setItem( 'likeItemList', JSON.stringify(parseLikeItemList) );

            dispatch(removeLike(index));
        };

    };



    return (
        <React.Fragment>
            <div>
                <div className={classes.dis}>
                    {
                        user.name !== '' ? <h2><u className={classes.u}>{user.name}さんのお気に入り商品一覧</u></h2> :
                        <h2><u className={classes.u}>お気に入り商品一覧</u></h2>
                    }
                </div>
                <div>
                    { likes.length === 0 ? <h2>お気に入り登録がありません！</h2>:
                    <div>
                        <div className={classes.lucky}>
                            <button onClick={ ()=>{BestRamen()} } className={classes.randombutton}>今日のハッピー・ラッキーラーメン♪♫</button>
                            <h3>{randomramen}</h3>
                            <h2><img src={randomramen2} alt='' className="pic" /></h2>
                        </div>
                        <table className={classes.tableWidth}>
                            <thead>
                                <tr className={classes.cartTitle}>
                                    <th>
                                        <h2>商品名</h2>
                                    </th>
                                    <th>
                                        <h2>商品イメージ</h2>
                                    </th>
                                    <th>
                                        <h2>説明</h2>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            {
                                likes.map( (like: likeItemListOneType,index: number)=>{
                                    return (
                                        <tbody className={classes.tableBody}　key={like.product_id}>
                                            <tr>
                                                <td>
                                                    <div>{like.name}</div>
                                                </td>
                                                <td>
                                                    <div><img src={like.pic} className={classes.pic} alt='' ></img></div>
                                                </td>
                                                <td>
                                                    <div>{like.detail}</div>
                                                </td>
                                                <td>
                                                    <button onClick={()=> router.push(`products/${like.product_id}`)} className={classes.button}>商品詳細へ</button>
                                                    <button onClick={ ()=>{remove(index)} } className={classes.button}>お気に入りから削除</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                            </table>
                    </div>
                    }
                </div>

            </div>
        </React.Fragment>
    );
};

export default Like;