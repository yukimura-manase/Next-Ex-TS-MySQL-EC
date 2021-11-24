import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItem, buyCart, initCart, setLoginUser } from "../redux/ActionCreator";
import { createStyles, makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { loginUserSelector, ramenSelector, cartSelector } from "../redux/Selector";
import { ramenArray,cartItemList, mergeRamen, cartType } from "../components/pageTypes";
import router from "next/router";
import axios from "axios";

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
		"fontAdjust":{
			fontSize:"25px"
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
            background:"#ffead6"
        },
		"pic":{
            width: "350px",
            height: "200px"
        },
		"input": {
            width: "30%",
        },
		"u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        },
		"table":{
			width:"100%"
		},
		"error1": {
            color:"black",
            fontSize:"22px"
        },
        "error2": {
            color:"blue",
            fontSize:"20px"
        }


	}),
);


const Order = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);
    
    let cartData: any = useSelector(cartSelector);

    const ramenData = useSelector(ramenSelector);

    const dispatch = useDispatch();

    // 支払い情報のstate & 入力フォームと連動して、stateに入力値を保存するための関数たち
	const [ status, setStatus ] = useState<string>("");
	const inputStatus = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setStatus(e.target.value);
	};

	const [ orderDate, setOrderDate ] = useState<string>("");

	const [ userName, setUser ] = useState<string>("");
	const inputUserName = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUser(e.target.value);
	};

	const [ mail, setMail ] = useState<string>("");
	const inputMailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMail(e.target.value);
	};

	const [ addressNumber, setAddressNumber ] = useState<string>("");
	const inputAddressNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddressNumber(e.target.value);
	};

	const [ address, setAddress ] = useState<string>("");
	const inputAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value);
	};

	const [ phoneNumber, setPhoneNumber ] = useState<string>("");
	const inputPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(e.target.value);
	};

	const [ deliveryDate, setDeliveryDate ] = useState<string>("");
	const inputDeliveryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDeliveryDate(e.target.value);
	};

	const [ deliveryTime, setDeliveryTime ] = useState<string>("");
	const inputDeliveryTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDeliveryTime(e.target.value);
	};
	
    const
	[ ramens, setRamen] = useState<ramenArray|[]>([]),
	[ carts, setCart ] = useState<cartItemList|[]>([]),
	[ carts2 , setCart2] = useState<mergeRamen|[]>([]);

    useEffect(
        () => {

            if (ramenData.length !== 0 && cartData.cartItemList !== 0) {

				setRamen(ramenData);

				setCart(cartData.cartItemList);


                const cartIdList: number[] = carts.map(cart => cart.product_id); // cart内のidだけのリストを作成

                let matchRamen: any[] = cartIdList.map( // findした値の配列を生成する！ => matchラーメン配列
                    cartid => {
                        return ramens.find( (ramen: any) => cartid === ramen.product_id);
                    }
                );

                let mergeArray:any = []; // 入れ物用意

                    carts.forEach( (cart: any) => {
                    
                        let Match: any = matchRamen.find( (ramen: any) => ramen.product_id === cart.product_id); // idが一致するものを一つ格納！
    
                        const merged: any = { ...cart, ...Match };
    
                        mergeArray.push(merged);

                    });
                    setCart2(mergeArray);
            };

	    }, [cartData, ramenData, carts, ramens] // 監視対象となる値
    );

	// ユーザー登録がある場合は、登録情報を自動入力！
	useEffect( ()=>{

        if(user && user.name !== ''){
            setUser(user.name);
            setMail(user.mail);
            setPhoneNumber(user.phoneNumber);
            setAddressNumber(user.addressNumber);
            setAddress(user.address);
			setPoint(user.point);
        };

    },[user]);

    const totalTax = () => { // 消費税の合計を計算
		//console.log('totalTax')
		let tax: number[] = []
		carts.forEach( (cart: any) => {
			tax.push(cart.total * 0.1)
		});

		let totalTax = tax.reduce((sum, currentVal) => {
			return sum + currentVal;
		}, 0) // 初期値を設定している。
		return totalTax;
	};

    const sumTotalPlice = () => { // 小計金額(total)ごとの消費税分を計算。
		//console.log('sumTotalPlice')
		let taxInclude: number[] = []
		carts.forEach((cart: any) => {
			taxInclude.push(cart.total * 1.1)
		})
		let totalTaxIncludes = taxInclude.reduce((sum, currentVal) => {
			return sum + currentVal;
		}, 0)
		return Math.floor(totalTaxIncludes)
	};

    //バリデーション
	const attmark = (mailAddress: string) => {
		let val = (/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
		return val.test(mailAddress);
	}

	const yuubin = (addressNumber: string) => {
		let val = (/^\d{3}-\d{4}$/);
		return val.test(addressNumber);
	}

	const denwa = (phoneNumber: string) => {
		let val = (/^0\d{1,4}-\d{1,4}-\d{3,4}$/);
		return val.test(phoneNumber);
	}

	const order = (deliveryDate: string) => {
		let today = new Date()//今日の日付

		today = new Date(
			today.getFullYear(), //年
			today.getMonth(), //月
			today.getDate(), //日
			today.getHours(), //時間
		)

		let hopeDate = new Date(deliveryDate)

		let nowDay = today.getDate()
		
		let date = new Date(hopeDate)

		hopeDate = new Date(
			today.getMonth(), //月
			today.getDate(), //日
		)

		let selectDay = date.getDate()　//お届け希望の日付
		let nowHour = today.getHours() //現在の時間
		let i = Math.abs(Number(deliveryTime) - nowHour) //お届け希望の時間 - 今の時間

		//同じ日の処理
		if (nowDay === selectDay) {

			if (Number(deliveryTime) <= nowHour) {
				return false
			} else if (3 <= i) { //今の時間以降の場合
				return true
			} else {
				return false
			};

		} else if (nowDay >= selectDay) { //違う日の処理 ( 昨日以前 or 明日以降 )
			return false
		} else {
			return true
		};
	};

	const [ errors, setErrors ] = useState<string[]>([]); // バリデーション・エラーチェック用の配列


	//バリデーション関数 => 仕様に沿っているかのチェック(検証・確認)
	const Validation = (e: any) => {

		setErrors([]); //対象にする配列を空にしてあげる

		let allErrors = []; // error対象を入れる配列

		const sumTotalPoint = sumPoint(); // 獲得予定ポイントをセット

		setGetPoint( sumTotalPoint ); // 買い物によって得られるポイント(変わらない！)

		if(pointStatus === 'no'){
			console.log('ポイント利用なし！');

		} else if(pointStatus === 'all'){
			console.log('ポイントすべて利用！');

		} else if(pointStatus === 'part'){
			console.log('ポイント一部利用');

			// 一部利用時のポイントエラー文表示
			if( 0 >= inputPartPoint ){
				alert('使用ポイント額を入力してください！');
				allErrors.push('使用ポイント額を入力してください！');
			} else if( userPoint < inputPartPoint ){
				alert('使用可能ポイント額を超えています！');
				allErrors.push('使用可能ポイント額を超えています！');
			};
			
		};

		//お名前エラー
		if (userName === "") {
			allErrors.push("名前を入力してください");
		};

		//アドレスエラー
		if ( mail === "" ) {
			allErrors.push("アドレスを入力してください") }
		else if( !attmark( mail ) ) {
			allErrors.push("メールアドレスの形式が不正です ('@', '.'は入っているか、スペースを空けていないか確認して下さい。) ")
		};

		//郵便番号エラー
		if (addressNumber === "") {
			allErrors.push("郵便番号を入力してください")
		} else if ( !yuubin(addressNumber) ) {
			allErrors.push("郵便番号はスペースは空けず、XXX-XXXXの形式で入力してください")
		};

		//住所エラー
		if (address === "") {
			allErrors.push("住所を入力してください")
		};

		//TELエラー
		if (phoneNumber === "") {
			allErrors.push("電話番号を入力してください")
		} else if (!denwa(phoneNumber)) {
			allErrors.push("電話番号はスペースは空けず、'0'始まりの XXX-XXXX-XXXX の形式で入力してください")
		};

		//お届け日エラー
		if (deliveryDate === "") {
			allErrors.push("配送日を入力してください")
		}
		//時間指定エラー
		else if (!order(deliveryDate)) {
			allErrors.push("今から3時間後の日時をご入力ください")
		};

		//お届け時間エラー
		if (deliveryTime === "") {
			allErrors.push("配送時間を入力してください")
		};

		//お支払いエラー
		if (!status) {
			allErrors.push("支払い方法を選択してください")
		};

		setErrors(allErrors);
		//console.log(errors);

		if(allErrors.length === 0){
			//console.log('動作確認1');
			orderFinish();
		};

	};

	const dayOfWeek = ['(日)','(月)','(火)','(水)','(木)','(金)','(土)'];

	const zeroCheck = (num)=> {
		//console.log(num);
		if(num < 10 ){
			//console.log('ゼロチェック！');
			return '0' + num ;
		}else {
			return num;
		};
	};

	const orderFinish = ()=> {
		//console.log('orderFinish起動！');
		let now: Date = new Date();
		//console.log(now);

		let stringNow: string = `${now.getFullYear()}年 ${now.getMonth() + 1}月 ${now.getDate()}日 ${ dayOfWeek[now.getDay()] } ${ now.getHours() }時 ${ zeroCheck( now.getMinutes() ) }分`;
		// console.log(stringNow);
		// console.log(typeof stringNow);

		setOrderDate(stringNow); // Dateオブジェクトを文字列化して保存する！
		//console.log('動作確認2');
	};

	useEffect( ()=>{
		//console.log('useEffect ver.orderDate');

		if (errors.length === 0 && orderDate !== '') {
			//console.log('orderDateあり！！');

			if(user.user_id){
				dispatchOrderCart(user);
			} else {
				NoLoginOrderCart();
			};
			
			router.push('/thanks');
		};

	},[orderDate]);

	const [ userPoint, setPoint ] = useState<number>(0); // 所持ポイント

	const [ partSwich, setBoolean ] = useState<boolean>(false); // 一部ポイント利用のスイッチ(表示/非表示)

	const [ pointStatus, setPointStatus ] = useState<string>('no');

	const [ allPoint, setAllPoint ] = useState<number>(0);

	const [ inputPartPoint, setUsePartPoint ] = useState<number>(0);

	const [ orderGetPoint, setGetPoint ] = useState<number>(0); // 最終的にuserがgetするpoint
	
	// 獲得予定ポイント合計を計算
	const sumPoint = ()=> {
		const sumTotal = sumTotalPlice();

		return Math.floor(sumTotal / 10);
	};

	// デフォルト(ポイント利用なし)
	const useNoPoint = (e)=> {

		setBoolean(false); // swich

		setAllPoint(0); // init
		setUsePartPoint(0); // init

		setPointStatus(e.target.value); //statusセット
	};

	// ポイントすべて利用ボタン
	const useAllPoint = (e)=> {

		setBoolean(false);

		setUsePartPoint(0);
		setAllPoint(userPoint); // すべてのポイントをセット

		setPointStatus(e.target.value);
	};

	// ポイントを部分的に利用ボタン
	const usePartPoint = (e)=> {

		setPointStatus(e.target.value);

		setBoolean(true);

		setAllPoint(0);
	};

	// ポイント使用額入力
	const inputUsePoint = (e)=> {
		setUsePartPoint( Number(e.target.value) );
	};

	// ポイント使用後の金額計算を表示する！
	const afterUsePointDisplay = ()=> {

		if(pointStatus === 'no'){
			return <h4>ポイント利用なし！</h4>;
		} else if(pointStatus === 'all'){
			return <h4 className={ classes.fontAdjust}><u className={classes.u}>{ sumTotalPlice() - allPoint }円(税込)</u></h4>;
		} else if(pointStatus === 'part'){

			if(0 >= inputPartPoint){
				return <h5 className={ classes.fontAdjust}><u className={classes.u}>使用ポイント額を入力してください</u></h5>;
			} else if(userPoint >= inputPartPoint) {
				return <h5 className={ classes.fontAdjust}><u className={classes.u}>{ sumTotalPlice() - inputPartPoint }円(税込)</u></h5>;
			} else if(userPoint < inputPartPoint) {
				return <h4 className={ classes.fontAdjust}><u className={classes.u}>使用可能ポイント額を超えています！</u></h4>;
			};
		};

	};

	// 最終的なポイントの計算関数！
	const calculateTotalPoint = ()=>{
		console.log('動作確認');
		console.log(`獲得予定ポイント:${orderGetPoint}`);
		console.log(`ユーザーの所持ポイント:${userPoint}`);
		console.log(`一部利用の入力ポイント:${inputPartPoint}`);

		console.log('動作確認2');
		if(pointStatus === 'no'){
			console.log('ポイント利用なし！');
			return orderGetPoint + userPoint;
		} else if(pointStatus === 'all'){
			console.log('ポイントすべて利用！');
			return orderGetPoint;
		} else if(pointStatus === 'part'){
			console.log('ポイント一部利用！');
			return orderGetPoint + ( userPoint - inputPartPoint);
		};

	};

	// 注文完了時のカート処理
    const dispatchOrderCart = (user) => {

		// ログインしている場合
		if(user && user.user_id){

			let user_id = user.user_id;

			let totalPoint = calculateTotalPoint();
			console.log(totalPoint);

			const pointUpdate = `http://localhost:8000/api/point/${user_id}`;

			let updatePoint = { point: totalPoint }; // 獲得ポイント + 所持ポイント
			console.log(updatePoint);

			axios.post(pointUpdate, updatePoint)
			.then( (res)=> {
					console.log('ポイントupdateレスポンス！');
					console.log(res);
					
					let userData = res.data;

					dispatch( setLoginUser(userData) ); // ユーザー情報を更新
			})
			.catch(console.error);

			let SubmitCart = {
				cart_id: user_id,
				status: status,
				orderDate: orderDate,
				userName: userName,
				mail: mail,
				addressNumber: addressNumber,
				address: address,
				phoneNumber: phoneNumber,
				deliveryDate: deliveryDate,
				deliveryTime: deliveryTime,
				cartItemList: cartData.cartItemList
			};
			//console.log(SubmitCart);

			dispatch( buyCart(SubmitCart) ); // 購入完了した商品をStoreStateに保存する！

			const server = `http://localhost:8000/api/order/${user_id}`;

			axios.post(server, SubmitCart)
			.then( (res)=> {
				//console.log(res);

				alert(res.data);

				let initCart = {
					cart_id: user_id,
					status: 0,
					orderDate: '',
					userName: '',
					mail: '',
					addressNumber: '',
					address: '',
					phoneNumber: '',
					deliveryDate: '',
					deliveryTime: '',
					cartItemList: []
				};
				const server2 = `http://localhost:8000/api/newcart`;

				axios.post(server2, initCart)
				.then( (res)=>{
					//console.log(res);

					//console.log(JSON.parse(res.config.data));

					let axiosData = JSON.parse(res.config.data);
					//console.log(axiosData);

					dispatch( fetchCartItem(axiosData) ); // 新規作成したカートをセットする！
				})
				.catch(console.error);
				
			})
			.catch(console.error);
			
		};
		
	};

	// ノーログインユーザー専用の購入完了処理 & initCart
    const NoLoginOrderCart = () => {

		let SubmitCart = {
			cart_id: null,
			status: status,
			orderDate: orderDate,
			userName: userName,
			mail: mail,
			addressNumber: addressNumber,
			address: address,
			phoneNumber: phoneNumber,
			deliveryDate: deliveryDate,
			deliveryTime: deliveryTime,
			cartItemList: cartData.cartItemList
		};

		console.log(SubmitCart);
		dispatch( buyCart(SubmitCart) ); // 購入完了処理

		dispatch( initCart() ); // カートの初期化

	};
	

	
    return(
        <div className={ classes.text } >

			<div className={ classes.title} ><u className={classes.u}>注文確認画面</u></div>

			{
				carts2.length === 0 ? <h3>カートに商品情報がありません！</h3> :
				<div>
					<div>
					<table className={classes.tableWidth}>
						<thead>
							<tr className={ classes.cartTitle } >
								<th>商品名</th>
								<th>商品イメージ</th>
								<th>サイズ</th>
								<th>数量</th>
								<th>トッピング</th>
								<th>価格(税抜)</th>
							</tr>
						</thead>
						<tbody className={ classes.tableBody } >
							{ carts2.map((item, index) => {
								return (
									<tr key={index}>
										<td> {item.name} </td>
										<td><img src={item.pic} className={classes.pic} alt='' /></td>
										<td> {item.size} </td>
										<td> {item.number} </td>
										<td> {item.topping} </td>
										<td> {item.total}円 </td>
									</tr>
								);
							})}
						</tbody>
					</table>
					</div>

					<div>
						<div>消費税 : {totalTax()} 円</div>
					</div>

					<div>
						<div className={ classes.fontAdjust} ><u className={classes.u}>注文金額 (税込) : {sumTotalPlice()} 円</u></div>
					</div>

					<h4>獲得予定ポイント：{ sumPoint() } ポイント</h4>


					<h3 className={ classes.fontAdjust } ><u className={classes.u}>ポイント情報✨</u></h3>

					<h4>ユーザー所持ポイント：{user.point} ポイント</h4>

					<div>
						<div>
							<label htmlFor="no-point" >ポイントを利用しない</label>
							<input type="radio" name="point" value="no" id="no-point" onChange={ (e)=>{ useNoPoint(e) } } />
						</div>
						<div>
							<label htmlFor="all-point">すべてのポイントを利用</label>
							<input type="radio" name="point" value="all" id="all-point" onChange={ (e)=>{ useAllPoint(e) } } />
						</div>
						<div>
							<label htmlFor="part-point">一部のポイントを利用</label>
							<input type="radio" name="point" value="part" id="part-point" onChange={ (e)=>{ usePartPoint(e) } } />
							{ partSwich ? <input type="number"  onChange={ (e)=>{ inputUsePoint(e) } } /> : false }
						</div>
						<h4>ポイント利用後の注文金額🍀</h4>
						<div>{ afterUsePointDisplay() }</div>
					</div>



					<div>

						<h3 className={ classes.fontAdjust} ><u className={classes.u}>お届け先情報</u></h3>
						<h4>登録済みの情報は、自動入力されます✨</h4>

						<div>

							<div>お名前</div>
							<div>
								<input className={ classes.input } type="text" value={userName} onChange={inputUserName} placeholder="ラーメン太郎" />
							</div>
						

					
							<div>メールアドレス</div>
							<div>
								<input className={ classes.input } type="text" value={mail} onChange={inputMailAddress} placeholder="ramen@xxxx.com" />
							</div>
						

					
							<div>郵便番号</div>
							<div>
								<input className={ classes.input } type="text" value={addressNumber} onChange={inputAddressNumber} placeholder="160-0022" />
							</div>
						

					
							<div>住所</div>
							<div>
								<input className={ classes.input } type="text" value={address} onChange={inputAddress} placeholder="東京都新宿区新宿4-3-23 TOKYU REIT  新宿ビル8F" />
							</div>
						
							<div>電話番号</div>
							<div>
								<input className={ classes.input } type="text" value={phoneNumber} onChange={inputPhoneNumber} placeholder="000-0000-0000" />
							</div>
						
							<div>配達日時</div>
							<div>
								<input className={ classes.input } type="date" value={deliveryDate} onChange={inputDeliveryDate} />
							</div>
							<div className="time">
								<div className="time-item"><input type="radio" name="time" value="10" onChange={inputDeliveryTime} id="r10" /><label htmlFor="r10">&nbsp;10時</label></div>
								<div className="time-item"><input type="radio" name="time" value="11" onChange={inputDeliveryTime} id="r11" /><label htmlFor="r11">&nbsp;11時</label></div>
								<div className="time-item"><input type="radio" name="time" value="12" onChange={inputDeliveryTime} id="r12" /><label htmlFor="r12">&nbsp;12時</label></div>
								<div className="spacer"></div>
								<div className="time-item"><input type="radio" name="time" value="13" onChange={inputDeliveryTime} id="r13" /><label htmlFor="r13">&nbsp;13時</label></div>
								<div className="time-item"><input type="radio" name="time" value="14" onChange={inputDeliveryTime} id="r14" /><label htmlFor="r14">&nbsp;14時</label></div>
								<div className="time-item"><input type="radio" name="time" value="15" onChange={inputDeliveryTime} id="r15" /><label htmlFor="r15">&nbsp;15時</label></div>
								<div className="spacer"></div>
								<div className="time-item"><input type="radio" name="time" value="16" onChange={inputDeliveryTime} id="r16" /><label htmlFor="r16">&nbsp;16時</label></div>
								<div className="time-item"><input type="radio" name="time" value="17" onChange={inputDeliveryTime} id="r17" /><label htmlFor="r17">&nbsp;17時</label></div>
								<div className="time-item"><input type="radio" name="time" value="18" onChange={inputDeliveryTime} id="r18" /><label htmlFor="r18">&nbsp;18時</label></div>
							</div>
										

						</div>

					</div>

					<div >

						<h3>お支払い方法</h3>

						<div className={ classes.text } >
							
							<h4>お支払い方法を選択してください。</h4>
							<input type="radio" name="pay" value="1" onChange={inputStatus} id="cashOnDelivery" /><label htmlFor="cashOnDelivery">代金引換</label>
							<input type="radio" name="pay" value="2" onChange={inputStatus} id="credit" /><label htmlFor="credit">クレジットカード決済</label>
						</div>
					</div>

					<div>{errors.map( (error, index)=> {
							return (
								<React.Fragment key={index} >
									<h4 className={classes.error1} >入力エラー{index + 1}</h4>
									<h5 className={ classes.error2 } >{error}</h5>
								</React.Fragment>
							);
						})
					}</div>


					<div>
						<button className={classes.button} onClick={Validation} >　注文　</button>
					</div>
				</div>
			}

			

        </div>
    );
};

export default Order;