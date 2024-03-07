<template>
  <Dag
    :mode="MODE.DEFINITION"
    :readonly="false"
    :showNodeGroups="true"
    :nodesBar="nodesBar"
    :showToolBar="true"
    :dagMeta="dagMeta"
    :methods="methods"
    :nodeGroups="nodeGroups"
    :dagInfo="dagInfo"
    :actionType="actionType"
  />
</template>

<script lang="ts" setup>
  import { Dag, MODE } from '/@/components/Dag';
  import { onMounted, ref } from "vue";

  import {
    flowDefinitionDetailApi,
    flowGroupDetailApi,
    getFlowExecuteApi,
    getFlowSubmitApi,
  } from '@/api/table';
  import { useRoute } from 'vue-router';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGo } from '@/hooks/web/usePage';
  import { useI18n } from '@/hooks/web/useI18n';

  const route = useRoute();
  const { createMessage } = useMessage();
  const go = useGo();
  const { t } = useI18n();

  const nodeGroups = ref({
    basicNodes: [],
    plugins: [],
  });
  const dagInfo = ref();
  const dagMeta = ref();
  const nodesBar = ref();
  const actionType = ref('edit');
  const submitDag = (params, yamlData) => {
    getFlowSubmitApi(params, yamlData).then((res) => {
      console.log('SubmitDag getFlowSubmitApi', params, yamlData, res);
      if (res.ret) {
        createMessage.success('保存成功.descriptor_id:' + res.descriptor_id);
        go({
          path: '/flow-definition/detail',
          query: {
            descriptor_id: res.descriptor_id,
          },
        });
      } else {
        createMessage.error('保存失败');
      }
    });
  };

  const executeDag = (params, data) => {
    getFlowExecuteApi(params, data).then((res) => {
      console.log('executeDag getFlowExecuteApi', params, data, res);
      if (res.execution_id) {
        createMessage.success('测试任务提交成功.execution_id:' + res.execution_id);
        go({
          path: '/flow-instance/detail',
          query: {
            execution_id: res.execution_id,
          },
        });
      } else {
        createMessage.error('测试任务提交成功');
      }
    });
  };

  const methods = ref({});
  methods.value = {
    submitDag,
    executeDag,
  };
  const open = ref<boolean>(false);

  const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
  };

  onMounted(async () => {
    console.log('xxx', route.query);
    const metaNodeResult = await flowGroupDetailApi({ node_type: 'meta'});
    nodeGroups.value.basicNodes = metaNodeResult.data;
    const templateNodeResult = await flowGroupDetailApi({ node_type: 'template' });
    nodeGroups.value.plugins = templateNodeResult.data;

    if (route.query.type === 'create') {
      dagInfo.value = {};
      actionType.value = 'create';
      return;
    }
    const response = await flowDefinitionDetailApi({ id: route.query.descriptor_id }, {});
    if (response.tasks === '{}') {
      createMessage.error(t('routes.flow.instances.graph.execution_detail_expire_message'));
      go('/flow-instance/list');
      return;
    }

    response.id = route.query.descriptor_id;
    dagInfo.value = response;
    console.log('===> dagInfo', nodeGroups.value);
  });

</script>
