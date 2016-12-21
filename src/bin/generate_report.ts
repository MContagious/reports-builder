import { model, Model, Document, connect } from 'mongoose';
import * as mongoose from 'mongoose';
import { executeQuery } from "../DataBase";
import { MemDB } from "../MemDB";
import moment = require('moment');
import { fromJsonObj  } from "../XLSX";
import { renderFile } from "pug";
import { CSV } from "../CSV";
import { SendEmail } from "../SendEmail";
import { out_file_pattern_to_name, replace_known_patterns } from "../Utils";

import '../models';
const ScheduleModel = model('Schedules');
const ReportsModel = model('Reports');
const DModel = model("DB");

const opts = {
    server: "192.168.0.195",
    port: "27017",
    db: "ReportBuilder-dev"
};
Connect(opts);
export class ScheduleRunner {
    schedule: any;
    constructor(private scheduleName:string) {
    }
    async getSchedule() {
        try {
            this.schedule = await ScheduleModel.findOne({name: this.scheduleName}).exec();
        } catch(er) {
            throw er;
        }
        if (this.schedule === null) {
            throw new Error("No Schedule found with the given name" + this.scheduleName);
        }
        return this.schedule;
    }
    async process() {
        // Get the document from mongodb. Store in this.schedule.
        let consolidated = {};
        try {
            await this.getSchedule();
            const rbs:[any] = await this.getReports();
            consolidated = rbs.reduce((n, rb:ReportBuilder) => {
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
        } catch(err) {
            throw err;
        }
        try {
            printMemUsed();
            const emailParts = await this.getEmailParts(
                consolidated
            );
            // Send email.
            let message = await SendEmail(
              this.schedule.subject
            , this.schedule.name
            , this.schedule.from
            , this.schedule.to
            , this.schedule.cc
            , this.schedule.bcc
            , this.schedule.message || this.schedule.emptyMessage 
            , emailParts);
            
            return `Sent Email Successfully : ${message}`;
        } catch(err) {
            throw err;
        }
    }
    async getEmailParts(consolidated) {
        return Promise.all(
            Object.keys(consolidated).map((outfilePattern) => {
                let parts = Object.keys(consolidated[outfilePattern])
                    .map((k) => consolidated[outfilePattern][k]);
                let emailParts = new EmailParts(parts);
                return emailParts.get();
            })
        );
    }
    async getReports() {
        return Promise.all(
            this.schedule.reports.map((report) => {
                let rb = new ReportBuilder(Object.assign(
                    report, {
                    'Message' : this.schedule.message,
                    'EmptyMessage': this.schedule.empty_message
                }));
                return rb.getReport() as Promise<ReportBuilder>;
            })
        );
    }
}
class EmailPartsOptions {
    RPTData: Array<any>;
    Name: string;
    Options: any;
    Pivot: any;
    Graph: any;
    CFS: any;
    ReportHeading: string;
    outfile_pattern: string
}
export class EmailParts {
    emailParts:{
        XLSX: string,
        EmailBody: [string],
        CSV: string[],
        Graph:{
            img: any;
            heading: any;
            buffer: any;
        }[]
    };
    constructor(public parts:EmailPartsOptions[]) {
    }
    async get () {
        let wantHtml 
            = this.parts
                .filter((part:EmailPartsOptions) =>!!part.Options.EmailBody)
                .map((part) => part.Name);
        let validReports 
            = this.parts
                .filter((part:EmailPartsOptions) =>part.RPTData.length)
                .map((part:EmailPartsOptions) => ({
                    Name: part.Name,
                    ReportHeading : part.ReportHeading,
                    Data: part.RPTData,
                    Pivot: part.Pivot,
                    CFS: part.CFS,
                    WantXLSX: !!(part.Options.Attachment && part.Options.AttachmentType == 'XLSX')
                }));
        try {
            let { xlsx, wd } = await this.generateExcel(validReports);
            let htmls = await this.prepareHTMLs(wd, wantHtml);
            let { csv, graph } = await this.prepareCSVFiles(this.parts);
            this.emailParts = {
                XLSX : xlsx,
                EmailBody: htmls,
                CSV : csv,
                Graph: graph
            };
        } catch(err) {
            console.log(err);
            throw err;
        }

        return this;
    }
    async prepareCSVFiles(parts) {
        return Promise.all(
            parts.map((part) => (
                ( 
                    (part.Options.Attachment && part.Options.AttachmentType == 'CSV')
                    || part.Options.Graph
                )
                ? this.prepareCSV(part)
                : Promise.resolve(undefined)))
        ).then((CSV):{csv:string[], graph:{img, heading, buffer}[]} => {
            return {
                csv : CSV.filter((a) => a).map((a:{csv,graph:{img, heading, buffer}}) => a.csv),
                graph: CSV.filter((a) => a).map((a:{csv,graph:{img, heading, buffer}}) => a.graph)
            }
        });
    }
    async prepareCSV(Report:EmailPartsOptions):Promise<{csv,graph:{img, heading, buffer}}> {
        let cSv = new CSV(Report.RPTData);
        return {
            csv: await cSv.getCSV(Report.Options),
            graph: await cSv.getGraph(Report.Graph)
        }
    }
    async prepareHTMLs(wd, wantHtml:string[]):Promise<[string]> {
        return Promise.all(wd.map((rpt) => 
            ((wantHtml as any).includes(rpt.Name))
             ? this.prepareHTML(rpt) 
             : Promise.resolve(undefined))
        ).then((values:any): [string] => {
            return values;
        });
    }
    async prepareHTML(Report):Promise<string> {
        return renderFile('../views/reports_new.pug', {
            ReportHeading : Report.ReportHeading || Report.name,
            Cols : Report.data.splice(0, Report.headers_len),
            Rows : Report.data,
            CFS : Report.CFS || {}
        });
    }
    async generateExcel(validReports) {
        return await fromJsonObj(validReports);
    }
}

function printMemUsed() {
    if (global.gc){
        global.gc();
    }
    let heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.");
}
export class ReportBuilder {
    report:any;
    name:string;
    records:Array<Object>;
    message:string;
    outFilePattern:string;
    reportHeading:string;

    constructor(doc:any) {   
            this.report = {
                'Name': doc.name,
                'ReportHeading'     : doc.heading,
                'ReportDetails'     : {
                    'Message'       : doc.Message,
                    'EmptyMessage'  : doc.EmptyMessage
                },
                'outfile_pattern'   : doc.outfile_pattern,
                'Options'           : doc.options,
                'Pivot'             : doc.enable_pivot ? doc.pivot||{} : {},
                'Graph'             : doc.options.Graph ? doc.graph : {},
                'CFS'               : doc.formatting ? doc.cnd_formats : []
            };    
    }
    async getReportDoc() {
        try {
            console.log("Getting report details for " + this.report.Name);
            let report:any = await ReportsModel.findOne({name: this.report.Name}).exec();
            if (!report) {
                throw new Error("Report not found for " + this.report.Name);
            }
            console.log(report);
            this.report.ReportDetails.Options = report.Options;
            this.report.ReportDetails.Queries = report.queries.map(function(query){ return { 'query' : query.query, 'db' :query.database};});
            this.report.ReportDetails.AggregateQuery = report.aggregate_query;

            this.name = out_file_pattern_to_name(this.report.Name, {Name: this.name});
            this.outFilePattern = out_file_pattern_to_name(this.report.outfile_pattern, {Name: this.name});
            this.reportHeading	= out_file_pattern_to_name(this.report.ReportHeading, {Name: this.name});
        } catch(err) {
            throw err;
        }
        return this.report;
    }
    async getReport():Promise<ReportBuilder> {
        try {
            await this.getReportDoc();
            await this.processReport();
            return this;
        } catch(err) {
            throw err;
        }
    }
    async processReport() {
        try {
            let queryResults:any = await this.executeQueries();
            let memDb = new MemDB(Object.keys(queryResults[0][0]));
            queryResults.forEach((rows) => memDb.insertRows(rows));
            this.records = await memDb.getRows(this.report.ReportDetails.AggregateQuery);
            if (this.records.length) {
                this.message = this.report.ReportDetails.Message;
            } else {
                this.message = this.report.ReportDetails.EmptyMessage;
            }
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
    async executeQueries () {
        return Promise.all(
            this.report.ReportDetails.Queries.map((q):Promise<[Object]> => {
                let db = new Database(q.db, q.query);
                return db.query();
            })
        )
    }
}
export class Database {
    db:any;
    constructor(private dbName:string, private sqlQuery:string) {
    }
    async getDetails():Promise<Database> {
        return new Promise<Database>((resolve, reject) => {
            DModel.findOne({
                name: this.dbName
            })
            .exec((err, doc:any) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('No such DB Found' + this.dbName));
                this.db = {
                    Options  :   doc.Options || {},
                    DBType   :   doc.dbType,
                    Host     :   doc.host,
                    Port     :   doc.port,
                    UserName :   doc.username,
                    Password :   doc.password,
                    Query    : this.sqlQuery
                };
                resolve(this);
            });
        });
    }
    async query():Promise<Array<Object>> {
        try {
            await this.getDetails();
            return await executeQuery(this.db);
        } catch(err) {
            throw err;
        }
    }
}
function Connect(opts) {
  (mongoose as any).Promise = global.Promise;
  mongoose.connect(`mongodb://${opts.server}:${opts.port}/${opts.db}`);
  return mongoose.connection;
};

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