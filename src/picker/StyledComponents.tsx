import styled from 'styled-components'

export const Window = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`

export const WindowInner = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  height: 180px;
  width: 80%;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
`

export const LoadingText = styled.div`
  text-align: center;
  color: white;
`

const favAB = (a: string, b: string) => (props: { fav?: boolean }) =>
  props.fav ? a : b

export const ActivityButton = styled.button<{ fav?: boolean }>`
  width: ${favAB('140px', '70px')};
  align-items: center;
  justify-content: center;
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
  padding: 5px;
`

export const Key = styled.div`
  position: absolute;
  bottom: -15px;
  right: 0;
  left: 0;
  text-align: center;
  color: white;
  width: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: 400;
  padding: 1px;
  margin-left: auto;
  margin-right: auto;
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
  background-color: rgba(0, 0, 0, 0.9);
  color: #fafafa;
  font-size: 20px;
  line-height: 1.5;
  padding: 20px 30px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-family: sans-serif;
  border-radius: 20px;
`
