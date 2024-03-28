# Slack file upload action

This action uploads file to slack, simple as that. For now supports only a
single file.

## Inputs

### `token`

**Required** Slack app token. See
[Internal app tokens](https://slack.com/intl/en-ru/help/articles/215770388-Create-and-regenerate-API-tokens#internal-app-tokens)

1. Create app
1. Add `files:write` and `files:read` permission
1. Install app to your workspase
1. Invite bot to required channels `/invite <botname>`
1. Use bot token from `OAuth & Permissions` page

### `path`

**Required** Path to file

### `channel_id`

Slack channel*id for upload \_THIS IS NOT A CHANNEL NAME* you can easily check
for channel id in browser url

### `channels`

Comma-separated list of channel_id's for upload

### `thread_ts`

Slack thread for upload

### `filename`

Filename of file, recommended to set

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
      - run: echo "Test file " > test.txt
      - name: Upload to slack step
        uses: vaporif/slack-file-upload-action@main
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          path: test.txt
          channel_id: C06S5FLDSN4
```
