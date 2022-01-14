import Discord, { GuildMember, User } from 'discord.js'
import { ExtendedMessage } from '../typings/Command';
import { ExtendedInteraction } from '../typings/SlashCommand';
import { roleColor } from '../util/lechsFunctions';
import { PlayerObject, ButtonsObject } from '../typings/TicTacToe'

export class TicTacToe {
    public gameId: string;
    public hostMessage: ExtendedInteraction;
    public gameMessage: ExtendedMessage;
    public host: User;
    public opponent: User;
    public xPlayer: PlayerObject;
    public oPlayer: PlayerObject;
    public xEmoji = "❌";
    public oEmoji = "⭕";
    public idleEmoji = '➖'
    public tieEmoji = "💢";
    public buttons: ButtonsObject;
    public inputWaiting: User;
    public wonner:  User = null;
    public round = 0;
    

    constructor(message: ExtendedInteraction) {
        let opponent = message.options.getUser('person')
        this.gameMessage = null
        this.hostMessage = message
        this.gameId = message.gameId
        this.host = message.user
        this.opponent = opponent
        this.xPlayer = {
            emoji: this.xEmoji,
            player: this.host,
            color: 1,
        }
        this.oPlayer = {
            emoji: this.oEmoji,
            player: this.opponent,
            color: 3,
        }

        this.hostMessage.deleteReply()

        this.requestToGame()
    }

