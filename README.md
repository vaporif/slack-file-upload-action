# Slack file upload action

[![Integration Tests](https://github.com/vaporif/slack-file-upload-action/actions/workflows/integration-tests.yml/badge.svg?branch=main)](https://github.com/vaporif/slack-file-upload-action/actions/workflows/integration-tests.yml)

This action uploads file(s) to slack using v2 files API.

## Inputs

### `token`

**Required** Slack app token. See
[Internal app tokens](https://slack.com/intl/en-ru/help/articles/215770388-Create-and-regenerate-API-tokens#internal-app-tokens)

1. Create app
1. Add `files:write` and `files:read` permission
1. Install app to your workspase
1. Invite bot to required channels `/invite <botname>`
1. Use bot token from `OAuth & Permissions` page

### `files`

**Required** List of files including file path and filename remember json wont
work with backslashes so you might need `${{ toJSON(variable) }}`

### `channel_id`

Slack channel ID for upload

**THIS IS NOT A CHANNEL NAME**

ID is included in the URL of a channel in web version.

### `thread_ts`

Slack thread for upload

### `initial_comment`

The message text introducing the file in specified channels.

## Example usage

```yaml
on: [push]

jobs:
  slack_upload_job:
    runs-on: ubuntu-latest
    name: Upload test file
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - run: |
          mkdir dir
          echo "Test file " > dir/test.txt
      - name: Upload to slack step
        uses: vaporif/slack-file-upload-action@v1
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          files: >
            [
              {"file": "./dir/test.txt", "filename": "testfile.txt"},
              {"file": "./dir/test.txt", "filename": "testfile.txt"}
            ]
          channel_id: C06S5FLDSN4
```
