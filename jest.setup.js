import 'react-testing-library/cleanup-after-each'

beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: () => {},
    unobserve: () => {},
  }))
})
