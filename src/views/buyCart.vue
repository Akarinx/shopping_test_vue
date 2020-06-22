<template>
	<div id="buyCart">
		<div class="info">
			<span>30天无忧退货</span>
			<span>48小时快速退款</span>
			<span>满88元免邮费</span>
		</div>
		<div class="list">
			<div class="cartItem" v-for="(item, index) in cartList" :key="index">
				<van-checkbox @change="changeEvent($event,item)" v-model="item.checked"></van-checkbox>
				<van-image width="70" height="70" :src="item.list_pic_url" />
				<div class="proBrief">
					<div class="title">
						{{item.goods_name}}
						<span class="num">X{{item.number}}</span>
					</div>
					<p class="brief">{{item.goods_specifition_name_value}}</p>
					<p class="price">￥ {{item.retail_price}}</p>
				</div>
			</div>
		</div>
		<van-submit-bar :price="cartTotal.checkedGoodsAmount*100" button-text="提交订单" @submit="onSubmit">
			<van-checkbox v-model="checkedAll">全选</van-checkbox>
		</van-submit-bar>
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
let mapStateObj = mapState(['cartTotal', 'cartList'])
let mapActionsObj = mapActions(['AjaxCarList'])
export default {
	data() {
		return {
			checked: true
		}
	},
	computed: {
		...mapStateObj,
		checkedAll: {
			set(val) {
				console.log(val, '这啥')
			},
			get() {
				if (
					this.cartTotal.goodsCount ==
					this.cartTotal.checkedGoodsCount
				) {
					return true
				} else {
					return false
				}
			}
		}
	},
	methods: {
		...mapActionsObj,
		onSubmit: function() {},
		changeEvent: async function(event, item) {
			let res = await axios.post(this.$root.api.CartChecked, {
				isChecked: Number(event),
				productIds: item.product_id
			})
			let data = res.data.data
			console.log(data)
			this.$store.commit('setCartList', data.cartList)
			this.$store.commit('setCartTotal', data.cartTotal)
		}
	},
	created() {
		this.AjaxCarList()
	},
	mounted() {
		console.log(this.cartList)
	}
}
</script>

<style lang="less">
#buyCart {
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

	.cartItem {
		display: flex;
		align-content: center;
		padding: 10px 5px;

		.van-checkbox {
			margin: 0 5px;
		}
		.van-image {
			background-color: #efefef;
		}

		.proBrief {
			padding: 0 5p;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			height: 70px;
			padding: 0 10px;
			.title {
				font-size: 14px;
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
			.brief {
				color: #999;
				font-size: 12px;
			}
		}
	}
}
</style>