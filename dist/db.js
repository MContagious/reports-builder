"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongodb_1 = require('mongodb');
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
