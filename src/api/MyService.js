
const KEY = "AIzaSyBUlVo1hI6x58Zp3w1uvKDag5H4HqIuINE"
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

const getHeaders = () => {
    // const token = reactLocalStorage.get("user.token", "");
    
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        
    }
}
const convertURLParameter = ( params) => {
    var url = BASE_URL ;
    if (params) {
        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        url += "?" + query;
        
    }
    return url;
}

const MyService = {
    getRequestData: async function (path, params) {
        var url = convertURLParameter(path, params);
        console.log(url)
        var result = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
            params: params
        })
            .then(response => response.json())
            .then(json => {
                return json;
            })
            .catch(e => {
                return { code: "error", message: e }
            });
        return result;
    }
    ,
    postRequestData: async function (url,  data, token) {
        var result = await fetch(BASE_URL + url, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            return { code: "error", message: e }
        });
        return result;
    },
    // putRequestData: async (url, data, token) => {
    //     var result = await axios.put(BASE_URL + url, data, {
    //         headers: getHeaders(token)
    //     })
    //         .then(response => {
    //             return response.data;
    //         })
    //         .catch(
    //             error => console.log(error)
    //         )
    //     return result;
    // },
    // deleteRequestData: async (url, token) => {
    //     var result = await axios.delete(BASE_URL + url, {
    //         headers: getHeaders(token)
    //     })
    //         .then(response => {
    //             return response.data;
    //         })
    //         .catch(
    //             error => console.log(error)
    //         )
    //     return result;
    // },
    // postSendEmail: async function (url, params) {
    //     var result = await axios.post(url, {}, {
    //         headers: getHeaders(),
    //         params: params
    //     })
    //         .then(response => {
    //             return response.data;
    //         })
    //         .catch(
    //             error => console.log(error)
    //         )
    //     return result;
    // },
}

export default MyService;