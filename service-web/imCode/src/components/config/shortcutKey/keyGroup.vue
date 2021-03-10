<template>
    <div id="keyGroup">
        <div :style="keyStyles" class="key">
            <div v-for="(temp, i) in data.keys" :key="i">
                <span>{{temp}}</span>
                <i v-if="i !== (data.keys.length-1)">+</i>
            </div>
        </div>
        <div :style="textStyles">
            <span>{{data.text}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object
        },
        labelWidth: {
            type: Number,
            default: 140
        }
    },
    computed: {
        keyStyles() {
            return {
                width: this.labelWidth + "px"
            };
        },
        textStyles() {
            return {
                marginLeft: "80px"
            };
        }
    }
};
</script>

<style lang="less" scoped>
#keyGroup {
    margin-bottom: 20px;
    > div {
        display: inline-block;
        &.key {
            >div {
                display: inline-block;
                > span {
                    padding: 10px;
                    border-radius: 4px;
                    box-shadow: rgba(52, 63, 75, 0.1) 0px 2px 4px 0px,
                        rgb(233, 236, 238) 0px -2px 0px 0px inset,
                        rgb(242, 244, 245) 0px -1px 0px 0px inset;
                }
                > i {
                    margin: 0 10px;
                }
            }
        }
    }
}
</style>
