<template>
    <div id="product">
        <van-nav-bar title="商品" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img class="swipeImg" v-lazy="image.img_url" />
            </van-swipe-item>
        </van-swipe>
        <div class="info">
            <span>30天无忧退货</span>
            <span>48小时快速退款</span>
            <span>满88元免邮费</span>
        </div>
        <div class="pro_info">
            <h3 class="title">{{info.name}}</h3>
            <p class="brief">{{info.goods_brief}}</p>
            <p class="price">￥{{info.retail_price}}</p>
        </div>
        <van-cell title="请选择规格数量" is-link />
        <!-- 商品参数 -->
        <div class="proParams">
            <h3>商品参数</h3>
            <div class="proItem" v-for="(item1, index1) in attribute" :key="index1">
                <span class="title">{{item1.name}}</span>
                <span class="value">{{item1.value}}</span>
            </div>
        </div>
        <!-- 商品详情 -->
        <div class="prodetail" v-html="info.goods_desc"></div>
        <!-- 加入购物车 -->
        <van-goods-action>
            <van-goods-action-icon to="/buyCart" :info="infonum" icon="cart-o" text="购物车" />
            <van-goods-action-icon icon="star-o" text="已收藏" />
            <van-goods-action-button type="warning" @click="showSku=true" text="加入购物车" />
            <van-goods-action-button type="danger" @click="showSku=true" text="立即购买" />
        </van-goods-action>
        <!-- 商品规格 -->
        <van-sku v-model="showSku" :sku="sku" :goods="goods" @buy-clicked="onBuyClicked" @add-cart="onAddCartClicked" />
    </div>
</template>
<script>
    let sku = {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [{
                id: 2259, // skuId，下单时后端需要
                price: 100, // 价格（单位分）
                's-1': '2', // 规格类目 k_s 为 s1 的对应规格值 id
                's-2': '3', // 规格类目 k_s 为 s2 的对应规格值 id
                stock_num: 110 // 当前 sku 组合对应的库存
            },
            {
                id: 2259, // skuId，下单时后端需要
                price: 100, // 价格（单位分）
                's-1': '1', // 规格类目 k_s 为 s1 的对应规格值 id
                's-2': '4', // 规格类目 k_s 为 s2 的对应规格值 id
                stock_num: 130 // 当前 sku 组合对应的库存
            }
        ],
        price: '1.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        hide_stock: false // 是否隐藏剩余库存
    }
    import axios from 'axios'
    import Vue from 'vue';
    import {
        Lazyload
    } from 'vant';
    Vue.use(Lazyload);
    export default {
        props: ['id'],
        data() {
            return {
                data: {},
                info: {},
                attribute: {},
                showSku: false,
                sku: sku,
                goods: {
                    // 默认商品 sku 缩略图
                    picture: 'https://img.yzcdn.cn/1.jpg',
                    title: ''
                }
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            onBuyClicked() {
                // 跳转至订单页
                console.log('ok')
            },
            async onAddCartClicked(skuData) {
                //加入购物车
                this.showSku = false;
                let chooseContent = skuData.selectedSkuComb['s-1'] + '_' + skuData.selectedSkuComb['s-2']
                let resultPro = this.data.productList.filter((item, index) => {
                    if (item.goods_specification_ids == chooseContent) {
                        return true
                    } else {
                        return false
                    }
                })
                // console.log(resultPro)
                let cartRes = await axios.post(this.$root.api.CartAdd, {

                    goodsId: resultPro[0].goods_id,
                    number: skuData.selectedNum,
                    productId: resultPro[0].id
                })
                let data = cartRes.data.data;
                this.$store.commit('setCartList', data.cartList)
                this.$store.commit('setCartTotal', data.cartTotal)
            }
        },
        computed: {
            images() {
                if (this.data.gallery) {
                    return this.data.gallery
                } else {
                    return []
                }
            },
            infonum: function () {
                return this.$store.state.cartTotal.goodsCount == 0 ? '' : this.$store.state.cartTotal.goodsCount
            }
        },
        async created() {
            this.$store.dispatch('AjaxCarList')
            let tree = [];
            let res = await axios.get(this.$root.api.GoodsDetail, {
                params: {
                    id: this.id
                }
            })
            this.data = res.data.data
            this.info = this.data.info
            this.attribute = this.data.attribute
            this.goods.picture = this.info.primary_pic_url
            this.goods.title = this.info.name;
            this.sku.price = this.info.retail_price;
            this.sku.stock_num = this.info.goods_number;
            this.data.specificationList.forEach((item, index) => {
                let arr = []
                item.valueList.forEach((product, i) => {
                    arr.push({
                        id: product.id, // skuValueId：规格值 id
                        name: product.value, // skuValueName：规格值名称
                    })
                })
                tree.push({
                    k: item.name, // skuKeyName：规格类目名称
                    v: arr,
                    k_s: 's-' + item
                        .specification_id //sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                })
            });
            this.sku.tree = tree;
        },

    }
</script>
<style lang="less">
    #product {
        .swipeImg {
            width: 100%;
        }

        .info {
            display: flex;
            justify-content: space-around;
            font-size: 12px;
            color: #999;
            height: 24px;
            line-height: 24px;
            background-color: #efefef;
        }

        .info span {
            position: relative;
        }

        .info span::before {
            content: '';
            display: block;
            position: absolute;
            left: -10px;
            top: 8px;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            border: 1px solid red;
        }

        .pro_info {
            .title {
                font-weight: 500;
            }

            .brief {
                font-size: 12px;
                color: #999;
            }

            .price {
                font-size: 16px;
                color: red;
                padding: 5px;
            }
        }

        .van-cell__title {
            text-align: left;
        }

        .proParams h3 {
            padding: 10px 0;
        }

        .proParams {
            padding-bottom: 20px;
        }

        .proParams .proItem {
            width: 90%;
            height: 24px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            color: #999;
            font-size: 12px;
            background: #efefef;
            line-height: 24px;
        }

        .proParams .proItem .title {
            width: 45px;
            text-align: center;
            padding: 0 10px;
            border-right: 1px solid #ccc;
        }

        .proParams .proItem .value {
            width: 260px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
        }

        .prodetail {
            width: 100%;

            img {
                width: 100%;
                vertical-align: middle;
            }

        }
    }
</style>