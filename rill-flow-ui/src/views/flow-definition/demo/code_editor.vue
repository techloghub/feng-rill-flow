<template>
  <PageWrapper title="代码编辑器组件示例" contentFullHeight fixedHeight contentBackground>
    <template #extra>
      <a-space size="middle">
        <a-button @click="showData" type="primary">获取数据</a-button>
      </a-space>
    </template>
    <CodeEditor v-model:value="value" :mode="modeValue" readonly="true" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref, unref, h } from 'vue';
import { CodeEditor, JsonPreview, MODE } from '/@/components/CodeEditor';
import { PageWrapper } from '/@/components/Page';
import { Radio, Space, Modal } from 'ant-design-vue';

const jsonData =
  '{"name":"BeJson","url":"http://www.xxx.com","page":88,"isNonProfit":true,"address":{"street":"科技园路.","city":"江苏苏州","country":"中国"},"links":[{"name":"Google","url":"http://www.xxx.com"},{"name":"Baidu","url":"http://www.xxx.com"},{"name":"SoSo","url":"http://www.xxx.com"}]}';

export default defineComponent({
  components: {
    CodeEditor,
    PageWrapper,
    RadioButton: Radio.Button,
    RadioGroup: Radio.Group,
    ASpace: Space,
  },
  setup() {
    const modeValue = ref<MODE>(MODE.JSON);
    const value = ref(jsonData);


    function showData() {
      if (unref(modeValue) === 'application/json') {
        Modal.info({
          title: '编辑器当前值',
          content: h(JsonPreview, { data: JSON.parse(value.value) }),
        });
      } else {
        Modal.info({ title: '编辑器当前值', content: value.value });
      }
    }

    return { value, modeValue, showData };
  },
});
</script>
