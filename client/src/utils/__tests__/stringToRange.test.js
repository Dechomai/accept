import stringToRange from '../stringToRange';

describe('Utils > stringToRange', () => {
  it('should return number from range', () => {
    const i = stringToRange('str', 4);
    expect(i).toBeLessThan(4);
    expect(i).toBeGreaterThanOrEqual(0);
  });
  it('should return same result for multiple calls', () => {
    const i1 = stringToRange('test string', 3);
    const i2 = stringToRange('test string', 3);
    expect(i1).toEqual(i2);
  });
});
