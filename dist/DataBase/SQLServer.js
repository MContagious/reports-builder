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
                let connection = new mssql_1.Connection(this.dbConfig, (err) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU1FMU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0RhdGFCYXNlL1NRTFNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFvRDtBQUVwRDtJQUVJLFlBQW9CLFFBQVk7UUFBWixhQUFRLEdBQVIsUUFBUSxDQUFJO1FBQzVCLElBQUksQ0FBQyxRQUFRLGdCQUNOLFFBQVEsSUFDWCxpQkFBaUIsRUFBRyxNQUFNLEVBQzFCLGNBQWMsRUFBRyxPQUFPLEdBQzNCLENBQUM7SUFDTixDQUFDO0lBRUssT0FBTzs7WUFDVCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDL0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxrQkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHO29CQUMvQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMxQixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFDSyxLQUFLLENBQUMsS0FBSzs7WUFDYixNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUc7b0JBQy9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDakUsQ0FBQztvQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQXBDRCw4QkFvQ0MifQ==