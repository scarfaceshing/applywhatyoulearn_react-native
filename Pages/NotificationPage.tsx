import React from 'react';
import {Button, Text} from 'react-native';
import {IProps, IState} from 'types-module';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

PushNotification.deleteChannel('channel_01');

PushNotification.createChannel(
  {
    channelId: 'channel_01', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'my_sound.mp3',
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.getChannels(function (channel_ids) {
  console.log(channel_ids); // ['channel_id_1']
});

PushNotification.channelExists('channel_01', function (exists) {
  console.log(exists); // true/false
});

const picture =
  'https://scontent.fmnl5-2.fna.fbcdn.net/v/t39.30808-6/344349487_1528539717677418_6510000352953720409_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeE0Ksl8hQd3xew73PyBawmhNWjKKpEr-qY1aMoqkSv6pjcO7TxjavV10qF7Xd_Yg-GqPiJKf423UK4jEHfkUpSq&_nc_ohc=yhRnVETqqkgAX8QpCC3&_nc_ht=scontent.fmnl5-2.fna&oh=00_AfDZQtQHCqR4Fvcm_JDuvQwvA-BFxjVrrNunke2yNEHY8g&oe=646A5A35';

class NotificationPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {}

  runNotification(): void {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'channel_01', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      ticker: 'My Notification Ticker', // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: 'bubble_icon', // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: picture, // (optional) default: undefined
      smallIcon: 'bubble_icon', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText:
        'My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)', // (optional) default: "message" prop
      subText: 'This is a subText', // (optional) default: none
      bigPictureUrl: picture, // (optional) default: undefined
      bigLargeIcon: 'ic_launcher', // (optional) default: undefined
      bigLargeIconUrl: picture, // (optional) default: undefined
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

      when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

      actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      category: '', // (optional) default: empty string
      subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Hoy Bugtaw', // (optional)
      message: 'Testing ko lang na Notipikasyon', // (required)
      picture: picture, // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: 'my_sound.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });

    // PushNotification.localNotificationSchedule({
    //   channelId: 'channel_01',
    //   //... You can use all the options from localNotifications
    //   message: 'My Notification Message', // (required)
    //   date: new Date(Date.now() + 1 * 1000), // in 60 secs
    //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    //   soundName: 'my_sound', // (optional) See `soundName` parameter of `localNotification` function
    //   picture: 'picture',
    //   /* Android Only Properties */
    //   repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    // });
  }

  clearAllNotification(): void {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
  }

  render() {
    return (
      <>
        <Button
          onPress={() => this.runNotification()}
          title="Run Notification"
        />
        <Button
          onPress={() => this.clearAllNotification()}
          title="Clear Notification"
        />
      </>
    );
  }
}

export default NotificationPage;
