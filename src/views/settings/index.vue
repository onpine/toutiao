<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form
            ref="setting-user"
            :rules="rules"
            :model="user"
            label-width="80px"
          >
            <el-form-item label="编号">{{ user.id }}</el-form-item>
            <el-form-item label="手机">{{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdateUser"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="6">
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <input
            type="file"
            id="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="perview-image-wrap">
        <img class="preview-image" ref="preview-image" :src="previewImage" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      // 预览图片
      previewImage: '',
      // 裁切器实例
      cropper: null,
      updatePhotoLoading: false,
      updateProfileLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度2 到 10 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      this.$refs['setting-user'].validate(valid => {
        if (!valid) {
          return false
        }
        this.updateProfileLoading = true
        const { name, intro, eamil } = this.user
        updateUserProfile({
          name,
          intro,
          eamil
        }).then(res => {
          this.$message({
            type: 'success',
            message: '保存信息成功'
          })
          this.updateProfileLoading = false
          // 发布通知用户信息已修改
          // 更新顶部用户信息
          globalBus.$emit('update-user', this.user)
        })
      })
    },

    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

    onFileChange () {
      // 得到要预览的图片
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },

    onDialogOpened () {
      /**
       * 图片裁切器必须基于 img 进行初始化
       * 注意：img 必须是可见状态才能正常完成初始化
       *
       * 因为我们这里要在对话框里面初始化裁切器
       * 所以务必要在对话框完全打开的状态去进行初始化
       */
      // 获取图片节点
      const image = this.$refs['preview-image']
      /**
       * 第一次初始化好了之后，如果预览裁切的图片发生了变化，裁切器默认不会不会更新
       * 如果预览图片发生变化，需要更新裁切器：
       *  方式一：裁切器.replace 方法
       *  方式二：销毁裁切器，重新初始化
       */
      // 初始化图片裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return false
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false,
        background: true
      })
    },

    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },

    onUpdatePhoto () {
      // 打开确定按钮loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 直接把裁切结果的文件对象转为blob
          this.user.photo = window.URL.createObjectURL(file)
          // 由服务端返回的图片更新视图展示
          // this.user.photo = res.data.data.photo
          // 关闭确定按钮loading
          this.updatePhotoLoading = false
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 更新顶部用户信息
          globalBus.$emit('update-user', this.user)
        })
      })
    }

  }
}
</script>

<style scoped lang='less'>
.perview-image-wrap {
  .preview-image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 200px;
  }
}
</style>
