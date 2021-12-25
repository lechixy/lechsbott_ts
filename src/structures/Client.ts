import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    Intents
} from "discord.js";
import { SlashCommandType } from "../typings/SlashCommand";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import { lechs_Subscription } from "./Music/Subscription";
import { subCounter } from "../counters/subcounter"
import mongoose from 'mongoose'
import { MONGO_DB_SRV, LECHSBOTTKEY } from '../config.json'

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    slashCommands: Collection<string, SlashCommandType> = new Collection();
    queue: Collection<string, lechs_Subscription> = new Collection();

    constructor() {
        super({
            shards: 'auto',
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_BANS
            ],
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

        //Commands
        const commands = []
        const commandFiles = await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        );
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            console.log(`CMD | ${command.name} loaded!`)

            this.commands.set(command.name, command);
            commands.push(command);
        });

        // Slash Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const slashCommandFiles = await globPromise(
            `${__dirname}/../slashCommands/*/*{.ts,.js}`
        );
        slashCommandFiles.forEach(async (filePath) => {
            const command: SlashCommandType = await this.importFile(filePath);
            if (!command.name) return;
            console.log(`SCMD | ${command.name} loaded!`)

            this.slashCommands.set(command.name, command);
            slashCommands.push(command);
        });

        this.once("ready", () => {

            let guilds = this.guilds.cache.map(x => x.id)

            this.registerCommands(
                slashCommands,
                guilds
            );

            subCounter(this)

            this.user.setActivity(/*`${total.toLocaleString()} members!`,*/`the snowflakes ❄️`, { type: 'WATCHING' })
            console.log("lechsbott is now online!");
        });

        //Database
        mongoose.connect(MONGO_DB_SRV).then(() => {
            console.log('Successfully connected to lechsbottdb')
        }).catch((err) => {
            console.log(err)
        })

        // Event
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            console.log(`EVENT | ${event.event} loaded!`)
            this.on(event.event, event.execute);
        });
    }
}
