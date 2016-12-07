import { model, Model, Document, Promise as p } from 'mongoose';
import '../models';

const ScheduleModel = model('Schedules');

export class ScheduleRunner {
    schedule: Document;
    constructor(private scheduleName:string) {
    }
    async getSchedule() {
        this.schedule = await ScheduleModel.findOne({name: this.scheduleName}).exec();
        console.log("kishore");
        console.log(this.schedule);
        return this.schedule;
    }
}

var x = new ScheduleRunner('IDEA_OBD_HARYANA_E1_Utilization_Report');
x.getSchedule().then((a) => {
    console.log(a);
});
