import express from "express";
import { ApolloServer, gql, IResolvers, makeExecutableSchema, MockList } from "apollo-server-express";
import { resolvers as cityResolver, typeDefs as city } from "./graph_types/city";
import { typeDefs as station } from "./graph_types/station";
import { City, Station } from "./databases/connection";
import { Op } from "sequelize";

import usersRouter from "./routes/users";

let app = express();

app.use("/users", usersRouter);

const typeDefs = gql`
    type Query {
        city(name: String!): City
    }
    type Mutation {
        addCity(name: String!): ID
        updateCityNameById(id: Int!, newName: String!): ID
        removeCityById(id: Int!): ID
        addStation(city: String!, name: String!, number: String, address: String): Station
        updateStationById(id: Int!, name: String!, number: String!, address: String!): String
        removeStationById(id: Int!): ID
    }`;

const Query: IResolvers = {
    Query: {
        city: async (_: null, arg: City) => {
            return await City.findOne({
                where: {
                    name: `${arg.name}`
                },
                attributes: ["id", "name"],
            });
        },
    },

    Mutation: {
        addCity: async (_: null, arg: City) => {
            if (!arg.name) {
                return new Error("Must be city name to create or update fields");
            }

            let [city, isCreated] = await City.findOrCreate({
                where: {name: `${arg.name}`},
                defaults: {
                    name: `${arg.name}`
                }
            });

            if (!isCreated) {
                return new Error("This city is already exist");
            }

            if (city && isCreated) {
                return city.id;
            }
        },
        updateCityNameById: async (_: null, arg: City) => {
            if (!arg.id) {
                return new Error("Must be id to update city");
            }

            if (!arg.newName) {
                return new Error("Must be new name to update city");
            }

            let isUpdated: [Number, City[]] = await City.update({name: `${arg.newName}`}, {
                where: {
                    id: `${arg.id}`
                }
            });

            if (!!isUpdated[0]) {
                return arg.id;
            } else {
                return new Error("There is nothing to update");
            }
        },
        removeCityById: async (_: null, arg: City) => {
            let isDeleted: boolean = !!await City.destroy({
                where: {
                    id: `${arg.id} `
                }
            });

            if (isDeleted) {
                return arg.id;
            } else {
                return new Error("there is no city by this id");
            }
        },
        addStation: async (_: null, arg: Station) => {
            if (!arg.city) {
                return new Error("Must be city name to create Station");
            }

            if (!arg.name) {
                return new Error("Must be station name to create Station");
            }

            let cityId: City | null = await City.findOne({
                attributes: ["id"],
                where: {
                    name: `${arg.city}`
                }
            });

            if (!cityId) {
                return new Error("This city doesn't exist. Please, add one");
            }

            let [station, isCreated] = await Station.findOrCreate({
                where: {
                    [Op.and]: [{cityId: `${cityId.id}`}, {name: `${arg.name}`}],
                },
                defaults: {
                    name: `${arg.name}`,
                    number: `${arg.number}`,
                    address: `${arg.address}`,
                    cityId: Number(cityId.id)
                }
            });

            if (!isCreated) {
                return new Error("There is already station with this name in this city");
            }

            return station;
        },
        // updateStationById: async (_: null, arg: Station) => {
        //     return null;
        // },
        removeStationById: async (_: null, arg: Station) => {
            let isDeleted: boolean = !!await Station.destroy({
                where: {
                    id: `${arg.id} `
                }
            });

            if (isDeleted) {
                return arg.id;
            } else {
                return new Error("there is no station by this id");
            }
        }
    }
};

let resolvers = Object.assign({}, Query, cityResolver);

const mocks: any = {
    Mutation: () => ({
        updateStationById: () => ("Triggers mock method")
    }),
};

let schema = makeExecutableSchema({
    typeDefs: [typeDefs, city, station],
    resolvers: resolvers,
});

const server: ApolloServer = new ApolloServer({schema, mocks, mockEntireSchema: false});

server.applyMiddleware({app});

export = app;
