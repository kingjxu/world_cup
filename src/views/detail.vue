<template>
  <div class="page_bg">
    <div class="top">
      <p class="pivot_txt" v-if="question_data.qo">
        <span :class="{ 'font-animation': is_animation }">{{ active_num }}</span><span>/{{ question_data.qo.length }}</span>
      </p>
      <van-progress
        stroke-width="21px" track-color="#7072FF"
        color="linear-gradient(to right, #FFC101, #FFE3A0)"
        :show-pivot="false" :percentage="percentage" />
      <van-count-down :time="countdown_time" format="mm:ss" />
    </div>
    <van-swipe ref="questionSwipe" class="question_swipe" :touchable="false" indicator-color="white">
      <van-swipe-item v-for="(item, index) in question_data.qo" :key="item.id">
        <h4>{{index + 1}}. {{ item.question }}</h4>
        <van-radio-group v-if="qa_items[index]" v-model="qa_items[index].answer">
          <van-radio v-for="(list, idx) in item.options" :key="idx"
            :class="{ active: qa_items[index].answer === list }" :disabled="is_animation"
            :name="list" icon-size="0px" @click="clickRadio(index, item.options.length)">
            {{ list }}
          </van-radio>
        </van-radio-group>
      </van-swipe-item>
    </van-swipe>
    <div class="bottom" :style="{ top: swipeHeight + 'px' }" v-if="qa_items[active_num-1]">
      <van-button class="bottom_prev" color="#7072FF" plain size="large"
        v-if="active_num !== 1" @click="prevQuestion">
        上一题
      </van-button>
      <van-button class="bottom_next" color="#7072FF" plain size="large"
        v-if="qa_items[active_num-1].answer !== ''" @click="nextQuestion">
        下一题
      </van-button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia'
export default {
  data() {
    return {
      is_loaded: false,
      countdown_time: 0,
      is_animation: false,
      active_num: 0,
      qa_items: [],
      swipeHeight: 0,
    };
  },
  computed: {
    ...mapState(useUserStore, ['getRouteQuery', 'question_data']),
    percentage() {
      // 进度条最大值为100，最小值为5，没数据为0
      if (!this.question_data.qo) return 0;
      return 100 / this.question_data.qo.length * this.active_num || 5;
    },
  },
  watch: {
    active_num() {
      this.$nextTick(() => {
        this.swipeHeight = this.$el.querySelectorAll('.van-swipe-item')[this.active_num-1].clientHeight + 69;
      });
    }
  },
  methods: {
    loadQaItems() {
      this.qa_items = this.question_data.qo.map((item) => {
        return {
          question: item.question,
          answer: '',
        };
      });
      this.active_num = 1;
    },
    clickRadio(active_num) {
      if (this.is_animation) return;
      this.is_animation = true; // 切换值以开始或停止动画
      setTimeout(() => { this.is_animation = false; }, 500);
      this.$refs.questionSwipe.next();
      // active_num为当前索引号，+1可得图片从1开始数的序号，再+1可得下一张图的序号
      if (active_num + 2 > this.qa_items.length) {
        const userStore = useUserStore();
        userStore.setAnswerData(this.qa_items);
        this.$router.push({ path: '/test/createorder' });
        return;
      }
      this.active_num = active_num + 2;
    },
    prevQuestion() {
      this.$refs.questionSwipe.prev();
      this.active_num = this.active_num - 1;
    },
    nextQuestion() {
      this.$refs.questionSwipe.next();
      this.active_num = this.active_num + 1;
    },
  },
  mounted() {
    if (!Object.keys(this.question_data).length) {
      this.$router.replace({ path: '/test', query: this.getRouteQuery });
      return;
    }
    this.countdown_time = this.question_data.expect_complete_time * 60 * 1000;
    this.loadQaItems();
  },
}
</script>

<style scoped>
@keyframes fontscale {
  0%, 100% { font-size: 18px; }
  50% { font-size: 22px; }
}
.font-animation{
  animation: fontscale 500ms; /* 1秒内无限次闪烁 */
}
.page_bg{
  background: #FAFAFA;
  height: 100vh;
  padding-bottom: 55px;
  box-sizing: border-box;
}
.top{
  display: flex;
  background: #fff;
  padding: 15px 0;
}
.top .van-progress{
  border-radius: 15px;
  width: 100%;
  margin: 6px 0;
}
.top .pivot_txt{
  color: #A5A5A5;
  font-size: 16px;
  position: relative;
  padding: 5px 15px 5px 34px;
}
.top .pivot_txt span:first-child{
  color: #7072FF;
  font-size: 18px;
  display: block;
  position: absolute;
  left: 18px;
  top: 50%;
  margin-top: -1px;
  transform: translateX(-50%) translateY(-50%);
  width: 26px;
  text-align: right;
}
.top .van-count-down{
  color: #A5A5A5;
  font-size: 16px;
  line-height: 1;
  padding: 8px 15px;
  width: 79px;
}
.question_swipe .van-swipe-item{
  padding: 0 20px;
  box-sizing: border-box;
}
.question_swipe h4{
  font-size: 22px;
  margin: 28px 0;
}
.question_swipe .van-radio{
  background: #fff;
  margin: 20px 0;
  padding: 26px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}
.question_swipe .van-radio :deep(.van-radio__label){
  display: block;
  margin: 0 auto;
  color: #323233;
  font-size: 16px;
}
.question_swipe .van-radio.active{
  background: #DEDFFB;
  border: 1px solid #DEDFFB;
}
.bottom{
  padding: 0 20px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.4s ease-in-out;
}
.bottom .bottom_prev{
  float: left;
  width: auto;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
}
.bottom .bottom_next{
  float: right;
  width: auto;
  width: auto;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
}
</style>
