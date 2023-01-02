# How to Write Unit Tests

## Filename

Filename should be the same as filename in src folder.

## Asserting results

Use `mocha` package as testing framework. Use `chai` package for asserts.

## Structure

```
describe(path.relative(process.cwd(), __filename), () => {
  describe("getCachedAssets", () => {
    it("should return `cachedAssets` from store", () => {
      expect(
        getCachedAssets({
          asset: {
            cachedAssets: [
              {
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          id: 1,
        },
      ]);
    });
    it("should return `empty object` by default", () => {
      expect(
        getCachedAssets({
          asset: {},
        }),
      ).is.deep.equal({});
      expect(getCachedAssets({})).is.deep.equal({});
    });
  });
});
```

1. Global `describe` title should match with file path.

   Tip: Use `path.relative(process.cwd(), __filename`.

2. Shared variables should be declared at the top of global `describe`.

3. Create a separate `describe` for each function that is tested. A title should
   match a function name.

4. Each test case should be in a separate `it`.

5. A title of `it` should have the following structure:
   `should {specify return} when {specify case}`.

   Example:
   `should return undefined when auth is empty`.

