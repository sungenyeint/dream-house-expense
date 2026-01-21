<template>
  <div :class="boxClass">
    <p class="text-xs opacity-70">{{ title }}</p>
    <p class="font-semibold text-lg">
      {{ value.toLocaleString() }} ကျပ်
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: Number,
  color: String
})

const colors = {
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  green: 'bg-green-50 border-green-200 text-green-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800'
}

const boxClass =
  `border rounded-xl p-3 ${colors[props.color]}`
</script>
