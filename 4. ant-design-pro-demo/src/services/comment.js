import request from '@/utils/request';
import { stringify } from 'qs';
import ServiceBase from './ServiceBase';

class CommentService extends ServiceBase {
  constructor(...props) {
    super(...props);
  }

  queryItems = async (params) => {
    return request(`${this.urlBase}/preview/query?${stringify(params)}`);
  }
}

export default new CommentService('comments');