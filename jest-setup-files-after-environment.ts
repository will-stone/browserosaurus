import '@testing-library/jest-dom'

// Not available in jsdom so must be mocked
globalThis.HTMLElement.prototype.scrollTo = jest.fn
