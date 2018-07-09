import { Button } from '@blueprintjs/core'
import { remote, shell } from 'electron'
import React, { Component } from 'react'
import semver from 'semver'
import TabAbout from './Tab.About'

class TabAboutContainer extends Component {
  state = {
    updateStatus: ''
  }

  /**
   * Check For Update
   *
   * Checks GitHub API for Browserosaurus's latest release.
   * NB: only allowed 60 requests per IP address per hour.
   * @returns {object} - {update: boolean, message: string} if update true,
   * message is URL to latest release, else message is string to be displayed.
   */
  _checkForUpdate = () => {
    return fetch(
      'https://api.github.com/repos/will-stone/browserosaurus/releases/latest'
    )
      .then(response => response.json())
      .then(response => {
        if (
          response.message &&
          response.message.startsWith('API rate limit exceeded')
        ) {
          return "API rate limit exceeded, please try again later or visit Browserosaurus's website to check for an update"
        } else if (semver.gt(response.tag_name, remote.app.getVersion())) {
          return (
            <Button
              onClick={() =>
                shell.openExternal(
                  'https://github.com/will-stone/browserosaurus/releases/latest'
                )
              }
              intent="primary"
            >
              Update Available
            </Button>
          )
        } else {
          return 'You have the latest version'
        }
      })
  }

  handleUpdateCheck = () => {
    this.setState(
      {
        updateStatus: 'Checking for update...'
      },
      async () => {
        const status = await this._checkForUpdate()
        this.setState({
          updateStatus: status
        })
      }
    )
  }

  componentDidMount = () => {
    this.handleUpdateCheck()
  }

  render() {
    const { updateStatus } = this.state

    return <TabAbout updateStatus={updateStatus} />
  }
}

export default TabAboutContainer
