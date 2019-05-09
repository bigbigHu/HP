// import query from '@/common/utils/query';
import Api from '@/config/api';
import fetch from '@/common/utils/query';
import Mock from '@/mock/index';


function factory ( serviceName, methodName, version) {
  return function (payload) {
    let url = `${serviceName}/${methodName}`;
    if (process.env.REACT_APP_MOCK) {
      url = `/api?${url}`;
    }
    const params = {
      ...payload,
    };
    return fetch.post(url, params);
  };
}
export default function serviceFactory ( serviceName, methods = [], version = '' ) {
  const method = {};
  methods.forEach( methodName => {
    method[methodName] = factory(serviceName, methodName, version);
  } );
  return method;
}