import { getInput, setFailed, setOutput } from '@actions/core'
import { existsSync } from 'fs'
import { WebClient } from '@slack/web-api'

export async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const path = getInput('path')
    const file_uploads = parseFilesInput(getInput('files'))

    if (!existsSync(path)) {
      throw new Error(`File does not exist at path: ${path}`)
    }

    const web = new WebClient(token)
    const result = await web.files.uploadV2({
      initial_comment: getInput('initial_comment'),
      thread_ts: getInput('tread_ts'),
      channel_id: getInput('channel_id'),
      title: getInput('title'),
      file_uploads
    })

    setOutput('result', result)
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
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
