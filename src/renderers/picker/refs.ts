import { createRef } from 'react'

const appsRef: React.MutableRefObject<HTMLButtonElement[] | null> = createRef()

const appsScrollerRef = createRef<HTMLDivElement>()

export { appsRef, appsScrollerRef }
