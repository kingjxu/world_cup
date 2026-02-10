<template>
  <div v-if="pic">
    <img class="bg" :src="pic" />
    <div class="bottom">
      <p class="tip">你需要回答{{qo_cnt}}道题，预计用时{{expect_complete_time}}分钟</p>
      <van-button block color="#FC2C2B" @click="goPage">立即测试</van-button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { showToast } from 'vant';
export default {
  data() {
    return {
      pic: '',
      qo_cnt: '',
      expect_complete_time: '',
    };
  },
  methods: {
    getQuestionList(params) {
      this.$axios.get('/qo_list', {
        params: Object.assign({ need_pic: true }, params),
      }).then((res) => {
        const userStore = useUserStore();
        userStore.setQuestionData(res);
        userStore.setRouteQuery(params);
        this.pic = res.pic;
        this.qo_cnt = res.qo_cnt.toString();
        this.expect_complete_time = res.expect_complete_time.toString();
        if (!this.pic) this.goPage();
      }).catch((err) => {
        showToast(err.message || err);
      });
    },
    goPage() {
      this.$router.push({ path: '/test/detail' });
    },
  },
  created(){
    if (this.$route.query && this.$route.query.qo_type) {
      this.getQuestionList(this.$route.query);
    }
  },
}
</script>

<style scoped>
.bg{
  display: block;
  width: 100%;
}
.bottom{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.bottom .tip{
  background: #F7D8B2;
  color: #333;
  margin: 0;
  font-size: 16px;
  text-align: center;
  padding: 8px;
}
.bottom .van-button{
  color: #fff;
  font-weight: bold;
  font-size: 26px;
  width: 100%;
  border: 0;
  border-radius: 0;
  height: 70px;
  line-height: 70px;
}
</style>
