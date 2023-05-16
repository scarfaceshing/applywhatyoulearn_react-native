import SQLite from 'react-native-sqlite-storage';

class Database {
  database: any;

  constructor(dbName: string) {
    this.database = SQLite.openDatabase({name: `${dbName}.db`, location: 'default'});
  }

  dropTable(tableName: string) {
    const query = `DROP TABLE ${tableName}`;
    this.database.executeSql(
      query,
      [],
      () => console.log('Drop table success'),
      () => console.log(`Drop table: table not found`),
    );
  }

  createTable(tableName: string, callback: (data: any) => void) {
    const schema = new Schema(tableName);
    callback(schema);
    const query = schema.compile();

    this.database.transaction((tx: any) => {
      tx.executeSql(
        query,
        () => console.log('Create table success'),
        () => console.log(`Create table: table already exist`),
      );
    });
  }

  columnQuery(columns: Array<string>, callback: (column: any, insert: any) => void) {
    let resultColumn = '';
    let resultInsert = '';

    columns.forEach((column, index) => {
      resultColumn += columns.length !== index + 1 ? column + ',' : column;
      resultInsert += columns.length !== index + 1 ? '?,' : '?';
    });

    callback(resultColumn, resultInsert);
  }

  updateQuery(columns: Array<string>, callback: (column: any) => void) {
    let resultColumn = '';

    columns.forEach((column, index) => {
      resultColumn += columns.length !== index + 1 ? `${column} = ?,` : `${column} = ?`;
    });

    callback(resultColumn);
  }

  insertTable(tableName: string, columns: Array<string>, data: Array<string | number>) {
    let callbackColumn = '';
    let callbackResult = '';

    this.columnQuery(columns, (a, b) => {
      callbackColumn = a;
      callbackResult = b;
    });

    this.database.executeSql(
      `INSERT INTO ${tableName} (${callbackColumn}) VALUES (${callbackResult})`,
      data,
      () => {
        console.log('Insert table: success');
      },
      (error: any) => {
        console.log(`Insert table: error: ${error.message ?? ''}`);
      },
    );
  }

  updateTable(tableName: string, id: number, columns: Array<string>, data: Array<string | number>) {
    let callbackColumn = '';

    this.updateQuery(columns, a => {
      callbackColumn = a;
    });

    this.database.executeSql(
      `UPDATE ${tableName} SET ${callbackColumn} WHERE id = ${id}`,
      data,
      () => {
        console.log(`Update table: success ${id}`);
      },
      (error: any) => {
        console.log(`Update table: error: ${error.message ?? ''}`);
      },
    );
  }

  truncateTable(tableName: string) {
    this.database.executeSql(
      `DELETE FROM ${tableName}`,
      [],
      () => {
        console.log(`Delete table: success`);
      },
      (error: any) => {
        console.log(`Delete table: error ${error.message ?? ''}`);
      },
    );
  }

  deleteDataTable(tableName: string, id: number) {
    this.database.executeSql(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id],
      () => {
        console.log(`Delete data table: success ${id}`);
      },
      (error: any) => {
        console.log(`Delete data table: error ${error.message ?? ''}`);
      },
    );
  }

  findByIdTable(
    tableName: string,
    id: number,
    columns: Array<string>,
    callback: (data: any) => void,
  ) {
    let data: any = [];
    let callbackColumn = '';

    this.columnQuery(columns, a => {
      callbackColumn = a;
    });

    this.database.executeSql(
      `SELECT ${callbackColumn} FROM ${tableName} WHERE id = ?`,
      [id],
      (result: any) => {
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          let row = rows.item(i);
          data.push(row);
        }

        callback(data);
        console.log(`Find by ID table: Query success`);
      },
      (error: any) => {
        console.log(`Find by ID table: Query error: ${error.message ?? ''}`);
      },
    );
  }

  selectTable(tableName: string, columns: Array<string>, callback: (data: any) => void) {
    let data: any = [];
    let callbackColumn = '';

    this.columnQuery(columns, a => {
      callbackColumn = a;
    });

    this.database.executeSql(
      `SELECT ${callbackColumn} FROM ${tableName}`,
      [],
      (result: any) => {
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          let row = rows.item(i);
          data.push(row);
        }

        callback(data);
        console.log(`Select table: Query success`);
      },
      (error: any) => {
        console.log(`Select table: Query error: ${error.message ?? ''}`);
      },
    );
  }

  selectTable1(
    tableName: string,
    columns: Array<string>,
    orderBy: string | null,
    align: 'ASC' | 'DESC',
    callback: (data: any) => void,
  ) {
    let data: any = [];
    let callbackColumn = '';

    this.columnQuery(columns, a => {
      callbackColumn = a;
    });

    let addons = orderBy && align ? `ORDER BY ${orderBy} ${align}` : '';

    this.database.executeSql(
      `SELECT ${callbackColumn} FROM ${tableName} ${addons}`,
      [],
      (result: any) => {
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          let row = rows.item(i);
          data.push(row);
        }

        callback(data);
        console.log(`Select table: Query success`);
      },
      (error: any) => {
        console.log(`Select table: Query error: ${error.message ?? ''}`);
      },
    );
  }
}

class Utils {
  constructor() {}

  swapElements(arr: Array<any>, a: number, b: number) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

    return arr;
  }
}

class Schema {
  tableName: string;
  createTable: string;
  query: Array<string>;
  index: number;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.query = [];
    this.index = 0;
    this.createTable = `CREATE TABLE IF NOT EXISTS ${this.tableName} `;
  }

  id() {
    this.query.push(`id INTEGER PRIMARY KEY AUTOINCREMENT`);
    return this;
  }

  text(columnName: string) {
    this.query.push(`${columnName} TEXT`);
    return this;
  }

  int(columnName: string) {
    this.query.push(`${columnName} INTEGER`);
    return this;
  }

  real(columnName: string) {
    this.query.push(`${columnName} REAL`);
    return this;
  }

  numeric(columnName: string) {
    this.query.push(`${columnName} NUMERIC`);
    return this;
  }

  date(columnName: string) {
    this.query.push(`${columnName} DATE`);
    return this;
  }

  boolean(columnName: string) {
    this.query.push(`${columnName} BOOLEAN`);
    return this;
  }

  time(columnName: string) {
    this.query.push(`${columnName} TIME`);
    return this;
  }

  blob(columnName: string) {
    this.query.push(`${columnName} BLOB`);
    return this;
  }

  timestamp(columnName: string) {
    this.query.push(`${columnName} DATETIME DEFAULT CURRENT_TIMESTAMP`);
    return this;
  }

  datetime(columnName: string) {
    this.query.push(`${columnName} DATETIME DEFAULT NULL`);
  }

  foreignKey(columnName: string, references: string, foreignTable: string) {
    this.query.push(`FOREIGN KEY(${columnName}) REFERENCES ${foreignTable}(${references})`);
    return this;
  }

  compile() {
    let result = this.createTable + '(';
    let query = '';
    this.query.forEach((item, index) => {
      query += this.query.length !== index + 1 ? item + ',' : item;
    });
    return result + query + ')';
  }
}

export default Database;
