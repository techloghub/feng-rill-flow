<template>
  <div class="wrap">
    <div class="content flex ">
      <div class="sider w-75" v-if="showNodeGroups" >
        <NodesBar :nodes="nodesBar" ></NodesBar>
      </div>

      <div class="panel flex-auto w-50">
        <!--流程图工具栏-->
        <div class="toolbar">
          <ToolBar v-if="showToolBar"/>
        </div>
        <!--流程图画板-->
        <graph
          :mode="mode"
          :readonly="readonly"
          :showNodeGroups="showNodeGroups"
        />
      </div>
      <!--右侧工具栏-->
      <div v-if="showRightTool">
        <div class="config w-100" v-if="isConfigPanelShow">
          <config-panel v-if="initGraphStatus"/>
        </div>
        <div class="show-config">
         <span class="button" @click="toggleConfigPanel">
             <template v-if="isConfigPanelShow">
                <MenuUnfoldOutlined/>
              </template>
              <template v-else>
                <MenuFoldOutlined/>
              </template>
         </span>
        </div>
      </div>
    </div>
    <div>
      <Modal2 @register="register" />
      <Modal3 @register="register3" />
    </div>
  </div>

</template>

<script lang="ts" setup>
import {ref, onMounted, provide, watch, inject, Ref} from 'vue';
import './reset/reset.less';
import './reset/global.css';
import './index.less';
import ConfigPanel from './components/ConfigPanel/index.vue';
import Graph from './components/Graph/index.vue';
import ToolBar from './components/ToolBar/index.vue';
import NodesBar from './components/NodesBar/index.vue';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons-vue';
import Modal2 from './components/Graph/Modal2.vue';
import Modal3 from './components/Graph/Modal3.vue';

import {useMessage} from '@/hooks/web/useMessage';
import {useGo} from "@/hooks/web/usePage";
import {useI18n} from '@/hooks/web/useI18n';
import {useRoute} from 'vue-router'
import {MODE} from "@/components/Dag";
import {initGraph} from "@/components/FlowGraph";
import {useModal} from "@/components/Modal";

const route = useRoute()
const {createMessage} = useMessage();
const go = useGo();
const {t} = useI18n();
const isConfigPanelShow = ref(true);

const initGraphStatus = ref(false);
const initGraphParams = ref();
const graph = ref();

const dagInfo: any = inject('dagInfo');
const nodeGroups: any = inject('nodeGroups');
console.log("Dag ===> start")
const props = defineProps({
  mode: {
    type: String as PropType<MODE>,
    default: MODE.INSTANCE,
    validator(value: any) {
      // 这个值必须匹配下列字符串中的一个
      return Object.values(MODE).includes(value);
    },
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
  nodesBar: {
    type: Object,
  },
});


const showNodeEditModal = ref<boolean>(false);
const showNodeSchema = ref({});

const [register, {openModal: openModal}] = useModal();
const [register3, {openModal: openModal3}] = useModal();

provide('graph', graph);
provide('initGraphStatus', initGraphStatus);
provide('initGraphParams', initGraphParams);
provide('showNodeEditModal', showNodeEditModal);
provide('showNodeSchema', showNodeSchema);


watch(() => showNodeEditModal.value, (n) => {

  const type = showNodeSchema.value.store.data.nodeDetailSchema?.node_type
  if (type === 'template') {
    openModal(showNodeEditModal.value, showNodeSchema.value)
  } else {
    // TODO 调试节点临时默认为原数据节点
  // } else if (type === 'meta') {
    openModal3(showNodeEditModal.value, showNodeSchema.value)
  }
  console.log("Dag showNodeEditModal", showNodeEditModal.value, showNodeSchema.value, type)

}, {deep: true})


const toggleConfigPanel = () => {
  isConfigPanelShow.value = !isConfigPanelShow.value;
};

</script>
