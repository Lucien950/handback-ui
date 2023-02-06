const COOKIENAME = "Authorization"
const generateCookie = (authorization: string, ubcNum: number)=>{
	return `${COOKIENAME}=${authorization}/${ubcNum}; Path=/`
}
const deleteAuthCookie = ()=>{
	document.cookie = `${COOKIENAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export { deleteAuthCookie, generateCookie }