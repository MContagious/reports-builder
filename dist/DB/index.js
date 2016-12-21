"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const MySQL_1 = require("./MySQL");
const SQLServer_1 = require("./SQLServer");
function execute_query(server) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            var DB;
            if (server.DBType == 'MYSql') {
                DB = new MySQL_1.MySQL({
                    host: server.Host,
                    port: server.Port,
                    user: server.UserName,
                    password: server.Password,
                    insecureAuth: server.insecureAuth || true
                });
            }
            if (server.DBType == 'SQLServer' || server.DBType == 'MSSql') {
                DB = new SQLServer_1.SQLServer({
                    server: server.Host,
                    port: server.Port,
                    user: server.UserName,
                    password: server.Password,
                    options: {
                        tdsVersion: server.Options || undefined
                    }
                });
            }
            return DB.query(server.Query);
        });
    });
}
exports.execute_query = execute_query;
