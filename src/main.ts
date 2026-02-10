import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import axios from 'axios';
import {
  Button,
  Toast,
  Progress,
  CountDown,
  Swipe, SwipeItem,
  RadioGroup, Radio,
  Icon,
  Overlay,
  Image as VanImage
} from 'vant';
import 'vant/lib/index.css';


// 线上
axios.defaults.baseURL = 'http://ddbaby.site/jk/';

axios.interceptors.request.use(config => {
  return config;
}, err => {
  return Promise.reject(err);
});
axios.interceptors.response.use(response => {
  if(response.status !== 200 || !response.data) return { code:0, error:'服务器错误！' };
  return response.data;
}, err => {
  return Promise.reject(err);
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.use(createPinia());
app.use(router);
app.use(Button);
app.use(Toast);
app.use(Progress);
app.use(CountDown);
app.use(Swipe);
app.use(SwipeItem);
app.use(Radio);
app.use(RadioGroup);
app.use(Icon);
app.use(Overlay);
app.use(VanImage);

app.mount('#app');
