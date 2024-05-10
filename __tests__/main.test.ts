/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import { env } from 'process'

const runMock = jest.spyOn(main, 'run')

let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

const CHANNEL_ID = 'C072N8BE71U'

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('uploads file', async () => {
    const files = [
      {"file": './samples/sample1.jpeg', "filename": "sample1.jpeg" },
    ]
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'token':
          return `${env.SLACK_OUATH_TOKEN}`
        case 'files':
          return JSON.stringify(files);
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
        console.log('setFailedMock was called with the following parameters:');
        setFailedMock.mock.calls.forEach((call, index) => {
            console.log(`Call ${index + 1}:`, call);
        });
    } 
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
  })
})
