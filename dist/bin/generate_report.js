"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const DataBase_1 = require("../DataBase");
const MemDB_1 = require("../MemDB");
const XLSX_1 = require("../XLSX");
const pug_1 = require("pug");
const CSV_1 = require("../CSV");
const SendEmail_1 = require("../SendEmail");
const Utils_1 = require("../Utils");
require("../models");
const ScheduleModel = mongoose_1.model('Schedules');
const ReportsModel = mongoose_1.model('Reports');
const DModel = mongoose_1.model("DB");
const opts = {
    server: "192.168.0.195",
    port: "27017",
    db: "ReportBuilder-dev"
};
Connect(opts);
class ScheduleRunner {
    constructor(scheduleName) {
        this.scheduleName = scheduleName;
    }
    getSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.schedule = yield ScheduleModel.findOne({ name: this.scheduleName }).exec();
            }
            catch (er) {
                throw er;
            }
            if (this.schedule === null) {
                throw new Error("No Schedule found with the given name" + this.scheduleName);
            }
            return this.schedule;
        });
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the document from mongodb. Store in this.schedule.
            let consolidated = {};
            try {
                yield this.getSchedule();
                const rbs = yield this.getReports();
                consolidated = rbs.reduce((n, rb) => {
                    n[rb.outFilePattern] = n[rb.outFilePattern] || {};
                    n[rb.outFilePattern][rb.reportHeading] = {
                        RPTData: rb.records,
                        Name: rb.name,
                        Options: rb.report.Options,
                        Pivot: rb.report.Pivtot || {},
                        Graph: rb.report.Graph,
                        CFS: rb.report.CFS,
                        ReportHeading: rb.reportHeading,
                        outfile_pattern: rb.outFilePattern
                    };
                    return n;
                }, {});
                printMemUsed();
            }
            catch (err) {
                throw err;
            }
            try {
                printMemUsed();
                const emailParts = yield this.getEmailParts(consolidated);
                // Send email.
                let message = yield SendEmail_1.SendEmail(this.schedule.subject, this.schedule.name, this.schedule.from, this.schedule.to, this.schedule.cc, this.schedule.bcc, this.schedule.message || this.schedule.emptyMessage, emailParts);
                return `Sent Email Successfully : ${message}`;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getEmailParts(consolidated) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(Object.keys(consolidated).map((outfilePattern) => {
                let parts = Object.keys(consolidated[outfilePattern])
                    .map((k) => consolidated[outfilePattern][k]);
                let emailParts = new EmailParts(parts);
                return emailParts.get();
            }));
        });
    }
    getReports() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.schedule.reports.map((report) => {
                let rb = new ReportBuilder(Object.assign(report, {
                    'Message': this.schedule.message,
                    'EmptyMessage': this.schedule.empty_message
                }));
                return rb.getReport();
            }));
        });
    }
}
exports.ScheduleRunner = ScheduleRunner;
class EmailPartsOptions {
}
class EmailParts {
    constructor(parts) {
        this.parts = parts;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            let wantHtml = this.parts
                .filter((part) => !!part.Options.EmailBody)
                .map((part) => part.Name);
            let validReports = this.parts
                .filter((part) => part.RPTData.length)
                .map((part) => ({
                Name: part.Name,
                ReportHeading: part.ReportHeading,
                Data: part.RPTData,
                Pivot: part.Pivot,
                CFS: part.CFS,
                WantXLSX: !!(part.Options.Attachment && part.Options.AttachmentType == 'XLSX')
            }));
            try {
                let { xlsx, wd } = yield this.generateExcel(validReports);
                let htmls = yield this.prepareHTMLs(wd, wantHtml);
                let { csv, graph } = yield this.prepareCSVFiles(this.parts);
                this.emailParts = {
                    XLSX: xlsx,
                    EmailBody: htmls,
                    CSV: csv,
                    Graph: graph
                };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
            return this;
        });
    }
    prepareCSVFiles(parts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(parts.map((part) => (((part.Options.Attachment && part.Options.AttachmentType == 'CSV')
                || part.Options.Graph)
                ? this.prepareCSV(part)
                : Promise.resolve(undefined)))).then((CSV) => {
                return {
                    csv: CSV.filter((a) => a).map((a) => a.csv),
                    graph: CSV.filter((a) => a).map((a) => a.graph)
                };
            });
        });
    }
    prepareCSV(Report) {
        return __awaiter(this, void 0, void 0, function* () {
            let cSv = new CSV_1.CSV(Report.RPTData);
            return {
                csv: yield cSv.getCSV(Report.Options),
                graph: yield cSv.getGraph(Report.Graph)
            };
        });
    }
    prepareHTMLs(wd, wantHtml) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(wd.map((rpt) => (wantHtml.includes(rpt.Name))
                ? this.prepareHTML(rpt)
                : Promise.resolve(undefined))).then((values) => {
                return values;
            });
        });
    }
    prepareHTML(Report) {
        return __awaiter(this, void 0, void 0, function* () {
            return pug_1.renderFile('../views/reports_new.pug', {
                ReportHeading: Report.ReportHeading || Report.name,
                Cols: Report.data.splice(0, Report.headers_len),
                Rows: Report.data,
                CFS: Report.CFS || {}
            });
        });
    }
    generateExcel(validReports) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield XLSX_1.fromJsonObj(validReports);
        });
    }
}
exports.EmailParts = EmailParts;
function printMemUsed() {
    if (global.gc) {
        global.gc();
    }
    let heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.");
}
class ReportBuilder {
    constructor(doc) {
        this.report = {
            'Name': doc.name,
            'ReportHeading': doc.heading,
            'ReportDetails': {
                'Message': doc.Message,
                'EmptyMessage': doc.EmptyMessage
            },
            'outfile_pattern': doc.outfile_pattern,
            'Options': doc.options,
            'Pivot': doc.enable_pivot ? doc.pivot || {} : {},
            'Graph': doc.options.Graph ? doc.graph : {},
            'CFS': doc.formatting ? doc.cnd_formats : []
        };
    }
    getReportDoc() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Getting report details for " + this.report.Name);
                let report = yield ReportsModel.findOne({ name: this.report.Name }).exec();
                if (!report) {
                    throw new Error("Report not found for " + this.report.Name);
                }
                console.log(report);
                this.report.ReportDetails.Options = report.Options;
                this.report.ReportDetails.Queries = report.queries.map(function (query) { return { 'query': query.query, 'db': query.database }; });
                this.report.ReportDetails.AggregateQuery = report.aggregate_query;
                this.name = Utils_1.out_file_pattern_to_name(this.report.Name, { Name: this.name });
                this.outFilePattern = Utils_1.out_file_pattern_to_name(this.report.outfile_pattern, { Name: this.name });
                this.reportHeading = Utils_1.out_file_pattern_to_name(this.report.ReportHeading, { Name: this.name });
            }
            catch (err) {
                throw err;
            }
            return this.report;
        });
    }
    getReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getReportDoc();
                yield this.processReport();
                return this;
            }
            catch (err) {
                throw err;
            }
        });
    }
    processReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let queryResults = yield this.executeQueries();
                let memDb = new MemDB_1.MemDB(Object.keys(queryResults[0][0]));
                queryResults.forEach((rows) => memDb.insertRows(rows));
                this.records = yield memDb.getRows(this.report.ReportDetails.AggregateQuery);
                if (this.records.length) {
                    this.message = this.report.ReportDetails.Message;
                }
                else {
                    this.message = this.report.ReportDetails.EmptyMessage;
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    executeQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.report.ReportDetails.Queries.map((q) => {
                let db = new Database(q.db, q.query);
                return db.query();
            }));
        });
    }
}
exports.ReportBuilder = ReportBuilder;
class Database {
    constructor(dbName, sqlQuery) {
        this.dbName = dbName;
        this.sqlQuery = sqlQuery;
    }
    getDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                DModel.findOne({
                    name: this.dbName
                })
                    .exec((err, doc) => {
                    if (err)
                        return reject(err);
                    if (!doc)
                        return reject(new Error('No such DB Found' + this.dbName));
                    this.db = {
                        Options: doc.Options || {},
                        DBType: doc.dbType,
                        Host: doc.host,
                        Port: doc.port,
                        UserName: doc.username,
                        Password: doc.password,
                        Query: this.sqlQuery
                    };
                    resolve(this);
                });
            });
        });
    }
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDetails();
                return yield DataBase_1.executeQuery(this.db);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.Database = Database;
