import * as core from '@actions/core'
import { existsSync } from 'fs'
import { WebClient } from '@slack/web-api'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const path = core.getInput('path')
    const file_uploads = parseFilesInput(core.getInput('files'))

    if (!existsSync(path)) {
      throw new Error(`File does not exist at path: ${path}`)
    }

    const web = new WebClient(token)
    const result = await web.files.uploadV2({
      initial_comment: core.getInput('initial_comment'),
      thread_ts: core.getInput('tread_ts'),
      channel_id: core.getInput('channel_id'),
      title: core.getInput('title'),
      file_uploads
    })

    core.setOutput('result', result)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      throw error
    }
  }
}

function parseFilesInput(input: string): FileObject[] {
  const files: FileObject[] = JSON.parse(input)

  if (!Array.isArray(files)) {
    throw new Error('Input must be an array')
  }

  for (const file of files) {
    if (typeof file.file !== 'string' || typeof file.filename !== 'string') {
      throw new Error(
        'Each file object must have a "file" and "filename" property'
      )
    }

    if (!file.file.startsWith('./')) {
      file.file = `./${file.file}`
    }
  }

  if (files.length === 0) {
    throw new Error('At least one file should be added')
  }

  return files
}

interface FileObject {
  file: string
  filename: string
}
