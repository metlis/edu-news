import API_KEY from './api-key';
import domains from './api-source-domains';
import keywords from './api-keywords';

const apiCallParams = {
  domains,
  keywords,
  language: 'ru',
  sortBy: 'publishedAt',
  pageSize: 100,
  apiKey: API_KEY,
  createParamsStr(category = '') {
    const keywordsStr = this.keywords.getCategoryKeysStr(category);

    return `q=${keywordsStr}&domains=${this.domains}&language=${this.language}&sortBy=${this.sortBy}&pageSize=${this.pageSize}&apiKey=${this.apiKey}`;
  },
};

export default apiCallParams;
