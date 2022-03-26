import Discord from "discord.js";
import { Command } from "../../structures/Command";
import { roleColor } from "../../util/lechsFunctions";

export default new Command({
    name: 'test',
    ownerOnly: true,
    async execute({ client, message, args, cmd }) {

        await message.delete()
        let igemoji = await message.guild.emojis.fetch('957228609251213312')
        let twemoji = await message.guild.emojis.fetch('957232129790586890')
        let ytemoji = await message.guild.emojis.fetch('957227925512540200')
        let dcemoji = await message.guild.emojis.fetch('936315976427917434')
        let hremoji = await message.guild.emojis.fetch('860070890312826900')

        let desc1 = `${ytemoji} **__[YouTube](https://www.youtube.com/dawnistaken)__ Abone Ol! ${hremoji}**`
        let desc2 = `${igemoji} **__[Instagram](https://www.instagram.com/dawnistaken/)__ Takip Et! ${hremoji}**`
        let desc3 = `${twemoji} **__[Twitch](https://www.twitch.tv/dawnistaken)__ Takip Et! ${hremoji}**`
        let desc4 = `${dcemoji} **__[discord.gg/reaver](https://discord.gg/reaver)__ ile sunucuyu arkadaşlarınla paylaşabilirsin!**`
        let resarray = [desc1, desc2, desc3]
        let resultdesc = resarray.join('\n')

        let embed = new Discord.Embed()
        .addField({name: `Sosyal Medyalar`, value: resultdesc})
        .addField({name: `Sunucu Daveti`, value: desc4})
        .setColor(Discord.Util.resolveColor(roleColor(message)))
        message.channel.send({embeds: [embed]})
    }
})