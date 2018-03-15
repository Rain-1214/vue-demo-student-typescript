<template>
  <div id="user">
    <div class="set-padding">
      <iv-button type="default"><router-link to="/student">返回</router-link></iv-button>
    </div>
    <div class="set-padding">
      <iv-table :columns='column' :data="users"></iv-table>
    </div>
    <div class="set-padding text-right">
      <iv-page :total="userCountNum" :page-size="pageSize" @on-change="currentPageChange($event)"></iv-page>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { User } from '../../entity/User'
import store from '../../store/'
import { UserService } from '../../api/userService'
import { Message } from 'iview'

@Component({
  beforeRouteEnter (to: Route, from: Route, next: (path?: string) => void) {
    if (store.state.user.userRole !== '超级管理员') {
      next('/student')
    }
    next()
  }
})
export default class UserComponent extends Vue {
  name = 'user'

  column = [
    {
      title: '用户名',
      key: 'username'
    },
    {
      title: '状态',
      key: 'userState',
      render: (h, params) => {
        return h('div', [
          params.row.userState === 1 ? '可用' : '已封'
        ])
      }
    },
    {
      title: '邮箱',
      key: 'email'
    },
    {
      title: '操作',
      key: 'username',
      render: (h, params) => {
        return h('div', [
          h('iv-button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.activeUser(params.row.id)
              }
            }
          }, '激活'),
          ' ',
          h('iv-button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.deactiveUser(params.row.id)
              }
            }
          }, '禁封')
        ])
      }
    }
  ]

  users: User[] = []
  userCountNum: number = null
  privateCurrentPage = 1
  pageSize = 6

  get currentPage () {
    return this.privateCurrentPage
  }

  set currentPage (value: number) {
    this.privateCurrentPage = value
    this.loadUser()
  }

  async created () {
    await this.loadUser()
  }

  async loadUser () {
    const res = await UserService.getUser(this.currentPage, this.pageSize)
    if (res) {
      this.userCountNum = res.userCountNumber
      this.users = res.users
    } else {
      this.$router.push('/login')
    }
  }

  async deactiveUser (userId: number) {
    const res = await UserService.deactiveUser(userId)
    if (res) {
      Message.success({
        content: '请求成功'
      })
      this.loadUser()
    }
  }

  async activeUser (userId: number) {
    const res = await UserService.activeUser(userId)
    if (res) {
      Message.success({
        content: '请求成功'
      })
      this.loadUser()
    }
  }

  currentPageChange (page: number) {
    this.currentPage = page
  }
}
</script>
<style lang="scss" scoped>
#user{
  max-width: 800px;
}
.set-padding{
  padding: 10px;
}
</style>
