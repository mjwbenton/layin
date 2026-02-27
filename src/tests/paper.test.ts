import { describe, it, expect } from "vitest";
import { mmToPx, PAPER_SIZES, DEFAULT_PAPER } from "../lib/paper";

describe("mmToPx", () => {
  it("converts 25.4mm to 300px (1 inch at 300 DPI)", () => {
    expect(mmToPx(25.4)).toBe(300);
  });

  it("converts 0mm to 0px", () => {
    expect(mmToPx(0)).toBe(0);
  });

  it("converts 100mm to 1181px (Postcard width)", () => {
    expect(mmToPx(100)).toBe(1181);
  });

  it("converts 148mm to 1748px (Postcard height)", () => {
    expect(mmToPx(148)).toBe(1748);
  });

  it("converts 2mm to 24px (default margin)", () => {
    expect(mmToPx(2)).toBe(24);
  });
});

describe("PAPER_SIZES", () => {
  it("contains one paper size", () => {
    expect(PAPER_SIZES).toHaveLength(1);
  });

  it("has Canon Selphy CP1000 Postcard as first entry", () => {
    expect(PAPER_SIZES[0].name).toBe("Canon Selphy CP1000 Postcard");
  });

  it("Postcard dimensions match spec", () => {
    const postcard = PAPER_SIZES[0];
    expect(postcard.widthMm).toBe(100);
    expect(postcard.heightMm).toBe(148);
    expect(postcard.widthPx).toBe(1181);
    expect(postcard.heightPx).toBe(1748);
  });

  it("pixel dimensions match mmToPx conversion", () => {
    for (const paper of PAPER_SIZES) {
      expect(paper.widthPx).toBe(mmToPx(paper.widthMm));
      expect(paper.heightPx).toBe(mmToPx(paper.heightMm));
    }
  });
});

describe("DEFAULT_PAPER", () => {
  it("is Canon Selphy CP1000 Postcard", () => {
    expect(DEFAULT_PAPER.name).toBe("Canon Selphy CP1000 Postcard");
  });
});
