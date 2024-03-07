<template>
  <div class="title">节点列表</div>
  <div class="context px-1" v-if="nodes">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="基础节点">
        <div
          class="tab-pane px-10 py-2"
          v-for="(node, index) in nodes?.basicNodes"
          :key="index"
          @mousedown="
            startDrag(
              {
                label: node.name,
                shape: 'rect',
                actionType: 'Vue-node',
                nodeDetailSchema: node,
              },
              $event,
            )
          "
        >
          <NodeTemplate :label="node.name" :icon="node.icon" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="模版节点">
        <div
          class="tab-pane px-4 py-2"
          v-for="(node, index) in nodes?.plugins"
          :key="index"
          @mousedown="
            startDrag(
              {
                label: node.name,
                shape: 'rect',
                actionType: 'Vue-node',
                nodeDetailSchema: node,
                nodeDetailParams: getJsonFromYaml(node.task_yaml),
              },
              $event,
            )
          "
        >
          <NodeTemplate :label="node.name" :icon="node.icon" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import NodeTemplate from '@/components/Dag/src/components/NodesBar/NodeTemplate.vue';

  import { inject, reactive, ref, watch } from 'vue';
  import { ActionType } from '@/components/Dag/src/common/enums';
  import {
    getDiamondNode,
    getEllipseNode,
    getRectNode,
    getVueNode,
  } from '@/components/Dag/src/common/transform';
  import { Addon } from '@antv/x6';
  import { nodeList } from './data';
  import { defaultPorts } from '@/components/FlowGraph/shape';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import { storeToRefs } from 'pinia';
  import { getJsonFromYaml } from "@/components/Dag/src/components/Graph/methods";

  const provideGraph = useProvideGraph();
  const { graphRef } = storeToRefs(provideGraph);

  const props = defineProps({
    nodes: {},
  });

  const data = reactive({
    dnd: {},
    freeze: false,
  });

  const activeKey = ref('1');
  const tabsFormSchema = ref([]);

  tabsFormSchema.value.push({
    key: 1,
    tab: '1',
  });
  tabsFormSchema.value.push({
    key: 2,
    tab: '2',
  });
  function startDrag(currentTarget, e) {
    console.log('currentTarget:', currentTarget, e);
    const { actionType, shape, label, nodeDetailSchema, nodeDetailParams } = currentTarget;
    const { TRIGGER, CONDITION, ACTION } = ActionType;
    let json;
    switch (actionType) {
      // 触发器
      case TRIGGER:
        json = getEllipseNode({
          shape,
          tooltip: label,
          size: { width: 100, height: 50 },
          actionType,
          initialization: true,
        });
        break;
      // 条件
      case CONDITION:
        json = getDiamondNode({
          // x6 不存在 diamond 形状, 转义 rect
          shape: 'rect',
          tooltip: label,
          actionType,
          initialization: true,
        });
        break;
      // 动作
      case ACTION:
        json = getRectNode({
          shape,
          tooltip: label,
          size: { width: 100, height: 50 },
          actionType,
          initialization: true,
        });
        break;
      case 'Vue-node':
        json = getVueNode({
          shape: 'rect',
          tooltip: label,
          size: { width: 200, height: 50 },
          actionType,
          initialization: true,
          nodeDetailSchema: nodeDetailSchema,
          nodeDetailParams: nodeDetailParams !== undefined ? nodeDetailParams : {},
          // nodeDetailParams: { task: {} },
          ports: defaultPorts,
          icon: nodeDetailSchema.icon,
        });
        break;
      default:
        break;
    }
    const node = graphRef.value.createNode(json);
    if (!data.freeze) data.dnd.start(node, e);
    console.log('startDrag', currentTarget, node);
  }

  function initDnd() {
    data.dnd = new Addon.Dnd({
      target: graphRef.value,
      validateNode() {
        return true;
      },
    });
  }

  watch(
    () => graphRef.value,
    (n) => {
      console.log('graph value', n);
      initDnd();
    },
    { deep: true },
  );
</script>

<style scoped></style>
