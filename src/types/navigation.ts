import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps as RNBottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Bottom Tab Navigator Parameter List
 */
export type BottomTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Prescriptions: undefined;
  Profile: undefined;
};

/**
 * Root Stack Navigator Parameter List
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList> | undefined;
  DoctorDetails: { doctorId: string; doctorName?: string };
  BookingDetails: { bookingId: string };
  PrescriptionDetails: { prescriptionId: string };
  BookingSuccess: {
    bookingId: string;
    doctorId: string;
    doctorName: string;
    speciality: string;
    clinicName: string;
    appointmentDate: string;
    appointmentTime: string;
    consultationFee: number;
    patientName: string;
  };
};

/**
 * Screen Props Helpers for Type-Safe Navigation
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    RNBottomTabScreenProps<BottomTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
