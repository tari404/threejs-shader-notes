<template>
  <ul>
    <li v-for="key in ShaderLibKeys" :key="key">
      {{ key }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ShaderChunk, ShaderLib } from 'three'

const ShaderChunkKeys: (keyof typeof ShaderChunk)[] = []
for (const key in ShaderChunk) {
  ShaderChunkKeys.push(key as keyof typeof ShaderChunk)
}

const ShaderLibKeys: (keyof typeof ShaderLib)[] = []
for (const key in ShaderLib) {
  ShaderLibKeys.push(key as keyof typeof ShaderLib)
}
</script>
