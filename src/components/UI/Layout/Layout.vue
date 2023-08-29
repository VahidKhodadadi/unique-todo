<template>
    <div class="flex flex-col justify-start h-100">
        <header class="min-h-[60px] max-h-[60px] bg-slate-400 flex items-center px-3 border-b-2 border-b-gray-800">
            <slot name="header"></slot>
        </header>
        <main>
            <slot name="main"></slot>
        </main>
        <footer class="mt-auto bg-white min-h-[60px] max-h-[60px] flex items-center px-3 border-t-2 border-t-gray-800">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>