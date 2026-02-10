<template>
  <div class="page_bg">
    <dl class="report_intro">
      <template v-for="(item, index) in getReportData.report_intro">
        <dt v-if="item.value_type === 'title'" :key="index">
          <p>{{ item.label }}</p><p>{{ item.value }}</p>
        </dt>
        <dd class="report_intro_item" v-if="item.value_type === 'content'" :key="index">
          <p>{{ item.label }}</p><p>{{ item.value }}</p>
        </dd>
      </template>
      <dd class="report_intro_risk" v-if="pay_info.risk_level">
        <p>风险</p><p>{{ pay_info.risk_level }}</p>
      </dd>
    </dl>
    <div class="pay_tips">
      <div v-html="getReportData.report_tip"></div>
    </div>
    <van-button block size="large" color="#3BC357" icon="wechat-pay" @click="createOrder">微信支付</van-button>
    <van-overlay :show="show_discount" @click="closeDiscountDialog">
      <div class="discount_dialog" @click.stop>
        <div class="main">
          <van-image class="discount_bg" block :src="img_src.discount_bg" />
          <van-image class="discount_pay" block :src="img_src.discount_pay" @click="createOrder" />
          <van-image class="discount_cancel" block :src="img_src.discount_cancel" @click="closeDiscountDialog" />
          <p>{{ pay_info.price_off ? pay_info.price_off / 100 : '' }}</p>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="show_test" @click="show_test = false;">
      <div class="test_dialog" @click.stop>
        <div class="main">
          <van-image block :src="img_src.test_img" @click="goPage" />
          <van-image block :src="img_src.wechat_img" @click="goPage" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia';
import { showToast, showLoadingToast } from 'vant';
import discountBgImg from '@/assets/images/discount_bg.png';
import discountPayImg from '@/assets/images/discount_pay.png';
import discountCancelImg from '@/assets/images/discount_cancel.png';
import testImg from '@/assets/images/test.png';
import wechatImg from '@/assets/images/wechat.png';
export default {
  data() {
    return {
      show_discount: false,
      show_test: false,
      img_src:{
        discount_bg: discountBgImg,
        discount_pay: discountPayImg,
        discount_cancel: discountCancelImg,
        test_img: testImg,
        wechat_img: wechatImg,
      },
    };
  },
  computed: {
    ...mapState(useUserStore, ['getRouteQuery', 'getAnswerData', 'getReportData', 'pay_info' ]),
  },
  methods: {
    showPayCancelDialog() {
      if (this.pay_info.seq === 1) {
        this.show_discount = true;
      } else if (this.pay_info.seq === 2) {
        this.show_test = true;
      }
    },
    closeDiscountDialog() {
      this.show_discount = false;
      this.show_test = true;
    },
    async createOrder() {
      const userStore = useUserStore();
      const ddbaby_token = await userStore.userLogin();
      const loading = showLoadingToast({ message: '加载中...', forbidClick: true });
      const params = Object.assign({
        user_id: ddbaby_token,
        qa_items: this.getAnswerData,
        seq: this.pay_info.seq >= 2 ? 2 : this.pay_info.seq + 1,
      }, this.getRouteQuery);
      this.$axios.post('/create_order', params).then((res) => {
        loading.close();
        window.location.href = res.pay_url;
      }).catch((err) => {
        loading.close();
        showToast(err.message || err);
      });
    },
    goPage() {
      window.location.href = this.pay_info.professor_url;
    },
  },
  mounted() {
    if (!Object.keys(this.pay_info).length || !Object.keys(this.getReportData).length
     || !this.getAnswerData.length) {
      this.$router.replace({ path: '/test', query: this.getRouteQuery });
      return;
    }
    this.showPayCancelDialog();
    showToast({ duration: 3000, message: '支付未成功' });
  },
}
</script>

<style scoped>
.page_bg{
  background: #FAFAFA;
  height: 100vh;
  padding: 25px 20px 20px;
  box-sizing: border-box;
}
.report_intro{
  background: #fff;
  border-radius: 8px;
  font-size: 16px;
  padding-bottom: 5px;
  overflow: hidden;
}
.report_intro dt{
  background: #DEDFFB;
  display: flex;
  flex-wrap: nowrap;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 3px;
}
.report_intro dd{
  display: flex;
  flex-wrap: nowrap;
  padding: 17px 20px;
  box-sizing: border-box;
}
.report_intro .report_intro_item{
  border-bottom: 1px dashed #eee;
}
.report_intro .report_intro_risk{
  padding: 22px 20px 20px;
  font-size: 20px;
  font-weight: bold;
}
.report_intro .report_intro_risk p:last-child{
  color: #ff4c4c;
}
.report_intro dt p:first-child, .report_intro dd p:first-child{
  width: 5em;
}
.report_intro dt p:last-child, .report_intro dd p:last-child{
  width: 90%;
  text-align: right;
}
.report_intro dt p:last-child{
  color: #7072FF;
}

.van-button{
  width: 90%;
  margin: 0 auto;
  border-radius: 8px;
  height: 58px;
  line-height: 58px;
}
.discount_dialog .main{
  position: absolute;
  top: 30%;
  left: 10%;
  width: 80%;
}
.discount_dialog .main .discount_bg{
  margin: 0 auto;
  width: 100%;
}
.discount_dialog .main .discount_pay{
  width: 43vw;
  position: absolute;
  z-index: 20;
  right: 4.5vw;
  bottom: 1vw;
}
.discount_dialog .main .discount_cancel{
  width: 69vw;
  position: absolute;
  z-index: 10;
  left: 5vw;
  bottom: 2vw;
}
.discount_dialog .main p{
  position: absolute;
  left: 54%;
  top: 53%;
  transform: translateX(-50%) translateY(-63%);
  font-size: 12vw;
  font-weight: bolder;
  background: linear-gradient(to bottom, #C11920, #7D191D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.test_dialog .main{
  position: absolute;
  top: 30%;
  left: 10%;
  width: 80%;
}
.test_dialog .main .van-image:first-child{
  margin: 0 auto;
  width: 100%;
}
.test_dialog .main .van-image:last-child{
  margin: 0 auto;
  width: 6vw;
  position: absolute;
  left: 8vw;
  bottom: 5.4vw;
}
</style>
