import { describe, it, expect } from "vitest";
import { calculateImageDrawRect } from "../lib/canvas-renderer";

describe("calculateImageDrawRect", () => {
  const slotX = 100;
  const slotY = 200;
  const slotW = 400;
  const slotH = 300;

  describe("fill mode", () => {
    it("landscape image into landscape slot — crops sides", () => {
      // 1600x900 image (16:9) into 400x300 slot (4:3)
      const rect = calculateImageDrawRect(1600, 900, slotX, slotY, slotW, slotH, "fill");
      // Image wider than slot: crop sides
      expect(rect.sh).toBe(900); // full height used
      expect(rect.sw).toBeCloseTo(900 * (4 / 3)); // width cropped to slot aspect
      expect(rect.sx).toBeCloseTo((1600 - rect.sw) / 2); // centered crop
      expect(rect.sy).toBe(0);
      expect(rect.dx).toBe(slotX);
      expect(rect.dy).toBe(slotY);
      expect(rect.dw).toBe(slotW);
      expect(rect.dh).toBe(slotH);
    });

    it("portrait image into landscape slot — crops top/bottom", () => {
      // 600x1000 image into 400x300 slot
      const rect = calculateImageDrawRect(600, 1000, slotX, slotY, slotW, slotH, "fill");
      // Image taller than slot: crop top/bottom
      expect(rect.sw).toBe(600); // full width used
      expect(rect.sh).toBeCloseTo(600 / (4 / 3)); // height cropped to slot aspect
      expect(rect.sx).toBe(0);
      expect(rect.sy).toBeCloseTo((1000 - rect.sh) / 2); // centered crop
      expect(rect.dx).toBe(slotX);
      expect(rect.dy).toBe(slotY);
      expect(rect.dw).toBe(slotW);
      expect(rect.dh).toBe(slotH);
    });

    it("exact aspect ratio image — no crop needed", () => {
      // 800x600 image (4:3) into 400x300 slot (4:3)
      const rect = calculateImageDrawRect(800, 600, slotX, slotY, slotW, slotH, "fill");
      expect(rect.sx).toBeCloseTo(0);
      expect(rect.sy).toBeCloseTo(0);
      expect(rect.sw).toBeCloseTo(800);
      expect(rect.sh).toBeCloseTo(600);
      expect(rect.dx).toBe(slotX);
      expect(rect.dy).toBe(slotY);
      expect(rect.dw).toBe(slotW);
      expect(rect.dh).toBe(slotH);
    });

    it("always fills the entire slot", () => {
      const images = [
        [1600, 900],
        [600, 1000],
        [800, 600],
        [100, 100],
      ];
      for (const [w, h] of images) {
        const rect = calculateImageDrawRect(w, h, slotX, slotY, slotW, slotH, "fill");
        expect(rect.dx).toBe(slotX);
        expect(rect.dy).toBe(slotY);
        expect(rect.dw).toBe(slotW);
        expect(rect.dh).toBe(slotH);
      }
    });
  });

  describe("fit mode", () => {
    it("landscape image into landscape slot — fits to width", () => {
      // 1600x900 image (16:9) into 400x300 slot (4:3)
      const rect = calculateImageDrawRect(1600, 900, slotX, slotY, slotW, slotH, "fit");
      // Image wider: fit to width, letterbox vertically
      expect(rect.sx).toBe(0);
      expect(rect.sy).toBe(0);
      expect(rect.sw).toBe(1600);
      expect(rect.sh).toBe(900);
      expect(rect.dw).toBe(slotW); // fills width
      expect(rect.dh).toBeCloseTo(slotW / (16 / 9)); // scaled height
      expect(rect.dx).toBe(slotX); // left-aligned with slot
      expect(rect.dy).toBeCloseTo(slotY + (slotH - rect.dh) / 2); // centered vertically
    });

    it("portrait image into landscape slot — fits to height", () => {
      // 600x1000 image into 400x300 slot
      const rect = calculateImageDrawRect(600, 1000, slotX, slotY, slotW, slotH, "fit");
      expect(rect.sx).toBe(0);
      expect(rect.sy).toBe(0);
      expect(rect.sw).toBe(600);
      expect(rect.sh).toBe(1000);
      expect(rect.dh).toBe(slotH); // fills height
      expect(rect.dw).toBeCloseTo(slotH * (600 / 1000)); // scaled width
      expect(rect.dy).toBe(slotY); // top-aligned with slot
      expect(rect.dx).toBeCloseTo(slotX + (slotW - rect.dw) / 2); // centered horizontally
    });

    it("exact aspect ratio image — fills entire slot", () => {
      // 800x600 image (4:3) into 400x300 slot (4:3)
      const rect = calculateImageDrawRect(800, 600, slotX, slotY, slotW, slotH, "fit");
      expect(rect.dw).toBeCloseTo(slotW);
      expect(rect.dh).toBeCloseTo(slotH);
      expect(rect.dx).toBeCloseTo(slotX);
      expect(rect.dy).toBeCloseTo(slotY);
    });

    it("uses full source image", () => {
      const images = [
        [1600, 900],
        [600, 1000],
        [800, 600],
        [100, 100],
      ];
      for (const [w, h] of images) {
        const rect = calculateImageDrawRect(w, h, slotX, slotY, slotW, slotH, "fit");
        expect(rect.sx).toBe(0);
        expect(rect.sy).toBe(0);
        expect(rect.sw).toBe(w);
        expect(rect.sh).toBe(h);
      }
    });

    it("rendered image stays within slot bounds", () => {
      const images = [
        [1600, 900],
        [600, 1000],
        [800, 600],
        [100, 100],
      ];
      for (const [w, h] of images) {
        const rect = calculateImageDrawRect(w, h, slotX, slotY, slotW, slotH, "fit");
        expect(rect.dx).toBeGreaterThanOrEqual(slotX - 0.01);
        expect(rect.dy).toBeGreaterThanOrEqual(slotY - 0.01);
        expect(rect.dx + rect.dw).toBeLessThanOrEqual(slotX + slotW + 0.01);
        expect(rect.dy + rect.dh).toBeLessThanOrEqual(slotY + slotH + 0.01);
      }
    });
  });

  describe("square image", () => {
    it("fill into landscape slot — crops top/bottom", () => {
      const rect = calculateImageDrawRect(500, 500, slotX, slotY, slotW, slotH, "fill");
      expect(rect.sw).toBe(500);
      expect(rect.sh).toBeCloseTo(500 / (4 / 3));
      expect(rect.dw).toBe(slotW);
      expect(rect.dh).toBe(slotH);
    });

    it("fit into landscape slot — fits to height", () => {
      const rect = calculateImageDrawRect(500, 500, slotX, slotY, slotW, slotH, "fit");
      expect(rect.dh).toBe(slotH);
      expect(rect.dw).toBe(slotH); // square, so dw = dh
    });
  });
});
