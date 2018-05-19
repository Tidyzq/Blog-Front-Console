import Xml2js from 'xml2js'

const xmlParser = new Xml2js.Parser({explicitArray: false, ignoreAttrs: true})

export function xml2js (str: string) {
  return new Promise<any>((resolve, reject) => {
    xmlParser.parseString(str, (err: Error, data: any) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
