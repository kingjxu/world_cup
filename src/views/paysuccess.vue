<template>
  <div class="page_bg">
    <div class="top">
      <van-icon name="checked" color="#8A6CF6" size="52" />
      <p>支付成功，点击下方按钮查看结果</p>
      <van-button color="#8A6CF6" block @click="goPage">点击查看结果</van-button>
      <van-image block :src="img_src.head_img" @click="goPage" />
    </div>
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
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia';
import headImg from '@/assets/images/head.png';
export default {
  data() {
    return {
      img_src: {
        head_img: headImg,
      },
    };
  },
  computed: {
    ...mapState(useUserStore, ['getRouteQuery', 'getReportData', 'pay_info']),
  },
  methods: {
    goPage() {
      window.location.href = this.pay_info.professor_url;
    },
  },
  mounted() {
    if (!Object.keys(this.pay_info).length || !Object.keys(this.getReportData).length) {
      this.$router.replace({ path: '/test', query: this.getRouteQuery });
      return;
    }
  },
}
</script>

<style scoped>
.page_bg{
  background: #FAFAFA;
  height: 100vh;
  padding: 15px;
  box-sizing: border-box;
}
.top{
  text-align: center;
  position: relative;
}
.top .van-icon{
  display: block;
  padding: 60px 0 20px;
}
.top .van-button{
  width: 90%;
  margin: 40px auto 70px;
  border-radius: 8px;
  font-size: 20px;
  height: 56px;
  line-height: 56px;
}
.top .van-image{
  width: 71px;
  position: absolute;
  right: 3.5%;
  bottom: -34px;
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
</style>
