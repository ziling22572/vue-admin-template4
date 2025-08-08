import request from '@/utils/request'

export default {

  getRoleList(searchModel) {
    return request({
      url: '/role/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        name: searchModel.name
      }
    });
  },

  submit(role) {
    return request({
      url: '/role/submit',
      method: 'post',
      data: role
    });
  },

  getRoleById(id) {
    return request({
      url: `/userRole/${id}`,
      method: 'get'
    });
  },

  deleteRole(id) {
    return request({
      url: `/role/removeById?id=${id}`,  // 使用查询参数传递 ID
      method: 'delete'                   // 使用 DELETE 方法
    });
  },
  getAllRole() {
    return request({
      url: '/role/all',
      method: 'get'
    });
  },
}
