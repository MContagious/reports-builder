import { Server, Db, Collection } from 'mongodb';
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var server = new Server('192.168.0.195', 27017, options);
var db = new Db('ReportBuilder-dev', server, { w: 1 });
db.open((err:Error, res:any) => console.log(err||res));

export class DataBase {
    document: Object;
    collectionName: string;
    collection: Collection;
    constructor(collectionName: string) {
        this.collection = db.collection("schedules");
    }

    async getByQuery(query:Object) {
        return new Promise((resolve, reject) => { 
            this.collection.findOne(query, (err, doc) => {
                if (err)
                    return reject(err);
                this.document = doc;
                return resolve(this.document);
            });
        });
    }
}

export class Schedule extends DataBase {
    get schedule () {
        return this.document;    
    }
    set schedule (doc:any){
        this.document = doc;
    }
    constructor(private name:string) {
        super("schedules"); 
    }
    async getByName() {
        this.document = await this.getByQuery({name : this.name});
        return this.document;
    }
}