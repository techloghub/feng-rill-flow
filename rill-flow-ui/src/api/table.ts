import {defHttp} from '@/utils/http/axios';
import {
  DemoParams,
  InstanceDetailParam
} from './demo/model/tableModel';

enum Api {
  INSTANCE_LIST = '/flow/bg/get_execution_ids.json?current=1',
  DEFINITION_LIST = '/flow/bg/get_descriptor_ids.json?current=1',
  TEMPLATE_LIST = '/template/get_task_templates.json',
  UPDATE_TEMPLATE_LIST = '/template/update_task_template.json',
  CREATE_TEMPLATE_LIST = '/template/create_task_template.json',
  BUSINESS_LIST = '/flow/bg/get_business_options.json',
  FEATURE_LIST = '/flow/bg/manage/descriptor/get_feature.json',
  INSTANCE_DETAIL = '/flow/bg/get_execution.json',
  DEFINITION_DETAIL = '/flow/bg/get_descriptor.json',
  FLOW_GROUP = '/flow/bg/edit/dag_op_groups.json',
  FLOW_VERSIONS = '/flow/bg/manage/descriptor/get_version.json',
}

/**
 * @description: Get sample list value
 */

export const instanceListApi = (params: DemoParams) =>
  defHttp.get({
    url: Api.INSTANCE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const definitionListApi = (params: DemoParams) =>
  defHttp.get({
    url: Api.DEFINITION_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const templateListApi = (params: DemoParams) =>
  defHttp.get({
    url: Api.TEMPLATE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const updateTemplateListApi = (params: any) =>
  defHttp.post({
    url: Api.UPDATE_TEMPLATE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const createTemplateListApi = (params: any) =>
  defHttp.post({
    url: Api.CREATE_TEMPLATE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const flowDefinitionDetailApi = (params: InstanceDetailParam) =>
  defHttp.get({
    url: Api.DEFINITION_DETAIL,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const flowInstanceDetailApi = (params: InstanceDetailParam) =>
  defHttp.get({
    url: Api.INSTANCE_DETAIL,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });


export const flowGroupDetailApi = () =>
  defHttp.get({
    url: Api.FLOW_GROUP,
  });

export const getBusinessIdsApi = () =>
  defHttp.get({
    url: Api.BUSINESS_LIST,
  });

export const getFeatureIdsApi = (params) =>
  defHttp.get({
    url: Api.FEATURE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getFlowVersionsApi = (params) =>
  defHttp.get({
    url: Api.FLOW_VERSIONS,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

