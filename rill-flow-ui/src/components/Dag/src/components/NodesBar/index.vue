<template>
  <div class="title">节点列表</div>
  <div class="context px-1" v-if="nodes">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="流程节点">
        <div
          class="tab-pane px-4 py-2"
          v-for="(node, index) in nodeList().function"
          :key="index"
          @mousedown="
            startDrag(
              {
                label: node.category,
                shape: 'rect',
                actionType: 'Vue-node',
                nodeDetailSchema: node,
              },
              $event,
            )
          "
        >
          <!--        {{node}}-->
          <NodeTemplate :label="node.category" :icon="node.icon" />
        </div>

        <div
          class="tab-pane px-4 py-2"
          v-for="(node, index) in nodeList().plugin"
          :key="index"
          @mousedown="
            startDrag(
              {
                label: node.node_type === 'meta' ? node.category : node.name,
                shape: 'rect',
                actionType: 'Vue-node',
                nodeDetailSchema: node,
              },
              $event,
            )
          "
        >
          <!--        {{node}}-->
          <NodeTemplate
            :label="node.node_type === 'meta' ? node.category : node.name"
            :icon="node.icon"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="逻辑节点">
        <!--        <div class="tab-pane py-2" v-for="(node, index) in nodeList().logical" :key="index"-->
        <!--             @mousedown="startDrag(-->
        <!--            {-->
        <!--              label: node.category,-->
        <!--              shape: 'rect',-->
        <!--              actionType: 'Vue-node',-->
        <!--              nodeDetailSchema: node-->
        <!--            },-->
        <!--            $event-->
        <!--          )"-->
        <!--        >-->
        <!--          &lt;!&ndash;        {{node}}&ndash;&gt;-->
        <!--          <NodeTemplate :label="node.category"-->
        <!--                        :icon="node.icon"/>-->
        <!--        </div>-->
        待添加
      </a-tab-pane>
      <a-tab-pane key="4" tab="插件节点">
        <!--        <div class="tab-pane py-2" v-for="(node, index) in nodeList().logical" :key="index"-->
        <!--             @mousedown="startDrag(-->
        <!--            {-->
        <!--              label: node.category,-->
        <!--              shape: 'rect',-->
        <!--              actionType: 'Vue-node',-->
        <!--              nodeDetailSchema: node-->
        <!--            },-->
        <!--            $event-->
        <!--          )"-->
        <!--        >-->
        <!--          &lt;!&ndash;        {{node}}&ndash;&gt;-->
        <!--          <NodeTemplate :label="node.category"-->
        <!--                        :icon="node.icon"/>-->
        <!--        </div>-->
        待添加
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

  const graph: any = inject('graph');
  const showNodeEditModal: any = inject('showNodeEditModal');
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
  // watch(() => props.nodes, (n) => {
  //   console.log("NodesBar ===> init", n, props.nodes)
  // })

  function startDrag(currentTarget, e) {
    console.log('currentTarget:', currentTarget, e);
    const { actionType, shape, label, nodeDetailSchema } = currentTarget;
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
          nodeDetailParams: { task: {} },
        });
        showNodeEditModal.value = false;
        break;
      default:
        break;
    }
    const node = graph.value.createNode(json);
    if (!data.freeze) data.dnd.start(node, e);
    console.log('startDrag', currentTarget, node);
  }

  function mouseupHandle(currentTarget, e) {
    console.log('mouseupHandle', currentTarget, e);
  }
  function mousedownHandle(currentTarget, e) {
    console.log('mousedownHandle', currentTarget, e);
  }

  function initDnd() {
    data.dnd = new Addon.Dnd({
      target: graph.value,
      validateNode() {
        return true;
      },
    });
  }

  watch(
    () => graph.value,
    (n) => {
      console.log('graph value', n);
      initDnd();
    },
    { deep: true },
  );
</script>

<style scoped></style>
