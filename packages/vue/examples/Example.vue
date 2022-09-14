<script setup lang="ts">
import DragList from '../src/App.vue'
</script>

<template>
  <div id="container">
    <DragList active-class-name="active-item">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
    </DragList>
  </div>
</template>

<style scoped>
.item {
  display: block;
  width: 200px;
  height: 40px;
  border-radius: 18px;
  background-color: #e121f2;
  padding: 10px;
  text-align: center;
  color: #fff;
  cursor: grab;
  /* margin: 20px 0px; */
}
.active-item {
  background-color: aqua;
}

#container {
  width: 400px;
  height: 400px;
  margin: 100px auto;
}
</style>
