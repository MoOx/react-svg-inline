import React, { Component, PropTypes } from "react"
import cx from "classnames"

// import styles from "./styles"

const cleanups = {
  // some useless stuff for us
  // that svgo doesn't remove
  title: /<title>.*<\/title>/gi,
  desc: /<desc>.*<\/desc>/gi,
  comment: /<!--.*-->/gi,
  defs: /<defs>.*<\/defs>/gi,

  // remove hardcoded dimensions
  width: / +width="\d+(\.\d+)?(px)?"/gi,
  height: / +height="\d+(\.\d+)?(px)?"/gi,

  // remove fill and stroke
  fill: / +fill=\"(none|#[0-9a-f]+)\"/gi,
  stroke: / +stroke=\"(none|#[0-9a-f]+)\"/gi,

  // Sketch.app shit
  sketchMSShapeGroup: / +sketch:type=\"MSShapeGroup\"/gi,
  sketchMSPage: / +sketch:type=\"MSPage\"/gi,
  sketchMSLayerGroup: / +sketch:type=\"MSLayerGroup\"/gi,
}

// @styled(styles)
class SVGInline extends Component {
  render() {
    const {
      className,
      component,
      svg,
      fill,
      stroke,
    } = this.props

    let cleanup = this.props.cleanup
    if (
      // simple way to enable entire cleanup
      cleanup === true ||
      // passing cleanupExceptions enable cleanup as well
      (
        this.props.cleanup.length === 0 &&
        this.props.cleanupExceptions.length > 0
      )
    ) {
      cleanup = Object.keys(cleanups)
    }
    cleanup = cleanup.filter(
      key => {
        return !(this.props.cleanupExceptions.indexOf(key) > -1)
      }
    )

    const { width } = this.props
    let { height } = this.props

    if (width && height === undefined) {
      height = width
    }

    const props = { ...this.props }
    // remove useless props for wrapper
    delete props.svg
    delete props.fill
    delete props.stroke
    delete props.width
    delete props.height

    const classes = cx({
      "SVGInline": true,
      "SVGInline--cleaned": cleanup.length,
      [className]: className,
    })
    const svgClasses = classes
      .split(" ")
      .join(this.props.classSuffix + " ") + this.props.classSuffix

    return (
      React.createElement(
        component,
        {
          ...props, // take most props
          className: classes,
          dangerouslySetInnerHTML: {
            __html: SVGInline.cleanupSvg(svg, cleanup).replace(
              /<svg/,
              `<svg class="${ svgClasses }"` +
              (
                fill
                ? ` fill="${ fill }"`
                : ""
              ) +
              (
                stroke
                ? `stroke="${ stroke }"`
                : ""
              ) +
              (
                width || height
                ? " style=\"" +
                    (width ? `width: ${width};` : "") +
                    (height ? `height: ${height};` : "") +
                  "\""
                : ""
              )
            ),
          },
        }
      )
    )
  }
}

SVGInline.propTypes = {
  className: PropTypes.string,
  classSuffix: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  svg: PropTypes.string.isRequired,
  fill: PropTypes.string,
  cleanup: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  cleanupExceptions: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
}

SVGInline.defaultProps = {
  component: "span",
  classSuffix: "-svg",
  cleanup: [],
  cleanupExceptions: [],
}

SVGInline.cleanupSvg = (svg, cleanup = []) => {
  return Object.keys(cleanups)
    .filter(key => cleanup.indexOf(key) > -1)
    .reduce((acc, key) => {
      return acc.replace(cleanups[key], "")
    }, svg)
    .trim()
}

export default SVGInline
