import Mock from 'mockjs';

const { list } = Mock.mock({
  'list|11-40': [{
		'id|+1': 0,
		'key|+1': 0,
		'age': /[0-9]{1,2}/,
    'address': '@county(true)',
    'city': '@name',
    'code': /[A-Za-z]{2}\d{2,6}/,
    'country': '@first',
    'countryCode': /[A-Z]{2}/,
    'created': '@now',
    'createdby': '@name @first',
    'defaultZipcode': '@zip',
    'eeCountry': '@name',
    'egdCutTime': '@time',
    'isActive|1': ['Y', 'N'],
    'name': '@name',
    'state': '@first',
    'updated': '@datetime',
    'updatedby': '@name @first',
    'warehouseProperty': '',
  }],
});


export default {
  queryList: (config) => {
    const data = JSON.parse(config.body);
    const { params: { ...res } } = data;
    let result = list.filter((item) => {
      if (res.age1 && (res.age1 !== item.age)) {
        return false;
      }
      if (res.name1 && (res.name1 !== item.name)) {
        return false;
      }
      if (res.address1 && !~item.address.indexOf(res.address1)) {
        return false;
      }
      return true;
    });
    const content = result;
    console.log(res);
    // result.slice((pageVo.pageNo - 1) * pageVo.pageSize, pageVo.pageNo * pageVo.pageSize);
    return {
      status: 1,
      info: {
        content,
        total: content.length,
      },
      url: '',
    };
  },
  add: (config) => {
    const data = JSON.parse(config.body);
    const { params: { ...res } } = data; 
    list.unshift({...res,id: list.length+1});
    const content = list;
    return {
      status: 1,
      info: {
        content,
        total: content.length,
      },
      url: ''
    }
  },
  remove: (config) => {
    const data = JSON.parse(config.body);
    const { params: { ...res } } = data;
    list.forEach( (c, i) => {
      if (c.id === res.id) {
        list.splice(i,1);
      };
    });
    const content = list;
    return {
      status: '1',
      info: {
        content: content,
        total: content.length
      },
      url: ''
    }
  },
  edit: (config) => {
    const data = JSON.parse(config.body);
    const { params: { ...res } } = data;
    list.forEach((c, i) => {
      if ( c.id === res.id ) {
        Object.assign(list[i], res)
      }
    });
    
    const content = list;
    return {
      status: '1',
      info: {
        content,
        total: content.length
      },
      url: ''
    };
  }
};
