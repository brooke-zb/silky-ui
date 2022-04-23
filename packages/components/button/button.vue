<template>
  <button class="px-2">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()
</script>

<style scoped>
button {
  background: aqua;
}
</style>