    public async requestToGame(): Promise<any> {

        let acceptEmbed = new Discord.MessageEmbed()
            .setAuthor(this.host.tag, this.host.displayAvatarURL({ dynamic: true }))
            .setTitle(`Waiting for ${this.opponent.username} to accept`)
            .setDescription(`${this.host.tag} is invited you to a game`)
            .setColor('RANDOM')

        let accept = new Discord.MessageButton()
            .setLabel('Accept')
            .setStyle('SUCCESS')
            .setCustomId('acceptedRequest')

        let decline = new Discord.MessageButton()
            .setLabel('Decline')
            .setStyle('DANGER')
            .setCustomId('declinedRequest')

        let accep = new Discord.MessageActionRow().addComponents([
            accept,
            decline
        ])

        const request = await this.hostMessage.channel.send({
            content: `**Hey ${this.opponent} you get an invite for game!**`,
            embeds: [acceptEmbed],
            components: [accep]
        })

        this.gameMessage = request


        const collector = request.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 30000
        })

        collector.on('collect', async (button) => {
            if (button.user.id !== this.opponent.id)
                return button.reply({
                    content: '**This is not for you!**',
                    ephemeral: true
                })


            if (button.customId == 'declinedRequest') {
                button.deferUpdate()
                return collector.stop('decline')
            } else if (button.customId == 'acceptedRequest') {
                button.deferUpdate()
                collector.stop()

                return this.onAccept()
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason == 'time') {
                let embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(this.host.tag, this.host.displayAvatarURL())
                    .setDescription(`${this.opponent} is not accepted challenge in time!`)
                this.gameMessage.edit({
                    content: '**Time expired!**',
                    embeds: [embed],
                    components: []
                })
            }
            if (reason == 'decline') {
                let embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(this.host.tag, this.host.displayAvatarURL())
                    .setDescription(`${this.opponent} has declined your game!`)
                this.gameMessage.edit({
                    content: '**Game declined!**',
                    embeds: [embed],
                    components: []
                })
            }
        })

    }

    public async onAccept(): Promise<void> {
        //setting somethings

        this.buttons = {
            a1: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            a2: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            a3: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            b1: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            b2: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            b3: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            c1: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            c2: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            },
            c3: {
                style: 2,
                emoji: this.idleEmoji,
                disabled: false
            }
        }
        let gameButtons = this.getButtons({})
        this.inputWaiting = this.host

        this.gameMessage = await this.gameMessage.edit({ content: `**${this.xPlayer.player} is your turn!**`, embeds: [], components: gameButtons })

        return this.gameLoop()
    }

    public async gameLoop(): Promise<any> {
        const collector = this.gameMessage.createMessageComponentCollector({
            componentType: 'BUTTON',
            max: 1,
            time: 30000
        })
        this.round++;

        collector.on('collect', (b) => {
            if (b.user.id !== this.inputWaiting.id) {
                b.reply({
                    content: '**Please wait for opponent turn!**',
                    ephemeral: true
                })
                collector.empty()
                return
            }


            if (this.buttons[`${b.customId}`].emoji !== this.idleEmoji) {
                b.reply({
                    content: '**Please select an empty button!**',
                    ephemeral: true
                })
                collector.empty()
                return
            } else {

                b.deferUpdate()

                if (this.inputWaiting.id === this.xPlayer.player.id) {
                    this.buttons[`${b.customId}`].emoji = `${this.xPlayer.emoji}`
                    this.buttons[`${b.customId}`].style = this.xPlayer.color
                    this.inputWaiting = this.oPlayer.player
                } else {
                    this.buttons[`${b.customId}`].emoji = `${this.oPlayer.emoji}`
                    this.buttons[`${b.customId}`].style = this.oPlayer.color
                    this.inputWaiting = this.xPlayer.player
                }

                collector.stop()

                return this.checkX()
            }

        })


        collector.on('end', (collected, reason) => {
            if (collected.size === 0) {

                this.gameMessage.edit({
                    content: `**${this.inputWaiting} didn\'t react in 30 seconds, game finished!**`,
                    components: []
                })
            }

        })

    }

    public async checkX() {
        if (
            this.buttons.a1.emoji == this.xPlayer.emoji &&
            this.buttons.b1.emoji == this.xPlayer.emoji &&
            this.buttons.c1.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.a2.emoji == this.xPlayer.emoji &&
            this.buttons.b2.emoji == this.xPlayer.emoji &&
            this.buttons.c2.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.a3.emoji == this.xPlayer.emoji &&
            this.buttons.b3.emoji == this.xPlayer.emoji &&
            this.buttons.c3.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.a1.emoji == this.xPlayer.emoji &&
            this.buttons.b2.emoji == this.xPlayer.emoji &&
            this.buttons.c3.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.a3.emoji == this.xPlayer.emoji &&
            this.buttons.b2.emoji == this.xPlayer.emoji &&
            this.buttons.c1.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.a1.emoji == this.xPlayer.emoji &&
            this.buttons.a2.emoji == this.xPlayer.emoji &&
            this.buttons.a3.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.b1.emoji == this.xPlayer.emoji &&
            this.buttons.b2.emoji == this.xPlayer.emoji &&
            this.buttons.b3.emoji == this.xPlayer.emoji
        )
            this.wonner = this.xPlayer.player
        if (
            this.buttons.c1.emoji == this.xPlayer.emoji &&
            this.buttons.c2.emoji == this.xPlayer.emoji &&
            this.buttons.c3.emoji == this.xPlayer.emoji
        ) {
            this.wonner = this.xPlayer.player
        }

        if (this.wonner !== null && this.wonner.id === this.xPlayer.player.id) {
            return this.gameMessage.edit({
                content: `**(${this.xPlayer.emoji}) ${this.wonner} is won the game!**`,
                components: this.getButtons({ disabled: true }),

            })
                .then((m) => {
                    m.react(this.xPlayer.emoji)
                })

        } else {
            this.checkO()

        }
    }

    public async checkO() {
        if (
            this.buttons.a1.emoji == this.oPlayer.emoji &&
            this.buttons.b1.emoji == this.oPlayer.emoji &&
            this.buttons.c1.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.a2.emoji == this.oPlayer.emoji &&
            this.buttons.b2.emoji == this.oPlayer.emoji &&
            this.buttons.c2.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.a3.emoji == this.oPlayer.emoji &&
            this.buttons.b3.emoji == this.oPlayer.emoji &&
            this.buttons.c3.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.a1.emoji == this.oPlayer.emoji &&
            this.buttons.b2.emoji == this.oPlayer.emoji &&
            this.buttons.c3.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.a3.emoji == this.oPlayer.emoji &&
            this.buttons.b2.emoji == this.oPlayer.emoji &&
            this.buttons.c1.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.a1.emoji == this.oPlayer.emoji &&
            this.buttons.a2.emoji == this.oPlayer.emoji &&
            this.buttons.a3.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.b1.emoji == this.oPlayer.emoji &&
            this.buttons.b2.emoji == this.oPlayer.emoji &&
            this.buttons.b3.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player
        if (
            this.buttons.c1.emoji == this.oPlayer.emoji &&
            this.buttons.c2.emoji == this.oPlayer.emoji &&
            this.buttons.c3.emoji == this.oPlayer.emoji
        )
            this.wonner = this.oPlayer.player

        if (this.wonner !== null && this.wonner.id === this.xPlayer.player.id) {
            return this.gameMessage.edit({
                content: `**(${this.oPlayer.emoji}) ${this.wonner} is won the game!**`,
                components: this.getButtons({ disabled: true }),

            })
                .then((m) => {
                    m.react(this.oPlayer.emoji)
                })

        } else {
            this.checkTie()
        }
    }

    public async checkTie() {
        if (this.round === 9) {
            return this.gameMessage.edit({
                content: `**It is tie, no one won the game!**`,
                components: this.getButtons({ disabled: true }),

            })
                .then((m) => {
                    m.react(this.tieEmoji)
                })
        } else {
            this.updateMessage()
        }
    }

    public async updateMessage() {

        this.gameMessage.edit({ content: `**${this.inputWaiting} is your turn!**`, components: this.getButtons({}) })
        return this.gameLoop()
    }


    public getButtons({ disabled = false }) {

        let a1 = new Discord.MessageButton()
            .setStyle(this.buttons.a1.style)
            .setEmoji(this.buttons.a1.emoji)
            .setCustomId('a1')
            .setDisabled(disabled)
        let a2 = new Discord.MessageButton()
            .setStyle(this.buttons.a2.style)
            .setEmoji(this.buttons.a2.emoji)
            .setCustomId('a2')
            .setDisabled(disabled)
        let a3 = new Discord.MessageButton()
            .setStyle(this.buttons.a3.style)
            .setEmoji(this.buttons.a3.emoji)
            .setCustomId('a3')
            .setDisabled(disabled)
        let b1 = new Discord.MessageButton()
            .setStyle(this.buttons.b1.style)
            .setEmoji(this.buttons.b1.emoji)
            .setCustomId('b1')
            .setDisabled(disabled)
        let b2 = new Discord.MessageButton()
            .setStyle(this.buttons.b2.style)
            .setEmoji(this.buttons.b2.emoji)
            .setCustomId('b2')
            .setDisabled(disabled)
        let b3 = new Discord.MessageButton()
            .setStyle(this.buttons.b3.style)
            .setEmoji(this.buttons.b3.emoji)
            .setCustomId('b3')
            .setDisabled(disabled)
        let c1 = new Discord.MessageButton()
            .setStyle(this.buttons.c1.style)
            .setEmoji(this.buttons.c1.emoji)
            .setCustomId('c1')
            .setDisabled(disabled)
        let c2 = new Discord.MessageButton()
            .setStyle(this.buttons.c2.style)
            .setEmoji(this.buttons.c2.emoji)
            .setCustomId('c2')
            .setDisabled(disabled)
        let c3 = new Discord.MessageButton()
            .setStyle(this.buttons.c3.style)
            .setEmoji(this.buttons.c3.emoji)
            .setCustomId('c3')
            .setDisabled(disabled)
        let a = new Discord.MessageActionRow().addComponents([a1, a2, a3])
        let b = new Discord.MessageActionRow().addComponents([b1, b2, b3])
        let c = new Discord.MessageActionRow().addComponents([c1, c2, c3])
        return [a, b, c]
    }
}