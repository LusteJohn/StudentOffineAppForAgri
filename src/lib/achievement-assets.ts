import { Image } from "react-native";

const ASSET_MAP: Record<string, number> = {
  "lesson_badges/badge_m1_l1.png": require("../../assets/lesson_badges/badge_m1_l1.png"),
  "lesson_badges/badge_m1_l2.png": require("../../assets/lesson_badges/badge_m1_l2.png"),
  "lesson_badges/badge_m1_l3.png": require("../../assets/lesson_badges/badge_m1_l3.png"),
  "lesson_badges/badge_m1_l4.png": require("../../assets/lesson_badges/badge_m1_l4.png"),
  "lesson_badges/badge_m2_l1.png": require("../../assets/lesson_badges/badge_m2_l1.png"),
  "lesson_badges/badge_m2_l2.png": require("../../assets/lesson_badges/badge_m2_l2.png"),
  "lesson_badges/badge_m2_l3.png": require("../../assets/lesson_badges/badge_m2_l3.png"),
  "lesson_badges/badge_m2_l4.png": require("../../assets/lesson_badges/badge_m2_l4.png"),
  "lesson_badges/badge_m3_l1.png": require("../../assets/lesson_badges/badge_m3_l1.png"),
  "lesson_badges/badge_m3_l2.png": require("../../assets/lesson_badges/badge_m3_l2.png"),
  "lesson_badges/badge_m4_l1.png": require("../../assets/lesson_badges/badge_m4_l1.png"),
  "lesson_badges/badge_m4_l2.png": require("../../assets/lesson_badges/badge_m4_l2.png"),
  "lesson_badges/badge_m4_l3.png": require("../../assets/lesson_badges/badge_m4_l3.png"),
  "module_badges/badge_m1.png": require("../../assets/module_badges/badge_m1.png"),
  "module_badges/badge_m2.png": require("../../assets/module_badges/badge_m2.png"),
  "module_badges/badge_m3.png": require("../../assets/module_badges/badge_m3.png"),
  "module_badges/badge_m4.png": require("../../assets/module_badges/badge_m4.png"),
  "module_badges/module_complete.png": require("../../assets/module_badges/module_complete.png"),
};

export function resolveAchievementAsset(assetPath: string): number | null {
  if (!assetPath) return null;
  const lookup = assetPath.replace(/^assets\//, "");
  const direct = ASSET_MAP[lookup];
  if (direct != null) {
    return direct;
  }
  const withoutExt = lookup.replace(/\.[^.]+$/, "");
  const altPath =
    lookup.endsWith(".jpg") ? `${withoutExt}.png` :
    lookup.endsWith(".png") ? `${withoutExt}.jpg` :
    null;
  if (altPath) {
    const altModule = ASSET_MAP[altPath];
    if (altModule != null) {
      return altModule;
    }
  }
  console.warn("Achievement asset not mapped:", assetPath);
  return null;
}
