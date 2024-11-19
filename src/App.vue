<script setup>
import { ref } from "vue"
import QuantizationImg from "@/assets/image/logo-quantization.svg"
import TreasureFundImg from "@/assets/image/logo-treasure-fund.svg"

const curUrl = window.location.origin;

const list = ref([
  {
    name: "量化中心",
    img: QuantizationImg,
    port: "5173"
  },
  {
    name: "成长基金",
    img: TreasureFundImg,
    port: "5174"
  }
])
function jump(port) {
  window.open(curUrl + ':' + port, '_blank')
}
</script>

<template>
  <div>
    <div class="list">
      <div class="item" @click="jump(item.port)" v-for="item in list">
        <div class="item-img">
          <img :src="item.img" alt="" />
        </div>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  font-size: 24px;
}

.item:hover {
  background-color: #efc3941e;
}

.item-img {
  width: 200px;
}
</style>
