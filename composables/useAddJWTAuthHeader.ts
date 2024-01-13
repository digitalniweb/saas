type JWTAuthHeader = { authorization?: string };
export default function () {
	let header = {} as JWTAuthHeader;
	if (localStorage.access_token)
		header.authorization = `Bearer ${localStorage.access_token}`;
	return header;
}
