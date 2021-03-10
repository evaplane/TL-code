import Vue from 'vue';
import Router, { Route, Location } from 'vue-router';
import layoutDefault from '@/views/layout/default.vue';
import userAuthenticationIndex from '@/views/user/authentication/index.vue';
import c2cAdIndex from '@/views/c2c/ad/index.vue';
import assetsOperatingDetail from '@/views/assets/operating/index.vue';
import leverTransfer from '@/views/trade/lever-transfer.vue';

Vue.use(Router);
interface IRouterNext {
  (config?: Location): void;
}
const tradePageBeforeEnter = (to: Route, _: Route, next: IRouterNext): void => {
  if (!to.params.type) {
    next({ name: to.name, params: { type: 'btc_usdt' } });
    return;
  }
  next();
};
const c2cPageBeforeEnter = (to: Route, _: Route, next: IRouterNext): void => {
  if (!to.params.type) {
    next({ name: to.name, params: { type: 'buy' } });
    return;
  }
  next();
};
export default new Router({
  routes: [
    {
      path: '/i',
      name: 'default',
      component: layoutDefault,
      redirect: { name: 'index' },
      children: [
        {
          path: 'index',
          name: 'index',
          component: (): Promise<any> => import(/* webpackChunkName: "main" */ '@/views/index/index.vue')
        }
      ]
    }, {
      path: '/trade',
      name: 'trade',
      component: (): Promise<any> => import(/* webpackChunkName: "trade" */ '@/views/trade/index.vue'),
      redirect: { name: 'kline' },
      children: [
        {
          path: 'kline/:type',
          name: 'trade-kline',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-kline" */ '@/views/trade/kline.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'handicap/:type',
          name: 'trade-handicap',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-handicap" */ '@/views/trade/handicap.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'lever-handicap/:type',
          name: 'lever-handicap',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-handicap" */ '@/views/trade/handicap.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'all/:type',
          name: 'trade-all',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-all" */ '@/views/trade/all.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'data/:type',
          name: 'trade-data',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-data" */ '@/views/trade/data.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'entrust/:type',
          name: 'trade-entrust',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-entrust" */ '@/views/trade/entrust.vue'),
          beforeEnter: tradePageBeforeEnter
        }, {
          path: 'overview/:type',
          name: 'trade-overview',
          component: (): Promise<any> => import(/* webpackChunkName: "trade-overview" */ '@/views/trade/overview.vue'),
          beforeEnter: tradePageBeforeEnter
        }
      ]
    }, {
      path: '/lever-transfer/:type',
      name: 'lever',
      redirect: { name: 'lever-borrow-coin', replace: true },
      component: leverTransfer,
      children: [
        {
          path: 'borrow-list1',
          name: 'lever-borrow-coin',
          meta: { level: 1 },
          component: (): Promise<any> => import(/* webpackChunkName: "lever-borrow" */ '@/views/trade/transfer/borrow-list.vue')
        }, {
          path: 'borrow-list2',
          name: 'lever-borrow-money',
          meta: { level: 1 },
          component: (): Promise<any> => import(/* webpackChunkName: "lever-borrow" */ '@/views/trade/transfer/borrow-list.vue')
        }, {
          path: 'return',
          name: 'lever-return',
          meta: { level: 1 },
          component: (): Promise<any> => import(/* webpackChunkName: "lever-return" */ '@/views/trade/transfer/return.vue')
        }, {
          path: 'transfer',
          name: 'lever-transfer',
          meta: { level: 1 },
          component: (): Promise<any> => import(/* webpackChunkName: "lever-transfer" */ '@/views/trade/transfer/transfer.vue')
        }
      ]
    }, {
      path: '/lever-borrow/:type',
      name: 'lever-borrow',
      component: (): Promise<any> => import(/* webpackChunkName: "lever-borrow-detail" */ '@/views/trade/transfer/borrow.vue')
    }, {
      path: '/return-detail/:id',
      name: 'lever-return-detail',
      meta: { level: 1 },
      component: (): Promise<any> => import(/* webpackChunkName: "lever-return-detail" */ '@/views/trade/transfer/return-detail.vue')
    }, {
      path: '/assets',
      name: 'assets',
      component: (): Promise<any> => import(/* webpackChunkName: "assets-index" */ '@/views/assets/default.vue'),
      redirect: { name: 'assets-index' },
      children: [
        {
          path: 'index',
          name: 'assets-index',
          meta: { level: 1 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-index" */ '@/views/assets/index.vue')
        }, {
          path: 'complex-bill',
          name: 'complex-bill',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "complex-bill" */ '@/views/assets/complex-bill.vue')
        }, {
          path: 'account/:type',
          name: 'account',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-account" */ '@/views/assets/account/index.vue')
        }, {
          path: 'account/:type/:action',
          name: 'assets-account',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-account" */ '@/views/assets/account/index.vue')
        }, {
          path: 'detail',
          name: 'assets-operating-detail',
          component: assetsOperatingDetail,
          children: [
            {
              path: 'payin/:type',
              name: 'assets-operating-payin',
              meta: { action: 'payin', level: 3 },
              component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-payin" */ '@/views/assets/operating/payin.vue')
            }, {
              path: 'withdraw/:type',
              name: 'assets-operating-withdraw',
              meta: { action: 'withdraw', level: 3 },
              component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-withdraw" */ '@/views/assets/operating/withdraw.vue')
            }, {
              path: 'bill/:type',
              name: 'assets-operating-bill',
              meta: { action: 'bill', level: 3 },
              component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-bill" */ '@/views/assets/operating/bill.vue')
            }, {
              path: 'transfer/:type',
              name: 'assets-operating-transfer',
              meta: { action: 'transfer', level: 3 },
              component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-transfer" */ '@/views/assets/operating/transfer.vue')
            }
          ]
        }, {
          path: 'loan',
          name: 'loan',
          redirect: { name: 'loan-money' },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-loan" */ '@/views/assets/loan/index.vue'),
          children: [
            {
              path: 'money',
              name: 'loan-money',
              meta: { level: 2 },
              component: (): Promise<any> => import(/* webpackChunkName: "loan-money" */ '@/views/assets/loan/loan.vue')
            },
            {
              path: 'coin',
              name: 'loan-coin',
              meta: { level: 2 },
              component: (): Promise<any> => import(/* webpackChunkName: "loan-money" */ '@/views/assets/loan/loan.vue')
            },
            {
              path: 'mortgage',
              name: 'loan-mortgage',
              meta: { level: 2, showFilter: true },
              component: (): Promise<any> => import(/* webpackChunkName: "loan-money" */ '@/views/assets/loan/mortgage.vue')
            }
          ]
        }, {
          path: 'redemption',
          name: 'loan-redemption',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-transfer" */ '@/views/assets/loan/common-details.vue')
        },
        {
          path: 'cash-deposit',
          name: 'loan-cashDeposit',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-transfer" */ '@/views/assets/loan/common-details.vue')
        },
        {
          path: 'money-details',
          name: 'loan-money-details',
          meta: { level: 2 },
          component: (): Promise<any> => import(/* webpackChunkName: "assets-operating-transfer" */ '@/views/assets/loan/common-details.vue')
        }
      ]
    }, {
      path: '/user',
      name: 'user',
      component: (): Promise<any> => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
      redirect: { name: 'user-login' },
      children: [
        {
          path: 'login',
          name: 'user-login',
          component: (): Promise<any> => import(/* webpackChunkName: "user-login" */ '@/views/user/login.vue')
        }
      ]
    }, {
      path: '/user-authentication',
      name: 'user-authentication',
      component: userAuthenticationIndex,
      redirect: { name: 'user-authentication-list' },
      children: [
        {
          path: 'list',
          name: 'user-authentication-list',
          component: (): Promise<any> => import(/* webpackChunkName: "user-authentication" */ '@/views/user/authentication/list.vue')
        },
        {
          path: 'mainland',
          name: 'user-authentication-mainland',
          component: (): Promise<any> => import(/* webpackChunkName: "user-authentication-mainland" */ '@/views/user/authentication/mainland.vue')
        },
        {
          path: 'oversea',
          name: 'user-authentication-oversea',
          component: (): Promise<any> => import(/* webpackChunkName: "user-authentication-oversea" */ '@/views/user/authentication/oversea.vue')
        }
      ]
    }, {
      path: '/c2c',
      name: 'c2c',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c" */ '@/views/c2c/index.vue'),
      redirect: { name: 'c2c-square' },
      children: [
        {
          path: 'square/:type',
          name: 'c2c-square',
          beforeEnter: c2cPageBeforeEnter,
          meta: {
            needLogin: false
          },
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-square" */ '@/views/c2c/square.vue')
        }, {
          path: 'management',
          name: 'c2c-management',
          meta: {
            needLogin: false
          },
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-management" */ '@/views/c2c/management/index.vue')
        }
      ]
    },
    {
      path: '/community',
      name: 'community',
      component: (): Promise<any> => import(/* webpackChunkName: "community" */ '@/views/community/index.vue'),
      redirect: { name: 'message' },
      children: [
        {
          path: 'message-list',
          name: 'community-message-list',
          component: (): Promise<any> => import(/* webpackChunkName: "message-list" */ '@/views/community/message.vue')
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: (): Promise<any> => import(/* webpackChunkName: "contacts" */ '@/views/community/contacts.vue')
        },
        {
          path: 'notice',
          name: 'community-notice',
          component: (): Promise<any> => import(/* webpackChunkName: "notice" */ '@/views/community/notice.vue')
        },
        {
          path: 'announcement',
          name: 'community-announcement',
          component: (): Promise<any> => import(/* webpackChunkName: "announcement" */ '@/views/community/announcement.vue')
        },
        {
          path: 'activity',
          name: 'community-activity',
          component: (): Promise<any> => import(/* webpackChunkName: "activity" */ '@/views/community/activity.vue')
        },
        {
          path: 'community-news',
          name: 'community-news',
          component: (): Promise<any> => import(/* webpackChunkName: "news" */ '@/views/community/news.vue')
        },
        {
          path: 'newsletter',
          name: 'community-newsletter',
          component: (): Promise<any> => import(/* webpackChunkName: "newsletter" */ '@/views/community/newsletter.vue')
        },
        {
          path: 'college',
          name: 'community-college',
          component: (): Promise<any> => import(/* webpackChunkName: "college" */ '@/views/community/college.vue')
        },
        {
          path: 'news-detail',
          name: 'news-detail',
          components: {
            default: (): Promise<any> => import(/* webpackChunkName: "news" */ '@/views/community/news.vue'),
            private: (): Promise<any> => import(/* webpackChunkName: "news-detail" */ '@/views/community/news-detail.vue')
          }
        },
        {
          path: 'annoucement-detail',
          name: 'annoucement-detail',
          components: {
            default: (): Promise<any> => import(/* webpackChunkName: "news" */ '@/views/community/announcement.vue'),
            private: (): Promise<any> => import(/* webpackChunkName: "annoucement-detail" */ '@/views/community/annoucement-detail.vue')
          }
        },
        {
          path: 'notice-list',
          name: 'notice-list',
          components: {
            default: (): Promise<any> => import(/* webpackChunkName: "notice" */ '@/views/community/notice.vue'),
            private: (): Promise<any> => import(/* webpackChunkName: "notice-list" */ '@/views/community/notice-list.vue')
          }
        },
        {
          path: '/serve-chat',
          name: 'serve-chat',
          components: {
            // default: (): Promise<any> => import(/* webpackChunkName: "message-list" */ '@/views/community/message.vue'),
            private: (): Promise<any> => import(/* webpackChunkName: "serve-chat" */ '@/views/community/chat.vue')
          }
        }
      ]
    },
    {
      path: '/c2c-order',
      name: 'c2c-order',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-order" */ '@/views/c2c/order/index.vue'),
      redirect: { name: 'c2c-await-order' },
      children: [
        {
          path: 'await/:orderId',
          name: 'c2c-await-order',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-await-order" */ '@/views/c2c/order/await-order.vue')
        },
        {
          path: 'buyer/:orderId',
          name: 'c2c-order-buyer',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-order-buyer" */ '@/views/c2c/order/buyer.vue')
        }, {
          path: 'add-payment/:orderId',
          name: 'c2c-add-payment',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-add-payment" */ '@/views/c2c/order/add-payment.vue')
        }, {
          path: 'seller/:orderId',
          name: 'c2c-order-seller',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-order-seller" */ '@/views/c2c/order/seller.vue')
        }, {
          path: 'chat',
          name: 'c2c-chat',
          component: (): Promise<any> => import(/* webpackChunkName: "chat" */ '@/views/c2c/chat.vue')
        }
      ]
    }, {
      path: '/c2c-appeal',
      name: 'c2c-appeal',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-appeal" */ '@/views/c2c/appeal/index.vue'),
      redirect: { name: 'c2c-sponsor/:orderId' },
      children: [
        {
          path: 'sponsor/:orderId/:appealId',
          name: 'c2c-sponsor',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-sponsor" */ '@/views/c2c/appeal/sponsor.vue')
        },
        {
          path: 'appeal-detail/:orderId',
          name: 'c2c-appeal-detail',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-appeal-detail" */ '@/views/c2c/appeal/appeal-detail.vue')
        }
      ]
    }, {
      path: '/c2c-merchant',
      name: 'c2c-merchant',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-merchant" */ '@/views/c2c/merchant/index.vue'),
      redirect: { name: 'business-application' },
      children: [
        {
          path: 'business-application',
          name: 'business-application',
          component: (): Promise<any> => import(/* webpackChunkName: "business-application" */ '@/views/c2c/merchant/business-application.vue')
        },
        {
          path: 'apply-ordinary-business',
          name: 'apply-ordinary-business',
          component: (): Promise<any> => import(/* webpackChunkName: "apply-ordinary-business" */ '@/views/c2c/merchant/apply-ordinary-business.vue')
        },
        {
          path: 'ordinary-business',
          name: 'ordinary-business',
          component: (): Promise<any> => import(/* webpackChunkName: "ordinary-business" */ '@/views/c2c/merchant/ordinary-business.vue')
        },
        {
          path: 'apply-authentication-business',
          name: 'apply-authentication-business',
          component: (): Promise<any> => import(/* webpackChunkName: "apply-authentication-business" */ '@/views/c2c/merchant/apply-authentication-business.vue')
        },
        {
          path: 'authentication-business',
          name: 'authentication-business',
          component: (): Promise<any> => import(/* webpackChunkName: "authentication-business" */ '@/views/c2c/merchant/authentication-business.vue')
        },
        {
          path: 'business-set',
          name: 'business-set',
          component: (): Promise<any> => import(/* webpackChunkName: "business-set" */ '@/views/c2c/merchant/set.vue')
        },
        {
          path: 'business-await',
          name: 'business-await',
          component: (): Promise<any> => import(/* webpackChunkName: "business-await" */ '@/views/c2c/merchant/await.vue')
        }
      ]
    }, {
      path: '/c2c-Payment',
      name: 'c2c-Payment',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-merchant" */ '@/views/c2c/payment/index.vue'),
      redirect: { name: 'c2c-payment-mode' },
      children: [
        {
          path: 'mode',
          name: 'c2c-payment-mode',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-Payment-mode" */ '@/views/c2c/payment/mode-payment.vue')
        },
        {
          path: 'select',
          name: 'c2c-payment-select',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-payment-select" */ '@/views/c2c/payment/payment-select.vue')
        },
        {
          path: 'add-bank-card/:title/:idCard',
          name: 'c2c-bank-card',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-add-bank-card" */ '@/views/c2c/payment/add-bank-card.vue')
        },
        {
          path: 'add-app-card/:title/:idCard',
          name: 'c2c-app-card',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-add-app-card" */ '@/views/c2c/payment/add-app-card.vue')
        },
        {
          path: 'add-paypal-card/:title/:idCard',
          name: 'add-paypal-card',
          component: (): Promise<any> => import(/* webpackChunkName: "add-paypal-card" */ '@/views/c2c/payment/add-paypal-card.vue')
        },
        {
          path: 'add-other-card/:title/:idCard',
          name: 'add-other-card',
          component: (): Promise<any> => import(/* webpackChunkName: "add-other-card" */ '@/views/c2c/payment/add-other-card.vue')
        }
      ]
    }, {
      path: '/c2c-advert',
      name: 'c2c-advert',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-advert" */ '@/views/c2c/advert/index.vue'),
      redirect: { name: 'business-advertising' },
      children: [
        {
          path: 'business-advertising/:userId/:marketId',
          name: 'business-advertising',
          component: (): Promise<any> => import(/* webpackChunkName: "business-advertising" */ '@/views/c2c/advert/business-advertising.vue')
        }
      ]
    }, {
      path: '/c2c-ad',
      name: 'c2c-ad',
      component: c2cAdIndex,
      redirect: { name: 'c2c-ad-mine' },
      children: [
        {
          path: 'mine',
          name: 'c2c-ad-mine',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-ad-mine" */ '@/views/c2c/ad/mine.vue')
        }, {
          path: 'release',
          name: 'c2c-ad-release',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-ad-release" */ '@/views/c2c/ad/release.vue')
        }, {
          path: 'select-coin',
          name: 'c2c-ad-select-coin',
          component: (): Promise<any> => import(/* webpackChunkName: "c2c-ad-select-coin" */ '@/views/c2c/ad/select-coin.vue')
        }
      ]
    }, {
      path: '/c2c-order-confirm',
      name: 'c2c-order-confirm',
      component: (): Promise<any> => import(/* webpackChunkName: "c2c-order-confirm" */ '@/views/c2c/order/confirm.vue')
    }, {
      path: '/app',
      name: 'app',
      component: (): Promise<any> => import(/* webpackChunkName: "app" */ '@/views/app/index.vue')
    }, {
      path: '/p',
      name: 'p',
      component: (): Promise<any> => import(/* webpackChunkName: "p" */ '@/views/index/password.vue')
    }, {
      path: '*',
      redirect: { name: 'index' }
    }
  ]
});
