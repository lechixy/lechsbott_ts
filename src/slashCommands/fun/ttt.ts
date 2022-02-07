// import { SlashCommand } from "../../structures/SlashCommand";
// import { roleColor } from "../../util/lechsFunctions";
// import Discord from 'discord.js'
// import { TicTacToe } from "../../structures/TicTacToe";

// export default new SlashCommand({
//     name: "tic-tac-toe",
//     description: "Play ttt with a friend!",
//     options: [
//         {
//             name: "person",
//             description: "Who you want to play with?",
//             type: Discord.ApplicationCommandOptionType.User,
//             required: false,
//         }
//     ],
//     execute({ client, interaction, args }) {
//         let person = args.getUser('person')

//         if (person) {

//             if (person.id == interaction.user.id){
//                 return interaction.followUp({
//                     content: 'You cannot play by yourself!',
//                     ephemeral: true
//                 })
//             }
                
//             const game = new TicTacToe(interaction)

//         }
//     }
// })