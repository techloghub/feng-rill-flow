import { defineStore } from 'pinia';
import {computed, ref, toRaw} from 'vue';

export const useTemplateNodeReferenceCache = defineStore('templateNodeReferenceMap', () => {
  const templateNodeReferenceMap = ref({ a: 'bbb' });
  const getTemplateNodeReferenceMap = computed(() => templateNodeReferenceMap);
  const getTemplateNodeReferenceByKey = (key) => {
    console.log("getTemplateNodeReferenceByKey", key, templateNodeReferenceMap, toRaw(templateNodeReferenceMap.value[key]))
    return toRaw(templateNodeReferenceMap.value[key]);
  };
  function setTemplateNodeReferenceMap(value) {
    templateNodeReferenceMap.value = value;
  }
  return {
    templateNodeReferenceMap,
    getTemplateNodeReferenceMap,
    setTemplateNodeReferenceMap,
    getTemplateNodeReferenceByKey,
  };
});
