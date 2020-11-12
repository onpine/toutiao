<template>
  <div class="login-container">
    <div class="login-header"></div>
    <!--
      配置Form表单验证
      1、必须给el-form组件绑定model为表单数据对象
      2、给需要验证的表单项 el-form-item 绑定 prop 属性
        注意：prop属性需要指定表单对象中的数据名称
      3、给el-form组件的rules属性配置验证规则

      手动触发表单验证
      1、给el-form设置ref 起个名字（随便起名，不要重复即可）
      2、通过ref或去el-form组件，调用组件的validate进行验证
     -->
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
    >
      <el-form-item prop="mobile">
        <el-input placeholder="请输入手机号" v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input placeholder="请输入验证码" v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">同意我们的隐私协议</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loginLoading"
          class="login-btn"
          type="primary"
          @click="onLogin"
          >登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      // checked: false,
      // 登陆的loading状态
      loginLoading: false,
      // 表单验证规则
      formRules: {
        // 要验证的数据名称，规则列表[]
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式 ', trigger: 'change' }

        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user
      // 表单验证
      // validate方法是异步的
      this.$refs['login-form'].validate((valid, err) => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return false
        } else {
          // 验证通过，提交登录
          this.login()
        }
      })
    },
    login () {
      // 开启登录中loading
      this.loginLoading = true
      /**
       * 对于代码中的请求操作
       * 1、接口请求可能需要重用
       * 2、实际工作中，接口非常容易变动，改起来非常麻烦
       * 建议把所有的请求都封装成函数然后统一的组织到模块中管理
       * 管理维护方便，也好重用
       */
      login(this.user).then(res => {
        // console.log(res)
        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭loading
        this.loginLoading = false

        // 将接口返回的用户相关数据放到本地存储，方便那应用
        // 本地存储只能存储字符串，对象、数组类型的数据，则把他们转为JSON格式的字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/login')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        // 登录失败
        this.$message({
          message: '登录失败，手机号或验证码错误',
          type: 'error'
        })

        // 关闭loading
        this.loginLoading = false
      })
      // 处理后端响应结果
      // 成功
      // 失败
    }
  }
}
</script>

<style scoped lang='less'>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-header {
    height: 57px;
    width: 300px;
    background: url("./logo_index.png") no-repeat;
    margin-bottom: 30px;
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
