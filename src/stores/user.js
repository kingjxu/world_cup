// stores/user.js
import { defineStore } from 'pinia';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { v4 as uuidv4 } from 'uuid';
import { dateFormat, answerFormat } from '../utils/format';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      ddbaby_token: '',
      route_query: {},
      question_data: {},
      answer_data: [],
      report_data: {},
      pay_info: {},
    };
  },
  getters: {
    getRouteQuery(state) {
      if (Object.keys(state.route_query).length) return state.route_query;
      if (sessionStorage.getItem('ddbaby_route_query')) {
        try {
          const route_query = JSON.parse(sessionStorage.getItem('ddbaby_route_query'));
          return route_query;
        } catch (err) {
          return {};
        }
      }
      return state.route_query;
    },
    getAnswerData(state) {
      if (state.answer_data.length) return state.answer_data;
      if (sessionStorage.getItem('ddbaby_answer_data')) {
        try {
          const answer_data = JSON.parse(sessionStorage.getItem('ddbaby_answer_data'));
          return answer_data;
        } catch (err) {
          return {};
        }
      }
      return state.answer_data;
    },
    getReportData(state) {
      if (Object.keys(state.report_data).length) return state.report_data;
      if (sessionStorage.getItem('ddbaby_report_data')) {
        try {
          const report_data = JSON.parse(sessionStorage.getItem('ddbaby_report_data'));
          return report_data;
        } catch (err) {
          return {};
        }
      }
      return state.report_data;
    },
  },
  actions: {
    async userLogin() {
      if (this.ddbaby_token) return this.ddbaby_token;
      if (localStorage.getItem('ddbaby_token')) {
        this.ddbaby_token = localStorage.getItem('ddbaby_token');
        return this.ddbaby_token;
      }
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        this.ddbaby_token = result.visitorId;
      } catch (err) {
        const result = uuidv4();
        this.ddbaby_token = result;
      }
      localStorage.setItem('ddbaby_token', this.ddbaby_token);
      return this.ddbaby_token;
    },
    setRouteQuery(res) {
      this.route_query = res;
      sessionStorage.setItem('ddbaby_route_query', JSON.stringify(this.route_query));
    },
    setQuestionData(res) {
      this.question_data = res;
    },
    setAnswerData(res) {
      this.answer_data = res;
      sessionStorage.setItem('ddbaby_answer_data', JSON.stringify(this.answer_data));
    },
    setReportData(question_data, answer_data) {
      if (!Object.keys(question_data).length || !answer_data.length) return [];
      const report_intro = [
        { label: '报告摘要', value: question_data.title, value_type: 'title' },
        { label: '答题数', value: `${question_data.qo_cnt}题`, value_type: 'content' },
        { label: '完成时间', value: dateFormat(new Date().getTime()), value_type: 'content' },
        { label: '性别', value: answerFormat(answer_data, '性别'), value_type: 'content' },
        { label: '年龄', value: answerFormat(answer_data, '年龄'), value_type: 'content' },
      ];
      const report_tip = `<p>${question_data.tips}</p><p>已有<span>${question_data.participant_count}</span>人查看结果</p>`;
      this.report_data = { report_intro, report_tip };
      sessionStorage.setItem('ddbaby_report_data', JSON.stringify(this.report_data));
      return this.report_data;
    },
    setPayInfo(res) {
      this.pay_info = res;
    },
  },
})