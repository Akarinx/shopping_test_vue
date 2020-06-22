<template>
    <div id="categoryList">
        <h1>产品分类页</h1>
        <van-tabs v-model="tabActive">
            <van-tab v-for="(item, index) in category" :key="index" :title='item.name'>
                <div>
                    <h4>{{item.name}} </h4>
                    <h4>{{item.front_name}} </h4>
                </div>
                <div v-if="item.plist">
                    <van-grid :border="true" :column-num="2">
                        <van-grid-item v-for="(item1, index1) in item.plist.data" :key="index1"
                            :to="'/product/'+item1.id">
                            <van-image width="100" height="100" :src="item1.list_pic_url" />
                            <h4 class="van-ellipsis">{{item1.name}}</h4>
                            <p class="price"> ￥{{item1.retail_price}}</p>
                        </van-grid-item>
                    </van-grid>
                </div>

            </van-tab>
        </van-tabs>
        <tabbtn></tabbtn>
    </div>
</template>
<script>
    import tabbtn from '@/components/tabbtn'
    import axios from 'axios';
    export default {
        components: {
            tabbtn
        },
        props: ['id'],
        data() {
            return {
                tabActive: 0,
                category: []
            }
        },
        async created() {
            let res = await axios.get(this.$root.api.GoodsCategory, {
                params: {
                    id: this.id
                }
            })
            this.category = res.data.data.brotherCategory;
            let id = this.category[0].id;
            this.category.forEach(async (item, index) => {
                item.plist = await this.getList(item.id, 1)
                this.$forceUpdate();
                // console.log(item.plist)
            });

        },
        methods: {
            async getList(cid, page, size = 20) {
                let categoryId = cid;
                let res = await axios.get(this.$root.api.GoodsList, {
                    params: {
                        categoryId,
                        page,
                        size
                    }
                })
                // console.log(res.data)
                return res.data.data;
            }
        },
    }
</script>
<style lang="less">
    #categoryList {
        .price {
            color: red;
        }

        .van-ellipsis {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
        }

        .van-grid-item {

            overflow: hidden;
            box-sizing: border-box;
        }
    }
</style>