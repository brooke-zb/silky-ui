import { parallel, series } from 'gulp'
import { withTaskName, run } from './utils'
import { outDir, uiRoot } from './utils/paths'
import packageAll from './package'
import fs from 'fs'
import path from 'path'

function copyPackageFile(cb: () => void) {
  fs.copyFileSync(path.resolve(uiRoot, 'package.json'), path.resolve(outDir, 'package.json'))
  cb()
}

// 清空dist目录
function clean(cb: () => void) {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true })
  }
  fs.mkdirSync(outDir)
  cb()
}

export default series(
  clean,

  // 构建组件
  parallel(
    withTaskName('buildComponents', async () => run('rollup -c')),
    copyPackageFile,
  ),

  // 打包组件
  packageAll,
)