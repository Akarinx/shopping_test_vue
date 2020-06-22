<template>
    <div id="category">
        <van-search v-model="seachData" input-align='center' placeholder="请输入搜索关键词" />
        <van-tree-select :items="items" :main-active-index.sync="activeIndex" height='calc(100vh - 104px)'
            @click-nav='changeRight'>
            <template #content>
                <div>
                    <img width="100%" :src="banner_img" alt="">
                </div>

                <van-grid :column-num="3">
                    <van-grid-item v-for="(item, index) in subCategoryList" :key="index" :icon="item.wap_banner_url"
                        :text="item.name" :to="'/categoryList/'+item.id" />

                </van-grid>
            </template>
        </van-tree-select>
        <tabbtn></tabbtn>
    </div>
</template>
<script>
    import axios from 'axios'
    import tabbtn from '@/components/tabbtn'
    import api from '@/assets/config/api'
    export default {
        components: {
            tabbtn
        },
        data() {
            return {
                seachData: '',
                activeIndex: 0,
                data: {},
                subCategoryList: [],
                banner_img: ''
            }

        },
        computed: {
            items: function () {
                // items: [{text: '分组 1'}, {text: '分组 2'}]
                if (this.data.categoryList) {
                    let arr = []
                    this.data.categoryList.forEach((item, index) => {
                        item.text = item.name
                        arr.push(item)
                    });
                    return arr;
                } else {
                    return []
                }
            },
        },
        watch: {
            activeIndex: async function () {
                if (this.items.length != 0) {
                    let id = this.items[this.activeIndex].id
                    let res = await axios.get(api.CatalogCurrent, {
                        params: {
                            id
                        }
                    })
                    this.subCategoryList = res.data.data.currentCategory.subCategoryList
                    this.banner_img = this.items[this.activeIndex].img_url
                } else {
                    this.subCategoryList = []
                }
            },
        },
        methods: {
            changeRight(index) {
                this.activeIndex = index
            }
        },
        async created() {
            let res = await axios.get(api.CatalogList)
            this.data = res.data.data;
            this.subCategoryList = this.data.currentCategory.subCategoryList;
            this.banner_img = this.data.currentCategory.img_url;
        },
    }
</script>