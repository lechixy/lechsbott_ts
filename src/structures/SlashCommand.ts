import { SlashCommandType } from "../typings/SlashCommand";

export class SlashCommand {
    constructor(commandOptions: SlashCommandType) {
        Object.assign(this, commandOptions);
    }
}
