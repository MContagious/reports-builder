import { Database, QueryResults } from 'sql.js';
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
    async getRows(sql?:string) {
        if (sql) {
            sql = sql.replace(/ Results\s*/i, ` ${this.tableName} `);
        } else {
            sql = `Select * from ${this.tableName}`;
        }
        console.log(sql);
        try {
            let rows:QueryResults = this.memdb.exec(sql)[0];

            return rows.values.map((row) => {
                let res = {};
                for (let i=0; i<this.cols.length; i++) {
                    res[this.cols[i]] = row[i];
                }
                return res;
            });
        } catch(er) {
            throw er;
        }
    }
    async getColumns () {
        return this.cols;
    }
}