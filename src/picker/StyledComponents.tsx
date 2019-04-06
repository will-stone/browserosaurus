import styled from 'styled-components'
import { animated } from 'react-spring/web.cjs'

export const Window = styled(animated.div)`
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 100px;
`

export const LoadingText = styled.div`
  text-align: center;
  color: white;
`

export const ActivitiesWrapper = styled.div`
  text-align: center;
`

export const ActivityButton = styled(animated.button)<{
  fav: 'fav' | undefined
}>`
  display: ${props => (props.fav === 'fav' ? 'block' : 'inline-flex')};
  height: ${props => (props.fav === 'fav' ? '200px' : '150px')};
  width: ${props => (props.fav === 'fav' ? '200px' : '150px')};
  margin-left: ${props => (props.fav === 'fav' ? 'auto' : '30px')};
  margin-right: ${props => (props.fav === 'fav' ? 'auto' : '30px')};
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 30px;
  background: transparent;
  border: none;
  opacity: 0.5;
  transition: opacity 300ms linear;
  text-align: center;
  flex-shrink: 0;
  position: relative;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`

export const ActivityImg = styled.img`
  display: block;
  width: 100%;
`

export const Key = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: 400;
`

export const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;

  &:focus {
    outline: none;
  }
`

export const Url = styled.div`
  color: #fafafa;
  font-size: 20px;
  line-height: 1.5;
  margin-top: 30px;
  padding: 20px 30px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-family: sans-serif;
`
