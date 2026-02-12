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
  it("contains three paper sizes", () => {
    expect(PAPER_SIZES).toHaveLength(3);
  });

  it("has Postcard as first entry", () => {
    expect(PAPER_SIZES[0].name).toBe("Postcard");
  });

  it("Postcard dimensions match spec", () => {
    const postcard = PAPER_SIZES[0];
    expect(postcard.widthMm).toBe(100);
    expect(postcard.heightMm).toBe(148);
    expect(postcard.widthPx).toBe(1181);
    expect(postcard.heightPx).toBe(1748);
  });

  it("L Size dimensions match spec", () => {
    const lsize = PAPER_SIZES[1];
    expect(lsize.widthMm).toBe(89);
    expect(lsize.heightMm).toBe(119);
    expect(lsize.widthPx).toBe(1051);
    expect(lsize.heightPx).toBe(1406);
  });

  it("Card dimensions match spec", () => {
    const card = PAPER_SIZES[2];
    expect(card.widthMm).toBe(54);
    expect(card.heightMm).toBe(86);
    expect(card.widthPx).toBe(638);
    expect(card.heightPx).toBe(1016);
  });

  it("pixel dimensions match mmToPx conversion", () => {
    for (const paper of PAPER_SIZES) {
      expect(paper.widthPx).toBe(mmToPx(paper.widthMm));
      expect(paper.heightPx).toBe(mmToPx(paper.heightMm));
    }
  });
});

describe("DEFAULT_PAPER", () => {
  it("is Postcard", () => {
    expect(DEFAULT_PAPER.name).toBe("Postcard");
  });
});
