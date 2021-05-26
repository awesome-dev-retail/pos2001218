import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button, Spin,Select,Alert} from "antd";
import { UserOutlined, LockOutlined} from "@ant-design/icons";
import CONSTANT from "../../configs/CONSTANT";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {fetchShopList, fetchLaneList,selectShops,selectLanes, setToken, fetchUser,userLogOut,selectCurrentUser,selectIsLogin, selectAuthIsLoading, setCurrentShop
} from "../../slices/authSlice";
import CacheStorage from "../../lib/cache-storage";
import PageLoading from "../../components/PageLoading";
import {db, message} from "../../lib";

const { Option } = Select;

const SelectShop = (props) => {

    const history = useHistory();
	const dispatch = useDispatch();
	const shopList = useSelector(state => selectShops(state));
	const laneList = useSelector(state => selectLanes(state));
	const [shopValue, setShopValue] = useState();
	const [laneValue, setLaneValue] = useState();
	const token = CacheStorage.getItem("token");
	const isLogin = useSelector(state => selectIsLogin(state));
	const currentUser = useSelector(state => selectCurrentUser(state));
	const isLoading = useSelector(state => selectAuthIsLoading(state));
	// const [isLoading, setIsLoading] = useState(true);
	const selectShop = CacheStorage.getItem("SELECT_SHOP");
	const selectLane = CacheStorage.getItem("SELECT_LANE");

	const handleButton = ()=>{
		db.sendLogsToServer();
		// message.error("Something wrong");
	};

	useEffect(() => {
		if (token) {
			console.log(token);
			dispatch(setToken(token));
			dispatch(fetchUser());
		}
		dispatch(fetchShopList());
		dispatch(fetchLaneList());

		// setIsLoading(false);

		if(selectShop) {
			setShopValue(selectShop);	
		}
		if(selectLane) {
			setLaneValue(selectLane);
		}
	}, []);


    const handleBackToLogin = ()=> {
			dispatch(userLogOut());	
    };

    const handleToHomePage = ()=> {
		history.push(CONSTANT.ROUTES.HOME);
    };

    const handleShopChange = (value)=> {
		console.log(`selected ${value}`);
		CacheStorage.setItem("SELECT_SHOP", value);
		// const selectShop = CacheStorage.getItem("SELECT_SHOP");
		setShopValue(value);
		dispatch(setCurrentShop);
	};

	const handleLaneChange = (value)=> {
		console.log(`selected ${value}`);
		CacheStorage.setItem("SELECT_LANE", value);
		const selectShop = CacheStorage.getItem("SELECT_LANE");
		setShopValue(selectLane);
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
					value={shopValue}
                    style={{border: 0}}
                    onChange={handleShopChange}
				>
				{
					shopList.length > 0 && 
						shopList.map((shop, index) => <Option key={index} value={shop.id}>{shop.shop_name}</Option>)
				}
                </Select>
				</Form.Item>

				<Form.Item 
				// name="bizex_catering_pos_lane"
				rules={[{ required: true, message: "Please select a Lane!"  }]}
				>

				<Select 
					placeholder="Select a Lane" 
					value={laneValue}
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
			<Button onClick={handleButton}>Add</Button>
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