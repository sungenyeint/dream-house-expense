<template>
  <div class="rounded-2xl p-4 shadow-sm">
    <div class="flex justify-between items-center"
        @click="expanded = !expanded">
      <div>
        <p class="text-xs text-slate-500">{{ title }}</p>
        <p class="text-lg font-semibold mt-1">
          {{ value.toLocaleString() }} ကျပ်
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Dropdown Arrow -->
        <button v-if="$slots.extra"
          class="p-1 rounded-full hover:bg-gray-100 transition">
          <svg
            class="w-4 h-4 transform transition-transform duration-300"
            :class="{ 'rotate-180': expanded }"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Extra content -->
    <transition name="fade-slide">
      <div v-if="expanded" class="mt-2 text-xs text-slate-600 space-y-1">
        <slot name="extra" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
})

const expanded = ref(false)
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  max-height: 300px; /* adjust as needed */
}
</style>
