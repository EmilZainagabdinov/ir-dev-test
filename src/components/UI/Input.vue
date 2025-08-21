<template>
  <div class="inputFieldWrapper">
    <icon v-if="icon" :size="18" class="inputFieldIcon" />
    <input class="inputField" v-bind="$attrs" type="text" :placeholder="placeholder" v-model="model" />
  </div>
</template>

<script setup lang="ts">
import { LucideIcon } from 'lucide-vue-next';
import { InputWidth } from '@/components/UI/types.ts';

defineOptions({ inheritAttrs: false });
const { icon = null, width = '100%' } = defineProps<{ placeholder?: string; icon?: LucideIcon; width?: InputWidth }>();
const model = defineModel();
</script>

<style scoped>
.inputFieldWrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  width: v-bind(width);
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #bebebe;
  padding: 0 12px;
  &:focus-within {
    outline: solid 3px #a0a0a0;
  }
}
.inputField {
  all: unset;
  min-width: 0;
  width: 100%;
  color: #2d2d2d;
  font-weight: 500;
  &::placeholder {
    color: #a0a0a0;
  }
}
.inputFieldIcon {
  flex-shrink: 0;
  & * {
    stroke: #646469;
  }
}
</style>
