"use strict";
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const HeroRouter_1 = require("./routes/HeroRouter");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/heroes', HeroRouter_1.default);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App().express;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsbUNBQW1DO0FBQ25DLGlDQUFpQztBQUNqQywwQ0FBMEM7QUFFMUMsb0RBQTZDO0FBRTdDLGtEQUFrRDtBQUNsRDtJQUtFLG9EQUFvRDtJQUNwRDtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsZ0NBQWdDO0lBQ3hCLFVBQVU7UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELDJCQUEyQjtJQUNuQixNQUFNO1FBQ1o7OzJCQUVtQjtRQUNuQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1lBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ1AsT0FBTyxFQUFFLGNBQWM7YUFDeEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0JBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FFRjs7QUFFRCxrQkFBZSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyJ9