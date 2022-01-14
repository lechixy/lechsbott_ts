import { User, MessageButtonStyle } from "discord.js";

export type PlayerObject = {
    emoji: string,
    player: User,
    color: number,
}

export type ButtonsObject = {
    [buttonId: string]: {
        style: number,
        emoji: string,
        disabled: boolean
    }
}