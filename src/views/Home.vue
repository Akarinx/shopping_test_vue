<template>
  <div id="home" class="home">
    <van-search v-model="seachData" input-align='center' placeholder="请输入搜索关键词" />
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" width='375' height='200'>
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class='swiperimg' v-lazy="image.image_url" />
      </van-swipe-item>
    </van-swipe>
    <!-- 5图标 -->
    <van-grid column-num=5>
      <van-grid-item v-for="(item, index) in channel" :key="index" icon="star-o" :text="item.name" />
    </van-grid>
    <!-- 品牌商 -->
    <div class='pinpai'>
      <van-panel title="品牌制造商直供">
        <van-grid gutter=0 :column-num="2">
          <van-grid-item v-for="(item1, index1) in brandList" :key="index1">
            <van-image lazy-load :src="item1.new_pic_url" />
            <h4 class="name">{{item1.name}}</h4>
            <p class="price">{{item1.floor_price}}元起</p>
          </van-grid-item>
        </van-grid>
      </van-panel>
    </div>
    <!-- 新品 -->
    <div class='xp'>
      <van-panel title='每日新品'>
        <van-grid :column-num="2">
          <van-grid-item v-for="(item2, index2) in newGoodsList" :key="index2">
            <van-image lazy-load :src="item2.list_pic_url" />
            <h4 style="margin: 5px; width: 90%;" class="van-ellipsis">{{item2.name}}</h4>
            <p class="van-ellipsis">{{item2.retail_price}}元起</p>
          </van-grid-item>
        </van-grid>
      </van-panel>
    </div>
    <!-- 气人面板 -->
    <div class='hotlist'>
      <van-panel title='人气商品'>
        <van-card v-for="(item3, index3) in hotGoodsList" :key="index3" :price="item3.retail_price"
          :desc="item3.goods_brief" :title="item3.name" :thumb="item3.list_pic_url" />
      </van-panel>
    </div>
    <div style="height: 50px;"></div>
    <!-- 标签栏 -->
    <tabbtn></tabbtn>
  </div>
</template>

<script>
  // @ is an alias to /src
  import axios from 'axios'
  import api from '@/assets/config/api'
  import Vue from 'vue';
  import tabbtn from '@/components/tabbtn'
  import {
    Lazyload
  } from 'vant';

  Vue.use(Lazyload);

  export default {
    name: 'Home',
    components: {
      tabbtn
    },
    data() {
      return {
        seachData: '',
        data: {},
        tabactive: 0
      }
    },
    computed: {
      images() {
        if (this.data.banner) {
          return this.data.banner
        } else {
          return []
        }
      },
      channel() {
        if (this.data.channel) {
          return this.data.channel
        } else {
          return []
        }
      },
      brandList() {
        if (this.data.brandList) {
          return this.data.brandList
        } else {
          return []
        }
      },
      newGoodsList() {
        if (this.data.newGoodsList) {
          return this.data.newGoodsList
        } else {
          return []
        }
      },
      hotGoodsList() {
        if (this.data.hotGoodsList) {
          return this.data.hotGoodsList
        } else {
          return []
        }
      }
    },
    async mounted() {
      let res = await axios.get(api.IndexUrl)
      this.data = res.data.data;
    },
  }
</script>
<style lang="less">
  #home {
    .swiperimg {
      width: 375px;
      height: 200px;
    }

    .pinpai .van-grid-item__content {
      padding: 0;
    }

    .name {
      position: absolute;
      top: 0;
      left: 0;
    }

    .van-image {
      border: 1px solid white;
    }

    .price {
      position: absolute;
      top: 27px;
      left: 0;
    }
  }

  .hotlist {

    .van-card__content {
      text-align: left;
      justify-content: center;
    }

    .van-card__price {
      color: red;
    }

    .van-card__title {
      font-size: 14px;
      font-weight: 500;
    }
  }


  .van-grid-item {
    overflow: hidden;
  }
</style>