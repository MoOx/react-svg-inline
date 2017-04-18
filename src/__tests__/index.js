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
