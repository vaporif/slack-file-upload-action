import { getInput, setFailed, setOutput } from '@actions/core'
import { existsSync } from 'fs'
import { WebClient } from '@slack/web-api'

export async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const path = getInput('path')

    if (!existsSync(path)) {
      throw new Error(`File does not exist at path: ${path}`)
    }

    const web = new WebClient(token)

    const result = await web.files.uploadV2({
      initial_comment: getInput('initial_comment'),
      thread_ts: getInput('tread_ts'),
      channel_id: getInput('channel'),
      file_uploads: [
        {
          file: `./${path}`,
          filename: `${getInput('filename')}`
        }
      ]
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
