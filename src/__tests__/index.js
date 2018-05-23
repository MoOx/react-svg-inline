/* eslint-disable react/no-multi-comp, react/prop-types */

import test from "ava"
import React from "react"
import ReactDOMServer from "react-dom/server"

import SVGInline from ".."

// const result = ?
// => https://github.com/sindresorhus/ava/issues/274

test("SVGInline: passes & merges className", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline className="TestSVG" svg="<svg><g></g></svg>" />
  )
  t.is(
    result,
    "<span class=\"SVGInline TestSVG\"><svg class=\"SVGInline-svg "+
      "TestSVG-svg\"" +
    "><g></g></svg></span>"
  )
})

test("SVGInline: parent component can be chosen by tagName", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline
      component="div"
      className="TestSVG"
      svg="<svg><g></g></svg>"
    />
  )
  t.is(
    result,
    "<div class=\"SVGInline TestSVG\"><svg class=\"SVGInline-svg TestSVG-svg\""+
      "><g></g></svg></div>"
  )
})

test("SVGInline: parent composite component can be chosen", (t) => {
  const TestComponent = (props) => {
    return (
      <div {...props} className="foo" />
    )
  }

  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline
      component={ TestComponent }
      className="TestSVG"
      svg="<svg><g></g></svg>"
    />
  )
  t.is(
    result,
    "<div class=\"foo\"><svg class=\"SVGInline-svg TestSVG-svg\"><g></g></svg>"+
      "</div>"
  )
})

const svgPiece = "width=\"24\" height=\"16px\"><g fill=\"none\"><path " +
  "fill=\"#ab234f\"></path></g></svg>"
const SVGInlineStart = "<span class=\"SVGInline\"><svg class=\"SVGInline-svg\""
const SVGInlineCleanedStart = "<span class=\"SVGInline SVGInline--cleaned\">" +
  "<svg class=\"SVGInline-svg SVGInline--cleaned-svg\""

test("SVGInline: doesn't cleanup the svg by default", (t) => {

  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ `<svg ${ svgPiece }` } />
  )
  t.is(
    result,
    `${ SVGInlineStart } ${ svgPiece }</span>`
  )
})

test("SVGInline: can cleanup the svg", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline cleanup svg={ `<svg ${ svgPiece }` } />
  )
  t.is(
    result,
    `${ SVGInlineCleanedStart }><g><path></path></g></svg></span>`
  )
})

test("SVGInline: cleanup the svg with exceptions", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline cleanupExceptions={ [ "fill" ] } svg={ `<svg ${ svgPiece }` } />
  )
  t.is(
    result,
    `${ SVGInlineCleanedStart }><g fill="none"><path fill="#ab234f"></path>` +
      "</g></svg></span>"
  )
})

test("SVGInline: should add width (and height automatically)", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } width="1rem" />
  )
  t.is(
    result,
    `${ SVGInlineStart } style="width: 1rem;height: 1rem;"><g></g></svg></span>`
  )
})

test("SVGInline: should add width & height", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } width="1rem" height="auto" />
  )
  t.is(
    result,
    `${ SVGInlineStart } style="width: 1rem;height: auto;"><g></g></svg></span>`
  )
})

test("SVGInline: should add height", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } height="1rem" />
  )
  t.is(
    result,
    `${ SVGInlineStart } style="height: 1rem;"><g></g></svg></span>`
  )
})

test("SVGInline: does not pass internal props to component", (t) => {
  const TestComponent = (props) => {
    t.not(props.className, undefined)
    t.is(props.component, undefined)
    t.is(props.classSuffix, undefined)
    t.is(props.fill, undefined)
    t.is(props.cleanup, undefined)
    t.is(props.cleanupExceptions, undefined)

    return <div className="foo" />
  }

  ReactDOMServer.renderToStaticMarkup(
    <SVGInline
      component={ TestComponent }
      className="TestSVG"
      classSuffix="-test"
      fill="#000000"
      svg="<svg><g></g></svg>"
      cleanupExceptions={ [ "fake" ] }
      cleanup
    />
  )

})

test("SVGInline: includes title element if accessibilityLabel is provided", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } accessibilityLabel="My test title" />
  )
  t.is(
    result,
    `${ SVGInlineStart } role="img" aria-labelledby="SVGInline-0-title"><title id="SVGInline-0-title">My test title</title><g></g></svg></span>`
  )
})

test("SVGInline: accessibilityLabel IDs are not the same", (t) => {
  const result1 = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } accessibilityLabel="First test title" />
  )
  const result2 = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } accessibilityLabel="Second test title" />
  )
  t.is(
    result1,
    `${ SVGInlineStart } role="img" aria-labelledby="SVGInline-1-title"><title id="SVGInline-1-title">First test title</title><g></g></svg></span>`
  )
  t.is(
    result2,
    `${ SVGInlineStart } role="img" aria-labelledby="SVGInline-2-title"><title id="SVGInline-2-title">Second test title</title><g></g></svg></span>`
  )
})

test("SVGInline: includes desc element if accessibilityDesc is provided", (t) => {
  const result = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg><g></g></svg>" } accessibilityDesc="Longer accessibility description of this svg image" />
  )
  t.is(
    result,
    `${ SVGInlineStart }><desc>Longer accessibility description of this svg image</desc><g></g></svg></span>`
  )
})

test("SVGInline: accessibilityLabel doesn't crash on svg tag with newlines", (t) => {
  const result1 = ReactDOMServer.renderToStaticMarkup(
    <SVGInline svg={ "<svg \n><g></g></svg>" } accessibilityLabel="Third test title" />
  )
  t.is(
    result1,
    `${ SVGInlineStart } ${'\n'} role="img" aria-labelledby="SVGInline-3-title"><title id="SVGInline-3-title">Third test title</title><g></g></svg></span>`
  )
})
