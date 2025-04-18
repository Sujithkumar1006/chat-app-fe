import Cookies from "js-cookie";

export const fetchWrapper = (url: string, method = 'GET', bodyParams?: any) => {
    return fetch(url, { method, body: JSON.stringify(bodyParams), headers: { authorization: `Bearer ${Cookies.get("access_token")}`, "Content-Type": "application/json" } })
}

