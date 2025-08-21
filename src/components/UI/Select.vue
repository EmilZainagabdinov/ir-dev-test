<template>
  <SelectRoot v-model="model" @update:model-value="update">
    <SelectTrigger class="selectTrigger">
      <SelectValue class="selectValue" :placeholder="placeholder" />
      <SelectIcon class="selectIcon" asChild>
        <ChevronDown :size="18" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal to="body">
      <SelectContent class="selectContent" position="popper" :side-offset="5">
        <SelectItem class="selectItem" :value="null" :disabled="model === ''">
          <SelectItemText> Clear </SelectItemText>
          <SelectItemIndicator />
        </SelectItem>
        <SelectItem v-for="option in options" :key="option.value" class="selectItem" :value="option.value">
          <SelectItemText>{{ option.label }}</SelectItemText>
          <SelectItemIndicator />
        </SelectItem>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  AcceptableValue,
} from 'reka-ui';
import { ChevronDown } from 'lucide-vue-next';
import { SelectOptions } from '@/components/UI/types.ts';

const model = defineModel();
const { options, placeholder = 'Select...' } = defineProps<{ options: SelectOptions[], placeholder?: string }>();

const update = (payload: AcceptableValue) => {
  if (payload === null) {
    model.value = '';
  }
};
</script>

<style>
.selectTrigger {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 40px;
  width: 160px;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #bebebe;
  padding: 0 12px;
  font-weight: 500;
  color: #2d2d2d;
  &[data-state='open'] {
    outline: solid 3px #a0a0a0;
    & .selectIcon {
      transform: rotate(-180deg);
    }
  }
}
.selectValue {
  color: #2d2d2d;
  font-size: 18px;
  flex: 1;
  text-align: left;
}
.selectIcon {
  flex-shrink: 0;
  transition: transform 200ms linear;
  & * {
    stroke: #2d2d2d;
  }
}
.selectContent {
  background-color: #f0f0f0;
  border: 1px solid #bebebe;
  border-radius: 8px;
  padding: 6px;
  width: var(--reka-select-trigger-width);
}
.selectItem {
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  color: #2d2d2d;
  &[data-disabled] {
    color: #a0a0a0;
    &:hover {
      background-color: transparent;
      cursor: default;
    }
  }
  &:hover {
    background-color: #dcdcdc;
  }
  &:focus-visible {
    outline: none;
  }
}
</style>
