/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

const runMock = jest.spyOn(main, 'run')

let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>

const CHANNEL_ID = 'C072N8BE71U'

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('uploads file', async () => {
    const files = [{ file: './samples/sample1.jpeg', filename: 'sample1.jpeg' }]
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'token':
          return `${process.env.SLACK_OAUTH_TOKEN}`
        case 'files':
          return JSON.stringify(files)
        case 'initial_comment':
          return 'test upload'
        case 'channel_id':
          return CHANNEL_ID
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    if (setFailedMock.mock.calls.length > 0) {
      console.log('setFailedMock was called with the following parameters:')
      for (const ele of setFailedMock.mock.calls) {
        console.log(`Call ${ele}`)
      }
    }
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
  })
})
