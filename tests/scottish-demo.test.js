// SPDX-FileCopyrightText: 2026 Balamory demonstration contributors
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readPracticeFile,
  listPages,
  validatePractice,
  normalisePractice,
} from "../lib/practice.js";

// Scottish demo assertions must not depend on the practice's editable details.
const fixture = "tests/fixtures/balamory-practice";
const data = readPracticeFile(fixture);
const pages = listPages(fixture);

test("Scottish support is fictional only, not a production validation bypass (H2/H7/H9)", () => {
  assert.deepEqual(validatePractice(data, { pages }).errors, []);
  const real = structuredClone(data);
  real.demo = false;
  const errors = validatePractice(real, { pages }).errors;
  for (const field of [
    "practice.nation",
    "sites[0].postcode",
    "online_services.online_consultation.url",
  ]) {
    assert.ok(
      errors.some((error) => error.field === field),
      field,
    );
  }
});

test("Scottish demo still rejects unsafe data and embeds (H2/H4/H7)", () => {
  for (const [mutate, field] of [
    [(d) => (d.contact.phone = "123"), "contact.phone"],
    [(d) => (d.opening_hours.monday = []), "opening_hours.monday"],
    [(d) => (d.practice.description = "TODO"), "practice.description"],
    [
      (d) => (d.online_services.online_consultation.url = "/other/"),
      "online_services.online_consultation.url",
    ],
    [
      (d) =>
        (d.online_services.online_consultation.embed_html =
          '<iframe src="https://untrusted.invalid/"></iframe>'),
      "online_services.online_consultation.embed_html",
    ],
  ]) {
    const bad = structuredClone(data);
    mutate(bad);
    assert.ok(
      validatePractice(bad, { pages }).errors.some((e) => e.field === field),
      field,
    );
  }
});

test("Scottish demo routes requests locally and urgent help to NHS 24 (H1/H9/H10)", () => {
  const p = normalisePractice(data);
  assert.equal(p.phone_link, "/online-requests/");
  assert.equal(p.online_services.online_consultation.url, "/online-requests/");
  assert.equal(p.urgent.nhs111_url, "https://www.nhs24.scot/111/");
  assert.equal(p.online_services.nhs_app, false);
});
