<template>
  <div class="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl p-4">
    <div class="flex items-center gap-3">
      <div class="text-2xl">{{ icon }}</div>
      <div>
        <p class="text-sm text-slate-600">{{ title }}</p>
        <p class="text-lg font-semibold text-slate-800">
          {{ value.toLocaleString() }} ကျပ်
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon: { type: String, default: '' }
})
</script>
