import request from '@/utils/request'

export default {

  getMenuTree() {
    return request({
      url: '/menu/tree',
      method: 'get'
    });
  },
  getMenuListTree(searchModel) {
    return request({
      url: '/menu/list',
      method: 'get',
      params: {
        name: searchModel.name,
        roleCode: searchModel.roleCode
      }
    });
  },
  getMenuById(id) {
    return request({
      url: `/menu/${id}`,
      method: 'get'
    });
  },

  submit(menu) {
    return request({
      url: '/menu/submit',
      method: 'post',
      data: menu
    });
  },
  deleteMenuById(id) {
    return request({
      url: `/menu/removeById?id=${id}`,  // 使用查询参数传递 ID
      method: 'delete'                   // 使用 DELETE 方法
    });
  },


}
