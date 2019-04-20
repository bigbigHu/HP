import query from '@/common/utils/query';
import Api from '@/config/api';
import axios from 'axios';

export default {
   orderAdd (data) {
      console.log(data);
      return axios.post(Api.orderlistAdd, data);
   }
}

// export function getlistAll (data) {
//     return query.all([])
// }