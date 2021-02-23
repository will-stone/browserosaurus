import React from 'react'

interface Props {
  className?: string
}

export const Carrot: React.FC<Props> = ({ className = '' }) => (
  <span aria-label="Carrot" className={className} role="img">
    🥕
  </span>
)
