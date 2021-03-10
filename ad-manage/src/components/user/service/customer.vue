<template>
    <div class='right'>
        <span class='rightBody' v-html="message"></span>
        <span class='rightHeader'><img :src="avatar" class='dialogAvatar' alt=""></span>
    </div> 
</template>
<script>
export default {
    name:'customer',
    props: ['message',"avatar"]
}
</script>

<style>

</style>
