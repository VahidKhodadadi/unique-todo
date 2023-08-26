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
    background-color: white;
    min-height: 60px;
    display: flex;
    align-items: center;
    border-top: 3px solid #5d5c61;
}

header {
    min-height: 60px;
    background-color: #607D8B;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-bottom: 3px solid #5d5c61;
}
</style>