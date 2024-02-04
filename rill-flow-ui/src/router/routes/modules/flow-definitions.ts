import {LAYOUT} from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import {ExceptionEnum} from "@/enums/exceptionEnum";
const ExceptionPage = () => import('/@/views/sys/exception/Exception.vue');

const flowDefinitions: { redirect: string; path: string; component: () => Promise<any>; children: { path: string; component: () => Promise<any>; meta: { title: string }; name: string }[]; meta: { icon: string; title: string }; name: string } = {
  path: '/flow-definition',
  name: 'flow-definition',
  component: LAYOUT,
  redirect: '/flow-definition/list',
  meta: {
    icon: 'tabler:chart-dots',
    title: t('routes.flow.definitions.record'),
    orderNo: 100,
  },
  children: [
    {
      path: 'list',
      name: 'FlowDefinitionPage',
      meta: {
        title: t('routes.flow.definitions.list'),
        open: true
      },
      component: () => import('/@/views/flow-definition/index.vue'),
    },
    {
      path: 'detail',
      name: 'FlowQueryPage',
      component: () => import('@/views/flow-definition/details/index.vue'),
      meta: {
        title: t('routes.flow.definitions.detail'),
        hideMenu: true,
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/flow-definition/list',
      },
    },
    {
      path: 'node-templetes',
      name: 'FlowNodeTempletes',
      component: () => import('@/views/flow-definition/node-templetes/index.vue'),
      meta: {
        title: t('routes.flow.definitions.node_templetes'),
        open: true
      },
    },
    {
      path: 'json-schema',
      name: 'FlowJsonSchema',
      component: () => import('@/views/flow-definition/json-schema/index.vue'),
      meta: {
        title: t('routes.flow.definitions.json_schema'),
        open: true
      },
    },
    {
      path: 'formily',
      name: 'Formily',
      // component: () => import('@/views/flow-definition/formily/index.vue'),
      // component: () => import('@/views/flow-definition/formily/index_tree.vue'),
      // component: () => import('@/views/flow-definition/formily/index_tab.vue'),
      // component: () => import('@/views/flow-definition/demo/yaml_show.vue'),
      component: () => import('@/views/flow-definition/demo/code_editor.vue'),
      // component: () => import('@/views/flow-definition/formily/index_array.vue'),
      // component: () => import('@/views/flow-definition/formily/switch.vue'),
      meta: {
        title: t('routes.flow.definitions.formily'),
        open: true
      },
    },
    {
      path: 'demo',
      name: 'Demo',
      // component: () => import('@/views/flow-definition/formily/index.vue'),
      // component: () => import('@/views/flow-definition/formily/index_tree.vue'),
      // component: () => import('@/views/flow-definition/formily/index_tab.vue'),
      // component: () => import('@/views/flow-definition/formily/index_array.vue'),
      // component: () => import('@/views/flow-definition/formily/switch.vue'),
      meta: {
        title: "demo",
        open: true
      },
      children: [
        {
          path: 'yaml_show',
          name: 'YamlShow',
          meta: {
            title: "yamlShow",
          },
          component: () => import('@/views/flow-definition/demo/yaml_show.vue'),
        },
        {
          path: 'codeEditor',
          name: 'codeEditor',
          meta: {
            title: "codeEditor",
          },
          component: () => import('@/views/flow-definition/demo/code_editor.vue'),
        },
      ]
    },
  ],
};

export default flowDefinitions;
