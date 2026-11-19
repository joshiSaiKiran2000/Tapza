import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const theme = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const HomeScreenSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.skeletonContainer, { padding: theme.spacing.md }]}>
      {/* Top Banner Skeleton */}
      <Skeleton height={180} borderRadius={20} style={{ marginBottom: 16 }} />

      {/* Quick Actions Skeleton */}
      <Skeleton height={22} width={130} borderRadius={6} style={{ marginBottom: 12 }} />
      <View style={styles.gridRow}>
        <Skeleton width="48%" height={80} borderRadius={16} />
        <Skeleton width="48%" height={80} borderRadius={16} />
      </View>
      <View style={[styles.gridRow, { marginTop: 12, marginBottom: 20 }]}>
        <Skeleton width="48%" height={80} borderRadius={16} />
        <Skeleton width="48%" height={80} borderRadius={16} />
      </View>

      {/* Chips Skeleton */}
      <Skeleton height={22} width={150} borderRadius={6} style={{ marginBottom: 12 }} />
      <View style={styles.chipsRow}>
        <Skeleton width={110} height={44} borderRadius={22} style={{ marginRight: 8 }} />
        <Skeleton width={120} height={44} borderRadius={22} style={{ marginRight: 8 }} />
        <Skeleton width={100} height={44} borderRadius={22} />
      </View>

      {/* Doctor Carousel Skeleton */}
      <Skeleton height={22} width={170} borderRadius={6} style={{ marginTop: 24, marginBottom: 12 }} />
      <View style={styles.chipsRow}>
        <Skeleton width={260} height={160} borderRadius={18} style={{ marginRight: 12 }} />
        <Skeleton width={260} height={160} borderRadius={18} />
      </View>
    </View>
  );
};

export const DoctorDetailsSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.skeletonContainer, { padding: theme.spacing.md }]}>
      {/* Doctor Profile Card */}
        <View
          style={[
            styles.profileHeader,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Skeleton width={60} height={60} borderRadius={16} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Skeleton height={22} width="70%" borderRadius={6} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width="50%" borderRadius={4} style={{ marginBottom: 6 }} />
            <Skeleton height={14} width="35%" borderRadius={4} />
          </View>
        </View>

        {/* Date Selector Skeleton */}
        <Skeleton height={20} width={180} borderRadius={4} style={{ marginTop: 24, marginBottom: 10 }} />
        <View style={styles.chipsRow}>
          <Skeleton width={64} height={64} borderRadius={14} style={{ marginRight: 8 }} />
          <Skeleton width={64} height={64} borderRadius={14} style={{ marginRight: 8 }} />
          <Skeleton width={64} height={64} borderRadius={14} style={{ marginRight: 8 }} />
          <Skeleton width={64} height={64} borderRadius={14} />
        </View>

        {/* Clinic Skeleton */}
        <Skeleton height={100} borderRadius={16} style={{ marginTop: 20 }} />

        {/* Button Skeleton */}
        <Skeleton height={50} borderRadius={14} style={{ marginTop: 24 }} />
      </View>
      );
};

export const PrescriptionListSkeleton: React.FC = () => {
  const theme = useTheme();

      return (
      <View style={[styles.skeletonContainer, { padding: theme.spacing.md }]}>
        {/* Dose Progress Tracker Skeleton */}
        <Skeleton height={90} borderRadius={16} style={{ marginBottom: 18 }} />

        <Skeleton height={22} width={160} borderRadius={6} style={{ marginBottom: 12 }} />

        {/* Prescription Cards */}
        <Skeleton height={130} borderRadius={16} style={{ marginBottom: 14 }} />
        <Skeleton height={130} borderRadius={16} style={{ marginBottom: 14 }} />
        <Skeleton height={130} borderRadius={16} />
      </View>
      );
};

export const BookingListSkeleton: React.FC = () => {
  const theme = useTheme();

      return (
      <View style={[styles.skeletonContainer, { padding: theme.spacing.md }]}>
        <Skeleton height={140} borderRadius={16} style={{ marginBottom: 14 }} />
        <Skeleton height={140} borderRadius={16} style={{ marginBottom: 14 }} />
        <Skeleton height={140} borderRadius={16} />
      </View>
      );
};

      const styles = StyleSheet.create({
        skeletonContainer: {
        flex: 1,
  },
      gridRow: {
        flexDirection: 'row',
      justifyContent: 'space-between',
  },
      chipsRow: {
        flexDirection: 'row',
  },
      profileHeader: {
        flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
});
