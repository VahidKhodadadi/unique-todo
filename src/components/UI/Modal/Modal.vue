<template>
        <div class="modal-overlay">
            <div class="modal">
                <slot name="main"></slot>
            </div>
        </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0, 0.6);
}

.modal {
    width: auto;
    height: auto;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
}
</style>