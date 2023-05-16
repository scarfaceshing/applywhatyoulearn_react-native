import React, {Component} from 'react';
import {Text, Button, DeviceEventEmitter} from 'react-native';
import {
  showFloatingBubble,
  hideFloatingBubble,
  requestPermission,
  initialize,
} from 'react-native-floating-bubble';

// Change Bubble Icon
// Place the icon file as android/app/src/main/res/drawable/bubble_icon.png

// To display the bubble over other apps you need to get 'Draw Over Other Apps' permission from androind.
// If you initialize without having the permission App could crash

interface PropsInterface {}
interface StateInterface {}

DeviceEventEmitter.addListener('floating-bubble-press', e => {
  // What to do when user press the bubble
  console.log('Press Bubble');
});
DeviceEventEmitter.addListener('floating-bubble-remove', e => {
  // What to do when user removes the bubble
  console.log('Remove Bubble');
});

class FloatingBubblePage extends React.Component<PropsInterface, StateInterface> {
  constructor(props: PropsInterface) {
    super(props);
  }

  allow(): void {
    // To display the bubble over other apps you need to get 'Draw Over Other Apps' permission from androind.
    // If you initialize without having the permission App could crash
    requestPermission()
      .then(() => console.log('Permission Granted'))
      .catch(() => console.log('Permission is not granted'));
  }

  initialize(): void {
    // Initialize bubble manage
    initialize().then(() => console.log('Initialized the bubble mange'));
  }

  showFloating(): void {
    // Show Floating Bubble: x=10, y=10 position of the bubble
    showFloatingBubble(10, 10).then(() => console.log('Floating Bubble Added'));
  }

  hideFloating(): void {
    // Hide Floatin Bubble
    hideFloatingBubble().then(() => console.log('Floating Bubble Removed'));
  }

  render(): JSX.Element {
    return (
      <>
        <Button onPress={() => this.allow()} title="Allow Floating Bubble" />
        <Button onPress={() => this.initialize()} title="Initialize" />
        <Button onPress={() => this.showFloating()} title="Show Floating" />
        <Button onPress={() => this.hideFloating()} title="Hide Floating Bubble" />
      </>
    );
  }
}

export default FloatingBubblePage;
