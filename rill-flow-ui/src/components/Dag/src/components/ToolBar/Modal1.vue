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
        readonly="true"
      />
      <hr />
      <CodeEditor
        class="json flex-auto w-64"
        v-model:value="value1"
        :mode="modeValue1"
        readonly="true"
      />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  export default defineComponent({
    components: { BasicModal, CodeEditor },
    setup() {
      const modeValue = ref<MODE>(MODE.JSON);
      const modeValue1 = ref<MODE>(MODE.JSON);
      const value = ref({});
      const value1 = ref({});
      const oldString = ref();
      const newString = ref();

      const [register] = useModalInner((data) => {
        console.log('xxxx', data);
        value.value = data.yaml;
        value1.value = data.json;
        newString.value = data.newString;
        oldString.value = data.oldString;
        console.log('xxxx value.value', value.value);
      });

      return { register, modeValue, modeValue1, value, value1, newString, oldString };
    },
  });
</script>
<style scoped>
  .empty-tips {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
