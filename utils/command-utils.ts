import { Command } from "../models/types";
import fs from "fs";

export const getCommands = (): Command[] => {
    return fs.readdirSync(`${__dirname}/commands`)
        .filter(file => file.endsWith(".ts") || file.endsWith(".js"))
        .map(file => {
            return require(`${__dirname}/commands/${file}`).default;
        });
};
