import {shouldRefetchItem, isItemLoading} from '../refetch';

describe('Utils > refetch', () => {
  it('should return true if item is empty', () => {
    expect(shouldRefetchItem()).toBe(true);
    expect(shouldRefetchItem(null)).toBe(true);
    expect(shouldRefetchItem({})).toBe(true);
  });
  it('should return false if item.loading is true', () => {
    expect(shouldRefetchItem({loading: true})).toBe(false);
  });
  it('should return false if item.data or item.error is present', () => {
    expect(shouldRefetchItem({data: true})).toBe(false);
    expect(shouldRefetchItem({error: true})).toBe(false);
  });
});

describe('Utils > isItemLoading', () => {
  it('should return true if item is empty', () => {
    expect(isItemLoading()).toBe(true);
    expect(isItemLoading(null)).toBe(true);
    expect(isItemLoading({})).toBe(true);
  });
  it('should return true if item.loading is true', () => {
    expect(isItemLoading({loading: true})).toBe(true);
  });
  it('should return false if item is present and item.loading is false', () => {
    expect(isItemLoading({loading: false})).toBe(false);
  });
});
