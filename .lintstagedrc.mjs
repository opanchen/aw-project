export default {
  '*.{ts,tsx,mts,vue}': files => {
    const clientFiles = files.filter(f => f.includes('apps/client/'))
    const otherFiles = files.filter(f => !f.includes('apps/client/'))

    const commands = []

    if (clientFiles.length) {
      commands.push(
        `eslint --fix --config apps/client/eslint.config.mjs ${clientFiles.join(' ')}`,
        `prettier --write ${clientFiles.join(' ')}`
      )
    }

    if (otherFiles.length) {
      commands.push(`eslint --fix ${otherFiles.join(' ')}`, `prettier --write ${otherFiles.join(' ')}`)
    }

    return commands
  },
  '*.{json,md,yaml,yml}': ['prettier --write'],
}