import vue from '@vitejs/plugin-vue'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'

import fs from 'fs'
import path from 'path'

const entries = []

function addEntry(inPath, outPath, name) {
  entries.push({
    input: path.resolve(inPath, 'index.ts'),
    output: [
      {
        file: path.resolve(outPath, name + '.esm.js'),
        format: 'esm',
      },
    ],
    plugins: [
      vue({
        isProduction: true,
        style: {
          postcssPlugins: [
            cssnano(),
            autoprefixer(),
          ],
          postcssOptions: {
            inject: true,
          }
        },
      }),
      postcss(),
    ],
    external: ['vue', 'gsap', /^@silky-ui/],
  })
}

function addSFC() {
  const componentRoot = path.resolve(__dirname, './packages/components')
  const outRoot = path.resolve(__dirname, './dist')

  // 遍历文件夹
  fs.readdirSync(componentRoot, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      let inPath = path.resolve(componentRoot, folderName)
      let outPath = path.resolve(outRoot, folderName)

      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath)
      }
      fs.readdirSync(inPath, { withFileTypes: true })
        .filter(file => file.isFile())
        .filter(file => file.name.endsWith('.vue') || file.name.endsWith('.d.ts'))
        .forEach(file => {
          // 复制组件vue文件和ts声明文件
          fs.copyFileSync(path.resolve(inPath, file.name), path.resolve(outPath, file.name))
        })

      // 编译sfc
      addEntry(inPath, outPath, folderName)
    })
}

addSFC()

export default entries