import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const intialDB = ()=>{
    let request = indexedDB.open("bizex_catering_pos_fe");
    request.onerror = function(e){
        console.log("Failsed to open indexedDB");
    };
    request.onsuccess = function(e){
        let db = e.target.result;
        console.log("Success to open indexedDB");
    };
    request.onupgradeneeded = function(e){
        let db = e.target.result;
        console.log("upgrade indexedDB success");
        if(!db.objectStoreNames.contains("logs")){
            var objectStore = db.createObjectStore("logs", {autoIncrement: true});
            objectStore.createIndex("id", "id", {unique: false});
            objectStore.createIndex("uid", "uid", {unique: false});
            objectStore.createIndex("ip", "ip", {unique: false});
            objectStore.createIndex("level", "level", {unique: false});
            objectStore.createIndex("action", "action", {unique: false});
            objectStore.createIndex("content", "content", {unique: false});
            objectStore.createIndex("ctime", "ctime", {unique: false});
        }
    };
    return request;
};

const initialState = {
    db: intialDB(),
};

const appSlice = createSlice({
    name: "db",
    initialState,
    reducers: {},
    extraReducers: {}
});

export default appSlice.reducer;