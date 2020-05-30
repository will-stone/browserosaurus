import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { versionAtom } from '../atoms'

interface Props {
  className?: string
}

const Version: React.FC<Props> = ({ className }) => {
  const version = useRecoilValue(versionAtom)

  return <span className={cc([className])}>{version && `v${version}`}</span>
}

export default Version
