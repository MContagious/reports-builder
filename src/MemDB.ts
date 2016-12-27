// import { Database, QueryResults } from 'sql.js';
import { Database } from "sqlite3";

import { format } from 'mysql';

export class MemDB {
    memdb:Database;
    tableName:string;
    constructor(private cols:Array<string>) {
        this.memdb = new Database();
        this.tableName = `Results_${+(new Date())}`;
        this.createTable();
    }
    async createTable() {
        let sql_stmt = `Create Table ${this.tableName} ( ${this.cols.join(',')} )`;
        console.log(sql_stmt);
        this.memdb.exec(sql_stmt);
    }
    async insertRows(rows: Array<Object>) {
        let insert_sql = `insert into ${this.tableName} ( ${this.cols.join(',')} ) values ? `;
        let values = rows.map((row) => {
            return format(insert_sql, [[this.cols.map((col)=> {
                return (typeof(row[col]) == 'string') ? row[col].replace(/;/g,'\;') : row[col];
            })]]);
        }).join('; \n');
        this.memdb.exec(values);
    }
    async getRows(sql?:string):Promise<{}[]> {
        if (sql) {
            sql = sql.replace(/ Results\s*/i, ` ${this.tableName} `);
        } else {
            sql = `Select * from ${this.tableName}`;
        }
        console.log(sql);
        return new Promise<{}[]>((resolve, reject) => {
            this.memdb.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);   
            });
        });
    }
    async getColumns () {
        return this.cols;
    }
}