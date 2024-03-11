const TestInput = `float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else`

type TokenName =
  | 'line'
  | 'semi'
  | 'indent'
  | 'space'
  | 'remarks'
  | 'symbol'
  | 'type'
  | 'keyword'
  | 'parenthesis'
  | 'bracket'
  | 'braces'
  | 'define'
  | 'chunk'
  | 'number'
  | 'word'

type Token = {
  name: TokenName
  type?: string
  raw: string
  sign: string
  pos: number
}

export type Line = {
  row: number
  indent: number
  tokens: Token[]
  sign: string
  type?: string
}

const rules: Record<TokenName, RegExp> = {
  line: /^\n/,
  semi: /^;/,
  indent: /^\t+/,
  space: /^ +/,
  remarks: /^\/\/.+(?=\n|$)/,
  symbol: /^(,|\.|=|\+|-|\*|\/|%|\||&|!|<|>|\?|:)+/,
  type: /^(void|float|int|bool|vec2|vec3|vec4|mat2|mat3|mat4|struct)(?=\W|$)/,
  keyword: /^(uniform|varying|const|highp|mediump|lowp|return|in|out)(?=\W|$)/,
  parenthesis: /^(\(|\))/,
  bracket: /^(\[|\])/,
  braces: /^(\{|\})/,
  define: /^#\w+/,
  chunk: /^<\w+>/,
  number: /^\d+(\.\d+)?(e(\+|-)?\d+)?/,
  word: /^[a-zA-Z_]\w*/
}

const tokenList: TokenName[] = [
  'line',
  'semi',
  'indent',
  'space',
  'define',
  'chunk',
  'remarks',
  'symbol',
  'type',
  'keyword',
  'parenthesis',
  'bracket',
  'braces',
  'number',
  'word'
]

const tokenSign = (token: Token): string => {
  switch (token.name) {
    case 'semi':
      return ';'
    case 'type':
      return 'T'
    case 'keyword':
      return 'K'
    case 'symbol':
    case 'parenthesis':
    case 'bracket':
    case 'braces':
      return token.raw.slice(0, 1)
    case 'define':
      return '#'
    case 'chunk':
      return 'C'
    case 'number':
      return '0'
    case 'word':
      return 'W'
    default:
      return ''
  }
}

const scanner = (src: string = TestInput) => {
  const tokens: Token[] = []
  let sign: string = ''
  let tokenSeqPos = 0

  while (src) {
    const saved = src

    for (const name of tokenList) {
      const matched = rules[name].exec(src)
      if (matched) {
        const isSpace = ['line', 'indent', 'space', 'remarks'].includes(name)
        const token = {
          name,
          raw: matched[0],
          pos: isSpace ? -1 : tokenSeqPos,
          sign: ''
        }
        if (!isSpace) {
          tokenSeqPos++
          token.sign = tokenSign(token)
          sign += token.sign
        }
        tokens.push(token)
        src = src.slice(matched[0].length)
        break
      }
    }

    if (src && saved === src) {
      console.log(src.slice(0, 10), saved.slice(0, 10))
      throw new Error(
        'Infinite loop on byte: ' + src.charCodeAt(0) + ' "' + src.slice(0, 8) + '..."'
      )
    }
  }

  return { tokens, sign }
}

const lex = ({ tokens, sign }: { tokens: Token[]; sign: string }) => {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.name === 'word') {
      if (/^W\(/.test(sign.slice(token.pos))) {
        token.type = 'function-name'
      }
      if (/^WW=/.test(sign.slice(token.pos))) {
        token.type = 'function-name'
      }
      if (/^TW\{/.test(sign.slice(token.pos - 1))) {
        token.type = 'function-name'
      }
    }
    if (token.name === 'define') {
      if (/^#(if|ifdef|ifndef|elif|else|endif)$/.test(token.raw)) {
        token.type = 'ctrl'
      }
      if (/^#include$/.test(token.raw)) {
        token.type = 'include'
      }
    }
  }
  return tokens
}

const pack = (tokens: Token[]) => {
  const lines: Line[] = []
  let row = 1
  let line: Line = {
    row,
    indent: 0,
    tokens: [],
    sign: ''
  }
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    switch (token.name) {
      case 'indent':
        line.indent = token.raw.length
        break
      case 'line':
        lines.push(line)
        row++
        line = {
          row,
          indent: 0,
          tokens: [],
          sign: ''
        }
        break
      default:
        line.tokens.push(token)
        line.sign += token.sign
    }
  }

  if (line.tokens.length) {
    lines.push(line)
  }

  lines.forEach((line) => {
    if (/^#C$/.test(line.sign)) {
      line.type = 'include'
    }
  })

  return lines
}

export const parse = (src?: string) => pack(lex(scanner(src)))
