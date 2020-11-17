<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="medium" @change="loadImages(1)">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          @click="dialogUploadVisible = true"
          size="medium"
          type="success"
          >上传素材</el-button
        >
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
          :lg="4"
          :md="6"
          :sm="6"
          :xs="12"
          v-for="(img, index) in images"
          :key="index"
          class="image-item"
        >
          <el-image style="height: 150px" :src="img.url" fit="cover"></el-image>
          <div class="image-action">
            <el-button
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              type="warning"
              size="small"
              :loading="img.loading"
              @click="onCollect(img)"
            ></el-button>
            <el-button
              circle
              type="danger"
              size="small"
              icon="el-icon-delete-solid"
              :loading="img.loading"
              @click="onDelete(img)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        @current-change="onPageChange"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出框，上传图片 -->
    <el-dialog
      title="上传素材"
      :append-to-body="true"
      :visible.sync="dialogUploadVisible"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  getImages,
  collectImage,
  deleteImage
} from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      pageSize: 12,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    loadImages (page) {
      // 重置高亮页码
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        // 加入loading属性为false
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(1)
    },

    onPageChange (page) {
      this.loadImages(page)
    },

    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
    },

    onDelete (img) {
      // 展示loading
      img.loading = true
      deleteImage(img.id).then(res => {
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}
</script>

<style scoped lang='less'>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;
}
.image-action {
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  // color: #fff;
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
</style>
