import { sequelize } from "../connection";
import { DataTypes, Model } from "sequelize";

interface StationAttributes {
    id?: Number,
    name: String,
    number: String,
    address: String,
    cityId?: Number
}

export class Station extends Model<StationAttributes> implements StationAttributes {
    public id!: Number;
    public name!: String;
    public number!: String;
    public address!: String;
    public city!: String;
    public cityId!: Number;
    public preferredName!: string | null; // for nullable fields
}

Station.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    number: {
        type: DataTypes.STRING(45),
    },
    address: {
        type: DataTypes.STRING(100)
    },
}, {
    sequelize,
    modelName: "station",
    timestamps: false
});