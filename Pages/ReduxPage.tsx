import React, {Component} from 'react';
import {connect} from 'react-redux';
import {decrement, increment, incrementByAmount} from '../store/test';
import {Text, Button} from 'react-native';

class ReduxPage extends Component {
  render() {
    const {counter, increment, decrement, incrementByAmount}: any = this.props;

    return (
      <>
        <Button onPress={() => incrementByAmount(100)} title="incrementByAmount" />
        <Button onPress={() => increment()} title="increment" />
        <Text style={{color: 'black'}}>{counter.toString()}</Text>
        <Button onPress={() => decrement()} title="Decrement" />
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    counter: state.counter.value,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    incrementByAmount: (value: any) => dispatch(incrementByAmount(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReduxPage);
