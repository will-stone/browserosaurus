import { shell } from 'electron'
import React from 'react'

const UpdateStatus = ({ status }) => {
  switch (status) {
    case 'checking':
      return 'Checking for update...'

    case 'limitExceeded':
      return "API rate limit exceeded, please try again later or visit Browserosaurus's website to check for an update"

    case 'latestVersion':
      return 'You have the latest version'

    case 'updateAvailable':
      return (
        <button
          onClick={() =>
            shell.openExternal(
              'https://github.com/will-stone/browserosaurus/releases/latest'
            )
          }
        >
          Update Available
        </button>
      )

    default:
      return false
  }
}

export default UpdateStatus
