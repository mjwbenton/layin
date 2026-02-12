import { describe, it, expect } from "vitest";
import { calculateSlots, LAYOUTS, DEFAULT_LAYOUT, DEFAULT_MARGINS } from "../lib/layout";
import { DEFAULT_PAPER } from "../lib/paper";
import type { Layout, Margins } from "../lib/types";

const postcard = DEFAULT_PAPER;

describe("LAYOUTS", () => {
  it("contains four layouts", () => {
    expect(LAYOUTS).toHaveLength(4);
  });

  it("has 1x1, 1x2, 2x1, 2x2", () => {
    expect(LAYOUTS.map((l) => l.label)).toEqual(["1x1", "1x2", "2x1", "2x2"]);
  });
});

describe("DEFAULT_LAYOUT", () => {
  it("is 1x1", () => {
    expect(DEFAULT_LAYOUT.label).toBe("1x1");
  });
});

describe("calculateSlots", () => {
  it("returns correct number of slots for each layout", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        DEFAULT_MARGINS,
      );
      expect(slots).toHaveLength(layout.rows * layout.cols);
    }
  });

  it("1x1 produces one slot", () => {
    const layout: Layout = { label: "1x1", rows: 1, cols: 1 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      DEFAULT_MARGINS,
    );
    expect(slots).toHaveLength(1);
  });

  it("2x2 produces four slots", () => {
    const layout: Layout = { label: "2x2", rows: 2, cols: 2 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      DEFAULT_MARGINS,
    );
    expect(slots).toHaveLength(4);
  });

  it("all slots have positive dimensions", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        DEFAULT_MARGINS,
      );
      for (const slot of slots) {
        expect(slot.width).toBeGreaterThan(0);
        expect(slot.height).toBeGreaterThan(0);
      }
    }
  });

  it("all slots within paper bounds", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        DEFAULT_MARGINS,
      );
      for (const slot of slots) {
        expect(slot.x).toBeGreaterThanOrEqual(0);
        expect(slot.y).toBeGreaterThanOrEqual(0);
        expect(slot.x + slot.width).toBeLessThanOrEqual(postcard.widthPx);
        expect(slot.y + slot.height).toBeLessThanOrEqual(postcard.heightPx);
      }
    }
  });

  it("all slots in a layout have equal dimensions", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        DEFAULT_MARGINS,
      );
      const first = slots[0];
      for (const slot of slots) {
        expect(slot.width).toBe(first.width);
        expect(slot.height).toBe(first.height);
      }
    }
  });

  it("slots do not overlap", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        DEFAULT_MARGINS,
      );
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const a = slots[i];
          const b = slots[j];
          const overlapsX = a.x < b.x + b.width && a.x + a.width > b.x;
          const overlapsY = a.y < b.y + b.height && a.y + a.height > b.y;
          expect(overlapsX && overlapsY).toBe(false);
        }
      }
    }
  });

  it("zero margins use full paper area", () => {
    const margins: Margins = { edgeMm: 0, gutterMm: 0 };
    const layout: Layout = { label: "1x1", rows: 1, cols: 1 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      margins,
    );
    expect(slots[0].x).toBe(0);
    expect(slots[0].y).toBe(0);
    expect(slots[0].width).toBe(postcard.widthPx);
    expect(slots[0].height).toBe(postcard.heightPx);
  });

  it("zero margins with 2x2 divides evenly", () => {
    const margins: Margins = { edgeMm: 0, gutterMm: 0 };
    const layout: Layout = { label: "2x2", rows: 2, cols: 2 };
    const slots = calculateSlots(1000, 1000, layout, margins);
    expect(slots).toHaveLength(4);
    for (const slot of slots) {
      expect(slot.width).toBe(500);
      expect(slot.height).toBe(500);
    }
  });

  it("1x2 slots are side by side", () => {
    const layout: Layout = { label: "1x2", rows: 1, cols: 2 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      DEFAULT_MARGINS,
    );
    expect(slots[0].y).toBe(slots[1].y);
    expect(slots[1].x).toBeGreaterThan(slots[0].x);
  });

  it("2x1 slots are stacked", () => {
    const layout: Layout = { label: "2x1", rows: 2, cols: 1 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      DEFAULT_MARGINS,
    );
    expect(slots[0].x).toBe(slots[1].x);
    expect(slots[1].y).toBeGreaterThan(slots[0].y);
  });
});
