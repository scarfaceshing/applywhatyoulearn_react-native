import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';

interface PropsInterface {
  data: any;
}
interface StateInterface {
  tableHead: any;
}

const formatNumber = (data: any) => {
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(data);
  return currency;
};

export default class TableComponent extends Component<
  PropsInterface,
  StateInterface
> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const props = this.props;

    const cellWidth = {
      index: {
        width: '5%',
      },
      placeBet: {
        width: '6%', // - 4
      },
      bet: {
        width: '20.75%', //
      },
      result: {
        width: '6%', // - 4
      },
      earn: {
        width: '20.75%', //
      },
      balance: {
        width: '20.75%', //
      },
      date: {
        width: '20.75%', //
      },
    };

    return (
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
          <TableWrapper
            key={0}
            style={{...styles.row, backgroundColor: 'pink'}}>
            <Cell data={`#`} textStyle={styles.head} style={cellWidth.index} />
            <Cell
              data={`PB`}
              textStyle={styles.head}
              style={cellWidth.placeBet}
            />
            <Cell data={`R`} textStyle={styles.head} style={cellWidth.result} />
            <Cell data={`Bet`} textStyle={styles.head} style={cellWidth.bet} />
            <Cell
              data={`Earn`}
              textStyle={styles.head}
              style={cellWidth.earn}
            />
            <Cell
              data={`Balance`}
              textStyle={styles.head}
              style={cellWidth.balance}
            />
            <Cell
              data={`Date`}
              textStyle={styles.head}
              style={cellWidth.date}
            />
          </TableWrapper>
          {props.data.map((item: any, index: any) => (
            <TableWrapper key={index} style={styles.row}>
              <Cell
                data={index + 1}
                textStyle={styles.index}
                style={cellWidth.index}
              />
              <Cell
                data={item.place_bet === 'player' ? 'P' : 'B'}
                textStyle={{...styles.text, color: 'white'}}
                style={{
                  ...cellWidth.placeBet,
                  backgroundColor:
                    item.place_bet === 'player' ? '#00f' : '#f00',
                }}
              />
              <Cell
                data={item.result === 'win' ? 'W' : 'L'}
                textStyle={styles.text}
                style={cellWidth.result}
              />
              <Cell
                data={formatNumber(item.bet)}
                textStyle={styles.text}
                style={cellWidth.bet}
              />
              <Cell
                data={formatNumber(item.earn)}
                textStyle={styles.text}
                style={cellWidth.earn}
              />
              <Cell
                data={formatNumber(item.balance)}
                textStyle={styles.text}
                style={cellWidth.balance}
              />
              <Cell
                data={item.date}
                textStyle={{
                  ...styles.dateText,
                  fontSize: 9,
                  fontWeight: 'bold',
                }}
                style={cellWidth.date}
              />
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 0, paddingTop: 0, backgroundColor: '#fff'},
  head: {
    backgroundColor: '#555',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  text: {color: '#000', textAlign: 'center', fontSize: 11},
  row: {flexDirection: 'row', backgroundColor: '#fff'},
  index: {color: '#000', textAlign: 'center', fontSize: 11},
  dateText: {color: '#000', textAlign: 'center'},
  btnText: {textAlign: 'center', color: '#fff'},
});
