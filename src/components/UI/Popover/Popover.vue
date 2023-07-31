<template>
    <div class="handle" @click="setShowPopover">
        <slot name="handle"></slot>
        <div class="combobox" v-if="showPopover">
            <slot name="combobox"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showPopover: false
        }
    },
    methods: {
        setShowPopover() {
            this.showPopover = !this.showPopover;
        }
    }
}
</script>

<style scoped>
.handle {
    cursor: pointer;
    position: relative;
}

.combobox {
    border-radius: 3px;
    position: absolute;
    top: 100%;
    right: 0;
    box-shadow: 1px 1px 3px #e2e2e2;
    background-color: white;
}
</style>