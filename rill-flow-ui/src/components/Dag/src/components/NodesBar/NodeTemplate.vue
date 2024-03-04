<template>
  <div class="node">
    <img class="logo" v-if="icon?.startsWith('data')" :src="icon" alt="" />
    <Icon v-if="icon?.startsWith('ant-design')" :icon="icon" :size="18" class="logo pt-1" />
    <span class="label"> {{ label }}</span>
  </div>
</template>

<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    label: { type: String },
    icon: { type: String },
    options: { type: Object },
    optShow: { type: Boolean },
  });

</script>

<style lang="scss" scoped>
  .container {
    height: 50px;
    width: 90%;
    display: flex;
    user-select: none;
    background-color: #ff8228;
    border: 2px solid rgba(58, 184, 129, 0.5);
    background-color: rgba(58, 184, 129, 0.5);
    border-radius: 4px;
    color: rgb(125, 118, 113);
    display: flex;
    justify-content: center;
    font-size: 13px;
    align-items: center;
  }

  .node {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: #fff;
    border: 1px solid #c2c8d5;
    border-left: 4px solid #5f95ff;
    border-radius: 4px;
    box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  }

  .node img {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .node .logo {
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .node .label {
    display: inline-block;
    flex-shrink: 0;
    width: 104px;
    color: #666;
    font-size: 14px;
    text-align: center;
  }

  .node .status {
    flex-shrink: 0;
  }

  .node.SUCCEEDED {
    border-left: 4px solid #52c41a;
  }

  .node.SKIPPED {
    border-left: 4px solid #a67d3d;
  }

  .node.FAILED {
    border-left: 4px solid #ff4d4f;
  }

  .node.NOT_STARTED {
    border-left: 4px solid #545454;
  }

  .node.READY {
    border-left: 4px solid #ffff00;
  }

  .node.running .status img {
    animation: spin 1s linear infinite;
  }

  .x6-node-selected .node {
    border-color: #1890ff;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #d4e8fe;
  }

  .x6-node-selected .node.SUCCEEDED {
    border-color: #52c41a;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #ccecc0;
  }

  .x6-node-selected .node.FAILED {
    border-color: #ff4d4f;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #fedcdc;
  }

  .x6-edge:hover path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1px;
  }

  .x6-edge-selected path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1.5px !important;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
