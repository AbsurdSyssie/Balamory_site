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

// Fictional demo assertions must not depend on the practice's editable details.
const fixture = "tests/fixtures/balamory-practice";
const data = readPracticeFile(fixture);
const pages = listPages(fixture);

test("English fictional demo may omit facts, never a production validation bypass (H2/H7/H9)", () => {
  assert.deepEqual(validatePractice(data, { pages }).errors, []);
  for (const demo of [false, undefined, "true", 1]) {
    const real = structuredClone(data);
    real.demo = demo;
    const errors = validatePractice(real, { pages }).errors;
    for (const field of [
      "practice.ods_code",
      "sites[0].postcode",
      "online_services.online_consultation.url",
      "cqc",
      "gp_earnings",
    ]) {
      assert.ok(
        errors.some((error) => error.field === field),
        field,
      );
    }
    assert.equal(normalisePractice(real).fictional_demo, false);
  }
});

test("fictional demo still rejects unsafe data, supplied identities and embeds (H2/H4/H7)", () => {
  for (const [mutate, field] of [
    [(d) => (d.practice.nation = "scotland"), "practice.nation"],
    [(d) => (d.practice.ods_code = "invalid"), "practice.ods_code"],
    [(d) => (d.cqc = { location_id: "invalid" }), "cqc"],
    [(d) => (d.cqc = { location_id: "1-12345" }), "cqc"],
    [
      (d) => (d.cqc = { embed_html: '<iframe src="https://untrusted.invalid/"></iframe>' }),
      "cqc.embed_html",
    ],
    [(d) => (d.gp_earnings = { mean_earnings: -1 }), "gp_earnings.mean_earnings"],
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

test("only absent GP earnings may use the fictional demo allowance (H2)", () => {
  for (const earnings of [undefined, null]) {
    const absent = structuredClone(data);
    absent.gp_earnings = earnings;
    assert.deepEqual(validatePractice(absent, { pages }).errors, []);
    absent.demo = false;
    assert.ok(validatePractice(absent, { pages }).errors.some((e) => e.field === "gp_earnings"));
  }
});

test("supplied non-object GP earnings are rejected in demo and production (H2)", () => {
  for (const demo of [true, false]) {
    for (const earnings of [false, 0, [], "", "not an object"]) {
      const bad = structuredClone(data);
      bad.demo = demo;
      bad.gp_earnings = earnings;
      assert.ok(
        validatePractice(bad, { pages }).errors.some((e) => e.field === "gp_earnings"),
        `demo=${demo}, earnings=${JSON.stringify(earnings)}`,
      );
    }
  }
});

test("English fictional demo routes requests locally and urgent help to NHS 111 (H1/H9/H10)", () => {
  const p = normalisePractice(data);
  assert.equal(p.phone_link, "/online-requests/");
  assert.equal(p.online_services.online_consultation.url, "/online-requests/");
  assert.equal(p.practice.nation, "england");
  assert.equal(p.urgent.nhs111_url, "https://111.nhs.uk/");
  assert.equal(p.nhs_app_link.url, "https://www.nhs.uk/nhs-app/");
  assert.equal(p.online_services.nhs_app, false);
});
