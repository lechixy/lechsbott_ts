import Discord, { GuildMember, User } from 'discord.js'
import { ExtendedMessage } from '../typings/Command';
import { ExtendedInteraction } from '../typings/SlashCommand';

export class TicTacToe {
    public gameId: string;
    public hostMessage: ExtendedInteraction;
    public gameMessage: ExtendedMessage;
    public host: User;
    public opponent: User;
    public xEmoji = '❌'
    public oEmoji = '⭕'
    public idleEmoji = '➖'
    public buttons = null;
    public inputWaiting: User;
    public wonner: string;


    constructor(message: ExtendedInteraction) {
        let opponent = message.options.getUser('person')
        this.gameMessage = null
        this.hostMessage = message
        this.gameId = message.gameId
        this.host = message.user
        this.opponent = opponent

        this.hostMessage.deleteReply()

        this.requestToGame()
    }

    public async requestToGame(): Promise<any> {
        let acceptEmbed = new Discord.MessageEmbed()
            .setAuthor(this.host.tag, this.host.displayAvatarURL({dynamic: true}))
            .setTitle(`Waiting for ${this.opponent.username} to accept!`)
            .setDescription(`${this.host.tag} is invited you to a game`)

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
            content: `Hey ${this.opponent}`,
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
                    content: 'This is not for you!',
                    ephemeral: true
                })

            if (button.customId == 'declinedRequest') {
                button.deferUpdate()
                return collector.stop('decline')
            } else if (button.customId == 'acceptedRequest') {
                button.deferUpdate()
                collector.stop()
                console.log('accepted')

                this.buttons = {
                    a1: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    a2: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    a3: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    b1: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    b2: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    b3: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    c1: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    c2: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    },
                    c3: {
                        style: 'SECONDARY',
                        emoji: this.idleEmoji,
                        disabled: false
                    }
                }

                let gameButtons = this.getButtons()

                let epm = new Discord.MessageEmbed()
                    .setTitle('TicTacToe')
                    .addField(`Status`, `Waiting for input`, true)
                    .addField(`Turn`, `${this.host}`, true)
                    .addField(`Your Emoji`, `⭕`, true)

                this.gameMessage = await this.gameMessage.edit({ embeds: [epm], components: gameButtons })


            }
        })

        collector.on('end', (collected, reason) => {
            if (reason == 'time') {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Challenge Not Accepted in Time')
                    .setAuthor(this.host.tag, this.host.displayAvatarURL())
                    .setDescription('Ran out of time!\nTime limit: 30s')
                this.gameMessage.edit({
                    content: '<@' + this.opponent.id + '>. Didnt accept in time',
                    embeds: [embed],
                    components: []
                })
            }
            if (reason == 'decline') {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Game Declined!')
                    .setAuthor(this.host.tag, this.host.displayAvatarURL())
                    .setDescription(`${this.opponent.tag} has declined your game!`)
                this.gameMessage.edit({
                    embeds: [embed],
                    components: []
                })
            }
        })

    }

    public async gameLoop(): Promise<any> {

    }

    public getButtons() {
        let a1 = new Discord.MessageButton()
            .setStyle(this.buttons.a1.style)
            .setEmoji(this.buttons.a1.emoji)
            .setCustomId('a1')
            .setDisabled(this.buttons.a1.disabled)
        let a2 = new Discord.MessageButton()
            .setStyle(this.buttons.a2.style)
            .setEmoji(this.buttons.a2.emoji)
            .setCustomId('a2')
            .setDisabled(this.buttons.a2.disabled)
        let a3 = new Discord.MessageButton()
            .setStyle(this.buttons.a3.style)
            .setEmoji(this.buttons.a3.emoji)
            .setCustomId('a3')
            .setDisabled(this.buttons.a3.disabled)
        let b1 = new Discord.MessageButton()
            .setStyle(this.buttons.b1.style)
            .setEmoji(this.buttons.b1.emoji)
            .setCustomId('b1')
            .setDisabled(this.buttons.b1.disabled)
        let b2 = new Discord.MessageButton()
            .setStyle(this.buttons.b2.style)
            .setEmoji(this.buttons.b2.emoji)
            .setCustomId('b2')
            .setDisabled(this.buttons.b2.disabled)
        let b3 = new Discord.MessageButton()
            .setStyle(this.buttons.b3.style)
            .setEmoji(this.buttons.b3.emoji)
            .setCustomId('b3')
            .setDisabled(this.buttons.b3.disabled)
        let c1 = new Discord.MessageButton()
            .setStyle(this.buttons.c1.style)
            .setEmoji(this.buttons.c1.emoji)
            .setCustomId('c1')
            .setDisabled(this.buttons.c1.disabled)
        let c2 = new Discord.MessageButton()
            .setStyle(this.buttons.c2.style)
            .setEmoji(this.buttons.c2.emoji)
            .setCustomId('c2')
            .setDisabled(this.buttons.c2.disabled)
        let c3 = new Discord.MessageButton()
            .setStyle(this.buttons.c3.style)
            .setEmoji(this.buttons.c3.emoji)
            .setCustomId('c3')
            .setDisabled(this.buttons.c3.disabled)
        let a = new Discord.MessageActionRow().addComponents([a1, a2, a3])
        let b = new Discord.MessageActionRow().addComponents([b1, b2, b3])
        let c = new Discord.MessageActionRow().addComponents([c1, c2, c3])
        return [a, b, c]
    }
}