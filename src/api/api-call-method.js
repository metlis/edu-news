import axios from 'axios';
import API_ENDPOINT from './api-endpoint';
import apiCallParams from './api-params';

export default async function fetchNews(category = '') {
  const paramsStr = apiCallParams.createParamsStr(category);
  const uri = `${API_ENDPOINT}?${paramsStr}`;
  const r = await axios.get(uri);
  return r.data;
}
