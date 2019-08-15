import request from '@/utils/request';
import { stringify } from 'qs';
import ServiceBase from './ServiceBase';

class NewsService extends ServiceBase {
  constructor(...props) {
    super(...props);
  }

  getPreviewDetail = async (params) => {
    return request(`${this.urlBase}/preview/${params._id}`);
  }
}

class NewsCategoryService extends ServiceBase {
  constructor(...props) {
    super(...props);
  }

  getLevelOne = async (params) => {
    return request(`${this.urlBase}/level/one?${stringify(params)}`);
  }
}

const newsService = new NewsService('news');
const newsCategoryService = new NewsCategoryService('news-categories');

export { newsService, newsCategoryService };