function Connect(opts) {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${opts.server}:${opts.port}/${opts.db}`);
    return mongoose.connection;
}
;
function disConnect() {
    mongoose.disconnect();
}
var x = new ScheduleRunner(process.env.SCHEDULE);
x.process().then((a) => {
    console.log('Completed');
    disConnect();
}).catch((err) => {
    disConnect();
    throw err;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVfcmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi9nZW5lcmF0ZV9yZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQTJEO0FBQzNELHFDQUFxQztBQUNyQywwQ0FBMkM7QUFDM0Msb0NBQWlDO0FBRWpDLGtDQUF1QztBQUN2Qyw2QkFBaUM7QUFDakMsZ0NBQTZCO0FBQzdCLDRDQUF5QztBQUN6QyxvQ0FBNEU7QUFFNUUscUJBQW1CO0FBQ25CLE1BQU0sYUFBYSxHQUFHLGdCQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekMsTUFBTSxZQUFZLEdBQUcsZ0JBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0QyxNQUFNLE1BQU0sR0FBRyxnQkFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTNCLE1BQU0sSUFBSSxHQUFHO0lBQ1QsTUFBTSxFQUFFLGVBQWU7SUFDdkIsSUFBSSxFQUFFLE9BQU87SUFDYixFQUFFLEVBQUUsbUJBQW1CO0NBQzFCLENBQUM7QUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZDtJQUVJLFlBQW9CLFlBQW1CO1FBQW5CLGlCQUFZLEdBQVosWUFBWSxDQUFPO0lBQ3ZDLENBQUM7SUFDSyxXQUFXOztZQUNiLElBQUksQ0FBQztnQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRixDQUFFO1lBQUEsS0FBSyxDQUFBLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNB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