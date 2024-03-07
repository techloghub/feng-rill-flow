<template>
  <div ref="container"></div>
</template>

<script lang="ts" setup>
  import { inject, ref, toRaw, watch } from 'vue';
  import '@antv/x6-vue-shape';
  import { MODE } from '../../typing';
  import { initGraph } from '@/components/FlowGraph';
  import { Cell } from '@antv/x6';
  import { useTemplateNodeReferenceCache } from '../../store/dagStore';
  import { storeToRefs } from 'pinia';
  import { getGraphNodeTemplateReferenceMap } from '@/components/Dag/src/components/Graph/methods';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';

  const templateNodeReferenceCache = useTemplateNodeReferenceCache();
  const { setTemplateNodeReferenceMap } = templateNodeReferenceCache;

  const container = ref(null);

  // const graph: any = inject('graph');
  const initGraphStatus: any = inject('initGraphStatus');
  const dagInfo: any = inject('dagInfo');
  const nodeGroups: any = inject('nodeGroups');
  const showNodeEditModal: any = inject('showNodeEditModal');
  const showNodeSchema: any = inject('showNodeSchema');
  const showDagMetaEditModal: any = inject('showDagMetaEditModal');

  const props = defineProps({
    mode: {
      type: String as PropType<MODE>,
      default: MODE.INSTANCE,
    },
    actionType: {
      type: String,
    },
    readonly: {
      type: Boolean,
    },
    showNodeGroups: {
      type: Boolean,
    },
    nodeGroups: {
      type: Object,
    },
    dagInfo: {
      type: Object,
    }
  });

  watch(
    () => props.dagInfo,
    () => {
      console.log(
        'graph props',
        props.mode,
        props.readonly,
        props.showNodeGroups,
        props.dagInfo,
        toRaw(props.dagInfo),
        toRaw(props.nodeGroups)
      );
      let tasks;
      let dagDetail;
      if (props.mode === MODE.DEFINITION) {
        tasks = props.dagInfo?.data?.tasks;
        dagDetail = props.dagInfo;
      } else if (props.mode === MODE.INSTANCE) {
        tasks = props.dagInfo?.tasks;
        dagDetail = props.dagInfo;
      }

      const referenceMap = getGraphNodeTemplateReferenceMap(props.dagInfo?.tasks);
      console.log('graph props dagRefererce', props.dagInfo, referenceMap, toRaw(props.nodeGroups));
      // TODO 测试完成后 该行代码删除
      setTemplateNodeReferenceMap(referenceMap);

      initGraph(toRaw(tasks), toRaw(props.nodeGroups), container.value, props.readonly, dagDetail, props.mode);
      console.log('graph init actionType',props.actionType,props.actionType === 'create')
      if (props.actionType === 'create') {
        // 弹窗toolbar中的编辑dag基本信息
        showDagMetaEditModal.value = false;
        showDagMetaEditModal.value = true;
      }
      const provideGraph = useProvideGraph();
      const { graphRef } = storeToRefs(provideGraph);
      if (graphRef.value == undefined) {
        return;
      }
      console.log('getSelectedCells:', graphRef.value.getSelectedCells());

      graphRef.value.on('node:dblclick', ({ cell }) => {
        showNodeEditModal.value = false;
        console.log('node:dblclick', cell);
        showNodeEditModal.value = true;
        showNodeSchema.value = cell;
      });
      graphRef.value.on('node:contextmenu', ({ node }) => {
        console.log('node:contextmenu', node);
      });

      graphRef.value.on('node:removed', ({ node }) => {
        console.log('node:removed', node);
      });

      graphRef.value.on(
        'cell:change:*',
        (args: {
          cell: Cell;
          key: string; // 通过 key 来确定改变项
          current: any; // 当前值，类型根据 key 指代的类型确定
          previous: any; // 改变之前的值，类型根据 key 指代的类型确定
          options: any; // 透传的 options
        }) => {
          if (args.key === 'label') {
            args.cell.setAttrs({ label: { text: args.current } });
            args.cell.getData().tooltip = args.current;
            console.log('cell:change label', args.cell, args.cell.getData());
          } else if (args.key === 'nodeDetailParams') {
            console.log('cell:change nodeDetailParams', args);
          } else if (args.key === 'templateNodeDetailParams') {
            console.log('cell:change templateNodeDetailParams', args);
          } else if (args.key === 'nodeDelete') {
            console.log('cell:change nodeDelete', args, graphRef.value);
            // 节点删除
            args.cell.remove();
          } else if (args.key === 'taskYamlData') {
            console.log('cell:change taskYamlData', args);
          }
        },
      );

      graphRef.value.on('node:added', ({ node }) => {
        const { x, y } = node.position();
        console.log('node:added', x, y, node, showNodeEditModal.value);
        showNodeSchema.value = node;
      });

      initGraphStatus.value = true;
    },
    { deep: true },
  );


</script>
