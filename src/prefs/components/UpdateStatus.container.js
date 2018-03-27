import { remote } from 'electron'
import fetch from 'node-fetch'
import React, { Component, Fragment } from 'react'
import semver from 'semver'

import WindowHeightUpdater from '../../utils/WindowHeightUpdater'

import UpdateStatus from './UpdateStatus'

class UpdateStatusContainer extends Component {
  state = {
    status: 'idle'
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
          return 'limitExceeded'
        } else if (semver.gt(response.tag_name, remote.app.getVersion())) {
          return 'updateAvailable'
        } else {
          return 'latestVersion'
        }
      })
  }

  handleUpdateCheck = () => {
    this.setState(
      {
        status: 'checking'
      },
      async () => {
        const status = await this._checkForUpdate()
        this.setState({
          status: status
        })
      }
    )
  }

  componentDidMount = () => {
    this.handleUpdateCheck()
  }

  render() {
    return (
      <Fragment>
        <UpdateStatus status={this.state.status} />
        <WindowHeightUpdater />
      </Fragment>
    )
  }
}

export default UpdateStatusContainer
