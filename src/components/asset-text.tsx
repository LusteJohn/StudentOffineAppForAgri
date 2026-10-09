import { StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import { Image } from "expo-image";

import { isAssetImagePath, resolveContentInfoAsset } from "@/lib/content-info-assets";

type AssetTextViewProps = {
  /** Value from the database. May be question text or an asset path. */
  value: string | null | undefined;
  style?: StyleProp<TextStyle>;
  fallbackText?: string;
};

/**
 * Renders a database value that is normally text but sometimes holds an image
 * path. Some seeded exercises store an asset path in the question column, so
 * this renders those as an image instead of showing the raw path.
 */
export function AssetTextView({ value, style, fallbackText }: AssetTextViewProps) {
  if (isAssetImagePath(value)) {
    const uri = resolveContentInfoAsset(value);
    if (uri) {
      return (
        <View style={styles.imageFrame}>
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="contain"
            contentPosition="center"
            cachePolicy="memory-disk"
            transition={100}
          />
        </View>
      );
    }
  }

  return <Text style={style}>{value?.trim() ? value : (fallbackText ?? "")}</Text>;
}

const styles = StyleSheet.create({
  imageFrame: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(148, 163, 184, 0.10)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
