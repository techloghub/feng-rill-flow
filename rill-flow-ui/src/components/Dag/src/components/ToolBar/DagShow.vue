<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="详情"
    width="70%"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <div class="context flex">
      <CodeEditor
        class="yaml flex-auto w-64"
        v-model:value="value"
        :mode="modeValue"
        :readonly="true"
      />
      <hr />
      <CodeEditor
        class="json flex-auto w-64"
        v-model:value="value1"
        :mode="modeValue1"
        :readonly="true"
      />
    </div>
<!--    <div>-->
<!--      <code-diff-->
<!--        :old-string="oldString"-->
<!--        :new-string="newString"-->
<!--        language="yaml"-->
<!--        output-format="side-by-side"-->
<!--        filename="文件名"-->
<!--        theme="light"-->
<!--      ></code-diff>-->
<!--    </div>-->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  const modeValue = ref<MODE>(MODE.JSON);
  const modeValue1 = ref<MODE>(MODE.JSON);
  const value = ref({});
  const value1 = ref({});
  const oldString = ref();
  const newString = ref();

  const [register] = useModalInner((data) => {
    value.value = data.yaml;
    value1.value = data.json;
    newString.value = data.newString;
    oldString.value = data.oldString;
  });
</script>
