<template>
  <div class="wrap">
    <div class="content flex">
      <div class="sider w-75" v-if="showNodeGroups">
        <NodesBar :nodes="nodeGroups" />
      </div>

      <div class="panel flex-auto w-50">
        <!--流程图工具栏-->
        <div class="toolbar">
          <ToolBar v-if="showToolBar" :methods="methods" />
        </div>
        <!--流程图画板-->
        <graph :mode="mode" :readonly="readonly" :showNodeGroups="showNodeGroups" :nodeGroups="nodeGroups" :dagInfo="dagInfo" :actionType="actionType" />
      </div>
      <!--右侧工具栏-->
      <div v-if="showRightTool">
        <div class="config w-100" v-if="isConfigPanelShow">
          <config-panel v-if="initGraphStatus" :nodeGroups="nodeGroups" :dagInfo="dagInfo"/>
        </div>
        <div class="show-config">
          <span class="button" @click="toggleConfigPanel">
            <template v-if="isConfigPanelShow">
              <MenuUnfoldOutlined />
            </template>
            <template v-else>
              <MenuFoldOutlined />
            </template>
          </span>
        </div>
      </div>
    </div>
    <div>
      <TemplateNodeModal @register="templateNodeRegister" />
      <MetaNodeModal @register="metaNodeRegister" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide, watch, inject } from 'vue';
  import './reset/reset.less';
  import './reset/global.css';
  import './index.less';
  import ConfigPanel from './components/ConfigPanel/index.vue';
  import Graph from './components/Graph/index.vue';
  import ToolBar from './components/ToolBar/index.vue';
  import NodesBar from './components/NodesBar/index.vue';
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
  import MetaNodeModal from './components/Graph/MetaNodeModal.vue';
  import TemplateNodeModal from './components/Graph/TemplateNodeModal.vue';

  import { useMessage } from '@/hooks/web/useMessage';
  import { useGo } from '@/hooks/web/usePage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';
  import { MODE } from '@/components/Dag';
  import { useModal } from '@/components/Modal';
  import { useTemplateNodeReferenceCache } from './store/dagStore';

  const templateNodeReferenceCache = useTemplateNodeReferenceCache();

  const { setTemplateNodeReferenceMap } = templateNodeReferenceCache;
  const route = useRoute();
  const { createMessage } = useMessage();
  const go = useGo();
  const { t } = useI18n();
  const isConfigPanelShow = ref(true);

  const initGraphStatus = ref(false);
  const initGraphParams = ref();

  console.log('Dag ===> start');
  const props = defineProps({
    mode: {
      type: String as PropType<MODE>,
      default: MODE.INSTANCE,
      validator(value: any) {
        // 这个值必须匹配下列字符串中的一个
        return Object.values(MODE).includes(value);
      },
    },
    actionType: {
      type: String,
    },
    readonly: {
      type: Boolean,
    },
    showToolBar: {
      type: Boolean,
    },
    showNodeGroups: {
      type: Boolean,
    },
    showRightTool: false,
    nodeGroups: {
      type: Object,
    },
    methods: {
      type: Object,
    },
    dagInfo: {
      type: Object,
    }
  });

  const showNodeEditModal = ref<boolean>(false);
  const showDagMetaEditModal = ref<boolean>(false);
  const showNodeSchema = ref({});

  const [templateNodeRegister, { openModal: openTemplateNodeModal }] = useModal();
  const [metaNodeRegister, { openModal: openMetaNodeModal }] = useModal();

  provide('initGraphStatus', initGraphStatus);
  provide('initGraphParams', initGraphParams);
  provide('showNodeEditModal', showNodeEditModal);
  provide('showDagMetaEditModal', showDagMetaEditModal);
  provide('showNodeSchema', showNodeSchema);
  provide('dagInfo', props.dagInfo);

  watch(
    () => showNodeEditModal.value,
    () => {
      const type = showNodeSchema.value.store.data.nodeDetailSchema?.node_type;
      if (type === 'template') {
        openTemplateNodeModal(showNodeEditModal.value, showNodeSchema.value);
      } else {
        openMetaNodeModal(showNodeEditModal.value, showNodeSchema.value);
      }
      console.log('Dag showNodeEditModal', showNodeEditModal.value, showNodeSchema.value, type);
    },
    { deep: true },
  );

  const toggleConfigPanel = () => {
    isConfigPanelShow.value = !isConfigPanelShow.value;
  };
</script>
