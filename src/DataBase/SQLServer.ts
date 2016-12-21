import { Connection, Request, config } from "mssql";

export class SQLServer {
    request:Request;
    constructor(private dbConfig:any) {
        this.dbConfig = {
            ...dbConfig,
            connectionTimeout : 300000,
            requestTimeout : 2200000
        };
    }

    async connect() {
        return new Promise((resolve, reject) => {
            let connection = new Connection(this.dbConfig, (err)=> {
                if (err) {
                    reject(err);
                }
                else {
                    this.request = new Request(connection);
                    resolve(this.request);
                }
            });
        });
    }
    async query(Query) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.request.query(Query, (err, res) => {
                if (err) {
                    console.dir(err);
                    return reject(new Error(err.message + this.dbConfig.server));
                }
                resolve(res);
                this.request.connection.close();
            });
        });
    }
}