<template>
  <div ref="container"></div>
</template>

<script lang="ts" setup>
import {inject, ref, watch} from 'vue';
import '@antv/x6-vue-shape';
import {MODE} from "../../typing";
import {initGraph} from "@/components/FlowGraph";

const container = ref(null);

const graph: any = inject('graph');
const initGraphParams: any = inject('initGraphParams');
const initGraphStatus: any = inject('initGraphStatus');
const dagInfo: any = inject('dagInfo');
const nodeGroups: any = inject('nodeGroups');

const props = defineProps({
  mode: {
    type: String as PropType<MODE>,
    default: MODE.INSTANCE,
  },
  readonly: {
    type: Boolean,
  },
  showNodeGroups: {
    type: Boolean,
  }
})

watch(() => dagInfo.value, (n) => {
  console.log("graph props", props.mode, props.readonly, props.showNodeGroups)
  let tasks
  if(props.mode === MODE.DEFINITION) {
    tasks=dagInfo.value?.data?.tasks
  } else if (props.mode === MODE.INSTANCE) {
    tasks=dagInfo.value?.tasks
  }
  graph.value = initGraph(tasks, nodeGroups.value, container.value, props.readonly)
  initGraphStatus.value = true
}, {deep: true})

</script>
