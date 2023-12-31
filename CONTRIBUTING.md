# Contributing to Tutorials and Demos

## Useful Commands

### Update Dependencies

The following commands work across all packages

- `pnpm -r outdated`
- `pnpm -r update` (or `pnpm -r --latest update`, etc)

To perform any of these items on a _single_ package, use `--filter` instead of `-r`. For example:
`pnpm --filter getting-started outdated`.

### Add Dependencies

Typically, a dependency is required within a single project at a time. As such, the most common way to add a dependency
is to use `pnpm --filter <project> add <dependency>`. For example: `pnpm --filter getting-started add @capacitor/foo`.

### Running `ionic` or `npx cap` Commands

NPM scripts called `android` and `ios` exist for each package. As such, command like
`pnpm --filter getting-started android` will launch the Android Studio IDE for the specified package.

If you need to do something else, the best way to run these command are to `cd` into the package and run them from that
package's root. For example:

```bash
cd auth-connect/getting-started
ionic generate page foo
pnpm build
npx cap build ios
```
