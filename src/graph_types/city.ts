import { gql, IResolvers } from "apollo-server-express";
import { City, Station } from "../databases/connection";

export const typeDefs = gql`
    type City {
        id: Int
        name: String
        stations (name: String): [Station]
    }`;

export const resolvers: IResolvers = {
    City: {
        stations: async (parent: City, arg: Station) => {
            let station: String | undefined = arg.name;

            if (parent.id && !station) {
                return await Station.findAll({
                    where: {
                        // @ts-ignore
                        cityId: parent.id
                    }
                });
            } else if (parent.id && station) {
                return await Station.findAll({
                    where: {
                        cityId: Number(parent.id),
                        // @ts-ignore
                        name: station
                    }
                });
            }
        }
    }
};