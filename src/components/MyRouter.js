import React, { Suspense } from "react";
// import { Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import CONSTANT from "../configs/CONSTANT";
// import createBrowserHistory from "./history";

// import Header from "./Header";
import HomePage from "../pages/Home";
import OrderPage from "../pages/Order";
import PaymentPage from "../pages/Payment";
import AboutPage from "../pages/About/AboutPage";
import LoginPage from "../pages/Login/LoginPage";
import AuthCheck from "./AuthCheck/AuthCheck";
import SelectShop from "../pages/Login/SelectShop";
import PageLoading from "./PageLoading";
import MessageBox from "./MessageBox";
import ErrorBox from "./ErrorBox";

const history = createBrowserHistory();

const MyRouter = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={CONSTANT.ROUTES.LOGIN} component={LoginPage} />
        <Route path={CONSTANT.ROUTES.SELECT_SHOP} component={SelectShop} />
        <AuthCheck>
          <Suspense fallback={<PageLoading spinning={true} />}>
            <Route exact path={CONSTANT.ROUTES.HOME} component={HomePage} />
            <Route path={CONSTANT.ROUTES.TABLE} component={OrderPage} />
            <Route path={CONSTANT.ROUTES.PAYMENT} component={PaymentPage} />
            <Route path={CONSTANT.ROUTES.ABOUT} component={AboutPage} />
            <MessageBox />
            <ErrorBox />
          </Suspense>
        </AuthCheck>
      </Switch>
    </Router>
  );
};

export { history };

export default MyRouter;
