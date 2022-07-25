import { createRef } from 'react'

export const firstAppRef: React.MutableRefObject<HTMLButtonElement | null> =
  createRef()

export const appsRef: React.MutableRefObject<HTMLButtonElement[] | null> =
  createRef()

export const appsScrollerRef = createRef<HTMLDivElement>()
