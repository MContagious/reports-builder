import { createTransport
        , Transporter
        , SentMessageInfo
        , SendMailOptions } from 'nodemailer';

export class Emailer {
    transport:Transporter;
    constructor () {
        this.transport = createTransport({
            host :       "nxlmail.netxcell.com",
            port :       587,
            secure :     false,
            ignoreTLS :  false,
            tls :        { rejectUnauthorized: false },
            auth :      {
                user : 'mis',
                pass : 'Reset@2010'
            }
        });
    }
    async send(options:SendMailOptions):Promise<string> {
        console.log(options);
        return new Promise<string>((resolve, reject) => {
            // options.generateTextFromHTML = true;

            // Comment thse 3 lines for production use
            if (process.env.NODE_ENV === 'test') {
                options.bcc =  ""
                options.to = "kishore.relangi@netxcell.com;durga.sekhar@netxcell.com;ravibabu.m@netxcell.com";
                options.cc = "";
            }
            // Comment upto this.

            this.transport.sendMail(options, 
                (error:Error, response:SentMessageInfo) => {
                if(error) {
                    console.log(error);
                    reject(error);
                } else{
                    console.log("Message sent: " + response.response);
                    resolve(response.response);
                }
                this.transport.close();
            });
        });
  }
}
