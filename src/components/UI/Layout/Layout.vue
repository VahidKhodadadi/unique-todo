<template>
    <div class="flex flex-col justify-start h-full max-h-screen bg-gray-50">
        <header class="min-h-[60px] max-h-[60px] bg-white flex items-center px-4 border-b border-gray-200 shadow-sm">
            <slot name="header"></slot>
        </header>
        <main class="overflow-y-auto flex-1 p-4" style="height: calc(100% - 120px)">
            <slot name="main"></slot>
        </main>
        <footer class="mt-auto bg-white min-h-[60px] max-h-[60px] flex items-center px-4 border-t border-gray-200 shadow-sm">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>
