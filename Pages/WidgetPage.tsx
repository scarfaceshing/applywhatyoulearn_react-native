import React from 'react';
import {View, TextInput, StyleSheet, NativeModules} from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

const group = 'group.com.awylreactnative';

const SharedStorage = NativeModules.SharedStorage;

interface IProps {}
interface IState {
  text?: string;
}

class WidgetPage extends React.Component<IProps, IState> {
  widgetData: any;

  constructor(props: IProps) {
    super(props);

    this.state = {
      text: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async () => {
    const {text} = this.state;
    const widgetData = {
      text,
    };

    try {
      // iOS
      await SharedGroupPreferences.setItem('widgetKey', widgetData, group);
    } catch (error) {
      console.log({error});
    }
    // Android
    SharedStorage.set(JSON.stringify({text}));
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          onChangeText={newText => this.setState({text: newText})}
          value={this.state.text}
          returnKeyType="send"
          onEndEditing={this.handleSubmit}
          placeholder="Enter the text to display..."
        />
      </View>
    );
  }
}

export default WidgetPage;

const styles = StyleSheet.create({
  container: {
    marginTop: '50%',
    paddingHorizontal: 24,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    fontSize: 20,
    minHeight: 40,
    color: 'black',
  },
});
