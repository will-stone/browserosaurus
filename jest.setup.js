beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: () => {},
    unobserve: () => {},
  }))
})
