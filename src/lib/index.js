import {message as msg} from "antd";
import CONSTANT from "../configs/CONSTANT";
import moment from "moment";
import CacheStorage from "./cache-storage";
import {FELogsListRequest, FELogRequest} from "../services/logs";

export const db = {
    store: null,
    setStore: function(store){
        this.store = store;
    },

    addLogToDB: function(data){
        const {App} = this.store.getState();
        const {db} = App;
        let transaction = db.result.transaction(["logs"], "readwrite");
        let objectStore = transaction.objectStore("logs");
        let request = objectStore.add({
            uid: data.uid,
            ip: data.ip,
            level: data.level,
            action: data.action,
            content: data.content,
            ctime: data.ctime
        });
        request.onsuccess = function(e){
            console.log("Logs has been added successfully " + request.result);
        };
    },

    sendLogsToServer: function(){
        const {App} = this.store.getState();
        const {db} = App;
        let transaction = db.result.transaction(["logs"], "readwrite");
        let objectStore = transaction.objectStore("logs");
        let request = objectStore.getAll();
        request.onerror = () =>{
            console.log(request.error.message);
        };
        request.onsuccess =()=>{
            let logs = request.result;
            (async () => {
                try{
                    console.log(logs);
                    const res = await FELogsListRequest(logs);
                    if (res.error) throw res.error;
                    console.log(res);
                    this.clearLogs();
                }
                catch (e) {
                    e.message.error;
                }
            })();
        };
    },

    clearLogs: function() {
        const {App} = this.store.getState();
        const {db} = App;
        let transaction = db.result.transaction(["logs"], "readwrite");
        let objectStore = transaction.objectStore("logs");
        let request = objectStore.clear();
        request.onsuccess = () => {
            console.log("Logs cleared");

        };
        request.onerror = () => {
            console.log("Clear data failed: ${request.error.message}");
        };
    },

    sendErrorToSever: function(...ps){
        const { Auth } = this.store.getState();
        const {user} = Auth;
        // const len = ps.length;
        // const arr = ps.map(i => ({"error"}))
        let errorInfo = {
            uid: user.id || null,
            ip: window.location.href,
            level: 4, 
            action: "message error", 
            content: {
                ...ps
            },
            ctime: moment().format(),
        };
        return errorInfo;
    }

};

let dd_i = 0;
export const dd = (...ps) => {
    if (!CONSTANT.debug) return;
    dd_i++;
    ps.unshift("Debug " + dd_i + "[" + new Date() + "]");
    let debug = console.log.bind(window.console);
    debug(...ps);
};

export const message = {
    globalError: function (...ps) {
        msg.error(...ps);
        dd("Message.error", ...ps);

        // Write back to server
        (async () => {
            try{
                // await writeLogToServer(ps, 'message.error');
                window.location.href = "/";
            }
            catch (e) {}

        })();
    },
    error: function (...ps) {
        msg.error(...ps);
        dd("Message.error", ...ps);

        let errorInfo = db.sendErrorToSever(...ps);

        (async () => {
            try{
                const res = await FELogRequest(errorInfo);
                if (res.error) throw res.error;
                console.log(res);

            }
            catch (e) {
                console.log("failed to server");
            }
        
        })();
    },
    warning: function (...ps) {
        msg.warning(...ps);
        dd("Message.warning", ...ps);
    },
    info: function (...ps) {
        msg.info(...ps);
        dd("Message.info", ...ps);
    },
    success: function (...ps) {
        msg.success(...ps);
        dd("Message.success", ...ps);

        // Write back to server
        // (async () => {
        //     try{
        //         await writeLogToServer(ps, 'message.success');
        //     }
        //     catch (e) {}
        //
        // })();
    },
};