<template>
    <div class="layout">
        <header>
            <slot name="header"></slot>
        </header>
        <main>
            <slot name="main"></slot>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
}

footer {
    margin-top: auto;
    background-color: #e2e2e2;
    min-height: 60px;
    display: flex;
    align-items: center;
}

header {
    min-height: 60px;
    background-color: #e2e2e2;
    display: flex;
    align-items: center;
}
</style>