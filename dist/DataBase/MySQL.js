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
            try {
                yield this.connect();
            }
            catch (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlTUUwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRGF0YUJhc2UvTXlTUUwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUNBQXlFO0FBRXpFO0lBRUksWUFBb0IsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFDOUMsQ0FBQztJQUNLLE9BQU87O1lBQ1QsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsd0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUc7b0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzdCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRztvQkFDNUIsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQjtvQkFDckMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLEdBQUcsQ0FBQztvQkFDZCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFDSyxLQUFLLENBQUMsS0FBSzs7WUFDYixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsQ0FBRTtZQUFBLEtBQUssQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTTtvQkFDMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7b0JBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtDQUNKO0FBakRELHNCQWlEQyJ9