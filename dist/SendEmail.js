"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Utils_1 = require("./Utils");
function SendEmail(subject, name, from, to, cc, bcc, message, emailParts) {
    return __awaiter(this, void 0, void 0, function* () {
        const attachements = [];
        let html = '';
        for (let i = 0; i < emailParts.length; i++) {
            let report = emailParts[i];
            let outfile_pattern = report.parts
                .filter((p) => p.outfile_pattern)
                .map((p) => p.outfile_pattern)[0];
            let name = report.parts
                .filter((p) => p.Name)
                .map((p) => p.Name)[0];
            // CSV Files
            attachements.push(...report.emailParts.CSV.filter(a => a).map((csv) => {
                let out_file_name = "";
                try {
                    out_file_name = Utils_1.out_file_pattern_to_name(report.parts[i].outfile_pattern || outfile_pattern, { Name: report.parts[i].Name || name });
                }
                catch (e) {
                    console.dir(e);
                    process.exit(1);
                }
                return {
                    filename: out_file_name + '.csv',
                    content: csv
                };
            }));
            // XLSX file
            attachements.push(...[report.emailParts.XLSX].filter(a => a).map((xlsx) => {
                let out_file_name = "";
                try {
                    out_file_name = Utils_1.out_file_pattern_to_name(report.parts[i].outfile_pattern || outfile_pattern, { Name: report.parts[i].Name || name });
                }
                catch (e) {
                    console.dir(e);
                    process.exit(1);
                }
                return {
                    filename: out_file_name + '.xlsx',
                    content: new Buffer(xlsx, 'base64')
                };
            }));
            try {
                html += report.emailParts.EmailBody.filter(a => a).join("<br>");
            }
            catch (err) {
                throw err;
            }
            // Graph File
            attachements.push(...report.emailParts.Graph.filter(a => a).map((graph) => {
                let out_file_name = "";
                try {
                    out_file_name = Utils_1.out_file_pattern_to_name(report.parts[i].outfile_pattern || outfile_pattern, { Name: report.parts[i].Name || name });
                }
                catch (e) {
                    console.dir(e);
                    process.exit(1);
                }
                let cid = out_file_name + '.png' + '@netxcell.com';
                html += `<h2>${graph.heading}</h2>
                <img src="cid:${cid}"><br>`;
                return {
                    filename: out_file_name,
                    content: graph.buffer,
                    cid
                };
            }));
        }
        // Message
        message = Utils_1.out_file_pattern_to_name(message || '', { Name: name }) || '';
        if (new RegExp('{{HTML-Reports}}', 'i').test(message)) {
            html = message.replace(new RegExp('{{HTML-Reports}}', 'i'), html);
        }
        else {
            html = '<p>' + message + '</p>' + html;
        }
        try {
            let Email = new Utils_1.Emailer();
            let str = yield Email.send({
                to,
                cc,
                bcc,
                from,
                subject: Utils_1.out_file_pattern_to_name(subject, { Name: name }),
                html,
                attachments: attachements
            });
            return str;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.SendEmail = SendEmail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VuZEVtYWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1NlbmRFbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxtQ0FFa0Q7QUFHbEQsbUJBQ00sT0FBYyxFQUNkLElBQWEsRUFDYixJQUFhLEVBQ2IsRUFBVyxFQUNYLEVBQVUsRUFDVixHQUFXLEVBQ1gsT0FBZSxFQUNmLFVBQXVCOztRQUN6QixNQUFNLFlBQVksR0FBMkIsRUFBRSxDQUFDO1FBQ2hELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsS0FBSztpQkFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7aUJBQ2hDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUs7aUJBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNCLFlBQVk7WUFDWixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHO2dCQUM1RCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQztvQkFDRCxhQUFhLEdBQUcsZ0NBQXdCLENBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxJQUFJLGVBQWUsRUFDbEQsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBRTtnQkFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztnQkFFRCxNQUFNLENBQUM7b0JBQ0gsUUFBUSxFQUFFLGFBQWEsR0FBRyxNQUFNO29CQUNoQyxPQUFPLEVBQUUsR0FBRztpQkFDZixDQUFBO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVKLFlBQVk7WUFDWixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSTtnQkFDaEUsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUM7b0JBQ0QsYUFBYSxHQUFHLGdDQUF3QixDQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsSUFBSSxlQUFlLEVBQ2xELEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksRUFBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUQsTUFBTSxDQUFDO29CQUNILFFBQVEsRUFBRSxhQUFhLEdBQUcsT0FBTztvQkFDakMsT0FBTyxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7aUJBQ3RDLENBQUE7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDO2dCQUNELElBQUksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxDQUFFO1lBQUEsS0FBSyxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLEdBQUcsQ0FBQztZQUNkLENBQUM7WUFFRCxhQUFhO1lBQ2IsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSztnQkFDbEUsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUM7b0JBQ0QsYUFBYSxHQUFHLGdDQUF3QixDQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsSUFBSSxlQUFlLEVBQ2xELEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksRUFBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQ0QsSUFBSSxHQUFHLEdBQUcsYUFBYSxHQUFHLE1BQU0sR0FBRyxlQUFlLENBQUM7Z0JBQ25ELElBQUksSUFBSSxPQUFPLEtBQUssQ0FBQyxPQUFPO2dDQUNSLEdBQUcsUUFBUSxDQUFBO2dCQUMvQixNQUFNLENBQUM7b0JBQ0gsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTTtvQkFDckIsR0FBRztpQkFDTixDQUFBO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUM7UUFFRCxVQUFVO1FBQ1YsT0FBTyxHQUFHLGdDQUF3QixDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkUsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO1lBQzFCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDdkIsRUFBRTtnQkFDQSxFQUFFO2dCQUNGLEdBQUc7Z0JBQ0gsSUFBSTtnQkFDSixPQUFPLEVBQUUsZ0NBQXdCLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUN4RCxJQUFJO2dCQUNKLFdBQVcsRUFBRSxZQUFZO2FBQzlCLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFFO1FBQUEsS0FBSyxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sR0FBRyxDQUFDO1FBQ2QsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQTVHRCw4QkE0R0MifQ==