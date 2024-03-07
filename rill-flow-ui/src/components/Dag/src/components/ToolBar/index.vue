<template>
  <div class="bar">
    <a-tooltip placement="bottom">
      <template #title>
        <span>编辑DAG的基本信息</span>
      </template>
      <a-button name="edit" @click="handleClick" class="item-space" size="small">编辑</a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>保存已修改内容</span>
      </template>
      <a-button name="save" @click="handleClick" class="item-space" size="small">保存</a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>提交Dag的测试任务</span>
      </template>
      <a-button name="submitDagTestRun" @click="handleClick" class="item-space" size="small">测试</a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>DagYaml信息</span>
      </template>
      <a-button name="toJSON" @click="handleClick" class="item-space" size="small">
        详情
      </a-button>
    </a-tooltip>

<!--    <a-tooltip placement="bottom">-->
<!--      <template #title>-->
<!--        <span>Dag任务提交参数结构</span>-->
<!--      </template>-->
<!--      <a-button name="updateDagInputSchema" @click="handleClick" class="item-space" size="small">参数schema</a-button>-->
<!--    </a-tooltip>-->

    <DagShow @register="registerDagShow" />
    <DagSave @register="registerDagSave" />
    <DagInputSchema @register="registerDagInputSchema" />
    <DagTestRun @register="registerDagTestRun" />
    <DagEdit @register="registerDagEdit" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, inject, toRaw, watch } from "vue";
  import { useModal } from '@/components/Modal';
  import DagShow from '@/components/Dag/src/components/ToolBar/DagShow.vue';
  import DagSave from '@/components/Dag/src/components/ToolBar/DagSave.vue';
  import DagInputSchema from '@/components/Dag/src/components/ToolBar/DagInputSchema.vue';
  import DagTestRun from '@/components/Dag/src/components/ToolBar/DagTestRun.vue';
  import DagEdit from '@/components/Dag/src/components/ToolBar/DagEdit.vue';
import {
  transferDagJson,
  transferDagYaml,
  transferJsonYaml
} from '@/components/Dag/src/common/graphTransform';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import { storeToRefs } from 'pinia';
  import { DagMetaInfo } from "@/components/Dag/src/models/global";
import { MODE } from "@/components/Dag";

const props = defineProps({
  methods: {
    type: Object,
  }
});

const provideGraph = useProvideGraph();
const { graphRef, dagMeta, oldDagInfo } = storeToRefs(provideGraph);
const showDagMetaEditModal: any = inject('showDagMetaEditModal');

const [registerDagShow, { openModal: openDagShowModal }] = useModal();
const [registerDagSave, { openModal: openDagSaveModal }] = useModal();
const [registerDagInputSchema, { openModal: openDagInputSchemaModal }] = useModal();
const [registerDagTestRun, { openModal: openDagTestRunModal }] = useModal();
const [registerDagEdit, { openModal: openDagDagEditModal }] = useModal();

const handleClick = (event: Event) => {
  // const { graph } = FlowGraph;
  const name = (event.currentTarget as any).name!;
  console.log('event', name, event);

  switch (name) {
    case 'save':
      openDagSaveModal(true, {method: props.methods?.submitDag });
      break;
    case 'edit':
      openDagDagEditModal(true, {method: props.methods?.submitDag });
      break;
    case 'toJSON':
      console.log('toJSON====>', graphRef.value, toRaw(dagMeta.value));
      let newDagDetail = transferDagJson(graphRef.value, dagMeta.value);

      console.log('toJSON====> newDagDetail ', graphRef.value, newDagDetail, oldDagInfo.value);
      let yamlData = transferDagYaml(graphRef.value, dagMeta.value);
      let oldData = transferJsonYaml(toRaw(oldDagInfo.value));
      // let oldData = transferJsonYaml(graphRef.value.options.meta.data);
      openDagShowModal(true, {
        yaml: yamlData,
        json: JSON.stringify(newDagDetail),
        newString: yamlData,
        oldString: oldData,
      });

      break;
    case 'updateDagInputSchema':
      console.log('updateDagInputSchema====>', graphRef.value, dagMeta.value, toRaw(dagMeta.value));
      openDagInputSchemaModal(true, toRaw(dagMeta.value));
      break;
    case 'submitDagTestRun':
      console.log('updateDagInputSchema====>', graphRef.value, dagMeta.value, toRaw(dagMeta.value), props.methods.executeDag);
      openDagTestRunModal(true, {data: dagMeta.value, executeDagMethod: props.methods.executeDag});;
      break;
    default:
      break;
  }
};


