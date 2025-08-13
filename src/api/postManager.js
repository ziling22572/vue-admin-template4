import request from '@/utils/request'

export default {

  getDeptTree() {
    return request({
      url: '/dept/tree',
      method: 'get'
    });
  },



}
