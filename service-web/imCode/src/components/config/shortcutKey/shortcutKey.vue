<template>
    <div class="shortKey">
        <div class="layout">
            <div class="title">
                <h1>对话页</h1>
                <p>输入框激活后，输入模式</p>
            </div>
            <div class="main">
                <section>
                    <KeyGroup v-for="(temp,i) in fastKey" :key="i" :data="temp"></KeyGroup>
                </section>
            </div>
        </div>
        <div class="layout">
            <div class="title">
                <h1>对话页</h1>
                <p>输入框未激活</p>
            </div>
            <div class="main">
                <section>
                    <KeyGroup v-for="(temp,i) in unVisitedKeys" :key="i" :data="temp"></KeyGroup>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import KeyGroup from "./keyGroup";

export default {
    components: {
        KeyGroup
    },
    data() {
        return {
            fastKey: [
                {
                    keys: ["Enter"],
                    text: "发送消息"
                },
                {
                    keys: ["Ctrl", "Enter"],
                    text: "发送消息"
                },
                {
                    keys: ["Shift", "Enter"],
                    text: "文字换行"
                },
                {
                    keys: ["F1"],
                    text: "退出输入模式"
                }
            ],
            unVisitedKeys: [
                {
                    keys: ["R"],
                    text: "激活输入框"
                },
                // {
                //     keys: ["Shift", "R"],
                //     text: "激活输入框，并选择【内部消息】模式"
                // },
                {
                    keys: ["T"],
                    text: "给当前顾客添加标签"
                },
                {
                    keys: ["N"],
                    text: "给当前顾客添加备注"
                },
                {
                    keys: ["F2"],
                    text: "结束当前对话"
                }
            ]
        };
    }
};
</script>


<style lang="less" scoped>
.shortKey {
    width: 710px;
    > div.layout {
        background: #fff;
        margin-bottom: 30px;
        > .title {
            font-size: 14px;
            padding: 20px 30px;
            border-bottom: 1px solid #f5f5f5;
            line-height: 28px;
            > p {
                color: #969faa;
            }
        }
        > .main {
            font-size: 14px;
            padding: 20px 30px;
            border-bottom: 1px solid #f5f5f5;
            line-height: 28px;
        }
    }
}
</style>
