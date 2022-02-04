import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
} from "discord.js";
import { SlashCommandType } from "../typings/SlashCommand";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import { lechs_Subscription } from "./Music/Subscription";
import { subCounter } from "../counters/subcounter"
import mongoose from 'mongoose'
import Genius from 'genius-lyrics'
import { MONGO_DB_SRV, LECHSBOTTKEY, GENIUS } from '../config.json'
import { clientUtils } from "../typings/clientUtils";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    slashCommands: Collection<string, SlashCommandType> = new Collection();
    queue: Collection<string, lechs_Subscription> = new Collection();
    utils: clientUtils = {
        genius: new Genius.Client(GENIUS),
    }

    constructor() {
        console.log(`Starting the main client for process`)
        super({
            shards: 'auto',
            intents: 2048,
        });
    }

    start() {
        this.registerModules();
        this.login(LECHSBOTTKEY);
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands(commands, guilds: Array<string>) {

        let errors = []

        console.log(`Registering commands to all guilds`);
        guilds.forEach((guild) => {
            this.guilds.cache.get(guild)?.commands.set(commands).catch(err => {
                let x = {
                    id: guild,
                    error: err,
                }

                errors.push(x)
            })
        })

        if(errors.length !== 0){
            console.log(`An error occurred during deploying commands: ${errors.join(', ')}`);
        }

        // else {
        //     this.application?.commands.set(commands);
        //     console.log("Registering global commands");
        // }
    }

    async registerModules() {

        console.log(`Exploring the normal commands`)
        //Commands
        const commands = []
        await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        ).then(x => {
            x.forEach(async (filePath) => {
                const command: CommandType = await this.importFile(filePath);
                if (!command.name) return;
                console.log(`CMD | ${command.name} loaded!`)
    
                this.commands.set(command.name, command);
                commands.push(command);
            });
        })


        console.log(`Exploring the slash commands`)
        // Slash Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        await globPromise(
            `${__dirname}/../slashCommands/*/*{.ts,.js}`
        ).then(x => {
            x.forEach(async (filePath) => {
                const command: SlashCommandType = await this.importFile(filePath);
                if (!command.name) return;
                console.log(`SCMD | ${command.name} loaded!`)
    
                this.slashCommands.set(command.name, command);
                slashCommands.push(command);
            });
        })

        //Database
        mongoose.connect(MONGO_DB_SRV).then(() => {
            console.log('Successfully connected to lechsbottdb')
        }).catch((err) => {
            console.log(err)
        })

        console.log(`Exploring the events`)
        // Event
        await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        ).then(x => {
            x.forEach(async (filePath) => {
                const event: Event<keyof ClientEvents> = await this.importFile(
                    filePath
                );
                console.log(`EVENT | ${event.event} loaded!`)
                this.on(event.event, event.execute);
            });
        })

        this.once("ready", () => {

            let guilds = this.guilds.cache.map(x => x.id)

            this.registerCommands(
                slashCommands,
                guilds
            );

            subCounter(this)

            this.user.setActivity(/*`${total.toLocaleString()} members!`,*/`cry baby!`, { type: 2 })
            this.user.setPresence({ status: "idle"})
            console.log(`${this.user.tag} is now online!`);
        });
    }
}
