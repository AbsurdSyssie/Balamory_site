// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

// Builds the site from the practice's own details in practice/ and the frozen
// demo, Balamory and Wales fixtures, then checks the output. Tests that
// use "site" must pass for any valid practice, because practices run them on
// their own copy before publishing. These tests protect the clinical safety controls described
// in docs/clinical-safety/hazard-log.md.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Eleventy from "@11ty/eleventy";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "practice-build-"));

async function build(practiceDir, name) {
  const output = path.join(tmp, name);
  process.env.PRACTICE_DIR = practiceDir;
  const elev = new Eleventy("src", output, {
    configPath: "eleventy.config.js",
    quietMode: true,
  });
  await elev.write();
  delete process.env.PRACTICE_DIR;
  return output;
}

function htmlFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dir, f));
}

const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");

let site;
let demo;
let wales;
let balamory;

before(async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    site = await build("practice", "site");
    demo = await build("tests/fixtures/demo-practice", "demo");
    wales = await build("tests/fixtures/wales-practice", "wales");
    balamory = await build("tests/fixtures/balamory-practice", "balamory");
  } finally {
    console.warn = warn;
  }
});

after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test("every page shows 999 and 111 urgent help (hazard H1)", () => {
  for (const dir of [site, demo, wales, balamory]) {
    const files = htmlFiles(dir);
    assert.ok(files.length > 10);
    for (const file of files) {
      const html = fs.readFileSync(file, "utf8");
      assert.match(html, /data-safety="urgent-help"/, `${file} is missing urgent help`);
      assert.match(html, /href="tel:999"/, `${file} is missing 999`);
      assert.match(html, /href="tel:111"/, `${file} is missing 111`);
    }
  }
});

