<template>
  <div>
    <config-grid v-if="type === 'grid' || type === 'edge'" />
    <config-node v-if="type === 'node'" />
  </div>
</template>

<script lang="ts" setup>
  import ConfigGrid from './ConfigGrid/index.vue';
  import ConfigNode from './ConfigNode/index.vue';
  import { ref, inject, onMounted, provide } from 'vue';
  import moment from 'moment';
  import { RILL_CATEGORY } from '@/components/Dag';
  import {useProvideGraph} from "@/components/Dag/src/store/graph";
  import {storeToRefs} from "pinia";

  // const dagInfo: any = inject('dagInfo');
  // const graph: any = inject('graph');

  const provideGraph = useProvideGraph();
  const { graphRef } = storeToRefs(provideGraph);

  const nodeDetail: any = ref('nodeDetail');
  const type = ref('grid');

  onMounted(() => {
    graphRef.value.on('blank:click', () => {
      type.value = 'grid';
    });

    graphRef.value.on('cell:click', ({ cell }) => {
      console.log('cell:click', cell);
      let nodeDetailNew = cell.store.data.data.executionDetail;
      type.value = cell.isNode() ? 'node' : 'edge';
      let nodeInfo;
      if (type.value === 'edge') {
        return;
      }
      const category = cell.store.data.data.executionDetail.category;
      nodeInfo = cell.store.data.data.executionDetail.task;
      let status = cell.store.data.data.executionDetail.status;
      switch (category) {
        case RILL_CATEGORY.FOREACH:
          // nodeInfo = cell.attrs.nodeDetail.task;
          nodeDetail.value = {
            name: nodeInfo.name,
            status: status,
            category: nodeInfo.category,
            iterationMapping: JSON.stringify(nodeInfo?.iterationMapping),
            tolerance: nodeInfo?.tolerance + '',
          };
          break;
        case RILL_CATEGORY.RETURN:
          // nodeInfo = cell.attrs.nodeDetail.task;
          nodeDetail.value = {
            name: nodeInfo.name,
            status: status,
            category: nodeInfo.category,
            inputMappings: JSON.stringify(nodeInfo?.inputMappings),
            conditions: JSON.stringify(nodeInfo?.conditions),
            tolerance: nodeInfo?.tolerance + '',
          };
          break;
        case RILL_CATEGORY.PASS:
          // nodeInfo = cell.attrs.nodeDetail.task;
          nodeDetail.value = {
            name: nodeInfo.name,
            status: status,
            category: nodeInfo.category,
            inputMappings: JSON.stringify(nodeInfo?.inputMappings),
            outputMappings: JSON.stringify(nodeInfo?.outputMappings),
            tolerance: nodeInfo?.tolerance + '',
          };
          break;
        case RILL_CATEGORY.SUSPENSE:
          // nodeInfo = cell.attrs.nodeDetail.task;
          nodeDetail.value = {
            name: nodeInfo.name,
            status: status,
            category: nodeInfo.category,
            inputMappings: JSON.stringify(nodeInfo?.inputMappings),
            outputMappings: JSON.stringify(nodeInfo?.outputMappings),
            interruptions: JSON.stringify(nodeInfo?.interruptions),
            timeline: JSON.stringify(nodeInfo?.timeline),
            conditions: JSON.stringify(nodeInfo?.conditions),
            tolerance: nodeInfo?.tolerance + '',
          };
          break;
        case RILL_CATEGORY.CHOICE:
          // nodeInfo = cell.attrs.nodeDetail.task;
          nodeDetail.value = {
            name: nodeInfo.name,
            status: status,
            category: nodeInfo.category,
            inputMappings: JSON.stringify(nodeInfo?.inputMappings),
            outputMappings: JSON.stringify(nodeInfo?.outputMappings),
            choices: JSON.stringify(nodeInfo?.choices),
            tolerance: nodeInfo?.tolerance + '',
          };
          break;
        default:
          // nodeInfo = cell.store.data.data.executionDetail;
          // if (
          //   cell.attrs.nodeDetail?.contains_sub !== undefined &&
          //   !cell.attrs.nodeDetail?.contains_sub
          // ) {
          //   nodeDetail.value = {
          //     name: nodeInfo.name,
          //     status: nodeInfo?.status,
          //     start_time:
          //       nodeInfo?.task?.invoke_msg?.invoke_time_infos !== undefined &&
          //       nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.start_time !== undefined
          //         ? moment(nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.start_time).format(
          //             'YYYY-MM-DD HH:mm:ss',
          //           )
          //         : null,
          //     end_time:
          //       nodeInfo?.task?.invoke_msg?.invoke_time_infos !== undefined &&
          //       nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.end_time !== undefined
          //         ? moment(nodeInfo?.task?.invoke_msg?.invoke_time_infos[0]?.end_time).format(
          //             'YYYY-MM-DD HH:mm:ss',
          //           )
          //         : null,
          //     context: JSON.stringify(nodeInfo?.invoke_msg?.input),
          //     result: nodeInfo?.invoke_msg?.msg,
          //     resourceName: nodeInfo?.task?.resourceName,
          //     tolerance: nodeInfo?.task?.tolerance + '',
          //     pattern: nodeInfo?.task?.pattern,
          //     inputMappings: JSON.stringify(nodeInfo?.task?.inputMappings),
          //     outputMappings: JSON.stringify(nodeInfo?.task?.outputMappings),
          //     category: nodeInfo?.task?.category,
          //     resourceProtocol:
          //       nodeInfo?.task?.resourceProtocol === undefined ||
          //       nodeInfo?.task?.resourceProtocol === ''
          //         ? nodeInfo?.task?.resourceName?.split(':')[0]
          //         : nodeInfo?.task?.resourceProtocol,
          //     parameters: nodeInfo?.task?.parameters,
          //     inputMsg: JSON.stringify(nodeInfo?.invoke_msg?.input),
          //     outputMsg: JSON.stringify(nodeInfo?.invoke_msg?.output),
          //   };
          //   return;
          // }
          nodeDetail.value = {
            name: nodeDetailNew.name,
            status: status,
            start_time:
              nodeDetailNew?.invoke_msg?.invoke_time_infos !== undefined &&
              nodeDetailNew?.invoke_msg?.invoke_time_infos[0]?.start_time !== undefined
                ? moment(nodeDetailNew?.invoke_msg?.invoke_time_infos[0]?.start_time).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
            end_time:
              nodeDetailNew?.invoke_msg?.invoke_time_infos !== undefined &&
              nodeDetailNew?.invoke_msg?.invoke_time_infos[0]?.end_time !== undefined
                ? moment(nodeDetailNew?.invoke_msg?.invoke_time_infos[0]?.end_time).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
            context: JSON.stringify(nodeDetailNew?.invoke_msg?.input),
            result: nodeDetailNew?.invoke_msg?.msg,
            resourceName: nodeInfo.task?.resourceName,
            tolerance: nodeInfo?.tolerance + '',
            pattern: nodeInfo?.pattern,
            inputMappings: JSON.stringify(nodeInfo?.inputMappings),
            outputMappings: JSON.stringify(nodeInfo?.outputMappings),
            category: nodeInfo?.category,
            resourceProtocol:
              nodeInfo?.resourceProtocol === undefined || nodeInfo?.resourceProtocol === ''
                ? nodeInfo?.resourceName?.split(':')[0]
                : nodeInfo?.resourceProtocol,
            parameters: nodeInfo?.parameters,
            inputMsg: JSON.stringify(nodeDetailNew?.invoke_msg?.input),
            outputMsg: JSON.stringify(nodeDetailNew?.invoke_msg?.output),
          };
      }
    });
  });

  // provide('dagInfo', dagInfo);
  provide('nodeDetail', nodeDetail);
</script>

<style lang="less" scoped></style>
