<template>
  <div class="overview-box">
    <native-scroll>
      <div class="card-title">__('发行数据')</div>
      <div class="overview-cell-group">
        <div class="overview-cell">
          <span class="overview-cell--title">__('名称')</span>
          <span class="overview-cell--value">{{ coinName }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('发行时间')</span>
          <span class="overview-cell--value">{{ formatDate(coinInfo.publishTime) }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('全网市值')</span>
          <span class="overview-cell--value">{{ coinInfo.marketWorth || '--' }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('全网24小时成交')</span>
          <span class="overview-cell--value">{{ coinInfo.volume24 || '--' }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('流通数量')</span>
          <span class="overview-cell--value">{{ coinInfo.circlNum || '--' }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('发行总量')</span>
          <span class="overview-cell--value">{{ coinInfo.publishTotal || '--' }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('最大发行量')</span>
          <span class="overview-cell--value">{{ coinInfo.publishMaxTotal || '--' }}</span>
        </div>
        <div class="overview-cell">
          <span class="overview-cell--title">__('流通占比')</span>
          <span class="overview-cell--value">{{ fixNumber(coinInfo.circlPercent) + '%' }}</span>
        </div>
        <!-- <div class="overview-cell">
          <span class="overview-cell--title">__('当前周期新增')</span>
          <span
            class="overview-cell--value"
          >{{isNaN(coinInfo.periodAdd) ? '--' : coinInfo.periodAdd}}</span>
        </div> -->
        <div class="overview-cell">
          <span class="overview-cell--title">__('24小时换手')</span>
          <span class="overview-cell--value">{{ fixNumber(coinInfo.exchangeRate) + '%' }}</span>
        </div>
      </div>
      <div class="line" />
      <div class="card-title">__('技术模型')</div>
      <div class="card-content">{{ coinInfo.techModel || `__('暂无数据')` }}</div>
      <div class="line" />
      <div class="card-title">__('经济模型')</div>
      <div class="card-content">{{ coinInfo.economicModel || `__('暂无数据')` }}</div>
      <div class="line" />
      <template v-if="coinInfo.teams">
        <div class="card-title">__('团队')</div>
        <div class="team-list">
          <div :key="item.id" class="team-item" v-for="(item, i) in coinInfo.teams" @click="changeTeamIndex(i)">
            <div class="team-img" v-bg="{ src: item.headerImg, err: headImg }"></div>
            <div class="team-text">
              <h2 class="u-text-overflow1">
                {{ item.name }}
                <span class="title" v-if="item.jobTitle">{{ item.jobTitle }}</span>
              </h2>
              <p :class="{ 'team-show-more': i === showIndex }" class="u-text-overflow3">{{ item.introduction }}</p>
            </div>
          </div>
          <div class="company-name" v-if="coinInfo.foundation">__('基金会')：{{ coinInfo.foundation }}</div>
        </div>
      </template>
      <div class="line" />
      <div class="card-title">__('项目简介')</div>
      <div class="card-content">{{ coinInfo.introduction }}</div>
      <div class="line" />
      <div class="card-title">__('相关链接')</div>
      <div class="card-content link-content" v-if="isNotEmpty(coinInfo.links)">
        <div v-for="(item, type) in coinInfo.links" :key="type">
          <h2>{{ type }}</h2>
          <a :href="item.link" :key="index" v-for="(item, index) in item">
            <i v-if="item.linkTag">{{ item.linkTag }}</i>
            {{ item.link }}
          </a>
        </div>
      </div>
      <div class="card-content link-content" v-else>__('暂无数据')</div>
      <template v-if="coinInfo.events && coinInfo.events.length">
        <div class="line" />
        <div class="time-zone">
          <div :key="item.id" class="time-zone-item" v-for="item in coinInfo.events">
            <div class="time">
              <time>{{ item.occurTime | date('YYYY-MM-DD') }}</time>
            </div>
            <p>
              <i class="point"></i>
              {{ item.event }}
            </p>
          </div>
        </div>
        <div class="line" />
      </template>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsMarket from '@/mixins/market/market';
import { Catch } from '@/utils/decorators';
import { formatDate } from '@/utils/date';
import { fixNumber } from '@/utils/math';
import { isNotEmpty } from '@/utils/is';
import { State } from 'vuex-class';
import { getCoinInfoByName, ICoinInfo } from '@/api/common';
@Component
export default class Overview extends Mixins(mixinsMarket) {
  headImg: any = require('@img/user/default-avatar.png');
  showIndex: number = -1;
  isNotEmpty = isNotEmpty;
  // eslint-disable-next-line
  coinInfo = {} as ICoinInfo;
  @State('lang', { namespace: 'lang' }) lang!: string;
  @Watch('mixinsCShowNameUp', { immediate: true })
  _() {
    this.getCoinDetail();
  }
  get coinName(): string {
    let { nameAlias, coinName } = this.coinInfo;
    if (!nameAlias && !coinName) {
      return '--';
    }
    return [nameAlias, coinName]
      .map(item => {
        return isNotEmpty(item) === true ? item.toString().trim() : null;
      })
      .filter(item => !!item)
      .join('、');
  }
  trasferNumber(num: string | number) {
    let newNum = Number(num);
    if (newNum > 1e8) {
      return fixNumber(newNum / 1e8, 4) + '__("亿")';
    }
    if (newNum > 1e4) {
      return fixNumber(newNum / 10e3, 4) + '__("万")';
    }
    if (!newNum) {
      return '--';
    }
    return num + '';
  }
  fixNumber(num: string | number) {
    if (Number(num)) {
      return fixNumber(Number(num) * 100, 2);
    }
    return '--';
  }
  formatDate(date: number | string): string {
    if (!date) return '--';
    return formatDate(date, 'YYYY-MM-DD') as string;
  }
  changeTeamIndex(index: number) {
    if (index === this.showIndex) {
      this.showIndex = -1;
      return;
    }
    this.showIndex = index;
  }
  @Catch()
  async getCoinDetail() {
    let newCoin = await getCoinInfoByName(this.mixinsCShowNameUp, this.lang === 'cn' ? 0 : 1);
    this.coinInfo = newCoin || {};
  }
}
</script>

<style lang='scss'>
.overview-box {
  flex: 1;
  overflow: hidden;
  color: #383838;
  @include dark {
    color: #b7bec3;
  }
  .team-show-more {
    overflow: initial;
    display: block;
  }
  .overview-cell-group {
    .overview-cell {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      font-size: 14px;
      position: relative;
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 15px;
        right: 15px;
        bottom: 0;
        border-bottom: 1px solid var(--border-color); /* no */
      }
      .overview-cell--title {
        color: #7c8792;
      }
    }
  }
  .card-content {
    padding: 8px 15px 15px;
    font-size: 14px;
    line-height: 1.5;
  }
  .team-list {
    padding: 15px;
    .team-item {
      display: flex;
      padding-bottom: 10px;
    }
    .title {
      margin-left: 5px;
    }
    .team-img {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .team-text {
      padding-left: 10px;
      flex: 1;
      h2 {
        padding: 3px 0 8px;
        font-weight: 500;
        font-size: 15px;
        color: #27364a;
        @include dark {
          color: #fff;
        }
      }
      p {
        line-height: 1.5;
        font-size: 14px;
      }
    }
  }
  .company-name {
    font-size: 14px;
    line-height: 1.5;
  }
  .link-content {
    > div {
      margin-bottom: 15px;
    }
    h2 {
      font-size: 14px;
      font-weight: 500;
      color: #27364a;
      @include dark {
        color: #fff;
      }
    }
    a {
      line-height: 26px;
      display: block;
      font-size: 13px;
    }
    i {
      font-style: normal;
      display: inline-block;
      padding: 3px 5px;
      line-height: 1;
      color: #fff;
      border-radius: 2px;
      background: var(--primary-color);
    }
  }
  .time-zone {
    position: relative;
    overflow: hidden;
    padding: 20px 0;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px; /* no */
      background: var(--primary-color);
      height: 100%;
    }
    .time-zone-item {
      width: 50%;
      position: relative;
      margin-top: 15px;
      &:nth-child(odd) {
        margin-left: 50%;
        .point {
          left: -5px; /* no */
        }
      }
      &:nth-child(even) {
        .point {
          right: -5px; /* no */
        }
        .time {
          text-align: right;
        }
      }
      time {
        display: inline-block;
        background: var(--primary-color);
        padding: 4px;
        border-radius: 2px; /* no */
        color: #fff;
        margin: 0 15px;
        word-break: break-all;
      }
      p {
        margin: 7px 0;
        padding: 0px 15px;
        line-height: 1.5;
        font-size: 14px;
      }
      .point {
        position: absolute;
        top: 0;
        width: 3px; /* no */
        height: 3px; /* no */
        background: #fff;
        border: 4px solid var(--primary-color); /* no */
        border-radius: 50%;
        box-sizing: content-box;
        box-shadow: 0 0 0 3px rgba(#e91c41, 0.2);
      }
    }
  }
}
</style>
