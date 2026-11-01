// SPDX-FileCopyrightText: 2026 Balamory demonstration contributors
// SPDX-License-Identifier: MIT

import configure from "./eleventy.config.js";
import { readPracticeFile } from "./lib/practice.js";

export default function (config) {
  const data = readPracticeFile("practice");
  if (process.env.PRACTICE_DIR || data.demo !== true || data.practice.nation !== "scotland") {
    throw new Error("This upload target is for the fictional Scottish demonstration only.");
  }
  config.addTemplate(
    "demo-headers.njk",
    "/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n",
    { permalink: "/_headers", eleventyExcludeFromCollections: true },
  );
  config.addTemplate("demo-robots.njk", "User-agent: *\nDisallow: /\n", {
    permalink: "/robots.txt",
    eleventyExcludeFromCollections: true,
  });
  return { ...configure(config), pathPrefix: "/" };
}
