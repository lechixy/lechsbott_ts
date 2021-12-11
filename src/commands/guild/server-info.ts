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
            "THREADS_ENABLED": "Enabled threads",
            "NEW_THREAD_PERMISSIONS": "New thread permissions",
        }

        let featurearray = [];

        guild.features.forEach(featu => {
            featurearray.push(feature[featu])
        })

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setDescription(guild.description ? guild.description : `No description`)
            .setThumbnail(guild.bannerURL({ format: 'png', size: 512 }))
            .addField(`Owner`, `<@${guild.ownerId}>`, true)
            .addField(`Total Members`, `${serverSize}`, true)
            .addField(`Created`, `${checkDays(guild.createdAt)}`, true)
            // colum
            .addField(`Roles`, `${Size(guild.roles.cache.size, 'roles')}`, true)
            .addField(`Emojis`, `${Size(guild.emojis.cache.size, 'emojis')}`, true)
            .addField(`Stickers`, `${Size(guild.stickers.cache.size, 'stickers')}`, true)
            //colum
            .addField(`You joined`, `${checkDays(message.member.joinedAt)}`, true)
            .addField(`Server Boost`, `<a:anim_boost:890625632264917042> ${premiumTier(guild.premiumTier, guild.premiumSubscriptionCount)}`, true)
            .addField(`Server ID`, `${guild.id}`, true)
            //colum
            .addField(`Locale`, `${guild.preferredLocale}`, true)
            .addField(`NSFW Level`, nsfwLevel(guild.nsfwLevel), true)
            .addField(`Vanity URL Code`, guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : `No vanity url code`, true)
            // colum
            .addField(
                `Channels`,
                `<:text:891041979528519702> ${Size(message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size, 'texts')}<:transparent:890623794421592104><:voice:891041979612397579> ${Size(message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size, 'voices')}`,
            )
            //colum
            .addField(`Members`, `<:status_online:890624318021713980>${onlineCount}<:transparent:890623794421592104><:offline:890624315580637244>${serverSize - onlineCount}<:transparent:890623794421592104>:robot: ${botCount}`)
            // colum
            .addField(`Features`, featurearray.join('- '), true)
            // colum
            .addField(`Verification Level`, `${verifLevels[guild.verificationLevel]}`)
            .setTimestamp()
        message.channel.send({ embeds: [embed] });


    }
})