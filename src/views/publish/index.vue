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
      <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            :extensions="extensions"
            v-model="article.content"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
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
import 'element-tiptap/lib/index.css'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList
} from 'element-tiptap'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
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
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList()
      ]
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
