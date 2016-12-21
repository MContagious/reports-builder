"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const nodemailer_1 = require("nodemailer");
class Emailer {
    constructor() {
        this.transport = nodemailer_1.createTransport({
            host: "nxlmail.netxcell.com",
            port: 587,
            secure: false,
            ignoreTLS: false,
            tls: { rejectUnauthorized: false },
            auth: {
                user: 'mis',
                pass: 'Reset@2010'
            }
        });
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options);
            return new Promise((resolve, reject) => {
                // options.generateTextFromHTML = true;
                // Comment thse 3 lines for production use
                if (process.env.NODE_ENV === 'test') {
                    options.bcc = "";
                    options.to = "kishore.relangi@netxcell.com;durga.sekhar@netxcell.com;ravibabu.m@netxcell.com";
                    options.cc = "";
                }
                // Comment upto this.
                this.transport.sendMail(options, (error, response) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    else {
                        console.log("Message sent: " + response.response);
                        resolve(response.response);
                    }
                    this.transport.close();
                });
            });
        });
    }
}
exports.Emailer = Emailer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1haWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9VdGlscy9FbWFpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJDQUc4QztBQUU5QztJQUVJO1FBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyw0QkFBZSxDQUFDO1lBQzdCLElBQUksRUFBUyxzQkFBc0I7WUFDbkMsSUFBSSxFQUFTLEdBQUc7WUFDaEIsTUFBTSxFQUFPLEtBQUs7WUFDbEIsU0FBUyxFQUFJLEtBQUs7WUFDbEIsR0FBRyxFQUFVLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFO1lBQzFDLElBQUksRUFBUTtnQkFDUixJQUFJLEVBQUcsS0FBSztnQkFDWixJQUFJLEVBQUcsWUFBWTthQUN0QjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDSyxJQUFJLENBQUMsT0FBdUI7O1lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ3ZDLHVDQUF1QztnQkFFdkMsMENBQTBDO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxPQUFPLENBQUMsR0FBRyxHQUFJLEVBQUUsQ0FBQTtvQkFDakIsT0FBTyxDQUFDLEVBQUUsR0FBRyxnRkFBZ0YsQ0FBQztvQkFDOUYsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQ0QscUJBQXFCO2dCQUVyQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQzNCLENBQUMsS0FBVyxFQUFFLFFBQXdCO29CQUN0QyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbEIsQ0FBQztvQkFBQyxJQUFJLENBQUEsQ0FBQzt3QkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztvQkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztLQUFBO0NBQ0Y7QUF6Q0QsMEJBeUNDIn0=