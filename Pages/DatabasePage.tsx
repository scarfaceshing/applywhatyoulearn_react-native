import * as React from 'react';
import {Pressable, Button, Text, View, TextInput, FlatList, StyleSheet} from 'react-native';
import Database from '../sqlite/database';
import ModalComponent from '../Components/ModalComponent';

interface Props {}

interface State {
  showModalForm: boolean;
  showConfirmDelete: boolean;
  actionType: 'create' | 'update' | 'delete' | '';
  users: Array<string>;
  form: {
    id: string;
    name: string;
    age: string;
  };
}

interface ListItemProps {
  index: number;
  item: {
    id: string;
    name: string;
    age: string;
  };
  showModalRemove(item: any): void;
  showModalEdit(item: any): void;
}

/*
  TODO: change declare any type
*/

const filterNumericText = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

const db: any = new Database('my');

// db.createTable('users', (table: any) => {
//   table.id();
//   table.text('name');
//   table.int('age');
// });

class DatabasePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      actionType: '',
      showConfirmDelete: false,
      showModalForm: false,
      users: [],
      form: {
        id: '',
        name: '',
        age: '',
      },
    };
  }

  componentDidMount(): void {
    this.read();
  }

  handleInput = (name: any, value: any) => {
    let form = {[name]: value};

    this.setState({form: {...this.state.form, ...form}});
  };

  submit() {
    if (this.state.actionType === 'create') {
      this.create(this.state.form.name, this.state.form.age);
    } else if (this.state.actionType === 'update') {
      this.update(this.state.form.id, this.state.form.name, this.state.form.age);
    } else if (this.state.actionType === 'delete') {
      this.delete(this.state.form.id);
    }
  }

  read() {
    db.selectTable('users', ['id', 'name', 'age'], (data: any) => {
      this.setState({users: data});
    });
  }

  create(name: any, age: any) {
    db.insertTable('users', ['name', 'age'], [name, age]);
    this.setState({showModalForm: false});
    this.read();
  }

  update(id: any, name: any, age: any) {
    db.updateTable('users', id, ['name', 'age'], [name, age]);
    this.setState({showModalForm: false});
    this.read();
  }

  delete(id: string) {
    db.deleteDataTable('users', id);
    this.setState({showModalForm: false});
    this.read();
  }

  showModalConfirmDelete(item: any): void {
    this.setState({showConfirmDelete: true});
    this.setState({
      form: {
        ...this.state.form,
        id: item.id,
        name: item.name,
        age: item.age,
      },
    });
  }

  showModalForm(item: any, type: 'create' | 'update' | 'delete'): void {
    let form = {};

    if (type === 'create') {
      form = {
        id: '',
        name: '',
        age: '',
      };
    } else if (type === 'update') {
      form = {
        id: item.id,
        name: item.name,
        age: item.age.toString(),
      };
    } else if (type === 'delete') {
      form = {
        id: item.id,
        name: item.name,
        age: item.age.toString(),
      };
    }

    this.setState({
      form: {...this.state.form, ...form},
    });

    this.setState({actionType: type});
    this.setState({showModalForm: true});
  }

  render(): JSX.Element {
    return (
      <>
        <FlatList
          data={this.state.users}
          keyExtractor={(item: any) => item.id}
          renderItem={({item, index}) => (
            <ListItem
              item={item}
              index={index}
              showModalEdit={item => this.showModalForm(item, 'update')}
              showModalRemove={item => this.showModalForm(item, 'delete')}
            />
          )}
          ListHeaderComponent={renderHeader}
        />

        <Button onPress={() => this.showModalForm(null, 'create')} title={'Add'} />

        <ModalComponent
          show={this.state.showModalForm}
          close={() => this.setState({showModalForm: false})}>
          {this.state.actionType === 'create' ? (
            <Text style={styles.listTextHeader}>Add</Text>
          ) : (
            <></>
          )}
          {this.state.actionType === 'update' ? (
            <Text style={styles.listTextHeader}>Edit</Text>
          ) : (
            <></>
          )}
          {this.state.actionType === 'delete' ? (
            <Text style={styles.listTextHeader}>Remove</Text>
          ) : (
            <></>
          )}
          <TextInput
            style={{...styles.text}}
            value={this.state.form.name}
            editable={this.state.actionType !== 'delete'}
            placeholder={'name'}
            placeholderTextColor={'#666'}
            onChangeText={value => this.handleInput('name', value)}
          />
          <TextInput
            style={{...styles.text}}
            placeholder={'age'}
            editable={this.state.actionType !== 'delete'}
            value={this.state.form.age}
            placeholderTextColor={'#666'}
            onChangeText={value => this.handleInput('age', value)}
          />

          <Button onPress={() => this.submit()} title={'Submit'} />
        </ModalComponent>
      </>
    );
  }
}

const renderHeader = () => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'pink',
    }}>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      <Text style={{marginRight: 10, color: '#000', fontSize: 18, fontWeight: 'bold'}}>Action</Text>
    </View>
  </View>
);

const ListItem: React.FC<ListItemProps> = (props: ListItemProps): JSX.Element => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{marginLeft: 5, marginRight: 10, ...styles.listTextContent}}>
          {props.index + 1 ?? ''}
        </Text>
        <Text style={{marginRight: 10, ...styles.listTextContent}}>{props.item.name ?? ''}</Text>
        <Text style={{marginRight: 10, ...styles.listTextContent}}>{props.item.age ?? ''}</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <Pressable style={styles.button} onPress={() => props.showModalEdit(props.item)}>
            <Text style={{...styles.buttonText, color: 'blue'}}>Edit</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => props.showModalRemove(props.item)}>
            <Text style={{...styles.buttonText, color: 'red'}}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000000',
  },
  listTextHeader: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listTextContent: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 12,
  },
});

export default DatabasePage;
