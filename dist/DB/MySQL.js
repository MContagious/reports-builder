"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mysql_1 = require("mysql");
class MySQL {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection = mysql_1.createConnection(this.dbConfig);
                this.connection.connect((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(this.connection);
                    }
                });
                this.connection.on('error', (err) => {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        this.connect(); // Connect again.
                    }
                    else {
                        throw err;
                    }
                });
            });
        });
    }
    query(Query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            return new Promise((resolve, reject) => {
                this.connection.query(Query, (err, res, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(new Error(err.message + this.dbConfig.host));
                    }
                    if (/call /i.test(Query)) {
                        resolve(res[0]);
                    }
                    else {
                        if (res.length == 0) {
                            resolve([res]);
                        }
                        else {
                            resolve(res);
                        }
                    }
                }).on('end', () => {
                    this.connection.end();
                });
            });
        });
    }
}
exports.MySQL = MySQL;
