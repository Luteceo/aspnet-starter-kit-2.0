declare var jest, describe, it, expect;

import { Hello } from './Hello';

describe('Hello Class', () => {
  it('should throw an error', () => {
    expect.assertions(1);
    expect(() => new Hello()).toThrowError('Hello error!')
  });
});