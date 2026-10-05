import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}