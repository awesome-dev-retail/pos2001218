import { message } from "antd";
import axios from "axios";
import config from "../configs/index";
import { logoutLocally } from "../slices/authSlice";
const baseUrl = config.BASE_URL;

class HttpRequest {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
    this.queue = {};
    this.errorCount = 0;
  }

  setStore(store) {
    this.store = store;
  }

  getInsideConfig() {
    //let token = this.store.AuthStore.getToken ? this.store.AuthStore.getToken : '';
    const state = this.store.getState();
    const { Auth } = state;
    const { token } = Auth;

    return {
      baseURL: this.baseUrl,
      headers: {
        Authorization: token || "", //token
      },
      withCredentials: true,
      timeout: config.API_REQUEST_TIME_OUT_LIMIT,
      nocache: false,
    };
    // return config
  }

  resetBaseUrl(url) {
    this.baseUrl = url;
  }

  getCurrentBaseUrl() {
    return this.baseUrl;
  }

  destroy(url) {
    delete this.queue[url];
    // if (!Object.keys(this.queue).length) {
    // do something
    // }
  }

  interceptors(instance, url) {
    instance.interceptors.request.use(
      (config) => {
        // if (!Object.keys(this.queue).length) {
        // do something
        // }
        config.metadata = { startTime: new Date() };
        this.queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (res) => {
        // Set up timer for auto log out
        // const {user, saveLogsToDb} = this.store.AuthStore;
        // if (config.CURRENT_ENV === config.env.test) {
        //     dd('Data receive from API: ', res.status, res.headers, res.data)
        // }
        this.destroy(url);
        const { data, status, headers } = res;
        res.config.metadata.endTime = new Date();
        res.duration = (res.config.metadata.endTime - res.config.metadata.startTime) / 1000;

        // if ( res.duration > config.api_responsive_speed_alarm ) {
        //     // Check if not are log itself
        //     let url = res.config.url;
        //     if ( url.indexOf('FeLogs') === -1 ){
        //         if (config.CURRENT_ENV !== config.env.test) {
        //             (async() => {
        //                 // Send log
        //                 // await writeLogToServer({
        //                 //         duration: res.duration,
        //                 //         url,
        //                 //         config: res.config
        //                 //     },
        //                 //     config.log_action_slow_response_time, {
        //                 //         level: 3    // For speed test
        //                 //     });
        //                 // saveLogsToDb(
        //                 //     {duration: res.duration, url},
        //                 //     config.log_action_slow_response_time
        //                 // )
        //             })();
        //         }
        //     }
        // }

        // console.log("duration", res.duration, res);
        // interceptors action
        // if (typeof data === 'string') return data;
        if (status !== 200) {
          this.errorCount++;
          throw new Error("Access API failure, Status Code :" + status);
        }

        // if (headers && headers.businessserver) {
        //     const newBaseUrl = `https://${headers.businessserver}/`;
        //     this.resetBaseUrl(newBaseUrl);
        //     console.log(headers.businessserver)
        // }

        // Access token
        if (headers && headers.authorization && typeof data === "object") {
          data.token = headers.authorization;
        }

        //Refresh check token time every time receive API response except 401 which is require to login
        // let autoLogoutCheckTime = user ? user.getCompanyConfig({type: config.AUTO_LOGOUT}) : null;
        // if (autoLogoutCheckTime && data.code && data.code !== 401) {
        //     clearTimeout(this.timeOut);
        //     this.timeOut = setTimeout(() => {
        //         console.log('Checking login status...')
        //         checkToken();
        //     }, autoLogoutCheckTime);
        // }

        if (data.code) {
          if (data.code === 200) {
            this.errorCount = 0;
            data.error = null;
          } else if (data.code === 401) {
            // Authentication failed
            this.errorCount++;
            data.error = new Error(data.msg);
            data.error.code = data.code;
            // message.error(data.msg);

            this.store.dispatch(logoutLocally());

            // this.store.AuthStore.logoutWithOutNotice();
          } else {
            this.errorCount++;
            data.error = new Error(data.msg);
            data.error.code = data.code;
            message.error(data.msg);
          }
          return data;
        } else {
          return data;
        }
      },
      (error) => {
        this.errorCount++;
        this.destroy(url);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    // if (config.CURRENT_ENV === config.env.development) {
    //     //dd('API request sending to ', options.url);
    // }
    const insideConfig = this.getInsideConfig();
    const nocache = options.nocache ? options.nocache : insideConfig.nocache;
    if (nocache) {
      options.url = options.url + "?nocache=" + new Date().getTime();
    }
    delete options.nocache;
    delete insideConfig.nocache;
    const requestHeaders = Object.assign({}, insideConfig.headers ? insideConfig.headers : {}, options.headers ? options.headers : {});
    const instance = axios.create();
    options = Object.assign({}, this.getInsideConfig(), options, { headers: requestHeaders });
    // if (config.CURRENT_ENV === config.env.test) {
    //     // console.log('API request sending to: ' + options.baseURL + '/' + options.url);
    //     //dd('API request sending to: ', options);
    // }
    console.log(options);

    this.interceptors(instance, options.url);
    return instance(options);
  }
}

const api = new HttpRequest(baseUrl);

export default api;
