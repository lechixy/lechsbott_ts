import { ExtendedClient } from "../structures/Client";
import { Message, GuildMember, PermissionResolvable } from "discord.js"

export interface ExtendedMessage extends Message {
    member: GuildMember;
}

interface ExecuteOptions {
    client: ExtendedClient;
    message: ExtendedMessage;
    args: Array<string>;
    cmd: string;
}

type ExecuteFunction = (options: ExecuteOptions) => Promise<any>;

export type CommandType = {
    description?: string;
    name: string;
    arguments?: string;
    category?: string;
    userPermissions?: PermissionResolvable[];
    clientPermissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    cooldown?: number;
    execute: ExecuteFunction;
    aliases?: Array<string>;
    syntax?: string;
}
