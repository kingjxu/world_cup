<template>
  <div class="match-list-container">
    <!-- 横滑日期卡 -->
    <div class="date-slider">
      <div class="date-slider-wrapper">
        <div 
          v-for="(matches, date) in match_list_data" 
          :key="date" 
          class="date-card"
          :class="{ active: selectedDate === date }"
          @click="selectDate(date)"
        >
          <div class="date-day">{{ formatDay(date) }}</div>
          <div class="date-week">{{ formatWeek(date) }}</div>
        </div>
      </div>
    </div>

    <!-- 比赛列表 -->
    <div class="matches-container">
      <div v-if="!selectedDate" class="no-date-selected">
        请选择日期查看比赛
      </div>
      <div v-else-if="!match_list_data[selectedDate] || match_list_data[selectedDate].length === 0" class="no-matches">
        当日无比赛
      </div>
      <div v-else>
        <div v-for="(match, index) in match_list_data[selectedDate]" :key="index" class="match-item">
          <!-- 比赛信息 -->
          <div class="match-info">
            <div class="team host-team">
              <img :src="match.host_icon" :alt="match.host_team" class="team-icon" />
              <div class="team-name">{{ match.host_team }}</div>
            </div>
            <div class="vs">VS</div>
            <div class="team guest-team">
              <div class="team-name">{{ match.guest_team }}</div>
              <img :src="match.guest_icon" :alt="match.guest_team" class="team-icon" />
            </div>
          </div>

          <!-- 赔率信息 -->
          <div class="odds-container">
            <!-- 胜负赔率 -->
            <div class="odds-section" v-if="match.bet_type.胜负">
              <div class="odds-title">胜负</div>
              <div class="odds-options">
                <div v-for="(option, idx) in match.bet_type.胜负" :key="idx" class="odds-option">
                  <div class="option-text">{{ option.text }}</div>
                  <div class="option-odds">{{ option.odds }}</div>
                </div>
              </div>
            </div>

            <!-- 比分赔率 -->
            <div class="odds-section" v-if="match.bet_type.比分">
              <div class="odds-title">比分</div>
              <div class="odds-options score-odds">
                <div v-for="(option, idx) in match.bet_type.比分" :key="idx" class="odds-option">
                  <div class="option-text">{{ option.text }}</div>
                  <div class="option-odds">{{ option.odds }}</div>
                </div>
              </div>
            </div>

            <!-- 总进球赔率 -->
            <div class="odds-section" v-if="match.bet_type.总进球">
              <div class="odds-title">总进球</div>
              <div class="odds-options">
                <div v-for="(option, idx) in match.bet_type.总进球" :key="idx" class="odds-option">
                  <div class="option-text">{{ option.text }}</div>
                  <div class="option-odds">{{ option.odds }}</div>
                </div>
              </div>
            </div>

            <!-- 半全场赔率 -->
            <div class="odds-section" v-if="match.bet_type.半全场">
              <div class="odds-title">半全场</div>
              <div class="odds-options">
                <div v-for="(option, idx) in match.bet_type.半全场" :key="idx" class="odds-option">
                  <div class="option-text">{{ option.text }}</div>
                  <div class="option-odds">{{ option.odds }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showToast } from 'vant';
export default {
  data() {
    return {
      match_list_data: {},
      selectedDate: '',
    };
  },
  methods: {
    getMatchList(params) {
      this.$axios.get('http://ddbaby.site/world_cup/match_list', {
        params: Object.assign(params),
      }).then((res) => {
        this.match_list_data = res.match_list;
        // 默认选择第一个日期
        if (Object.keys(res.match_list).length > 0 && !this.selectedDate) {
          this.selectedDate = Object.keys(res.match_list)[0];
        }
        console.log("matchlist created",this.selectedDate);
      }).catch((err) => {
        showToast(err.message || err);
      });
    },
    selectDate(date) {
      this.selectedDate = date;
    },
    formatDay(date) {
      // 格式化为 MM月DD日
      return date.substring(4, 6) + '月' + date.substring(6, 8) + '日';
    },
    formatWeek(date) {
      // 计算星期
      const d = new Date(date.substring(0, 4), parseInt(date.substring(4, 6)) - 1, date.substring(6, 8));
      const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weeks[d.getDay()];
    },
  },
  created() {
    console.log("matchlist created");
    this.getMatchList(this.$route.query);
  },
};
</script>

<style scoped>
.match-list-container {
  padding-bottom: 100px;
}

/* 横滑日期卡样式 */
.date-slider {
  overflow-x: auto;
  white-space: nowrap;
  padding: 16px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.date-slider-wrapper {
  display: inline-flex;
  padding: 0 16px;
}

.date-card {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-card.active {
  background-color: #ff4d4f;
  color: #fff;
}

.date-day {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.date-week {
  font-size: 14px;
}

/* 比赛列表样式 */
.matches-container {
  padding: 0 16px;
}

.no-date-selected,
.no-matches {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 16px;
}

.match-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

/* 比赛信息样式 */
.match-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #333;
  color: #fff;
}

.team {
  display: flex;
  align-items: center;
}

.host-team {
  flex-direction: row;
}

.guest-team {
  flex-direction: row-reverse;
}

.team-icon {
  width: 40px;
  height: 40px;
  border-radius: 0;
  margin: 0 12px;
}

.team-name {
  font-size: 20px;
  font-weight: bold;
}

.vs {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

/* 赔率信息样式 */
.odds-container {
  padding: 16px;
}

.odds-section {
  margin-bottom: 20px;
}

.odds-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
  padding-left: 8px;
  border-left: 4px solid #ff4d4f;
}

.odds-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.score-odds {
  gap: 8px;
}

.odds-option {
  min-width: 80px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.option-text {
  margin-bottom: 4px;
  color: #333;
}

.option-odds {
  font-weight: bold;
  color: #ff4d4f;
}

/* 底部样式 */
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.bottom .tip {
  background: #F7D8B2;
  color: #333;
  margin: 0;
  font-size: 16px;
  text-align: center;
  padding: 8px;
}

.bottom .van-button {
  color: #fff;
  font-weight: bold;
  font-size: 26px;
  width: 100%;
  border: 0;
  border-radius: 0;
  height: 70px;
  line-height: 70px;
}

/* 隐藏滚动条但保留功能 */
.date-slider::-webkit-scrollbar {
  display: none;
}

.date-slider {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>