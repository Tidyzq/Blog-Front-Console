import { throttlePromise } from '@/utils'
import { size2str } from '@/utils/parseSize'
import limitedConcurrent from '@/utils/limitedConcurrent'
import { Image } from '@/models'

import cos from './cos'

const CDN_URL = process.env.REACT_APP_COS_CDN_URL || ''

const image = {
  getAll: throttlePromise(
    (accessToken: string) => cos.get(accessToken).then(
      contents => contents.map(
        content => ({
          name: content.Key,
          size: size2str(parseFloat(content.Size)),
          lastModified: new Date(content.LastModified),
          url: `${CDN_URL}/${content.Key}`,
        }) as Image,
      ).sort((a, b) => b.lastModified.valueOf() - a.lastModified.valueOf()), // descent by lastModified
    ),
  ),
  create (accessToken: string, files: File[], onProgress?: (progress: number) => any) {
    const total = files.reduce((total, file) => total + file.size, 0)
    const loaded: number[] = Array(files.length).fill(0)
    let loadedTotal = 0
    return limitedConcurrent(files.map((file, index) => () => cos.put(accessToken, file, {
      progress: e => {
        loadedTotal += e.loaded - loaded[index]
        loaded[index] = e.loaded
        if (onProgress) onProgress(loadedTotal / total)
      },
    })))
  },
  delete (accessToken: string, image: Image) {
    return cos.delete(accessToken, image.name)
  },
}

export default image
