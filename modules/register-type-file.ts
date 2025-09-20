import fs from 'fs'

import { defineWxtModule } from 'wxt/modules'

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('prepare:types', async (_, entries) => {
      try {
        const content = fs.readFileSync('types/types.d.ts', 'utf8')
        entries.push({
          path: 'types/types.d.ts',
          text: content,
          // IMPORTANT - without this line your declaration file will not be a part of the TS project:
          tsReference: true,
        })
      } catch (err) {
        console.error(err)
      }
    })
  },
})
