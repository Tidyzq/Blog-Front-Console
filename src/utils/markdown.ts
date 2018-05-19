import Prism from 'prismjs'
import MarkdownIt from 'markdown-it'
import Katex from 'katex'
import MarkdownMathPlugin from './markdownMathPlugin'

function requireLanguageFile (lang: string): boolean {
  // already has language
  if (Prism.languages[lang]) return true
  // try to load language file
  try {
    require(`prismjs/components/prism-${lang}.min.js`)
    // load success
    return true
  } catch (err) {
    // no language file
    return false
  }
}

const Markdown = MarkdownIt({
  html: true,
  breaks: false,
  highlight (str, lang) {
    // no such language file, simply return
    if (!requireLanguageFile(lang)) return str

    // use langage grammar setting to highligh
    const grammar = Prism.languages[lang]
    return Prism.highlight(str, grammar)
  },
})

Markdown.use(MarkdownMathPlugin, Katex)

export function parse (src: string, env = {}) {
  return Markdown.parse(src, env)
}

export function render (ast: MarkdownIt.Token[], env: any = {}) {
  return Markdown.renderer.render(ast, (Markdown as any).options, env)
}

export function renderText (ast: MarkdownIt.Token[], env: any = {}) {
  let result = ''
  const { limit = 0 } = env
  for (let i = 0, len = ast.length; i < len; i++) {
    const token = ast[i]
    if (token.children) {
      result += renderText(token.children, { limit: limit ? limit - result.length : 0 })
    } else {
      result += token.content
    }

    if (limit && result.length >= limit)  break
    if (!result.endsWith(' '))  result += ' '
  }
  return result
}
