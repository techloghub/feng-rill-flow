<template>
  <div class="wrap">
    <div class="content flex ">
      <div id="stencil" class="sider w-60" v-if="showNodeGroups"></div>
      <div class="panel flex-auto w-50">
        <!--流程图工具栏-->
        <div class="toolbar">
          <ToolBar v-if="showToolbar"/>
        </div>
        <!--流程图画板-->
        <graph
          :mode="mode"
          :readonly="readonly"
          :showNodeGroups="showNodeGroups"
        />
      </div>
      <!--右侧工具栏-->
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
</template>

<script lang="ts" setup>
import {ref, onMounted, provide, watch, inject, Ref} from 'vue';
import './reset/reset.less';
import './reset/global.css';
import './index.less';
import ConfigPanel from './components/ConfigPanel/index.vue';
import Graph from './components/Graph/index.vue';
import ToolBar from './components/ToolBar/index.vue';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons-vue';

import {useMessage} from '@/hooks/web/useMessage';
import {useGo} from "@/hooks/web/usePage";
import {useI18n} from '@/hooks/web/useI18n';
import {useRoute} from 'vue-router'
import {MODE} from "@/components/Dag";

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
  showNodeGroups: {
    type: Boolean,
  },
  showToolBar: {
    type: Boolean,
  },
})

onMounted( () => {
  console.log("Dag ===> init", graph.value, props.mode)
});

provide('graph', graph);
provide('initGraphStatus', initGraphStatus);
provide('initGraphParams', initGraphParams);

const toggleConfigPanel = () => {
  isConfigPanelShow.value = !isConfigPanelShow.value;
};

</script>
