import { ShaderChunk, ShaderLib } from 'three'

export type ShaderChunkKey = keyof typeof ShaderChunk
export type ShaderLibKey = keyof typeof ShaderLib

export const ShaderChunkKeys: ShaderChunkKey[] = []
for (const key in ShaderChunk) {
  ShaderChunkKeys.push(key as ShaderChunkKey)
}

export const ShaderLibKeys: ShaderLibKey[] = []
for (const key in ShaderLib) {
  ShaderLibKeys.push(key as ShaderLibKey)
}
