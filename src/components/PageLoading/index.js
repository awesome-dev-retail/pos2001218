import React from "react";
import {Spin} from "antd";
import styles from "./index.module.scss";

const PageLoading = ()=>{

    return(
        <Spin
                className={styles.Spin}
                tip={"Loading"}
                spinning={this.props.spinning}
            />
        
    );
};
export default PageLoading;