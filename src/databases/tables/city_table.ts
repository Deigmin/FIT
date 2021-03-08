import { sequelize, Station } from "../connection";
import { DataTypes, Model } from "sequelize";

interface CityAttributes {
    id?: Number,
    name: String
}

export class City extends Model<CityAttributes> implements CityAttributes {
    public id!: Number;
    public name!: String;
    public newName?: String;
    public preferredName!: string | null; // for nullable fields
}

City.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "city",
    timestamps: false
});