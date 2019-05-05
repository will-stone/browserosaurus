import styled from 'styled-components'
import { animated } from 'react-spring/web.cjs'

const primaryColor = '#0080ff'

export const Window = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
`

export const Url = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${primaryColor};
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
  color: white;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  cursor: copy;

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const Hostname = styled.span`
  font-weight: bold;
`

export const PickerWindow = styled(animated.div)`
  position: absolute;
  background-color: #232323;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  overflow: hidden;
`

const favAB = (a: string, b: string) => (props: { fav?: boolean }) =>
  props.fav ? a : b

export const ActivityButton = styled.button<{ fav?: boolean }>`
  width: ${favAB('200px', '100px')};
  height: ${favAB('200px', '100px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  transition: opacity 300ms linear;
  text-align: center;
  position: relative;
  cursor: default;
  color: white;

  &:hover {
    background-color: ${primaryColor};
  }

  &:focus {
    outline: none;
  }
`

export const ActivityImg = styled.img`
  display: block;
  width: 60%;
`

export const Key = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  padding: 1px;
`
