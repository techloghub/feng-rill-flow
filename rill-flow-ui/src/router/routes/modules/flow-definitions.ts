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
  ],
};

export default flowDefinitions;
