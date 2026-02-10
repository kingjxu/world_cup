<template>
  <div></div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia';
import { showConfirmDialog, showLoadingToast, showToast } from 'vant';
export default {
  computed: {
    ...mapState(useUserStore, ['getRouteQuery']),
  },
  methods: {
    showPayConfirm() {
      showConfirmDialog({
        title: '付款确认中',
        message: '亲，您是否已经完成支付啦？',
        confirmButtonText: '已支付',
        confirmButtonColor: '#DC0000',
      }).then(() => {
        this.checkOrder();
      }).catch(() => {
        this.checkOrder();
      });
    },
    checkOrder() {
      const loading = showLoadingToast({ message: '加载中...', forbidClick: true });
      const params = {
        order_id: this.$route.query.order_id,
      };
      this.$axios.get('/order_info', { params }).then((res) => {
        loading.close();
        const userStore = useUserStore();
        userStore.setPayInfo({
          seq: res.seq,
          price_off: res.price_off,
          professor_url: res.professor_url,
          risk_level: res.risk_level,
        });
        if (res.status === 10) {
          this.$router.replace({ path: '/test/paycancel' });
          return;
        } else if (res.status === 20) {
          this.$router.replace({ path: '/test/paysuccess' });
          return;
        } else {
          showToast('查询支付状态失败，请稍后重试');
        }
      }).catch((err) => {
        loading.close();
        showToast(err.message || err);
      });
    },
  },
  mounted() {
    if (!this.$route.query || !this.$route.query.order_id) {
      this.$router.replace({ path: '/test', query: this.getRouteQuery });
      return;
    }
    this.showPayConfirm();
  },
}
</script>

<style scoped>

</style>
