<template>
  <div class="fixed inset-0 flex flex-col">
    <header class="shrink-0 h-10 px-2 flex items-center border-b bg-slate-100">
      Threejs Shader Notes
    </header>

    <main class="flex-1 h-0 flex flex-col">
      <div class="p-2 flex items-center gap-2 text-sm">
        <div class="flex items-center gap-2 w-fit">
          <label for="shader-lib-key"> Shader Lib </label>
          <select
            id="shader-lib-key"
            class="h-6 px-2 rounded bg-slate-100 appearance-none outline-2 outline-transparent transition-all hover:outline-indigo-300"
            :value="ctx.libKey"
            @change="handleLibChange"
          >
            <option v-for="key in ShaderLibKeys" :key="key" :value="key">{{ key }}</option>
          </select>
        </div>

        <div class="flex rounded overflow-hidden">
          <div
            class="px-1.5 leading-6 cursor-pointer transition-colors"
            :class="
              ctx.shaderType === 'vertexShader'
                ? 'text-white bg-amber-600'
                : 'text-slate-600 bg-slate-100'
            "
            @click="ctx.setShaderType('vertexShader')"
          >
            vertex
          </div>

          <div
            class="px-1.5 leading-6 cursor-pointer transition-colors"
            :class="
              ctx.shaderType === 'fragmentShader'
                ? 'text-white bg-lime-600'
                : 'text-slate-600 bg-slate-100'
            "
            @click="ctx.setShaderType('fragmentShader')"
          >
            fragment
          </div>
        </div>

        <div
          class="px-2 rounded cursor-pointer text-slate-400 leading-6 transition-colors relative after:absolute after:inset-0 after:rounded after:border after:transition-colors"
          :class="{ ' text-white bg-violet-600 after:border-transparent': ctx.expanded }"
          @click="ctx.setExpanded(!ctx.expanded)"
        >
          Expand #include
        </div>
      </div>

      <hr class="border-t-0 border-b" />

      <div class="p-2 flex-1 h-0 overflow-x-auto">
        <div class="flex items-start gap-4 w-fit h-full">
          <div class="shrink-0 max-h-full overflow-y-scroll">
            <div class="text-xs whitespace-pre cursor-default table">
              <div
                v-for="line in ctx.focusedShaderLines"
                :key="line.row"
                class="table-row hover:bg-stone-100"
              >
                <span class="table-cell px-[1ch] text-slate-400 text-right select-none">{{
                  line.row
                }}</span>
                <CodeLine :line="line" @include="ctx.setFocusedChunkName" />
              </div>
              <div class="table-row hover:bg-stone-100">
                <span class="table-cell px-[1ch] text-slate-400 text-right">
                  {{ ctx.focusedShaderLines.length + 1 }}
                </span>
              </div>
            </div>
          </div>

          <!-- <div class="shrink-0 basis-56 w-56 text-xs -my-0.5 py-0.5 px-1 rounded border">
            测试信息
          </div> -->

          <div class="shrink-0 max-h-full overflow-y-scroll">
            <div class="text-xs whitespace-pre cursor-default table">
              <div
                v-for="line in ctx.focusedChunkLines"
                :key="line.row"
                class="table-row hover:bg-stone-100"
              >
                <span class="table-cell px-[1ch] text-slate-400 text-right select-none">{{
                  line.row
                }}</span>
                <p class="table-cell px-[1ch]">
                  <span v-if="line.indent">{{ ''.padStart(line.indent * 2, ' ') }}</span>
                  <span
                    v-for="(token, i) in line.tokens"
                    :class="token.type || token.name"
                    :key="i"
                  >
                    {{ token.raw }}
                  </span>
                </p>
              </div>
              <div class="table-row hover:bg-stone-100">
                <span class="table-cell px-[1ch] text-slate-400 text-right">
                  {{ ctx.focusedChunkLines.length + 1 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShaderLibKeys } from '@/lib/index'

import CodeLine from '@/components/code/Line.vue'
import { useContextStore } from '@/stores/context'

const ctx = useContextStore()

const handleLibChange = (e: Event) => {
  const select = e.target as HTMLSelectElement
  ctx.setLibKey(select.value)
}
</script>

<style lang="sass">
.chunk
  color: #31027e
.include
  color: #7343c2
.type
  color: #109fcd
  font-style: italic
.keyword
  color: #ac0cb8
.symbol
  color: #f252d6
.number
  color: #0084f1
.semi
  color: #c5c9d1
.braces, .parenthesis
  color: #aec329
.bracket
  color: #2556de
.remarks
  color: #8f8d8d
.function-name
  color: #639618
.define
  color: #5830d8
.ctrl
  color: #de1a6c
</style>
