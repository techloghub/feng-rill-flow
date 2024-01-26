<template>
  <div>
    <config-grid v-if="type === 'grid' || type === 'edge'"/>
    <config-node v-if="type === 'node'"/>
  </div>
</template>

<script lang="ts" setup>
import ConfigGrid from './ConfigGrid/index.vue';
import ConfigNode from './ConfigNode/index.vue';
import {ref, inject, onMounted, watch, provide} from 'vue';
import moment from 'moment';
import {RILL_CATEGORY} from "@/components/Dag";
import {Cell} from "@antv/x6";

const dagInfo: any = inject('dagInfo');
const graph: any = inject('graph');

const nodeDetail: any = ref('nodeDetail');
const type = ref('grid');
const showNodeEditModal: any = inject('showNodeEditModal');
const showNodeSchema: any = inject('showNodeSchema');

onMounted(() => {
  graph.value.on('blank:click', () => {
    type.value = 'grid';
  });

  // graph.value.on('cell:contextmenu', ({cell}) => {
  //   showNodeEditModal.value = false
  //   console.log("cell:contextmenu", cell)
  //   showNodeEditModal.value = true
  //   showNodeSchema.value = cell
  //
  // });
  //
  // graph.value.on('cell:mouseup', ({cell}) => {
  //   console.log("cell:mouseup", cell)
  // });
  //
  // graph.value.on('node:dblclick', ({node}) => {
  //   console.log("node:dblclick", node)
  //   showNodeEditModal.value = true
  // });
  //
  // graph.value.on('cell:change:*', (args: {
  //   cell: Cell
  //   key: string   // 通过 key 来确定改变项
  //   current: any  // 当前值，类型根据 key 指代的类型确定
  //   previous: any // 改变之前的值，类型根据 key 指代的类型确定
  //   options: any  // 透传的 options
  // }) => {
  //   // console.log("cell:change", args)
  //   console.log("cell:change", args)
  //
  //   if (args.key === 'label') {
  //     args.cell.setAttrs({ label: { text: args.current } })
  //   } else if (args.key === 'nodeDetailParams') {
  //     console.log("cell:change nodeDetailParams", args)
  //   }
  // })
  //
  // graph.value.on('node:added', ({ node }) => {
  //   const { x, y } = node.position()
  //   showNodeEditModal.value = true
  //   console.log("node:added", x, y, node, showNodeEditModal.value)
  //   showNodeSchema.value = node
  //
  //   // showNodeSchema.value = {
  //   //   "type": node.store.data.nodeDetailSchema?.node_type,
  //   //   "data": node.store.data.nodeDetailSchema?.node_type === 'meta' ?  node.store.data.nodeDetailSchema?.fields : node.store.data.nodeDetailSchema
  //   // }
  // })
  //
  // graph.value.on('cell:mousedown', ({cell}) => {
  //   console.log("cell:mousedown", cell)
  // });
  graph.value.on('cell:click', ({cell}) => {
    console.log("cell:click", cell)
    type.value = cell.isNode() ? 'node' : 'edge';
    let nodeInfo
    if(type.value === 'edge') {
      return;
    }

    switch (cell.attrs.nodeDetail?.task?.category) {
      case RILL_CATEGORY.FOREACH:
        nodeInfo = cell.attrs.nodeDetail.task
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": cell.attrs.nodeDetail.status,
          "category": nodeInfo.category,
          "iterationMapping": JSON.stringify(nodeInfo?.iterationMapping),
          "tolerance": nodeInfo?.tolerance + "",
        };
        break;
      case RILL_CATEGORY.RETURN:
        nodeInfo = cell.attrs.nodeDetail.task
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": cell.attrs.nodeDetail.status,
          "category": nodeInfo.category,
          "inputMappings": JSON.stringify(nodeInfo?.inputMappings),
          "conditions": JSON.stringify(nodeInfo?.conditions),
          "tolerance": nodeInfo?.tolerance + "",
        };
        break;
      case RILL_CATEGORY.PASS:
        nodeInfo = cell.attrs.nodeDetail.task
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": cell.attrs.nodeDetail.status,
          "category": nodeInfo.category,
          "inputMappings": JSON.stringify(nodeInfo?.inputMappings),
          "outputMappings": JSON.stringify(nodeInfo?.outputMappings),
          "tolerance": nodeInfo?.tolerance + "",
        };
        break;
      case RILL_CATEGORY.SUSPENSE:
        nodeInfo = cell.attrs.nodeDetail.task
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": cell.attrs.nodeDetail.status,
          "category": nodeInfo.category,
          "inputMappings": JSON.stringify(nodeInfo?.inputMappings),
          "outputMappings": JSON.stringify(nodeInfo?.outputMappings),
          "interruptions": JSON.stringify(nodeInfo?.interruptions),
          "timeline": JSON.stringify(nodeInfo?.timeline),
          "conditions": JSON.stringify(nodeInfo?.conditions),
          "tolerance": nodeInfo?.tolerance + "",
        };
        break;
      case RILL_CATEGORY.CHOICE:
        nodeInfo = cell.attrs.nodeDetail.task
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": cell.attrs.nodeDetail.status,
          "category": nodeInfo.category,
          "inputMappings": JSON.stringify(nodeInfo?.inputMappings),
          "outputMappings": JSON.stringify(nodeInfo?.outputMappings),
          "choices": JSON.stringify(nodeInfo?.choices),
          "tolerance": nodeInfo?.tolerance + "",
        };
        break;
      default:
        if(cell.attrs.nodeDetail?.contains_sub !== undefined && !cell.attrs.nodeDetail?.contains_sub) {
          nodeInfo = cell.attrs.nodeDetail
          nodeDetail.value = {
            "name": nodeInfo.name,
            "status": nodeInfo?.status,
            "start_time": (nodeInfo?.task?.invoke_msg?.invoke_time_infos!== undefined && nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.start_time !== undefined) ? moment(nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.start_time).format('YYYY-MM-DD HH:mm:ss') : null,
            "end_time": (nodeInfo?.task?.invoke_msg?.invoke_time_infos!== undefined && nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.end_time !== undefined) ? moment(nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.end_time).format('YYYY-MM-DD HH:mm:ss') : null,
            "context": JSON.stringify(nodeInfo?.invoke_msg?.input),
            "result": nodeInfo?.invoke_msg?.msg,
            "resourceName": nodeInfo?.task?.resourceName,
            "tolerance": nodeInfo?.task?.tolerance + "",
            "pattern": nodeInfo?.task?.pattern,
            "inputMappings": JSON.stringify(nodeInfo?.task?.inputMappings),
            "outputMappings": JSON.stringify(nodeInfo?.task?.outputMappings),
            "category": nodeInfo?.task?.category,
            "resourceProtocol": (nodeInfo?.task?.resourceProtocol === undefined || nodeInfo?.task?.resourceProtocol === "") ? nodeInfo?.task?.resourceName?.split(":")[0] : nodeInfo?.task?.resourceProtocol,
            "parameters": nodeInfo?.task?.parameters,
            "inputMsg": JSON.stringify(nodeInfo?.invoke_msg?.input),
            "outputMsg": JSON.stringify(nodeInfo?.invoke_msg?.output)
          };
          return;
        }
        nodeInfo = cell.attrs.nodeDetail
        nodeDetail.value = {
          "name": nodeInfo.name,
          "status": nodeInfo?.status,
          "start_time": (nodeInfo?.invoke_msg?.invoke_time_infos!== undefined && nodeInfo?.invoke_msg?.invoke_time_infos[0]?.start_time !== undefined) ? moment(nodeInfo?.invoke_msg?.invoke_time_infos[0]?.start_time).format('YYYY-MM-DD HH:mm:ss') : null,
          "end_time": (nodeInfo?.invoke_msg?.invoke_time_infos!== undefined && nodeInfo?.invoke_msg?.invoke_time_infos[0]?.end_time !== undefined) ? moment(nodeInfo?.invoke_msg?.invoke_time_infos[0]?.end_time).format('YYYY-MM-DD HH:mm:ss') : null,
          "context": JSON.stringify(nodeInfo?.invoke_msg?.input),
          "result": nodeInfo?.invoke_msg?.msg,
          "resourceName": nodeInfo?.resourceName,
          "tolerance": nodeInfo?.tolerance + "",
          "pattern": nodeInfo?.pattern,
          "inputMappings": JSON.stringify(nodeInfo?.inputMappings),
          "outputMappings": JSON.stringify(nodeInfo?.outputMappings),
          "category": nodeInfo?.category,
          "resourceProtocol": (nodeInfo?.resourceProtocol === undefined || nodeInfo?.resourceProtocol === "") ? nodeInfo?.resourceName?.split(":")[0] : nodeInfo?.resourceProtocol,
          "parameters": nodeInfo?.parameters,
          "inputMsg": JSON.stringify(nodeInfo?.invoke_msg?.input),
          "outputMsg": JSON.stringify(nodeInfo?.invoke_msg?.output)
        };
    }
  });
});


provide('dagInfo', dagInfo);
provide('nodeDetail', nodeDetail);

</script>

<style lang="less" scoped>
</style>
