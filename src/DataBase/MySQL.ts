import { createConnection, IConnection, IConnectionConfig } from "mysql";

export class MySQL {
    connection:IConnection;
    constructor(private dbConfig:IConnectionConfig) {
    }
    async connect() {
        return new Promise((resolve, reject) => {
            this.connection = createConnection(this.dbConfig);
            this.connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.connection);
                }
            });
            this.connection.on('error', (err) => {
                if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                    this.connect(); // Connect again.
                } else {
                    throw err;
                }
            });
        });
    }
    async query(Query) {
        try {
            await this.connect();
        } catch(err) {
            throw err;
        }
        return new Promise((resolve, reject) => {
            this.connection.query(Query, (err, res, fields) => {
                if (err) {
                    console.log(err);
                    return reject(new Error(err.message + this.dbConfig.host));
                }
                if (/call /i.test(Query)) {
                    resolve(res[0]);
                } else {
                    if (res.length == 0) {
                        resolve([res]);
                    } else {
                        resolve(res);
                    }
                }
            }).on('end', () => {
                this.connection.end();
            });
        });
    }
}