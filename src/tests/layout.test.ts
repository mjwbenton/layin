import { describe, it, expect } from "vitest";
import { calculateSlots, computeEffectiveMargins, LAYOUTS, DEFAULT_LAYOUT, DEFAULT_MARGINS } from "../lib/layout";
import { DEFAULT_PAPER, SELPHY_BLEED, rotateBleedLandscape, mmToPx } from "../lib/paper";
import type { Layout, Margins, Bleed } from "../lib/types";

const postcard = DEFAULT_PAPER;

// Helper: compute effective margins without bleed (matches old symmetric behavior)
function symmetricMargins(margins: Margins) {
  return computeEffectiveMargins(margins);
}

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
        symmetricMargins(DEFAULT_MARGINS),
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
      symmetricMargins(DEFAULT_MARGINS),
    );
    expect(slots).toHaveLength(1);
  });

  it("2x2 produces four slots", () => {
    const layout: Layout = { label: "2x2", rows: 2, cols: 2 };
    const slots = calculateSlots(
      postcard.widthPx,
      postcard.heightPx,
      layout,
      symmetricMargins(DEFAULT_MARGINS),
    );
    expect(slots).toHaveLength(4);
  });

  it("all slots have positive dimensions", () => {
    for (const layout of LAYOUTS) {
      const slots = calculateSlots(
        postcard.widthPx,
        postcard.heightPx,
        layout,
        symmetricMargins(DEFAULT_MARGINS),
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
        symmetricMargins(DEFAULT_MARGINS),
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
        symmetricMargins(DEFAULT_MARGINS),
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
        symmetricMargins(DEFAULT_MARGINS),
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
      symmetricMargins(margins),
    );
    expect(slots[0].x).toBe(0);
    expect(slots[0].y).toBe(0);
    expect(slots[0].width).toBe(postcard.widthPx);
    expect(slots[0].height).toBe(postcard.heightPx);
  });

  it("zero margins with 2x2 divides evenly", () => {
    const margins: Margins = { edgeMm: 0, gutterMm: 0 };
    const layout: Layout = { label: "2x2", rows: 2, cols: 2 };
    const slots = calculateSlots(1000, 1000, layout, symmetricMargins(margins));
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
      symmetricMargins(DEFAULT_MARGINS),
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
      symmetricMargins(DEFAULT_MARGINS),
    );
    expect(slots[0].x).toBe(slots[1].x);
    expect(slots[1].y).toBeGreaterThan(slots[0].y);
  });

  it("asymmetric margins produce correct slot positions", () => {
    const layout: Layout = { label: "1x1", rows: 1, cols: 1 };
    const em = computeEffectiveMargins(
      { edgeMm: 5, gutterMm: 0 },
      SELPHY_BLEED,
    );
    const slots = calculateSlots(postcard.widthPx, postcard.heightPx, layout, em);
    // top: 5 + 4.25 = 9.25mm, bottom: 5 + 5.5 = 10.5mm, left: 5 + 3.6 = 8.6mm, right: 5 + 3 = 8mm
    expect(slots[0].x).toBe(mmToPx(8.6));
    expect(slots[0].y).toBe(mmToPx(9.25));
    expect(slots[0].width).toBe(postcard.widthPx - mmToPx(8.6) - mmToPx(8));
    expect(slots[0].height).toBe(postcard.heightPx - mmToPx(9.25) - mmToPx(10.5));
  });
});

describe("computeEffectiveMargins", () => {
  it("without bleed returns symmetric margins", () => {
    const em = computeEffectiveMargins({ edgeMm: 5, gutterMm: 3 });
    const edgePx = mmToPx(5);
    expect(em.topPx).toBe(edgePx);
    expect(em.bottomPx).toBe(edgePx);
    expect(em.leftPx).toBe(edgePx);
    expect(em.rightPx).toBe(edgePx);
    expect(em.gutterPx).toBe(mmToPx(3));
  });

  it("with bleed adds bleed to each side", () => {
    const bleed: Bleed = { topMm: 4.25, bottomMm: 5.5, leftMm: 3.5, rightMm: 3 };
    const em = computeEffectiveMargins({ edgeMm: 5, gutterMm: 2 }, bleed);
    expect(em.topPx).toBe(mmToPx(9.25));
    expect(em.bottomPx).toBe(mmToPx(10.5));
    expect(em.leftPx).toBe(mmToPx(8.5));
    expect(em.rightPx).toBe(mmToPx(8));
    expect(em.gutterPx).toBe(mmToPx(2));
  });

  it("with zero edge and bleed returns bleed only", () => {
    const bleed: Bleed = { topMm: 4.25, bottomMm: 5.5, leftMm: 3.5, rightMm: 3 };
    const em = computeEffectiveMargins({ edgeMm: 0, gutterMm: 0 }, bleed);
    expect(em.topPx).toBe(mmToPx(4.25));
    expect(em.bottomPx).toBe(mmToPx(5.5));
    expect(em.leftPx).toBe(mmToPx(3.5));
    expect(em.rightPx).toBe(mmToPx(3));
  });
});

describe("rotateBleedLandscape", () => {
  it("rotates portrait bleed for landscape orientation", () => {
    const portrait: Bleed = { topMm: 4.25, bottomMm: 5.5, leftMm: 3.5, rightMm: 3 };
    const landscape = rotateBleedLandscape(portrait);
    // Matches export's 90° CW rotation
    expect(landscape.topMm).toBe(3);      // portrait right
    expect(landscape.rightMm).toBe(5.5);  // portrait bottom
    expect(landscape.bottomMm).toBe(3.5); // portrait left
    expect(landscape.leftMm).toBe(4.25);   // portrait top
  });

  it("identity for uniform bleed", () => {
    const uniform: Bleed = { topMm: 5, bottomMm: 5, leftMm: 5, rightMm: 5 };
    const rotated = rotateBleedLandscape(uniform);
    expect(rotated).toEqual(uniform);
  });
});
