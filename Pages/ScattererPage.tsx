import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Switch,
  StyleSheet,
  AppState,
  AppStateStatus,
} from 'react-native';
import {WebView} from 'react-native-webview';
import ModalComponent from '../Components/ModalComponent';
import Database from '../sqlite/database';
import {connect} from 'react-redux';
import {loadHistory} from '../store/scatterer';
import TableComponent from '../Components/TableComponent';

const mapStateToProps = (state: any) => {
  return {
    history: state.history.value,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadHistory: (value: any) => dispatch(loadHistory(value)),
  };
};

const database = new Database('scatterer');

// database.dropTable('store');
// database.dropTable('history');

database.createTable('store', table => {
  table.id();
  table.real('balance');
  table.real('bet');
  table.boolean('commision');
  table.datetime('updated_at');
});

database.createTable('history', table => {
  table.id();
  table.real('bet');
  table.text('place_bet');
  table.text('result');
  table.real('earn');
  table.real('balance');
  table.datetime('date');
});

database.findByIdTable('store', 1, ['balance', 'bet'], data => {
  if (!(data.length > 0)) {
    database.insertTable('store', ['balance', 'bet'], [0, 0]);
  }
});

const FIFTHY: number = 50;
const ONE_HUNDRED: number = 100;
const TWO_HUNDRED_FIFTHY: number = 250;
const ONE_THOUSAND_TWO_HUNDRED_FIFTHY: number = 1250;
const FIVE_THOUSAND: number = 5000;
const TWENTY_FIVE_THOUSAND: number = 25000;

interface Props {
  [key: string]: any; // TODO: change data type;
}

interface ListItemProps {
  index: number;
  item: {
    bet: string;
    betPlace: 'player' | 'banker' | '';
    result: 'win' | 'lose' | '';
    earn: string;
    balance: string;
    date: string;
  };
}

interface State {
  appState: AppStateStatus;
  url: string;
  debug: string;
  bet: any; // TODO: change data type
  balance: any; // TODO: change data type
  showHistory: boolean;
  showAddBalance: boolean;
  historyChips: Array<number>;
  activityLog: Array<any>;
  withCommision: boolean;
  currentBet: {
    [key: string]: boolean;
  };
  disablePhases: {
    [key: string]: boolean;
  };
  lockButton: {
    [key: string]: boolean;
  };
}

const filterNumericText = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

class ScattererPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      url: '777pub.org',
      debug: '',
      bet: 0.0,
      balance: '',
      showAddBalance: false,
      showHistory: false,
      historyChips: [],
      activityLog: [],
      withCommision: true,
      currentBet: {
        player: false,
        banker: false,
      },
      disablePhases: {
        balance: false,
      },
      lockButton: {
        fifthy: false,
        oneHundred: false,
        twoHundredFifthy: false,
        oneThousandTwoHundredFifthy: false,
        fiveThousand: false,
        twentyFiveThousand: false,
      },
    };

    this.handleBalance = this.handleBalance.bind(this);
    this.setWin = this.setWin.bind(this);
    this.undo = this.undo.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
  }

  componentDidMount(): void {
    AppState.addEventListener('change', this.handleAppStateChange);

    database.findByIdTable('store', 1, ['balance', 'bet'], data => {
      if (data.length > 0) {
        let balance = data[0].balance.toString();
        let bet = data[0].bet.toString();

        this.setState({balance: balance});
        this.setState({bet: bet});
      }
    });
  }

  changeHistory = () => {};

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    let balance = parseFloat(this.state.balance);
    let bet = parseFloat(this.state.bet);

    database.updateTable('store', 1, ['balance', 'bet'], [balance, bet]);

    // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //   console.log('Active!');
    // } else if (this.state.appState.match(/inactive|background/) && nextAppState === 'inactive') {
    //   console.log('Inactive!');
    // }

    // console.log(nextAppState, this.state.appState);
    this.setState({appState: nextAppState});
  };

  handleUrl(value: string): void {
    this.setState({url: value});
  }

  handleBalance(value: string): void {
    value = filterNumericText(value);
    this.setState({balance: value});
  }

  currentBet(value: string): void {
    if (value === 'player') {
      this.setState({currentBet: {player: true}});
    } else if (value === 'banker') {
      this.setState({currentBet: {banker: true}});
    }
  }

  validateWin(bet: number, playerPlace: boolean, bankerPlace: boolean): boolean | void {
    if ((bet > 0 && playerPlace) || (bet > 0 && bankerPlace)) {
      return true;
    }
  }

  setWin(value: string): void {
    let balance: number = parseFloat(this.state.balance);
    let totalWin: number = parseFloat(this.state.bet);
    let bet: number = parseFloat(this.state.bet);
    let playerPlace: boolean = this.state.currentBet.player;
    let bankerPlace: boolean = this.state.currentBet.banker;
    let result: 'win' | 'lose' | '' = '';
    let betPlace: 'player' | 'banker' | '' = '';

    const validateWin: boolean | void | undefined = this.validateWin(bet, playerPlace, bankerPlace);

    if (validateWin) {
      if (playerPlace) {
        betPlace = 'player';
      } else if (bankerPlace) {
        betPlace = 'banker';
      }

      if (value === 'player' && playerPlace === true) {
        balance += totalWin * 1;

        result = 'win';
      }

      if (value === 'player' && bankerPlace === true) {
        balance -= totalWin * 1;

        result = 'lose';
      }

      if (value === 'banker' && bankerPlace === true) {
        if (this.state.withCommision === true) {
          totalWin = Math.abs(totalWin * 0.02 - totalWin);
          balance += totalWin * 1;
        } else {
          balance += totalWin * 1;
        }

        result = 'win';
      }

      if (value === 'banker' && playerPlace === true) {
        balance -= totalWin * 1;

        result = 'lose';
      }

      balance = !(balance < 0) ? balance : 0;
      this.setState({balance: !isNaN(balance) ? balance.toString() : 0});
      this.setState({bet: 0});

      let dateToday = new Date().toLocaleString('en-GB').toString();

      database.insertTable(
        'history',
        ['bet', 'place_bet', 'result', 'earn', 'balance', 'date'],
        [bet, betPlace, result, totalWin, balance, dateToday],
      );
    }
  }

  proceed(): void {
    this.setState({disablePhases: {balance: true}});
  }

  reset(): void {
    let balance = 0;
    let bet = 0;

    this.setState({debug: ''});
    this.setState({balance: balance.toString()});
    this.setState({bet: bet.toString()});
    this.setState({historyChips: []});
    this.setState({disablePhases: {balance: false}});
    database.truncateTable('history');
    // this.props.dispatch(this.props.loadHistory(null)); // <-- return undefined is not function
    () => this.props.dispatch(this.props.loadHistory(null)); // <-- working...
  }

  placeBet(value: number): void {
    let bet: number = parseFloat(this.state.bet) + value;
    let balance: number = this.state.balance;

    let canBet: boolean | undefined | void = this.validateBet(bet, balance);

    if (canBet) {
      this.setState({bet: bet});
      let historyChips = [...this.state.historyChips, value];
      this.setState({historyChips: historyChips});
    }
  }

  validateBet(bet: number, balance: number) {
    if (balance >= bet) {
      return true;
    }
  }

  undo() {
    let historyChips = this.state.historyChips;
    if (this.state.bet !== 0) {
      this.setState({
        historyChips: historyChips.slice(0, historyChips.length - 1),
      });
      this.setState({
        bet: this.state.bet - historyChips[historyChips.length - 1],
      });
    }
  }

  cashIn(): void {
    let balance = parseFloat(this.state.balance);
    database.updateTable('store', 1, ['balance'], [balance]);
    this.setState({balance: balance.toString()});
    this.setState({showAddBalance: false});
  }

  showHistory(): void {
    database.selectTable1(
      'history',
      ['id', 'bet', 'place_bet', 'result', 'earn', 'balance', 'date'],
      'date',
      'DESC',
      data => {
        this.props.dispatch(this.props.loadHistory(data));
      },
    );

    this.setState({showHistory: true});
  }

  render(): JSX.Element {
    return (
      <>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <WebView
              source={{uri: this.state.url}}
              scrollEnabled={false}
              allowsFullscreenVideo={true}
              style={{
                width: 300,
                height: 100,
                backgroundColor: 'blue',
                marginTop: 0,
              }}
            />
          </View>
          <Text style={styles.text}>Balance: {this.state.balance}</Text>

          {this.state.disablePhases.balance ? (
            <>
              <Text style={styles.text}>Bet: {this.state.bet}</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button
                  disabled={this.state.lockButton.fifthy}
                  onPress={() => this.placeBet(FIFTHY)}
                  title="50"
                  color="#808080"
                />
                <Button
                  disabled={this.state.lockButton.oneHundred}
                  onPress={() => this.placeBet(ONE_HUNDRED)}
                  title="100"
                  color="#FFC0CB"
                />
                <Button
                  disabled={this.state.lockButton.twoHundredFifthy}
                  onPress={() => this.placeBet(TWO_HUNDRED_FIFTHY)}
                  title="250"
                  color="#FF0000"
                />
                <Button
                  disabled={this.state.lockButton.oneThousandTwoHundredFifthy}
                  onPress={() => this.placeBet(ONE_THOUSAND_TWO_HUNDRED_FIFTHY)}
                  title="1250"
                  color="#00FF00"
                />
                <Button
                  disabled={this.state.lockButton.fiveThousand}
                  onPress={() => this.placeBet(FIVE_THOUSAND)}
                  title="5000"
                  color="#000000"
                />
                <Button
                  disabled={this.state.lockButton.twentyFiveThousand}
                  onPress={() => this.placeBet(TWENTY_FIVE_THOUSAND)}
                  title="25000"
                  color="#CBC3E3"
                />
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button onPress={() => this.undo()} title="undo" color="#111" />
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button
                  onPress={() => this.currentBet('player')}
                  title={this.state.currentBet.player ? '* player' : 'player '}
                  color="#00f"
                />
                <Button
                  onPress={() => this.currentBet('banker')}
                  title={this.state.currentBet.banker ? '* banker' : 'banker '}
                  color="#f00"
                />
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button onPress={() => this.setWin('player')} title="win player" color="#006" />
                <Button onPress={() => this.setWin('banker')} title="win banker" color="#600" />
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button
                  onPress={() => this.setState({disablePhases: true})}
                  title="back"
                  color="#000"
                />
              </View>
            </>
          ) : (
            <>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button onPress={() => this.proceed()} title="Proceed" color="#00f" />
                <Button
                  onPress={() => this.setState({showAddBalance: !this.state.showAddBalance})}
                  title="cash in"
                  color="#000"
                />
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.text}>With Commision</Text>
                <Switch
                  // trackColor={{false: '#767577', true: '#81b0ff'}}
                  // thumbColor={this.state.withCommision ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.setState({withCommision: !this.state.withCommision})}
                  value={this.state.withCommision}
                />
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button onPress={() => this.reset()} title="Reset" color="#000" />
                <Button onPress={() => this.showHistory()} title="History" color="#000" />
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <TextInput
                  style={styles.text}
                  onChangeText={this.handleUrl}
                  value={this.state.url}
                  placeholder={'Url'}
                />
              </View>
            </>
          )}

          <ModalComponent
            show={this.state.showHistory}
            close={() => this.setState({showHistory: false})}>
            {/* <ListHistory items={this.props.history} /> */}
            <TableComponent data={this.props.history} />
          </ModalComponent>

          <ModalComponent
            show={this.state.showAddBalance}
            close={() => this.setState({showAddBalance: false})}>
            <TextInput
              style={styles.text}
              onChangeText={this.handleBalance}
              keyboardType="numeric"
              value={this.state.balance}
              placeholder={'Type your bet here...'}
            />
            <Button title={'submit'} onPress={() => this.cashIn()} />
          </ModalComponent>
        </View>
      </>
    );
  }
}

const ListHistory = ({items}: any) => (
  <>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'pink',
      }}>
      <Text style={{color: 'black', fontWeight: 'bold'}}>#</Text>
      <Text style={{color: 'black', fontWeight: 'bold'}}>Result</Text>
      <Text style={{color: 'black', fontWeight: 'bold'}}>Earn</Text>
      <Text style={{color: 'black', fontWeight: 'bold'}}>Blance</Text>
      <Text style={{color: 'black', fontWeight: 'bold'}}>Date</Text>
    </View>

    {items.map((item: any, index: number) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        key={index}>
        <Text style={{color: 'black'}}>{index + 1}</Text>
        <Text style={{color: 'black'}}>{item.result}</Text>
        <Text style={{color: 'black'}}>{item.earn}</Text>
        <Text style={{color: 'black'}}>{item.balance}</Text>
        <Text style={{color: 'black'}}>{item.date}</Text>
      </View>
    ))}
  </>
);

const styles = StyleSheet.create({
  text: {
    color: '#000000',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScattererPage);
