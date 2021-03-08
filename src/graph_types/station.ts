import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Station {
        id: Int
        name: String
        number: String
        address: String
    }`;