test("urgent help links to the right 111 service for the nation", () => {
  assert.match(read(demo, "index.html"), /https:\/\/111\.nhs\.uk\//);
  assert.match(read(wales, "index.html"), /https:\/\/111\.wales\.nhs\.uk\//);
  assert.doesNotMatch(read(wales, "index.html"), /https:\/\/111\.nhs\.uk\//);
});

test("Scottish demo urgent-help page highlights existing emergency guidance (hazard H1)", () => {
  const html = read(balamory, "urgent-help/index.html");
  assert.match(html, /class="nhsuk-card nhsuk-card--warning"/);
  assert.match(html, /<h2 class="nhsuk-card__heading">[\s\S]*?Emergency help[\s\S]*?<\/h2>/);
  assert.match(html, /Emergency help/);
  assert.match(html, /If it is a life-threatening emergency/);
  assert.match(html, /href="tel:999"[^>]*>999<\/a>/);
  assert.match(html, /or go to A&amp;E/);
  assert.match(html, /href="tel:111"[^>]*>111<\/a>/);
  assert.match(html, /NHS 24/);
  assert.match(html, /nhs24\.scot\/111/);
});

test("all standard pages are built", () => {
  for (const page of [
    "index.html",
    "appointments/index.html",
    "prescriptions/index.html",
    "test-results/index.html",
    "opening-times/index.html",
    "contact/index.html",
    "register/index.html",
    "our-team/index.html",
    "services/index.html",
    "news/index.html",
    "about/index.html",
    "urgent-help/index.html",
    "complaints/index.html",
    "accessibility-statement/index.html",
    "cookies/index.html",
    "privacy-notice/index.html",
    "404.html",
  ]) {
    assert.ok(fs.existsSync(path.join(site, page)), `${page} was not built`);
  }
});

test("NHS.UK frontend assets are copied", () => {
  for (const asset of [
    "assets/nhsuk-frontend.min.css",
    "assets/nhsuk-frontend.min.js",
    "assets/init.js",
    "assets/practice.css",
    "assets/images/favicon.svg",
  ]) {
    assert.ok(fs.existsSync(path.join(site, asset)), `${asset} is missing`);
  }
});

test("NHS.UK frontend macros render as HTML, not escaped text", () => {
  const html = read(site, "index.html");
  assert.match(html, /<header class="nhsuk-header/);
  assert.doesNotMatch(html, /&lt;div class=/);
});

test("the demo site is labelled and hidden from search engines", () => {
  const html = read(demo, "index.html");
  assert.match(html, /demonstration website for a fictional GP practice/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(read(wales, "index.html"), /fictional GP practice/);
});

test("the online consultation link and phone number are on the appointments page", () => {
  const html = read(demo, "appointments/index.html");
  assert.match(html, /href="https:\/\/example\.com\/fernmoor-online-consultation"/);
  assert.match(html, /href="tel:\+441632960000"/);
});

test("embed code is included as given", () => {
  assert.match(
    read(wales, "appointments/index.html"),
    /<script src="https:\/\/widget\.klinik\.co\.uk\/embed\.js"><\/script>/,
  );
});

test("England sites show CQC and GP earnings; Wales sites show HIW instead", () => {
  const england = read(demo, "about/index.html");
  assert.match(england, /cqc\.org\.uk\/location\/1-000000000/);
  assert.match(england, /£82,000 before tax and National Insurance/);
  const welsh = read(wales, "about/index.html");
  assert.match(welsh, /Healthcare Inspectorate Wales/);
  assert.doesNotMatch(welsh, /GP earnings/);
});

test("opening times are written in NHS style", () => {
  const html = read(demo, "opening-times/index.html");
  assert.match(html, /8am to 6:30pm/);
  assert.match(html, /7:30am to 6:30pm/);
  assert.match(html, /Saturday<\/th>\s*<td class="nhsuk-table__cell">\s*Closed/);
});

test("extra Markdown pages are built and linked from the services page", () => {
  assert.match(read(demo, "fit-notes/index.html"), /<h1>Fit notes<\/h1>/);
  assert.match(read(demo, "services/index.html"), /href="\/fit-notes\/">Fit notes</);
});

test("the accessibility statement names the practice and contact details", () => {
  const html = read(demo, "accessibility-statement/index.html");
  assert.match(html, /applies to the Fernmoor Medical Practice website/);
  assert.match(html, /01632\u00a0960000/);
});

test("Wales complaints point to Putting Things Right and the Welsh ombudsman", () => {
  const html = read(wales, "complaints/index.html");
  assert.match(html, /Putting Things Right/);
  assert.match(html, /ombudsman\.wales/);
});

test("the appointments page warns against using the form in an emergency (hazard H5)", () => {
  const html = read(demo, "appointments/index.html");
  assert.match(html, /nhsuk-card--care--emergency/);
  assert.match(html, /Do not use our online form/);
});

test("Balamory requests are inert and Scottish signposting stays truthful (H1/H7/H9/H10)", () => {
  const home = read(balamory, "index.html");
  assert.match(home, /Balamory Group Practice/);
  assert.match(home, /src="\/images\/tobermory-harbour\.jpg" width="640" height="377"/);
  assert.match(home, /alt="Colourful waterfront buildings reflected in Tobermory harbour\."/);
  assert.match(
    home,
    /href="https:\/\/commons\.wikimedia\.org\/wiki\/File:Not_Balamory_but_Tobermory_-_geograph\.org\.uk_-_1464192\.jpg">Tim S Addison \/ Not Balamory but Tobermory<\/a> \/ <a href="https:\/\/creativecommons\.org\/licenses\/by-sa\/2\.0\/">CC BY-SA 2\.0/,
  );
  assert.ok(fs.existsSync(path.join(balamory, "images/tobermory-harbour.jpg")));
  assert.doesNotMatch(home, /href="[^"]*nhsuk-icon|href="[^"]*favicon/);
  assert.match(home, /NHS App \(England\)/);
  assert.match(home, /href="https:\/\/www\.nhs\.uk\/nhs-app\/"/);
  assert.match(
    read(balamory, "online-requests/index.html"),
    /<p>Your PATCHS\/Accurx booking page here<\/p>/,
  );
  for (const file of htmlFiles(balamory)) {
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /https:\/\/www\.nhs24\.scot\/111\//, file);
    assert.equal(
      (html.match(/demonstration website for a fictional GP practice/g) ?? []).length,
      1,
      file,
    );
    assert.match(html, /<meta name="robots" content="noindex">/, file);
    assert.doesNotMatch(
      html,
      /<form\b|<iframe\b|cqc\.org\.uk|111\.nhs\.uk|111\.wales|ombudsman\.wales|NHS 24 online|maps\.google|tel:\+441632|Z00001/i,
      file,
    );
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      assert.ok(
        !/^https?:/.test(href) ||
          /^https:\/\/(www\.)?(nhs24\.scot|nhsinform\.scot|nhs\.uk|cloudflare\.com|geograph\.org\.uk|commons\.wikimedia\.org|creativecommons\.org)\//.test(
            href,
          ),
        `${file}: ${href}`,
      );
      if (href.startsWith("/") && !href.startsWith("/assets/") && !href.startsWith("/images/")) {
        const target = href === "/" ? "index.html" : `${href.slice(1)}index.html`;
        assert.ok(fs.existsSync(path.join(balamory, target)), `${file}: broken ${href}`);
      }
    }
  }
  for (const page of [
    "appointments",
    "prescriptions",
    "register",
    "test-results",
    "fit-notes",
    "contact",
    "complaints",
  ]) {
    assert.match(read(balamory, `${page}/index.html`), /href="\/online-requests\/"/, page);
  }
  assert.equal((home.match(/class="island-task" href="\/online-requests\/"/g) ?? []).length, 6);
  assert.doesNotMatch(read(balamory, "our-team/index.html"), /named accountable GP/);
  assert.match(
    read(balamory, "prescriptions/index.html"),
    /nhsinform\.scot\/tests-and-treatments\/medicines-and-medical-aids\/prescriptions\//,
  );
  assert.doesNotMatch(
    read(balamory, "prescriptions/index.html"),
    /href="[^"]*nhs-services\/pharmacy\/"/,
  );
});
