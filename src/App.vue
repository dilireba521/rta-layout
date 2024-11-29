<script setup>
import { ref } from "vue"
import QuantizationImg from "@/assets/image/logo-quantization.svg"
import TreasureFundImg from "@/assets/image/logo-treasure-fund.svg"
import { message, Space } from "ant-design-vue"
import { LoadingOutlined, CheckCircleFilled } from "@ant-design/icons-vue"
var flag = Object.prototype.hasOwnProperty.call(window, 'electronAPI')
// const curUrl = 'http://127.0.0.1'
const curUrl = 'http://' + (sessionStorage.getItem('ip') || '127.0.0.1');

const list = ref([
  {
    name: "量化中心",
    img: QuantizationImg,
    port: "5173",
    status: false
  },
  {
    name: "成长基金",
    img: TreasureFundImg,
    port: "5174",
    status: false
  }
])
function jump(params) {
  const { port, status } = params
  if (!status && flag) return
  let _url = curUrl + ':' + port
  if (flag) {
    window.electronAPI.onOpenUrl(_url)
  } else {
    window.open(_url, '_blank')
  }
}
function initData() {
  if (flag) {
    window.electronAPI.onUpdateProjectStatus((value) => {
      const _data = JSON.parse(value)
      const _item = list.value?.find(item => {
        if (item.port == _data.port && _data.status == 'success') {
          return item
        }
      })
      if (_item && !_item.status) {
        _item.status = true
      }
    })
  }
}
initData()

</script>

<template>
  <div>
    <div class="list">
      <Space class="item" @click="jump(item)" v-for="item in list">
        <div class="item-img">
          <img :src="item.img" alt="" />
        </div>
        <span>{{ item.name }}</span>
        <CheckCircleFilled v-if="flag" :style="{ color: item.status ? '#2ba169' : '#ffffff73' }" />
      </Space>
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
