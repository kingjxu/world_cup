<template>
  <div class="page_bg">
    <dl class="report_intro">
      <template v-for="(item, index) in getReportData.report_intro">
        <dt v-if="item.value_type === 'title'" :key="index">
          <p>{{ item.label }}</p><p>{{ item.value }}</p>
        </dt>
        <dd v-if="item.value_type === 'content'" :key="index">
          <p>{{ item.label }}</p><p>{{ item.value }}</p>
        </dd>
      </template>
    </dl>
    <div class="pay_tips">
      <div v-html="getReportData.report_tip"></div>
    </div>
    <van-button block size="large" color="#3BC357" icon="wechat-pay" @click="createOrder">微信支付</van-button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia';
import { showToast, showLoadingToast } from 'vant';
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState(useUserStore, ['getRouteQuery', 'getAnswerData', 'getReportData', 'question_data']),
  },
  methods: {
    async createOrder() {
      const userStore = useUserStore();
      const ddbaby_token = await userStore.userLogin();
      const loading = showLoadingToast({ message: '加载中...', forbidClick: true });
      const params = Object.assign({
        user_id: ddbaby_token,
        qa_items: this.getAnswerData,
        seq: 1,
      }, this.getRouteQuery);
      this.$axios.post('/create_order', params).then((res) => {
        loading.close();
        window.location.href = res.pay_url;
      }).catch((err) => {
        loading.close();
        showToast(err.message || err);
      });
    },
  },
  mounted() {
    if (!Object.keys(this.question_data).length || !this.getAnswerData.length) {
      if (Object.keys(this.getReportData).length) return;
      this.$router.replace({ path: '/test', query: this.getRouteQuery });
      return;
    }
    const userStore = useUserStore();
    userStore.setReportData(this.question_data, this.getAnswerData);
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
  border-bottom: 1px dashed #eee;
  box-sizing: border-box;
}
.report_intro dd:last-child{
  border: 0;
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
</style>
