import { Token } from 'markdown-it'
import katex from 'katex'

type Katex = typeof katex

function mathBlock (state: any, startLine: number, endLine: number, silent: boolean) {
  // var marker, len, params, nextLine, mem, token, markup,
  let haveEndMarker = false
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4)  return false

  if (pos + 2 > max)  return false

  const marker = state.src.charCodeAt(pos)

  if (marker !== 0x24/* $ */) {
    return false
  }

  // scan marker length
  let mem = pos
  pos = state.skipChars(pos, marker)

  let len = pos - mem
  if (len < 2)  return false

  const markup = state.src.slice(mem, pos)
  const params = state.src.slice(pos, max)

  if (params.indexOf(String.fromCharCode(marker)) >= 0)  return false

  // Since start is found, we can report success here in validation mode
  if (silent)  return true

  // search end of block
  let nextLine = startLine

  for (;;) {
    nextLine++
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine]
    max = state.eMarks[nextLine]

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break
    }

    if (state.src.charCodeAt(pos) !== marker)  continue

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue
    }

    pos = state.skipChars(pos, marker)

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len)  continue

    // make sure tail has spaces only
    pos = state.skipSpaces(pos)

    if (pos < max)  continue

    haveEndMarker = true
    // found!
    break
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine]

  state.line = nextLine + (haveEndMarker ? 1 : 0)

  const token   = state.push('math_block', 0)
  token.info    = params
  token.content = state.getLines(startLine + 1, nextLine, len, true)
  token.markup  = markup
  token.map     = [ startLine, state.line ]

  return true
}

function mathInline (state: any, silent: boolean) {
  // var start, max, marker, matchStart, matchEnd, token
  let pos = state.pos
  const ch = state.src.charCodeAt(pos)

  if (ch !== 0x24/* $ */)  return false

  const start = pos
  pos++
  const max = state.posMax

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) pos++

  const marker = state.src.slice(start, pos)

  let matchStart = pos
  let matchEnd = pos
  matchStart = state.src.indexOf('$', matchEnd)
  matchEnd = matchStart + 1

  while (matchStart !== -1) {
    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x24/* $ */) matchEnd++

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        const token   = state.push('math_inline', 0)
        token.markup  = marker
        token.content = state.src.slice(pos, matchStart)
          .replace(/[ \n]+/g, ' ')
          .trim()
      }
      state.pos = matchEnd
      return true
    }

    matchStart = state.src.indexOf('$', matchEnd)
    matchEnd = matchStart + 1
  }

  if (!silent)  state.pending += marker
  state.pos += marker.length
  return true
}

function mathRender (block: boolean, Katex: Katex) {
  return (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    const opt = { displayMode: block, throwOnError: false }
    try {
      return Katex.renderToString(token.content, opt)
    } catch (err) {
      const message = `<code style="color: red;">${err.message}</code>`
      return block ? `<pre>${message}</pre>` : message
    }
  }
}

export default function mathPlugin (md: any, Katex: Katex) {
  md.renderer.rules.math_block = mathRender(true, Katex)
  md.renderer.rules.math_inline = mathRender(false, Katex)
  md.block.ruler.before('code', 'math_block', mathBlock)
  md.inline.ruler.before('backticks', 'math_inline', mathInline)
}
