# npm Publishing Guide

Use the steps below to publish this package to npm. The package exposes `src/index.js` as the
entry point and only publishes the folders/files listed in the `files` array inside `package.json`.

1. Confirm you are logged in to npm:

   ```sh
   npm whoami
   ```

2. (Optional) Preview the package contents before publishing:

   ```sh
   npm publish --dry-run
   ```

3. Bump the version as needed:

   ```sh
   npm version patch
   ```

4. Publish the package (for public access):

   ```sh
   npm publish --access public
   ```

5. Verify the published version:

   ```sh
   npm view filepond-plugin-simple-image-editor version
   ```
