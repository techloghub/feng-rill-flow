<template>
  <div class="blockText">
    <a-typography-paragraph>
      <pre>{{ contextMessage }}</pre>
    </a-typography-paragraph>
  </div>
</template>

<script>
import {Typography} from "ant-design-vue";
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export default {
  name: "BlockText",
  props: ['context'], // Declare the 'label' prop,
  components: {
    ATypographyParagraph: Typography.Paragraph,
  },
  data() {
    return {}
  },
  computed: {
    contextMessage() {
      const { t } = useI18n();
      if (this.context!== undefined) {
        return this.context
      } else {
        return t('routes.flow.instances.graph.grid.schema.error_result_default_msg');
      }
    }
  }

}

</script>

<style scoped  lang="less" >
.blockText {
  width: 100%;
}
</style>
