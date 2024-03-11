import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ShaderChunk, ShaderLib } from 'three'

import { ShaderLibKeys, type ShaderChunkKey, type ShaderLibKey } from '@/lib'
import { parse } from '@/lib/scanner'

type ShaderType = 'vertexShader' | 'fragmentShader'

export const useContextStore = defineStore('context', () => {
  const libKey = ref<ShaderLibKey>(ShaderLibKeys[0])
  const setLibKey = (key: ShaderLibKey) => {
    libKey.value = key
  }

  const focusedShaderLib = computed(() => {
    return ShaderLib[libKey.value]
  })

  const shaderType = ref<ShaderType>('vertexShader')
  const setShaderType = (type: ShaderType) => {
    shaderType.value = type
  }

  const focusedShader = computed(() => {
    return focusedShaderLib.value[shaderType.value]
  })
  const focusedShaderLines = computed(() => {
    return parse(focusedShader.value)
  })

  const expanded = ref(false)
  const setExpanded = (val: boolean) => {
    expanded.value = val
  }

  const expandedShader = computed(() => {
    return focusedShader.value
      .split('\n')
      .map((line) => {
        const matched = line.match(/^(\t*)#include <(\w+)>$/)
        if (matched) {
          const indent = matched[1]
          const chunkName = matched[2] as ShaderChunkKey
          const chunk = ShaderChunk[chunkName]
          if (chunk) {
            return chunk
              .split('\n')
              .map((cline) => indent + cline)
              .join('\n')
          }
        }
        return line
      })
      .join('\n')
  })

  const focusedChunkName = ref<ShaderChunkKey>()
  const setFocusedChunkName = (name: ShaderChunkKey) => {
    focusedChunkName.value = name
  }

  const focusedChunk = computed(() => {
    return focusedChunkName.value ? ShaderChunk[focusedChunkName.value] : undefined
  })

  const propChunkCode = computed(() => {
    return (expanded.value ? expandedShader.value : focusedChunk.value) || ''
  })

  const focusedChunkLines = computed(() => {
    return parse(propChunkCode.value)
  })

  return {
    libKey,
    setLibKey,
    shaderType,
    setShaderType,
    focusedShaderLines,
    expanded,
    setExpanded,
    setFocusedChunkName,
    focusedChunkLines
  }
})
