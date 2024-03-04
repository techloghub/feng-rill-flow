<template>
  <Dag
    :mode="MODE.INSTANCE"
    :readonly="true"
    :showNodeGroups="false"
    :showToolBar="false"
    :showRightTool="true"
    :nodeGroups="nodeGroups"
    :dagInfo="dagInfo"
  />
</template>

<script lang="ts" setup>
  import { Dag, MODE } from '/@/components/Dag'
  import {onMounted, provide, ref} from "vue";
  import {flowGroupDetailApi, flowInstanceDetailApi} from "@/api/table";
  import {useRoute} from "vue-router";
  import {useMessage} from "@/hooks/web/useMessage";
  import {useGo} from "@/hooks/web/usePage";
  import {useI18n} from "@/hooks/web/useI18n";

  const route = useRoute()
  const { createMessage } = useMessage();
  const go = useGo();
  const {t} = useI18n();
  const nodeGroups = ref({
    basicNodes: [],
    plugins: [],
  });
  const dagInfo = ref();
  console.log("flow-instance start ====>")
  onMounted(async () => {
    console.log("xxx instance", route.query)
    if (route.query.execution_id === undefined) {
      createMessage.warn(t('routes.flow.instances.graph.execution_detail_none_message'));
      go("/flow-instance/list");
      return;
    }
    const response = await flowInstanceDetailApi({"id": route.query.execution_id}, {});
    if (response.tasks === '{}') {
      createMessage.error(t('routes.flow.instances.graph.execution_detail_expire_message'));
      go("/flow-instance/list");
      return;
    }
    dagInfo.value = response;

    const metaNodeResult = await flowGroupDetailApi({ node_type: 'meta'});
    nodeGroups.value.basicNodes = metaNodeResult.data;
    const templateNodeResult = await flowGroupDetailApi({ node_type: 'template' });
    nodeGroups.value.plugins = templateNodeResult.data;
  });

  // provide("nodeGroups", nodeGroups)
  // provide("dagInfo", dagInfo)

</script>
