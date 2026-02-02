// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"getting-started/installation.mdx": () => import("../content/getting-started/installation.mdx?collection=docs"), "getting-started/introduction.mdx": () => import("../content/getting-started/introduction.mdx?collection=docs"), "guides/basic-usage.mdx": () => import("../content/guides/basic-usage.mdx?collection=docs"), "guides/configuration.mdx": () => import("../content/guides/configuration.mdx?collection=docs"), "guides/dashboard.mdx": () => import("../content/guides/dashboard.mdx?collection=docs"), "guides/frameworks.mdx": () => import("../content/guides/frameworks.mdx?collection=docs"), "reference/api.mdx": () => import("../content/reference/api.mdx?collection=docs"), }),
};
export default browserCollections;