import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button, Spin,Select,Alert} from "antd";
import { UserOutlined, LockOutlined} from "@ant-design/icons";
import CONSTANT from "../../configs/CONSTANT";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {fetchShopList, selectShop, selectLane, setShop, setLane, fetchLaneList,selectShops,selectLanes, setToken, fetchUser,userLogOut,selectCurrentUser,selectIsLogin, selectAuthIsLoading
} from "../../slices/authSlice";
import CacheStorage from "../../lib/cache-storage";
import PageLoading from "../../components/PageLoading";


const { Option } = Select;

const SelectShop = (props) => {

    const history = useHistory();
	const dispatch = useDispatch();
	const shopList = useSelector(state => selectShops(state));
	const laneList = useSelector(state => selectLanes(state));
	const token = CacheStorage.getItem("token");
	const isLogin = useSelector(state => selectIsLogin(state));
	const currentUser = useSelector(state => selectCurrentUser(state));
	const isLoading = useSelector(state => selectAuthIsLoading(state));
	// const [isLoading, setIsLoading] = useState(true);
	const localShop = CacheStorage.getItem("SELECT_SHOP");
	const localLane = CacheStorage.getItem("SELECT_LANE");
	const shop = useSelector(state => selectShop(state));
	const lane = useSelector(state => selectLane(state));



	useEffect(() => {
		if (token) {
			dispatch(setToken(token));
			dispatch(fetchUser());
		}
		dispatch(fetchShopList());
		dispatch(fetchLaneList());

		if(localShop) {
			dispatch(setShop(localShop));
		}
		if(localLane) {
			dispatch(setLane(localLane));
		}
	}, []);


    const handleBackToLogin = ()=> {
			dispatch(userLogOut());	
    };

    const handleToHomePage = ()=> {
		history.push(CONSTANT.ROUTES.HOME);
    };

    const handleShopChange = (value)=> {
    	const selectedShop = shopList.find(shop => shop.shop_name === value);
    	if (selectedShop) {
			CacheStorage.setItem("SELECT_SHOP", selectedShop);
			//const shop = CacheStorage.getItem("SELECT_SHOP");
			// setShopValue(selectShop);
			dispatch(setShop(selectedShop));
		}
	};

	const handleLaneChange = (value)=> {
		const selectLane = laneList.find(lane => lane.lane_name === value);
		if (selectLane) {
			CacheStorage.setItem("SELECT_LANE", selectLane);
			dispatch(setLane(selectLane));
		}
		// console.log(`selected ${value}`);
		// const selectShop = CacheStorage.getItem("SELECT_LANE");
		// setShopValue(selectLane);
	};

	return (
		<div className={styles.LoginPageDiv}>
		<div className={styles.LoginContainer}>
		{isLogin && <Spin tip="Loading..." spinning={isLoading}> 	
	 		<Form
				name="basic"	
				onFinish={handleToHomePage}
			>

				<Form.Item
					name="username"
				>
				<Input 
					prefix={<UserOutlined className="site-form-item-icon" />}
					placeholder={currentUser.userinfo.uname}
					className={styles.LoginInput}
                    disabled
				/>
				</Form.Item>							

				<Form.Item 
					// name="bizex_catering_pos_shop"
					rules={[{ required: true, message: "Please select a Shop!" }]}
				>
				<Select 
					placeholder="Select a Shop" 
					value={shop.shop_name}
                    style={{border: 0}}
                    onChange={handleShopChange}
				>
				{
					shopList.length > 0 && 
						shopList.map((shop, index) => <Option key={index} value={shop.shop_name}>{shop.shop_name}</Option>)
				}
                </Select>
				</Form.Item>

				<Form.Item 
				// name="bizex_catering_pos_lane"
				rules={[{ required: true, message: "Please select a Lane!"  }]}
				>

				<Select 
					placeholder="Select a Lane" 
					value={lane.lane_name}
                    style={{border: 0}}
                    onChange={handleLaneChange}
				> 
					{
					laneList.length > 0 && 
						laneList.map((lane, index) => <Option key={index} value={lane.lane_name}>{lane.lane_name}</Option>)
					}
                </Select>
				</Form.Item>

				<Form.Item >
				<Button size="large" className={styles.SubmitBtn} onClick={handleBackToLogin}>
					Back to Login
				</Button>
                <Button size="large" htmlType="submit" className={styles.SubmitBtn} >
					Go
				</Button>
				</Form.Item>
    		</Form>	
		</Spin>
		}
		</div>
		</div>
	);
	// return(
	// 	isLoading?
	// 	<div><Spin className={styles.Spin} tip={"System Loading"}/></div>
	// 	:
	// 	isLogin && 
	// 	<div className={styles.LoginPageDiv}>
    //      	<div className={styles.LoginContainer}>
	// 		<Form
	// 			name="basic"	
	// 			onFinish={handleToHomePage}
	// 		>

	// 			<Form.Item
	// 				name="username"
	// 			>
	// 			<Input 
	// 				prefix={<UserOutlined className="site-form-item-icon" />}
	// 				placeholder={currentUser.userinfo.uname}
	// 				className={styles.LoginInput}
    //                 disabled
	// 			/>
	// 			</Form.Item>							

	// 			<Form.Item 
	// 				// name="bizex_catering_pos_shop"
	// 				rules={[{ required: true, message: "Please select a Shop!" }]}
	// 			>
	// 			<Select 
	// 				placeholder="Select a Shop" 
	// 				value={shopValue}
    //                 style={{border: 0}}
    //                 onChange={handleShopChange}
	// 			>
	// 			{
	// 				shopList.length > 0 && 
	// 					shopList.map((shop, index) => <Option key={index} value={shop.shop_name}>{shop.shop_name}</Option>)
	// 			}
    //             </Select>
	// 			</Form.Item>

	// 			<Form.Item 
	// 			// name="bizex_catering_pos_lane"
	// 			rules={[{ required: true, message: "Please select a Lane!"  }]}
	// 			>

	// 			<Select 
	// 				placeholder="Select a Lane" 
	// 				value={laneValue}
    //                 style={{border: 0}}
    //                 onChange={handleLaneChange}
	// 			> 
	// 				{
	// 				laneList.length > 0 && 
	// 					laneList.map((lane, index) => <Option key={index} value={lane.lane_name}>{lane.lane_name}</Option>)
	// 				}
    //             </Select>
	// 			</Form.Item>


	// 			<Form.Item >
	// 			<Button size="large" className={styles.SubmitBtn} onClick={handleBackToLogin}>
	// 				Back to Login
	// 			</Button>
    //             <Button size="large" htmlType="submit" className={styles.SubmitBtn} >
	// 				Go
	// 			</Button>
	// 			</Form.Item>
    // 		</Form>
	// 		</div>
	// 	</div>
	// );
};

export default SelectShop;