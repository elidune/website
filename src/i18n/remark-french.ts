import { frenchTypography } from './typography';

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
};

function walk(node: MdNode): void {
  if (node.type === 'code' || node.type === 'inlineCode' || node.type === 'html') return;
  if (node.type === 'text' && node.value) node.value = frenchTypography(node.value);
  for (const child of node.children ?? []) walk(child);
}

/** Apply French punctuation to Markdown text nodes under src/content/docs/fr. */
export function remarkFrenchTypography() {
  return (tree: MdNode, file: { path?: string; history?: string[] }) => {
    const source = String(file.path ?? file.history?.[0] ?? '');
    const french =
      source.includes('/docs/fr/') ||
      source.includes('/dev/fr/') ||
      source.includes('\\docs\\fr\\') ||
      source.includes('\\dev\\fr\\');
    if (!french) return;
    walk(tree);
  };
}
