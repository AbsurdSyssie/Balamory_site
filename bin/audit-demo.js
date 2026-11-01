// SPDX-FileCopyrightText: 2026 Balamory demonstration contributors
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "_preview";
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html"));
assert.equal(files.length, 19);
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.equal(
    (html.match(/demonstration website for a fictional GP practice/g) ?? []).length,
    1,
    file,
  );
  assert.match(html, /<meta name="robots" content="noindex">/, file);
  assert.match(html, /data-safety="urgent-help"/, file);
  assert.match(html, /href="tel:999"/, file);
  assert.match(html, /href="tel:111"/, file);
  assert.match(html, /https:\/\/www\.nhs24\.scot\/111\//, file);
  assert.doesNotMatch(
    html,
    /<form\b|<iframe\b|<script[^>]+src="https?:|cqc\.org\.uk|111\.nhs\.uk|tel:\+441632|Z00001|Fernmoor|Millbrook/i,
    file,
  );
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith("/")) {
      const target = href.endsWith("/") ? `${href.slice(1)}index.html` : href.slice(1);
      assert.ok(fs.existsSync(path.join(root, target)), `${file}: ${href}`);
    }
  }
}
assert.match(
  fs.readFileSync(`${root}/online-requests/index.html`, "utf8"),
  /<p>Your PATCHS\/Accurx booking page here<\/p>/,
);
assert.match(fs.readFileSync(`${root}/_headers`, "utf8"), /X-Robots-Tag: noindex, nofollow/);
assert.match(fs.readFileSync(`${root}/_headers`, "utf8"), /no-transform/);
assert.equal(fs.readFileSync(`${root}/robots.txt`, "utf8"), "User-agent: *\nDisallow: /\n");
console.log(`Audited ${files.length} fictional demo pages and deployment controls.`);
