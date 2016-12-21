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
function executeQuery(server) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(server);
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
            DB.query(server.Query).then(resolve).catch(reject);
        });
    });
}
exports.executeQuery = executeQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRGF0YUJhc2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQWdDO0FBQ2hDLDJDQUF3QztBQUV4QyxzQkFBb0MsTUFBTTs7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQVcsVUFBVSxPQUFPLEVBQUUsTUFBTTtZQUNsRCxJQUFJLEVBQWtCLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLEdBQUcsSUFBSSxhQUFLLENBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7b0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUTtvQkFDckIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO29CQUN6QixZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJO2lCQUM1QyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxFQUFFLEdBQUcsSUFBSSxxQkFBUyxDQUFDO29CQUNYLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDbkIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVE7b0JBQ3JCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtvQkFDekIsT0FBTyxFQUFFO3dCQUNMLFVBQVUsRUFBRSxNQUFNLENBQUMsT0FBTyxJQUFJLFNBQVM7cUJBQzFDO2lCQUNKLENBQUMsQ0FBQztZQUNYLENBQUM7WUFDRCxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUFBO0FBMUJELG9DQTBCQyJ9