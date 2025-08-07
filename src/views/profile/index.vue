// src/views/profile/index.vue
<template>
  <div class="profile-container">
    <el-button class="back-button" @click="$router.back()">退回</el-button>

    <el-card class="box-card">
      <div class="user-header">
        <el-avatar :src="user.avatar" size="large" />
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p>电话：{{ user.phone || '未绑定' }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import userApi from '@/api/userManager'

export default {
  name: 'UserProfileView',
  data() {
    return {
      user: {
        name: '',
        phone: '',
        avatar: ''
      }
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const res = await userApi.getUserInfo();
      if (res.code === 20000) {
        this.user = res.data;
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  position: relative;
}

.user-header {
  display: flex;
  align-items: center;
}

.user-info {
  margin-left: 20px;
}

.back-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
