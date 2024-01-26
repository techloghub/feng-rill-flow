<template>
  <Dag
    :mode="MODE.DEFINITION"
    :readonly="false"
    :showNodeGroups="true"
    :nodesBar="nodesBar"
    :showToolBar="true"
    :dagMeta="dagMeta"
  />
</template>

<script lang="ts" setup>
import { Dag, MODE } from '/@/components/Dag'
import {onMounted, provide, ref, watch} from "vue";
const route = useRoute()
const { createMessage } = useMessage();
const go = useGo();
const {t} = useI18n();

import {flowDefinitionDetailApi, flowGroupDetailApi} from "@/api/table";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {useGo} from "@/hooks/web/usePage";
import {useI18n} from "@/hooks/web/useI18n";
import Modal2 from './Modal2.vue';
import { useModal } from '/@/components/Modal';
import {dagInfoDemo} from "@/components/Dag/src/components/NodesBar/data";

const nodeGroups = ref();
const dagInfo = ref();
const dagMeta = ref();
const nodesBar = ref();

const [register, {openModal: openModal}] = useModal();


const handleClick = (event: Event) => {
  console.log("handleClick")
  openModal(true, {})
}
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};


onMounted(async () => {
  console.log("xxx", route.query)
  if (route.query.type === 'create') {
    dagMeta.value = route.query.dagMeta
  } else if (route.query.descriptor_id === undefined) {
    createMessage.warn(t('routes.flow.instances.graph.execution_detail_none_message'));
    go("/flow-definition/list");
    return;
  }

  const response = await flowDefinitionDetailApi({"id": route.query.descriptor_id}, {});
  console.log("xxx", response)
  if (response.tasks === '{}') {
    createMessage.error(t('routes.flow.instances.graph.execution_detail_expire_message'));
    go("/flow-instance/list");
    return;
  }

  const groups = await flowGroupDetailApi();
  dagInfo.value = response
  // dagInfo.value = dagInfoDemo()
  // dagInfo.value = {}
  console.log("===> dagInfo", response, dagInfoDemo())
  nodeGroups.value = groups.data
  nodesBar.value = groups.data
});

watch(() => dagInfo.value, (n) => {
  console.log("dagInfo watch", dagInfo.value, nodesBar.value)
}, {deep: true})

provide("nodeGroups", nodeGroups)
provide("dagInfo", dagInfo)

</script>
