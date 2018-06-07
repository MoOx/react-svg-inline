import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

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

  // remove fill
  fill: / +fill="(none|#[0-9a-f]+)"/gi,

  // Sketch.app shit
  sketchMSShapeGroup: / +sketch:type="MSShapeGroup"/gi,
  sketchMSPage: / +sketch:type="MSPage"/gi,
  sketchMSLayerGroup: / +sketch:type="MSLayerGroup"/gi
};

// @styled(styles)
class SVGInline extends Component {
  render() {
    const {
      className,
      component,
      svg,
      fill,
      width,
      accessibilityLabel,
      accessibilityDesc,
      classSuffix,
      cleanupExceptions,
      ...componentProps
    } = this.props;

    let { cleanup, height } = this.props;

    if (
      // simple way to enable entire cleanup
      cleanup === true ||
      // passing cleanupExceptions enable cleanup as well
      (cleanup.length === 0 && cleanupExceptions.length > 0)
    ) {
      cleanup = Object.keys(cleanups);
    }
    cleanup = cleanup.filter(key => {
      return !(cleanupExceptions.indexOf(key) > -1);
    });

    if (width && height === undefined) {
      height = width;
    }

    // remove useless props for wrapper
    delete componentProps.cleanup;
    delete componentProps.height;

    const classes = cx({
      SVGInline: true,
      "SVGInline--cleaned": cleanup.length,
      [className]: className
    });
    const svgClasses = classes.split(" ").join(classSuffix + " ") + classSuffix;
    let svgStr = SVGInline.cleanupSvg(svg, cleanup).replace(
      /<svg/,
      `<svg class="${svgClasses}"` +
        (fill ? ` fill="${fill}"` : "") +
        (width || height
          ? ' style="' +
            (width ? `width: ${width};` : "") +
            (height ? `height: ${height};` : "") +
            '"'
          : "")
    );
    let match;
    if (accessibilityDesc) {
      match = /<svg(.|\n|\r\n)*?>/.exec(svgStr);
      const pos = match.index + match[0].length;
      svgStr =
        svgStr.substr(0, pos) +
        `<desc>${accessibilityDesc}</desc>` +
        svgStr.substr(pos);
    }
    if (accessibilityLabel) {
      match = match || /<svg(.|\n|\r\n)*?>/.exec(svgStr);
      const pos = match.index + match[0].length - 1;
      const id = `SVGInline-${SVGInline.idCount++}-title`;
      svgStr =
        svgStr.substr(0, pos) +
        ` role="img" aria-labelledby="${id}"` +
        svgStr.substr(pos, 1) +
        `<title id="${id}">${accessibilityLabel}</title>` +
        svgStr.substr(pos + 1);
    }
    return React.createElement(component, {
      ...componentProps, // take most props
      className: classes,
      dangerouslySetInnerHTML: {
        __html: svgStr
      }
    });
  }
}

SVGInline.propTypes = {
  className: PropTypes.string,
  classSuffix: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  svg: PropTypes.string.isRequired,
  fill: PropTypes.string,
  cleanup: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  cleanupExceptions: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  accessibilityDesc: PropTypes.string
};

SVGInline.defaultProps = {
  component: "span",
  classSuffix: "-svg",
  cleanup: [],
  cleanupExceptions: []
};

SVGInline.idCount = 0;

SVGInline.cleanupSvg = (svg, cleanup = []) => {
  return Object.keys(cleanups)
    .filter(key => cleanup.indexOf(key) > -1)
    .reduce((acc, key) => {
      return acc.replace(cleanups[key], "");
    }, svg)
    .trim();
};

export default SVGInline;
