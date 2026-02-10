import { createRouter, createWebHashHistory } from 'vue-router';
import testView from '../views/test.vue';
import detailView from '../views/detail.vue';
import createorderView from '../views/createorder.vue';
import checkorderView from '../views/checkorder.vue';
import paysuccessView from '../views/paysuccess.vue';
import paycancelView from '../views/paycancel.vue';

const router = createRouter({
  history: createWebHashHistory('/dist/'),
  routes: [
    {
      path: '/test',
      name: 'test',
      children: [
        { path: '', meta: { title: '首页' }, component: testView },
        { path: 'detail', meta: { title: '答题页' }, name: 'detail', component: detailView },
        { path: 'createorder', meta: { title: '下单页' }, name: 'createorder', component: createorderView },
        { path: 'checkorder', meta: { title: '支付页' }, name: 'checkorder', component: checkorderView },
        { path: 'paysuccess', meta: { title: '支付页' }, name: 'paysuccess', component: paysuccessView },
        { path: 'paycancel', meta: { title: '支付页' }, name: 'paycancel', component: paycancelView },
      ],
    },
    { path: '/', redirect: '/test' }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title as string;
  next();
});

export default router;
