import config from "../config";
import { IConnection } from "../types/types";
import { Sequelize } from "sequelize";

const connection: IConnection = config["connection"];
export const sequelize = new Sequelize(`mysql://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`);

import { City } from "./tables/city_table";
import {Station} from "./tables/station_table";

City.hasMany(Station);
Station.belongsTo(City);
sequelize.sync({ alter: true });

export { City } from "./tables/city_table";
export { Station } from "./tables/station_table";

