"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongodb_1 = require("mongodb");
var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var server = new mongodb_1.Server('192.168.0.195', 27017, options);
var db = new mongodb_1.Db('ReportBuilder-dev', server, { w: 1 });
db.open((err, res) => console.log(err || res));
class DataBase {
    constructor(collectionName) {
        this.collection = db.collection("schedules");
    }
    getByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.collection.findOne(query, (err, doc) => {
                    if (err)
                        return reject(err);
                    this.document = doc;
                    return resolve(this.document);
                });
            });
        });
    }
}
exports.DataBase = DataBase;
class Schedule extends DataBase {
    constructor(name) {
        super("schedules");
        this.name = name;
    }
    get schedule() {
        return this.document;
    }
    set schedule(doc) {
        this.document = doc;
    }
    getByName() {
        return __awaiter(this, void 0, void 0, function* () {
            this.document = yield this.getByQuery({ name: this.name });
            return this.document;
        });
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUNBQWlEO0FBQ2pELElBQUksT0FBTyxHQUFHO0lBQ1osTUFBTSxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUNwRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFO0NBQ3RFLENBQUM7QUFDRixJQUFJLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCxJQUFJLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUyxFQUFFLEdBQU8sS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRXZEO0lBSUksWUFBWSxjQUFzQjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVLLFVBQVUsQ0FBQyxLQUFZOztZQUN6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUc7b0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQWxCRCw0QkFrQkM7QUFFRCxjQUFzQixTQUFRLFFBQVE7SUFPbEMsWUFBb0IsSUFBVztRQUMzQixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFESCxTQUFJLEdBQUosSUFBSSxDQUFPO0lBRS9CLENBQUM7SUFSRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUUsR0FBTztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBSUssU0FBUzs7WUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFDLElBQUksRUFBRyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO0tBQUE7Q0FDSjtBQWRELDRCQWNDIn0=