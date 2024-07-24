import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import clear from 'clear'

const execAsync = promisify(exec)
const packageDirPath = path.dirname(fileURLToPath(import.meta.url))

const packageJsonPath = path.join(packageDirPath, 'package.json')

const packageJsonString = await readFile(packageJsonPath, 'utf8')
const packageJsonData = JSON.parse(packageJsonString)

const createUpdatedVersion = version => {
  const numbers = version.split('.')
  numbers[2]++
  return numbers.join('.')
}

packageJsonData.version = createUpdatedVersion(packageJsonData.version)
await writeFile(packageJsonPath, JSON.stringify(packageJsonData, null, 2))

console.log('Обновляем пакет...')
await execAsync('npm i')

clear()
console.log('Выполняем сборку пакета...')
await execAsync('npm run build')

clear()
console.log('Упаковываем пакет...')
await execAsync('npm pack')

clear()
console.log('Обновление закончено! Версия: ' + packageJsonData.version)
