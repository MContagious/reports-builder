import { MySQL } from './MySQL';
import { SQLServer } from './SQLServer';

export async function executeQuery (server) {
    console.log(server);
    return new Promise<[Object]>(function (resolve, reject) {
        var DB:MySQL|SQLServer;
        if (server.DBType == 'MYSql') {
            DB = new MySQL({
                host: server.Host,
                port: server.Port,
                user: server.UserName,
                password: server.Password,
                insecureAuth: server.insecureAuth || true
            });
        }
        if (server.DBType == 'SQLServer' || server.DBType == 'MSSql') {
            DB = new SQLServer({
                    server: server.Host,
                    port: server.Port,
                    user: server.UserName,
                    password: server.Password,
                    options: {
                        tdsVersion: server.Options || undefined
                    }
                });
        }
        DB.query(server.Query).then(resolve).catch(reject);
    });
}