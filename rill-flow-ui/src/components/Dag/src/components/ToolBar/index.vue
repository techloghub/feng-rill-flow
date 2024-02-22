<template>
  <div class="bar">
    <a-tooltip placement="bottom">
      <template #title>
        <span>清除 (Cmd + D)</span>
      </template>
      <a-button name="delete" @click="handleClick" class="item-space" size="small">
        delete
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>导出 (Cmd + P)</span>
      </template>
      <a-button name="toJSON" @click="handleClick" class="item-space" size="small">
        toJSON
      </a-button>
    </a-tooltip>
    <a-tooltip placement="bottom">
      <template #title>
        <span>save</span>
      </template>
      <a-button name="save" @click="handleClick" class="item-space" size="small"> save</a-button>
    </a-tooltip>
    <DagShow @register="register1" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useModal } from '@/components/Modal';
  import DagShow from '@/components/Dag/src/components/ToolBar/DagShow.vue';
  import { transferDagJson, transferDagYaml } from '@/components/Dag/src/common/graphTransform';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import { storeToRefs } from 'pinia';

  export default defineComponent({
    name: 'Index',
    components: { DagShow },
    props: { methods: { type: Object } },
    setup: function (props) {
      const provideGraph = useProvideGraph();
      const { graphRef } = storeToRefs(provideGraph);

      const [register1, { openModal: openModal1 }] = useModal();

      const handleClick = (event: Event) => {
        // const { graph } = FlowGraph;
        const name = (event.currentTarget as any).name!;
        console.log('event', name, event);

        switch (name) {
          case 'save':
            let newDagDetail1 = transferDagJson(graphRef.value);
            let yamlData1 = transferDagYaml(graphRef.value);

            props.methods?.submitDag(
              {
                business_id: newDagDetail1.workspace,
                feature_name: newDagDetail1.dagName,
                alias: newDagDetail1?.alias,
              },
              yamlData1,
            );
            console.log(
              'event save',
              newDagDetail1,
              newDagDetail1.workspace,
              newDagDetail1.dagName,
              props.methods,
            );
            break;
          case 'toJSON':
            console.log('toJSON====>', graphRef.value, graphRef.value);
            let newDagDetail = transferDagJson(graphRef.value);

            console.log('toJSON====> newDagDetail ', graphRef.value, newDagDetail);
            let yamlData = transferDagYaml(graphRef.value);

            openModal1(true, { yaml: yamlData, json: JSON.stringify(newDagDetail) });

            break;
          default:
            break;
        }
      };

      return {
        handleClick,
        openModal1,
        register1,
      };
    },
  });
</script>

<style lang="less" scoped>
  .bar {
    margin-right: 16px;
  }

  .item-space {
    margin-left: 16px;
  }
</style>
