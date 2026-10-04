import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  return (
    <View style={styles.row}>
      <ThemedText type="code" style={[styles.label, { color: isDark ? theme.textSecondary : '#64748b' }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.value, { color: theme.text }]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
  },
});
