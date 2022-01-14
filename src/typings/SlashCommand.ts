import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * Execute: async({ interaction }) => {
 *
 * }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
    [x: string]: any;
    member: GuildMember;
}

interface ExecuteOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    args: CommandInteractionOptionResolver;
}

type ExecuteFunction = (options: ExecuteOptions) => any;

export type SlashCommandType = {
    userPermissions?: PermissionResolvable[];
    execute: ExecuteFunction;
} & ChatInputApplicationCommandData;