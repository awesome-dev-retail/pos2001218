export default class CacheStorage {

    static setItem = (k, v) => {
        localStorage.setItem(k, encodeURIComponent(JSON.stringify(v)));
    }

    static getItem = (k) => {
        try{
            return JSON.parse(decodeURIComponent(localStorage.getItem(k)));
        }
        catch (e) {}
    }

    static removeItem = (k) => {
        localStorage.removeItem(k);
    }

    // static setItem = (k, v) => {
    //     sessionStorage.setItem(k, encodeURIComponent(JSON.stringify(v)));
    // }
    //
    // static getItem = (k) => {
    //     try{
    //         return JSON.parse(decodeURIComponent(sessionStorage.getItem(k)));
    //     }
    //     catch (e) {}
    // }
    //
    // static removeItem = (k) => {
    //     sessionStorage.removeItem(k);
    // }
}
