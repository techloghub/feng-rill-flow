<template>
  <div class="node flex" :class="status">
    <img class="logo flex-none" v-if="logoSwitch" :src="logo" alt="" />
    <Icon v-if="!logoSwitch" :icon="logo" :size="18" class="logo flex-none pt-1" />
    <span class="label flex-auto w-30"></span>
    <span class="status flex-auto w-6">
      <img v-if="statusShow" :src="statusImg" alt="" />
    </span>
    <Dropdown class="options flex-auto w-6">
      <a class="ant-dropdown-link" @click.prevent>
        <DownOutlined />
      </a>
      <template #overlay>
        <Menu>
          <MenuItem v-for="(item, index) in menuItems" :key="index" @click="handleClickMenu(item)">
            <a>{{ item }}</a>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { NodeLogo, NodeStatus } from '@/components/FlowGraph/components/nodeConfig';
  import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { DownOutlined } from '@ant-design/icons-vue';

  const status = ref('init');
  const logo = ref(NodeLogo.default);
  const statusImg = ref();
  const statusShow = ref(false);
  const logoSwitch = ref(true);
  const getNode = inject<() => any>('getNode');
  if (getNode !== undefined) {
    console.log("===> nodeTemplate", getNode().store.data)
    status.value = getNode().store.data.attrs.status;
    const type = getNode().store.data.attrs.type;
    const icon = getNode().store.data.attrs.icon;

    if (getNode().store.data.attrs.icon !== undefined) {
      logo.value = getNode().store.data.attrs.icon;
      // logo.value = NodeLogo.prefix + getNode().store.data.attrs.icon;
      logoSwitch.value = getNode().store.data.attrs.icon.startsWith('data');
    } else if (type !== undefined && NodeLogo[type] !== undefined) {
      logo.value = NodeLogo[type];
      logoSwitch.value = false;
    }

    if (icon != undefined && icon.type === 'icon') {
      logoSwitch.value = false;
      logo.value = icon.value;
    } else if (icon != undefined && icon.type === 'img_base64') {
      logo.value = icon.value;
      logoSwitch.value = true;
    }

    if (NodeStatus[status.value] !== undefined) {
      statusImg.value = NodeStatus.prefix + NodeStatus[status.value];
      statusShow.value = true;
    }
  }

  const menuItems = ref(['删除']);
  function handleClickMenu(item) {
    console.log('item', item, getNode());
    if (getNode) {
      getNode().prop('nodeDelete', "jsonSchemaFormData.value");
    }
  }
</script>
<style xml:lang="scss" scoped>
  .node {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #c2c8d5;
    border-left: 4px solid #5f95ff;
    border-radius: 4px;
    box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  }

  .node img {
    //width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .node .logo {
    width: 25px;
    //height: 25px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .node .label {
    display: inline-block;
    flex-shrink: 0;
    //width: 104px;
    margin-left: 8px;
    color: #666;
    font-size: 14px;
  }

  .node .options {
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
