"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mssql_1 = require("mssql");
class SQLServer {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
        this.dbConfig = __assign({}, dbConfig, { connectionTimeout: 300000, requestTimeout: 2200000 });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let connection = new mssql_1.Connection(this.dbConfig, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.request = new mssql_1.Request(connection);
                        resolve(this.request);
                    }
                });
            });
        });
    }
    query(Query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
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
        });
    }
}
exports.SQLServer = SQLServer;
