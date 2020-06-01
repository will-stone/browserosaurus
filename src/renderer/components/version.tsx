import cc from 'classcat'
import { shell } from 'electron'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { updateAvailableAtom, versionAtom } from '../atoms'

interface Props {
  className?: string
}

const Version: React.FC<Props> = ({ className }) => {
  const updateAvailable = useRecoilValue(updateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const handleUpdateClick = useCallback(
    () => shell.openExternal('https://browserosaurus.com'),
    [],
  )

  if (updateAvailable) {
    return (
      <button
        className={cc([
          'bg-blue-800',
          'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
          'text-xs text-blue-100 active:text-white font-bold',
          'py-1 px-2',
          'cursor-default',
        ])}
        onClick={handleUpdateClick}
        type="button"
      >
        Update Available
      </button>
    )
  }

  return <span className={cc([className])}>{version && `v${version}`}</span>
}

export default Version
