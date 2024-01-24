<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    :helpMessage="['提示1', '提示2']"
  >
    Modal Info.
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '/@/components/Modal';


</script>