watch(
  () => showDagMetaEditModal.value,
  () => {
    openDagDagEditModal(showDagMetaEditModal.value);

    console.log('Dag showDagMetaEditModal', showDagMetaEditModal.value);
  },
  { deep: true },
);


  // export default defineComponent({
  //   name: 'Index',
  //   components: { DagShow, DagSave, DagInputSchema, DagTestRun, DagEdit },
  //   props: { methods: { type: Object } },
  //   setup: function (props) {
  //     const provideGraph = useProvideGraph();
  //     const { graphRef, dagMeta, oldDagInfo } = storeToRefs(provideGraph);
  //
  //     const [registerDagShow, { openModal: openDagShowModal }] = useModal();
  //     const [registerDagSave, { openModal: openDagSaveModal }] = useModal();
  //     const [registerDagInputSchema, { openModal: openDagInputSchemaModal }] = useModal();
  //     const [registerDagTestRun, { openModal: openDagTestRunModal }] = useModal();
  //     const [registerDagEdit, { openModal: openDagDagEditModal }] = useModal();
  //
  //     const handleClick = (event: Event) => {
  //       // const { graph } = FlowGraph;
  //       const name = (event.currentTarget as any).name!;
  //       console.log('event', name, event);
  //
  //       switch (name) {
  //         case 'save':
  //           openDagSaveModal(true, {method: props.methods?.submitDag });
  //           break;
  //         case 'edit':
  //           openDagDagEditModal(true, {method: props.methods?.submitDag });
  //           break;
  //         case 'toJSON':
  //           console.log('toJSON====>', graphRef.value, toRaw(dagMeta.value));
  //           let newDagDetail = transferDagJson(graphRef.value, dagMeta.value);
  //
  //           console.log('toJSON====> newDagDetail ', graphRef.value, newDagDetail, oldDagInfo.value);
  //           let yamlData = transferDagYaml(graphRef.value, dagMeta.value);
  //           let oldData = transferJsonYaml(toRaw(oldDagInfo.value));
  //           // let oldData = transferJsonYaml(graphRef.value.options.meta.data);
  //           openDagShowModal(true, {
  //             yaml: yamlData,
  //             json: JSON.stringify(newDagDetail),
  //             newString: yamlData,
  //             oldString: oldData,
  //           });
  //
  //           break;
  //         case 'updateDagInputSchema':
  //           console.log('updateDagInputSchema====>', graphRef.value, dagMeta.value, toRaw(dagMeta.value));
  //           openDagInputSchemaModal(true, toRaw(dagMeta.value));
  //           break;
  //         case 'submitDagTestRun':
  //           console.log('updateDagInputSchema====>', graphRef.value, dagMeta.value, toRaw(dagMeta.value), props.methods.executeDag);
  //           openDagTestRunModal(true, {data: dagMeta.value, executeDagMethod: props.methods.executeDag});;
  //           break;
  //         default:
  //           break;
  //       }
  //     };
  //
  //     return {
  //       handleClick,
  //       registerDagShow,
  //       registerDagSave,
  //       registerDagInputSchema,
  //       registerDagTestRun,
  //       registerDagEdit,
  //     };
  //   },
  // });
</script>

<style lang="less" scoped>
  .bar {
    margin-right: 16px;
  }

  .item-space {
    margin-top: 7px;
    margin-left: 16px;
  }
</style>
