<template>
     <div class="left">
        <span class='leftHeader'><img :src="avatar" class='dialogAvatar' alt=""></span>
        <span class='leftBody' v-html="message"></span>
    </div>
</template>

<script>
export default {
    name:'userDialog',
    props:['avatar','message']
}
</script>

<style>

</style>
