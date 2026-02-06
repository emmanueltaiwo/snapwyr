// @ts-nocheck
import * as __fd_glob_10 from "../content/reference/api.mdx?collection=docs"
import * as __fd_glob_9 from "../content/guides/frameworks.mdx?collection=docs"
import * as __fd_glob_8 from "../content/guides/dashboard.mdx?collection=docs"
import * as __fd_glob_7 from "../content/guides/configuration.mdx?collection=docs"
import * as __fd_glob_6 from "../content/guides/basic-usage.mdx?collection=docs"
import * as __fd_glob_5 from "../content/getting-started/introduction.mdx?collection=docs"
import * as __fd_glob_4 from "../content/getting-started/installation.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/reference/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/guides/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/getting-started/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content", {"meta.json": __fd_glob_0, "getting-started/meta.json": __fd_glob_1, "guides/meta.json": __fd_glob_2, "reference/meta.json": __fd_glob_3, }, {"getting-started/installation.mdx": __fd_glob_4, "getting-started/introduction.mdx": __fd_glob_5, "guides/basic-usage.mdx": __fd_glob_6, "guides/configuration.mdx": __fd_glob_7, "guides/dashboard.mdx": __fd_glob_8, "guides/frameworks.mdx": __fd_glob_9, "reference/api.mdx": __fd_glob_10, });