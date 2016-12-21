"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const sql_js_1 = require("sql.js");
const mysql_1 = require("mysql");
class MemDB {
    constructor(cols) {
        this.cols = cols;
        this.memdb = new sql_js_1.Database();
        this.tableName = `Results_${+(new Date())}`;
        this.createTable();
    }
    createTable() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql_stmt = `Create Table ${this.tableName} ( ${this.cols.join(',')} )`;
            this.memdb.exec(sql_stmt);
        });
    }
    insertRows(rows) {
        return __awaiter(this, void 0, void 0, function* () {
            let insert_sql = `insert into ${this.tableName} ( ${this.cols.join(',')} ) values ? `;
            let values = rows.map((row) => {
                return mysql_1.format(insert_sql, [[this.cols.map((col) => {
                            return (typeof (row[col]) == 'string') ? row[col].replace(/;/g, '\;') : row[col];
                        })]]);
            }).join('; \n');
            this.memdb.exec(values);
        });
    }
    getRows(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sql) {
                sql = sql.replace(/ Results\s*/i, ` ${this.tableName} `);
            }
            else {
                sql = `Select * from ${this.tableName}`;
            }
            console.log(sql);
            try {
                let rows = this.memdb.exec(sql)[0];
                return rows.values.map((row) => {
                    let res = {};
                    for (let i = 0; i < this.cols.length; i++) {
                        res[this.cols[i]] = row[i];
                    }
                    return res;
                });
            }
            catch (er) {
                throw er;
            }
        });
    }
    getColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cols;
        });
    }
}
exports.MemDB = MemDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtREIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTWVtREIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQWdEO0FBQ2hELGlDQUErQjtBQUUvQjtJQUdJLFlBQW9CLElBQWtCO1FBQWxCLFNBQUksR0FBSixJQUFJLENBQWM7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBQ0ssV0FBVzs7WUFDYixJQUFJLFFBQVEsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzNFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUNLLFVBQVUsQ0FBQyxJQUFtQjs7WUFDaEMsSUFBSSxVQUFVLEdBQUcsZUFBZSxJQUFJLENBQUMsU0FBUyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7WUFDdEYsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUc7Z0JBQ3RCLE1BQU0sQ0FBQyxjQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUc7NEJBQzFDLE1BQU0sQ0FBQyxDQUFDLE9BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ25GLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxHQUFXOztZQUNyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLEdBQUcsaUJBQWlCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUM7Z0JBQ0QsSUFBSSxJQUFJLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVoRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHO29CQUN2QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztvQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBRTtZQUFBLEtBQUssQ0FBQSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBQ0ssVUFBVTs7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO0tBQUE7Q0FDSjtBQTdDRCxzQkE2Q0MifQ==