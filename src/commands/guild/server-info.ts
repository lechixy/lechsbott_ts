import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name: 'serverinfo',
    aliases: ['server-info', 'server', 'guild'],
    description: 'How many people are in this server?',
    category: 'Guild',
    arguments: `<none>`,
    async execute({ client, message, args, cmd }) {

        const guild = message.guild

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " day") + " ago";
        };

        let serverSize = message.guild.memberCount;
        let botCount = message.guild.members.cache.filter(m => m.user.bot === true).size;
        let onlineCount = message.guild.members.cache.filter(member => member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle').size;

        let verifLevels = {
            "NONE": "Nothing",
            "LOW": "Low - Must have a verified email on their Discord account",
            "MEDIUM": "Medium - Must also be registered on Discord for longer than 5 minutes",
            "HIGH": "High -  Must also be a member of this server for longer than 10 minutes",
            "HIGHEST": "Highest - Must have a verified phone on their Discord account",
        }

        function Size(input, type) {
            if (input === 0) {
                return `No ${type}`
            } else {
                return `${input} ${type}`
            }

        }

        function premiumTier(input, input2) {
            if (input === 'NONE') {
                return `No boosts`
            } else {
                return `${input2} (Level ${input.slice(5, input.length)})`
            }
        }

        function nsfwLevel(input) {
            if (input === 'DEFAULT') {
                return `Default`
            } else if (input === 'EXPLICIT') {
                return `Explicit`
            } else if (input === 'SAFE') {
                return `Safe`
            } else if (input === 'AGE_RESTRICTED') {
                return `Age restricted`
            }
        }


        let feature = {
            "ANIMATED_ICON": "Animated guild icon",
            "BANNER": "Banner",
            "COMMERCE": "Commerce features",
            "COMMUNITY": "Community features",
            "DISCOVERABLE": "Discoverable",
            "FEATURABLE": "Featurable",
            "INVITE_SPLASH": "Invite background",
            "MEMBER_VERIFICATION_GATE_ENABLED": "Membership Screening",
            "NEWS": "News",
            "PARTNERED": "Discord Partner",
            "PREVIEW_ENABLED": "Previewed Membership Screening",
            "VANITY_URL": "Special URL",
            "VERIFIED": "Verified",
            "VIP_REGIONS": "384kbps bitrate voices",
            "WELCOME_SCREEN_ENABLED": "Welcome Screen",
            "TICKETED_EVENTS_ENABLED": "Events",
            "MONETIZATION_ENABLED": "Monetization",
            "MORE_STICKERS": "More stickers",
            "THREE_DAY_THREAD_ARCHIVE": "Three days thread archive",
            "SEVEN_DAY_THREAD_ARCHIVE": "Seven days thread archive",
            "PRIVATE_THREADS": "Private threads",
            "ROLE_ICONS": "Role Icons",
        }

        let featurearray = [];

        guild.features.forEach(featu => {
            featurearray.push(feature[featu])
        })

        const embed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setAuthor({name: guild.name, iconURL: guild.iconURL()})
            .setDescription(guild.description ? guild.description : `No description for **${guild.name}**`)
            .setThumbnail(guild.bannerURL({ size: 512 }))
            .addField({name: `Owner`, value: `<@${guild.ownerId}>`, inline: true})
            .addField({name: `Total Members`, value: `${serverSize}`, inline: true})
            .addField({name: `Created`, value: `${checkDays(guild.createdAt)}`, inline: true})
            //colum
            .addField({name: `Roles`, value: `${Size(guild.roles.cache.size, 'roles')}`, inline: true})
            .addField({name: `Emojis`, value: `${Size(guild.emojis.cache.size, 'emojis')}`, inline: true})
            .addField({name: `Stickers`, value: `${Size(guild.stickers.cache.size, 'stickers')}`, inline: true})
            //colum
            .addField({name: `You joined`, value: `${checkDays(message.member.joinedAt)}`, inline: true})
            .addField({name: `Server Boost`, value: `<a:anim_boost:890625632264917042> ${premiumTier(guild.premiumTier, guild.premiumSubscriptionCount)}`, inline: true})
            .addField({name: `Server ID`, value: `${guild.id}`, inline: true})
            //colum
            .addField({name: `Locale`, value: `${guild.preferredLocale}`, inline: true})
            .addField({name: `NSFW Level`, value: `${nsfwLevel(guild.nsfwLevel)}`, inline: true})
            .addField({name: `Vanity URL Code`, value: `${guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : `No vanity url code`}`, inline: true})
            //colum
            .addField({name: `Channels`, value: `<:text:891041979528519702> ${Size(message.guild.channels.cache.filter(c => c.type === 0).size, 'texts')}<:transparent:890623794421592104><:voice:891041979612397579> ${Size(message.guild.channels.cache.filter(c => c.type === 2).size, 'voices')}`, inline: false})
            //colum
            .addField({name: `Members`, value: `<:status_online:890624318021713980>${onlineCount}<:transparent:890623794421592104><:offline:890624315580637244>${serverSize - onlineCount}<:transparent:890623794421592104>:robot: ${botCount}`, inline: false})
            //colum
            .addField({name: `Features`, value: `${featurearray.join('- ')}`, inline: true})
            //colum
            .addField({name: `Verification Level`, value: `${verifLevels[guild.verificationLevel]}`, inline: false})
            .setTimestamp()
        message.channel.send({ embeds: [embed] });


    }
})