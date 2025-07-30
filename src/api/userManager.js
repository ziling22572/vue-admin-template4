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

  addUser(userForm) {
    return request({
      url: '/user/add',
      method: 'post',
      params: {
        username: userForm.username,
        phone: userForm.phone,
        password: userForm.password,
        email: userForm.email,
        sex:userForm.sex,
        status: userForm.status
      }
    });
  }

}
