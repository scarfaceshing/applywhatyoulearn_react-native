import * as React from 'react';
import {Modal, View, Button} from 'react-native';

interface Props {
  children?: React.ReactNode;
  show: boolean;
  close(): any;
}

interface State {}

class ModalComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.show}>
        <View style={{flex: 1}}>
          <>{this.props.children}</>
          <Button onPress={this.props.close} title="close" color="#ddd" />
        </View>
      </Modal>
    );
  }
}

export default ModalComponent;
