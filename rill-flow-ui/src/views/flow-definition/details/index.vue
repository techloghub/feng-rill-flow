<template>
  <Dag
    :mode="MODE.DEFINITION"
    :readonly="false"
    :showNodeGroups="true"
    :nodesBar="nodesBar"
    :showToolBar="true"
    :dagMeta="dagMeta"
    :methods="methods"
  />
</template>

<script lang="ts" setup>
  import { Dag, MODE } from '/@/components/Dag';
  import { onMounted, provide, ref, watch } from 'vue';

  import { flowDefinitionDetailApi, flowGroupDetailApi, getFlowSubmitApi } from '@/api/table';
  import { useRoute } from 'vue-router';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGo } from '@/hooks/web/usePage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { dagInfoDemo } from '@/components/Dag/src/components/NodesBar/data';

  const route = useRoute();
  const { createMessage } = useMessage();
  const go = useGo();
  const { t } = useI18n();

  const nodeGroups = ref();
  const dagInfo = ref();
  const dagMeta = ref();
  const nodesBar = ref();

  const [register, { openModal: openModal }] = useModal();

  const submitDag = (params, yamlData) => {
    getFlowSubmitApi(params, yamlData).then((res) => {
      console.log('SubmitDag getFlowSubmitApi', params, yamlData, res);
    });
  };

  const methods = ref({});
  methods.value = {
    submitDag,
  };
  const open = ref<boolean>(false);

  const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
  };

  onMounted(async () => {
    console.log('xxx', route.query);
    if (route.query.type === 'create') {
      dagMeta.value = route.query.dagMeta;
    } else if (route.query.descriptor_id === undefined) {
      createMessage.warn(t('routes.flow.instances.graph.execution_detail_none_message'));
      go('/flow-definition/list');
      return;
    }

    const response = await flowDefinitionDetailApi({ id: route.query.descriptor_id }, {});
    console.log('xxx', response);
    if (response.tasks === '{}') {
      createMessage.error(t('routes.flow.instances.graph.execution_detail_expire_message'));
      go('/flow-instance/list');
      return;
    }

    const groups = await flowGroupDetailApi();
    response.id = route.query.descriptor_id;
    dagInfo.value = response;
    console.log('===> dagInfo', response, dagInfoDemo());
    nodeGroups.value = groups.data;
    nodesBar.value = groups.data;
  });

  watch(
    () => dagInfo.value,
    () => {
      console.log('dagInfo watch', dagInfo.value, nodesBar.value);
    },
    { deep: true },
  );

  provide('nodeGroups', nodeGroups);
  provide('dagInfo', dagInfo);
</script>
