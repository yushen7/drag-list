<script setup lang="ts">
import { mountDragList } from '@drag-list/core'
import { onMounted } from 'vue'

const { activeClassName, containerHeight } = defineProps({
  activeClassName: String,
  containerHeight: String,
})

onMounted(() => {
  mountDragList({
    container: '#drag-list__container',
    items: [],
    activeClassName,
  })
})
</script>

<template>
  <div
    id="drag-list__container"
    :style="{
      height: containerHeight,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
#drag-list__container {
  height: 100vh;
}
</style>
