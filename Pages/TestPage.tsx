import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';

class TestPage extends Component {
  constructor(props: any) {
    super(props);

    this.navigate = this.props.navigation.navigate;
  }
  render() {
    return (
      <View>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

export default TestPage;
