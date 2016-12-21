import { EmailParts } from './bin/generate_report';
import { out_file_pattern_to_name
        , Emailer
        , replace_known_patterns } from "./Utils";
import { AttachmentObject } from 'nodemailer';

export async function SendEmail(
      subject:string
    , name : string
    , from : string
    , to : string
    , cc: string
    , bcc: string
    , message: string
    , emailParts:EmailParts[]):Promise<string> {
    const attachements:Array<AttachmentObject> = [];
    let html = '';

    for (let i=0; i < emailParts.length; i++) {
        let report = emailParts[i];
        let outfile_pattern = report.parts
        .filter((p) => p.outfile_pattern)
        .map((p) => p.outfile_pattern)[0];
        
        let name = report.parts
            .filter((p) => p.Name)
            .map((p) => p.Name)[0];

        // CSV Files
        attachements.push(...report.emailParts.CSV.filter(a=>a).map((csv) => {
            let out_file_name = "";
            try {
                out_file_name = out_file_pattern_to_name(
                    report.parts[i].outfile_pattern || outfile_pattern,
                    {Name: report.parts[i].Name || name});
            } catch (e) {
                console.dir(e);
                process.exit(1);
            }

            return {
                filename: out_file_name + '.csv',
                content: csv
            }
        }));

        // XLSX file
        attachements.push(...[report.emailParts.XLSX].filter(a=>a).map((xlsx) => {
            let out_file_name = "";
            try {
                out_file_name = out_file_pattern_to_name(
                    report.parts[i].outfile_pattern || outfile_pattern,
                    {Name: report.parts[i].Name || name});
            } catch (e) {
                console.dir(e);
                process.exit(1);
            }

            return {
                filename: out_file_name + '.xlsx',
                content: new Buffer(xlsx, 'base64')
            }
        }));
        try {
            html += report.emailParts.EmailBody.filter(a => a).join("<br>");
        } catch(err) {
            throw err;
        }

        // Graph File
        attachements.push(...report.emailParts.Graph.filter(a => a).map((graph) => {
            let out_file_name = "";
            try {
                out_file_name = out_file_pattern_to_name(
                    report.parts[i].outfile_pattern || outfile_pattern,
                    {Name: report.parts[i].Name || name});
            } catch (e) {
                console.dir(e);
                process.exit(1);
            }
            let cid = out_file_name + '.png' + '@netxcell.com';
            html += `<h2>${graph.heading}</h2>
                <img src="cid:${cid}"><br>`
            return {
                filename: out_file_name,
                content: graph.buffer,
                cid
            }
        }));
    }
    
    // Message
    message = out_file_pattern_to_name(message || '', { Name: name}) || '';
    if (new RegExp('{{HTML-Reports}}', 'i').test(message)) {
        html = message.replace(new RegExp('{{HTML-Reports}}', 'i'), html);
    } else {
        html = '<p>' + message + '</p>' + html;
    }

    try {
        let Email = new Emailer();
        let str = await Email.send({
            to
            , cc
            , bcc
            , from
            , subject: out_file_pattern_to_name(subject, {Name: name})
            , html
            , attachments: attachements
        });
        return str;
    } catch(err) {
        throw err;
    }
}