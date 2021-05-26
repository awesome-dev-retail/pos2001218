import React, { useEffect, useState} from "react";
import styles from "./index.module.scss";
import { Form, Input, Button} from "antd";
import { UserOutlined, LockOutlined} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginToServer, selectUserToken, fetchUser, setToken, selectCurrentUser } from "../../slices/authSlice";
import CONSTANT from "../../configs/CONSTANT";
import { useHistory } from "react-router-dom";
import CacheStorage from "../../lib/cache-storage";
// import history from "../../components/history";
import {db, message} from "../../lib";

const LoginPage = () => {
	const [isLoadind, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();
	const hasToken = useSelector(state => selectUserToken(state));
	const info = CacheStorage.getItem("token");
	const currentUser = useSelector(state => selectCurrentUser(state));

	// useEffect(() => {
	// 		if(hasToken) {
	// 			dispatch(setToken(hasToken));
	// 			dispatch(fetchUser());
	// 		}
	// }, [hasToken]);

	// useEffect(() => {
	// 	if (currentUser){
	// 		history.push(CONSTANT.ROUTES.SELECT_SHOP);
	// 	}
	// }, [currentUser]);

	const onFinish = (values) => {
		setIsLoading(true);
		dispatch(loginToServer({username: values.bizex_catering_pos_username, password: values.bizex_catering_pos_password}));
		setIsLoading(false);	
	  };

	return (
		<div className={styles.LoginPageDiv}>
				<div className={styles.LoginContainer}>
					<Form
				name="basic"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>

				<Form.Item
					name="bizex_catering_pos_username"
					rules={[{ required: true, message: "Please input your username!" }]}
				>
				<Input 
					prefix={<UserOutlined className="site-form-item-icon" />}
					placeholder="Username" 
					className={styles.LoginInput}
				/>
				</Form.Item>							

				<Form.Item
					
					name="bizex_catering_pos_password"
					rules={[{ required: true, message: "Please input your password!" }]}
				>
				<Input.Password 
					prefix={<LockOutlined className="site-form-item-icon" />}
					placeholder="Password" 
					className={styles.LoginInput}
				/>
				</Form.Item>

				<Form.Item >
				<Button loading={isLoadind} size="large" htmlType="submit" className={styles.SubmitBtn} >
					Login In
				</Button>
				</Form.Item>
    		</Form>
			</div>
		</div>
	);
};

export default LoginPage;

// onClick={handleSubmit}