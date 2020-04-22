import API_ENDPOINT from './api-endpoint';
import apiCallParams from './api-params';

export default function fetchNews(category = '') {
  const paramsStr = apiCallParams.createParamsStr(category);
  const uri = `${API_ENDPOINT}?${paramsStr}`;
  return fetch(uri).then((response) => response.json());
}
