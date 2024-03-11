<template>
  <p class="table-cell px-[1ch]" :class="{ 'cursor-pointer': line.type }" @click="handleClick">
    <span v-if="line.indent">{{ ''.padStart(line.indent * 2, ' ') }}</span>
    <span v-for="(token, i) in line.tokens" :class="token.type || token.name" :key="i">
      {{ token.raw }}
    </span>
  </p>
</template>

<script lang="ts" setup>
import type { ShaderChunkKey } from '@/lib'
import type { Line } from '@/lib/scanner'

const props = defineProps<{ line: Line }>()
const emit = defineEmits<{
  (e: 'include', chunk: ShaderChunkKey): void
}>()

const handleClick = () => {
  if (props.line.type === 'include') {
    const rawChunkName = props.line.tokens.find((t) => t.name === 'chunk')?.raw
    if (rawChunkName) {
      const chunkName = rawChunkName.slice(1, -1) as ShaderChunkKey
      emit('include', chunkName)
    }
  }
}
</script>
