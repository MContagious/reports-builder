"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongoose_1 = require('mongoose');
require('../models');
const ScheduleModel = mongoose_1.model('Schedules');
class ScheduleRunner {
    constructor(scheduleName) {
        this.scheduleName = scheduleName;
    }
    getSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schedule = yield ScheduleModel.findOne({ name: this.scheduleName }).exec();
            console.log("kishore");
            console.log(this.schedule);
            return this.schedule;
        });
    }
}
exports.ScheduleRunner = ScheduleRunner;
var x = new ScheduleRunner('IDEA_OBD_HARYANA_E1_Utilization_Report');
x.getSchedule().then((a) => {
    console.log(a);
});
