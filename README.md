# react-svg-inline

[![Travis (Unix) Build Badge](https://img.shields.io/travis/MoOx/react-svg-inline/master.svg?label=unix+build)](https://travis-ci.org/MoOx/react-svg-inline)

> A react component to clean and display raw SVGs.

## Install

```console
$ npm install react-svg-inline
```

You might also need to `npm install raw-loader` if you want to use this with
webpack.

## Usage

Here is an example of a usage in a React stateless component:

```js
import React from "react"
import SVGInline from "react-svg-inline"

export default () => (
  <div>
    <SVGInline svg={"<svg....</svg>"} />
  </div>
)
```

# Webpack to `require()` SVGs

Use the raw-loader to require() raw SVGs files and pass them to
`react-svg-inline`.

```js
module.exports = {
  loaders: [
    {
      test: /\.svg$/,
      loader: 'raw-loader'
    }
  ]
}

```

```js
import React from "react"
import SVGInline from "react-svg-inline"
import iconSVG from "./myicon.svg"

export default () => (
  <div>
    <SVGInline svg={ iconSVG } />
  </div>
)
```

## Options (props)

### className

``PropTypes.string``

Class name used for the component that will wrap the SVG.

### classSuffix

``PropTypes.string``

The class suffix that will be added to the svg className (default: "-svg").

### component

``PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
]),``

The component that will wrap the svg (default: `span`).

### svg

``PropTypes.string.isRequired``

### fill

``PropTypes.string``

Color to use

### cleanup

``PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.array,
])``

This allow you to cleanup (remove) some svg attributes.
Here are the supported value that can be removed:

- title
- desc
- comment
- defs
- width
- height
- fill
- sketchMSShapeGroup
- sketchMSPage
- sketchMSLayerGroup

If cleanup === true, it will remove all the attributes above.

### cleanupExceptions

``PropTypes.array``

This allow you to whitelist some svg attributes to keep while cleaning some
others.

### width

``PropTypes.string``

### height

``PropTypes.string``

### accessibilityLabel

``PropTypes.string``

This value is added as an svg `<title>` element that is accessible to screen readers.
(Note: when this option is used, an SVG `id` attribute will be automatically injected).

### accessibilityDesc

``PropTypes.string``

This value is added as an svg `<desc>` element that is accessible to screen readers.

---

## CONTRIBUTING

* ⇄ Pull requests and ★ Stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ npm test`).

## [CHANGELOG](CHANGELOG.md)

## [LICENSE](LICENSE)
