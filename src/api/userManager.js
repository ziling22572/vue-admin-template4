import request from '@/utils/request'

export default {

  getUserList(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone,
      }
    });
  },

  addUser(user) {
    return request({
      url: '/user/submit',
      method: 'post',
      data: user
    });
  },
  getUserById(id) {
    return request({
      url: `/user/${id}`,
      method: 'get'
    });
  },

  deleteUser(id) {
    return request({
      url: `/user/removeById?id=${id}`,  // 使用查询参数传递 ID
      method: 'delete'                   // 使用 DELETE 方法
    });
  }
}
