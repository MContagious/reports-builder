"use strict";
const express_1 = require("express");
const Heroes = require('../data');
class HeroRouter {
    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all Heroes.
     */
    getAll(req, res, next) {
        res.send(Heroes);
    }
    /**
     * GET one hero by id
     */
    getOne(req, res, next) {
        let query = parseInt(req.params.id);
        let hero = Heroes.find(hero => hero.id === query);
        if (hero) {
            res.status(200)
                .send({
                message: 'Success',
                status: res.status,
                hero
            });
        }
        else {
            res.status(404)
                .send({
                message: 'No hero found with the given id.',
                status: res.status
            });
        }
    }
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
    }
}
exports.HeroRouter = HeroRouter;
// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = heroRoutes.router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVyb1JvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvSGVyb1JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQWdFO0FBQ2hFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVsQztJQUdFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzNELElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNaLElBQUksQ0FBQztnQkFDSixPQUFPLEVBQUUsU0FBUztnQkFDbEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixJQUFJO2FBQ0wsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0osR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1osSUFBSSxDQUFDO2dCQUNKLE9BQU8sRUFBRSxrQ0FBa0M7Z0JBQzNDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTthQUNuQixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUk7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUVGO0FBbERELGdDQWtEQztBQUVELGtFQUFrRTtBQUNsRSxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFbEIsa0JBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQyJ9