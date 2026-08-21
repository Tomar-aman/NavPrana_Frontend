// NOTE: this layout deliberately exports no metadata.
//
// It used to export a full `metadata` object whose title and description
// disagreed with the one in ./page.jsx. The page always wins in the App Router,
// so the layout's copy was dead code that read as if it were live. Metadata for
// /products now lives in one place: generateMetadata() in ./page.jsx.

export default function ProductsLayout({ children }) {
  return children;
}
