import path from 'path'

export const projectRoot = path.resolve(__dirname, '../../')

export const outDir = path.resolve(projectRoot, './dist')

export const uiRoot = path.resolve(projectRoot, './packages/silky-ui')

export const componentsRoot = path.resolve(projectRoot, './packages/components')

export const utilsRoot = path.resolve(projectRoot, './packages/utils')