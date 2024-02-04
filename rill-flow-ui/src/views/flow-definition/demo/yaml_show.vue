<template>
  <code-diff
    :old-string="oldString"
    :new-string="newString"
    language="yaml"
    output-format="side-by-side"
    filename="文件名"
    theme="light"
  ></code-diff>
</template>

<script lang="ts" setup>
import {ref} from "vue";
// https://github.com/Shimada666/v-code-diff/blob/master/README-zh.md
const oldString = ref("name: Release\n" +
  "\n" +
  "on:\n" +
  "  push:\n" +
  "    branches:\n" +
  "      - master\n" +
  "\n" +
  "jobs:")

const newString = ref("name: Release\n" +
  "\n" +
  "on:\n" +
  "  push:\n" +
  "    branches:\n" +
  "      - alpha\n" +
  "\n" +
  "jobs:\n" +
  "  # job")
</script>

<style scoped>

</style>
