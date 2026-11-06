export interface PrototypeVersion {
  id: string;
  label: string;
  href: string;
  /** Path segment used to detect the active deployment (empty for site root / latest). */
  pathSegment: string;
}

/** Latest first — default selection when path does not match a frozen snapshot. */
export const PROTOTYPE_VERSIONS: PrototypeVersion[] = [
  {
    id: 'v2.2',
    label: 'V2.2 Search and Help',
    href: 'https://sjcox-rh.github.io/HCC-AI-Search/',
    pathSegment: '',
  },
  {
    id: 'v2',
    label: 'V2',
    href: 'https://sjcox-rh.github.io/HCC-AI-Search/v2/',
    pathSegment: 'v2',
  },
  {
    id: 'v1',
    label: 'V1',
    href: 'https://sjcox-rh.github.io/HCC-AI-Search/v1/',
    pathSegment: 'v1',
  },
];

export const LATEST_PROTOTYPE_VERSION = PROTOTYPE_VERSIONS[0];

export function resolvePrototypeVersionFromPath(pathname: string = window.location.pathname): PrototypeVersion {
  const segments = pathname.split('/').filter(Boolean);
  // GitHub Pages: /HCC-AI-Search/v1/... or /HCC-AI-Search/v2/...
  const versionIdx = segments[0] === 'HCC-AI-Search' ? 1 : 0;
  const candidate = segments[versionIdx];
  if (candidate === 'v1' || candidate === 'v2') {
    const match = PROTOTYPE_VERSIONS.find((v) => v.pathSegment === candidate);
    if (match) return match;
  }
  return LATEST_PROTOTYPE_VERSION;
}
