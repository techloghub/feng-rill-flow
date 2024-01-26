<template>
  <div ref="container"></div>
</template>

<script lang="ts" setup>
import {inject, ref, toRaw, watch} from 'vue';
import '@antv/x6-vue-shape';
import {MODE, RILL_CATEGORY} from "../../typing";
import {initGraph} from "@/components/FlowGraph";
import {Cell} from "@antv/x6";
import moment from "moment";

const container = ref(null);

const graph: any = inject('graph');
const initGraphParams: any = inject('initGraphParams');
const initGraphStatus: any = inject('initGraphStatus');
const dagInfo: any = inject('dagInfo');
const nodeGroups: any = inject('nodeGroups');
const showNodeEditModal: any = inject('showNodeEditModal');
const showNodeSchema: any = inject('showNodeSchema');

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
  console.log("graph props", props.mode, props.readonly, props.showNodeGroups, toRaw(dagInfo.value))
  let tasks
  if(props.mode === MODE.DEFINITION) {
    tasks=dagInfo.value?.data?.tasks
  } else if (props.mode === MODE.INSTANCE) {
    tasks=dagInfo.value?.tasks
  }
  graph.value = initGraph(toRaw(tasks), nodeGroups.value, container.value, props.readonly)
  console.log("getSelectedCells:",graph.value.getSelectedCells())


  graph.value.on('cell:contextmenu', ({cell}) => {
    showNodeEditModal.value = false
    console.log("cell:contextmenu", cell)
    showNodeEditModal.value = true
    showNodeSchema.value = cell

  });

  graph.value.on('cell:mouseup', ({cell}) => {
    console.log("cell:mouseup", cell)
  });

  graph.value.on('node:dblclick', ({node}) => {
    console.log("node:dblclick", node)
    showNodeEditModal.value = true
  });

  graph.value.on('cell:change:*', (args: {
    cell: Cell
    key: string   // 通过 key 来确定改变项
    current: any  // 当前值，类型根据 key 指代的类型确定
    previous: any // 改变之前的值，类型根据 key 指代的类型确定
    options: any  // 透传的 options
  }) => {
    // console.log("cell:change", args)
    console.log("cell:change", args)

    if (args.key === 'label') {
      args.cell.setAttrs({ label: { text: args.current } })
    } else if (args.key === 'nodeDetailParams') {
      console.log("cell:change nodeDetailParams", args)
    }
  })

  graph.value.on('node:added', ({ node }) => {
    const { x, y } = node.position()
    showNodeEditModal.value = true
    console.log("node:added", x, y, node, showNodeEditModal.value)
    showNodeSchema.value = node
  })

  graph.value.on('cell:mousedown', ({cell}) => {
    console.log("cell:mousedown", cell)
  });

  initGraphStatus.value = true
}, {deep: true})

</script>
