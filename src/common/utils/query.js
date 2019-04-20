import axios from 'axios';

let requestingCount = 0;

const instance = axios.create({
	// baseURL: '',
	headers: {
			'X-Requested-With': 'XMLHttpRequest',
	},
});

instance.interceptors.request.use((request) => {
// if (requestingCount <= 0) {
//   store.dispatch({ type: '@@DVA_LOADING/SHOW' });
//   requestingCount = 0;
// }
// requestingCount += 1;
	return request;
});
instance.interceptors.response.use((response) => {
// if (requestingCount > 0) {
//   store.dispatch({ type: '@@DVA_LOADING/HIDE' });
//   requestingCount -= 1;
// }
	return response.data;
});

export default instance;