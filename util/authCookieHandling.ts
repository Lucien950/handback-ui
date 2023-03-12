import auth from "types/auth";

const COOKIENAME = "Authorization"
const generateCookie = (auth: auth)=>{
	return `${COOKIENAME}=${auth.authorization}/${auth.ubcNum}; Path=/`
}
const deleteAuthCookie = ()=>{
	document.cookie = `${COOKIENAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export { deleteAuthCookie, generateCookie, COOKIENAME }