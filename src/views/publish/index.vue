<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            this.$route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :rules="formRules"
        ref="publish-form"
        :model="article"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 12 }"
            v-model="article.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updataArticle } from '@/api/article'
export default {
  name: 'PublishIndex',
  components: {
  },
  props: {},
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          // 封面类型 -1:自动，0:无图，1:1张，3:3张
          type: 0,
          // 图片的地址
          images: []

        },
        channel_id: null
      },
      channels: [],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        channel_id: [
          { required: true, message: '请输入文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 由于我们让发布和修改放到同一个组件
    // 所以我这里要判断
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    onPublish (draft = false) {
      // 数据验证
      this.$refs['publish-form'].validate(valid => {
        // 验证失败，停止表单验证
        if (!valid) {
          return false
        }
        const articleId = this.$route.query.id
        if (articleId) {
        // 执行修改操作
          updataArticle(articleId, this.article, draft).then(res => {
          // console.log(res)
            this.$message({
              type: 'success',
              message: `${draft ? '存入草稿' : '发布'}成功`
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
          // console.log(res)
            this.$message({
              type: 'success',
              message: `${draft ? '存入草稿' : '发布'}成功`
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
      })
    },

    loadChannels () {
      getArticleChannels().then(({ data }) => {
        this.channels = data.data.channels
      })
    },
    // 修改文章，加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
