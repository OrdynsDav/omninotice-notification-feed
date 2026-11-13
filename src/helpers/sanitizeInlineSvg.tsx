import { useEffect, useState } from "react";

const svgElements = new Set([
  "svg",
  "g",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "defs",
  "lineargradient",
  "radialgradient",
  "stop",
  "clippath",
  "mask",
  "marker",
  "pattern",
  "symbol",
  "use",
  "title",
  "desc",
]);

const svgAttributes = new Set([
  "xmlns",
  "xmlns:xlink",
  "version",
  "viewbox",
  "width",
  "height",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "d",
  "points",
  "transform",
  "fill",
  "fill-rule",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "opacity",
  "clip-path",
  "clip-rule",
  "mask",
  "id",
  "class",
  "href",
  "xlink:href",
  "preserveaspectratio",
  "gradientunits",
  "gradienttransform",
  "spreadmethod",
  "offset",
  "stop-color",
  "stop-opacity",
  "markerwidth",
  "markerheight",
  "refx",
  "refy",
  "patternunits",
  "patterncontentunits",
  "patterntransform",
]);

function sanitizeSvg(source: string, className: string): string | null {
  const document = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = document.documentElement;
  if (
    root.localName.toLowerCase() !== "svg" ||
    root.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" ||
    document.querySelector("parsererror")
  ) {
    return null;
  }

  const sanitizeElement = (element: Element) => {
    if (!svgElements.has(element.localName.toLowerCase())) {
      element.remove();
      return;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const isAriaAttribute = /^aria-[a-z0-9-]+$/.test(name);
      const isAllowed = svgAttributes.has(name) || isAriaAttribute;
      const isSafeReference =
        !/url\s*\(/i.test(attribute.value) ||
        /^url\(\s*(['"]?)#[\w:.-]+\1\s*\)$/i.test(attribute.value);
      const isSafeHref =
        !["href", "xlink:href"].includes(name) ||
        /^#[\w:.-]+$/.test(attribute.value);

      if (!isAllowed || !isSafeReference || !isSafeHref) {
        element.removeAttributeNode(attribute);
      }
    }

    for (const child of Array.from(element.children)) {
      sanitizeElement(child);
    }
  };

  sanitizeElement(root);
  root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  root.setAttribute("class", className);
  root.setAttribute("width", "100%");
  root.setAttribute("height", "100%");
  return new XMLSerializer().serializeToString(root);
}

export function UrlIcon({
  url,
  className,
  alt,
  onImageError,
}: {
  url: string;
  className: string;
  alt: string;
  onImageError: (url: string) => void;
}) {
  const [inlineSvg, setInlineSvg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setInlineSvg(null);

    fetch(url)
      .then(async (response) => {
        if (!response.ok) return;

        const source = await response.text();
        const isSvg =
          response.headers.get("content-type")?.includes("image/svg+xml") ||
          /^\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>)/i.test(
            source,
          );
        if (!isSvg) return;

        const sanitized = sanitizeSvg(source, className);
        if (active && sanitized) setInlineSvg(sanitized);
      })
      .catch(() => {
        // Keep the existing image fallback for URLs that cannot be fetched.
      });

    return () => {
      active = false;
    };
  }, [className, url]);

  if (inlineSvg) {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: inlineSvg }}
      />
    );
  }

  return (
    <img
      className={className}
      src={url}
      alt={alt}
      onError={() => onImageError(url)}
    />
  );
}
