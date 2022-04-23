import { outDir, utilsRoot } from './utils/paths'
import { parallel } from 'gulp'
import { rollup } from 'rollup'
import fs from 'fs'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'

// 为每个组件生成package.json
function generatePackageFile(cb: () => void) {
  fs.readdirSync(outDir, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      const packageContent = JSON.stringify({
        main: `./${ folderName }.esm.js`,
        module: `./${ folderName }.esm.js`,
        types: `./${ folderName }.d.ts`,
        browser: {
          ['./sfc']: `./${ folderName }.vue`,
        },
      }, null, 2)
      fs.writeFileSync(path.resolve(outDir, folderName, 'package.json'), packageContent)
    })
  cb()
}

// 修改导入路径
function modifyModule(cb: () => void) {
  fs.readdirSync(outDir, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(path.resolve(outDir, folderName), { withFileTypes: true })
        .filter(file => file.isFile())
        .filter(file => file.name.endsWith('.esm.js'))
        .forEach(({ name: fileName }) => {
          const content = fs.readFileSync(path.resolve(outDir, folderName, fileName), 'utf8')
          fs.writeFileSync(path.resolve(outDir, folderName, fileName), content
            .replace(/@silky-ui\/components/g, 'silky-ui')
            .replace(/@silky-ui/g, 'silky-ui')
          )
        })
    })
  cb()
}

// 打包utils
function packageUtils(cb: () => void) {
  let outPath = path.resolve(outDir, 'utils')

  // 创建utils目录
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath)
  }

  fs.readdirSync(utilsRoot, { withFileTypes: true })
    .filter(dir => dir.isFile())
    .filter(file => file.name.endsWith('.ts'))
    .forEach(async ({ name: fileName }) => {
      // 复制ts声明文件
      if (fileName.endsWith('.d.ts')) {
        fs.copyFileSync(path.resolve(utilsRoot, fileName), path.resolve(outPath, fileName))
      }
      // 编译ts文件
      else {
        const bundle = await rollup({
          input: path.resolve(utilsRoot, fileName),
          plugins: [typescript()],
          external: ['vue'],
        })
        await bundle.write({
          file: path.resolve(outPath, fileName.replace('.ts', '.js')),
          format: 'esm',
        })
      }
    })
  cb()
}

export default parallel(generatePackageFile, modifyModule, packageUtils)