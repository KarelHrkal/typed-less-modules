# typed-less-modules

Generate TypeScript definitions (`.d.ts`) files for CSS Modules that are written in LESS (`.less`).
Check out [this post to learn more](https://skovy.dev/generating-typescript-definitions-for-css-modules-using-less/) about the rationale and inspiration behind this package.

For example, given the following LESS:

```less
@import (reference) "./variables.less";

.text {
  color: @blue;

  &-highlighted {
    color: @yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

## Basic Usage

Run with npm package runner:

```bash
npx tlm src
```

Or, install globally:

```bash
yarn global add typed-less-modules
tlm src
```

Or, install and run as a `devDependency`:

```bash
yarn add -D typed-less-modules
yarn tlm src
```

## Advanced Usage

For all possible commands, run `tlm --help`.

The only required argument is the directoy where all LESS files are located. Running `tlm src` will search for all files matching `src/**/*.less`. This can be overridden by providing a [glob](https://github.com/isaacs/node-glob#glob-primer) pattern instead of a directory. For example, `tlm src/*.less`

### `--watch` (`-w`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch`

Watch for files that get added or are changed and generate the corresponding type definitions.

### `--ignoreInitial`

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch --ignoreInitial`

Skips the initial build when passing the watch flag. Use this when running concurrently with another watch, but the initial build should happen first. You would run without watch first, then start off the concurrent runs after.

### `--includePaths` (`-i`)

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `tlm src --includePaths src/core`

An array of paths to look in to attempt to resolve your `@import` declarations. This example will search the `src/core` directory when resolving imports.

### `--aliases` (`-a`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `tlm src --aliases.~some-alias src/core/variables`

An object of aliases to map to their corresponding paths. This example will replace any `@import '~alias'` with `@import 'src/core/variables'`.

### `--aliasPrefixes` (`-p`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `tlm src --aliasPrefixes.~ node_modules/`

An object of prefix strings to replace with their corresponding paths. This example will replace any `@import '~bootstrap/lib/bootstrap'` with `@import 'node_modules/bootstrap/lib/bootstrap'`.
This matches the common use-case for importing less files from node_modules when `less-loader` will be used with `webpack` to compile the project.

### `--nameFormat` (`-n`)

- **Type**: `"camel" | "kebab" | "param" | "dashes" | "none"`
- **Default**: `"camel"`
- **Example**: `tlm src --nameFormat camel`

The class naming format to use when converting the classes to type definitions.

- **camel**: convert all class names to camel-case, e.g. `App-Logo` => `appLogo`.
- **kebab**/**param**: convert all class names to kebab/param case, e.g. `App-Logo` => `app-logo` (all lower case with '-' separators).
- **dashes**: only convert class names containing dashes to camel-case, leave others alone, e.g. `App` => `App`, `App-Logo` => `appLogo`. Matches the webpack [css-loader camelCase 'dashesOnly'](https://github.com/webpack-contrib/css-loader#camelcase) option.
- **none**: do not modify the given class names (you should use `--exportType default` when using `--nameFormat none` as any classes with a `-` in them are invalid as normal variable names).
  Note: If you are using create-react-app v2.x and have NOT ejected, `--nameFormat none --exportType default` matches the class names that are generated in CRA's webpack's config.

### `--listDifferent` (`-l`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --listDifferent`

List any type definition files that are different than those that would be generated. If any are different, exit with a status code `1`.

### `--lineEnding` (`-d`)

- **Type**: `string`
- **Default**: `\n`
- **Example**: `tlm src --lineEnding "\r\n"`

Sets the character(s) to be used as a line ending. You can use a backslash to escape \n or \r.

### `--exportType` (`-e`)

- **Type**: `"named" | "default"`
- **Default**: `"named"`
- **Example**: `tlm src --exportType default`

The export type to use when generating type definitions.

#### `named`

Given the following LESS (text.less):

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions (text.less.d.ts) will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

#### `values`

Given the following LESS (text.less):

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following text.const.ts file will be generated:

```typescript
export const text = "text";
export const textHighlighted = "text-highlighted";
```

In this mode, the tool is used to create .const.ts files instead of .d.ts files. This is the most optimal for compilation, because it allows to not process .less files with bundler thus significantly reducing compilation time for big projects.

Having constants in .const.ts instead of .less.d.ts gives some additional comfort on opening source files, because we have different file extensions.

1. Setup generation of .constant.ts and .css files .less on save.

For VSCode, use emeraldwalk.runonsave plugin.

Add these settings to .vscode/settings.json:

```json
	"emeraldwalk.runonsave": {
		"commands": [
			{
				"match": "\\.less$",
				"cmd": "lessc -x --js src/index.less build/index.css && tlm ${file} -e values"
			}
		]
	},
```

2. Change imports of constants:

```typescript
import * as style from "./text.const";
```

3. Remove all imports of .less files from .tsx files

4. Remove .less file handling from bundler. In case of Webpack, remove the plugin chain of .less processing: less-loader (which compiles Less to CSS), css-loader (which translates CSS into CommonJS) and MiniCssExtractPlugin.loader (which creates style nodes from JS strings).

#### `default`

Given the following LESS (text.less):

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions (text.less.d.ts) will be generated:

```typescript
export interface Styles {
  text: string;
  textHighlighted: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
```

This export type is useful when using kebab (param) cased class names since variables with a `-` are not valid variables and will produce invalid types or when a class name is a TypeScript keyword (eg: `while` or `delete`). Additionally, the `Styles` and `ClassNames` types are exported which can be useful for properly typing variables, functions, etc. when working with dynamic class names.

## Examples

For examples, see the `examples` directory:

- [Basic Example](/examples/basic)
- [Default Export Example](/examples/default-export)
