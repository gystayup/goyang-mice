/**
 * Jest 테스트 환경 설정
 */

// @testing-library/jest-dom 확장 matcher 등록 (toBeInTheDocument, toHaveClass 등)
// side-effect import: runtime matcher 등록 + TypeScript 타입 확장 자동 로드
import '@testing-library/jest-dom';

// Mock fetch if needed
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console errors for tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
