import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	VoiceConnection,
} from '@discordjs/voice';
import Discord, { StageChannel, VoiceChannel } from 'discord.js';
import { ExtendedInteraction } from '../../typings/SlashCommand';
import { roleColor } from '../../util/lechsFunctions';
import { defineAuthor, removeAndClear, findTypeAndSend, clearAndStopPlayer } from './functions/all';
import { Track } from './Track';

export class lechs_Subscription {

	public guildId: any;
	public songs: Track[];
	public queueLock = false;
	public readyLock = false;
	public voiceChannel: VoiceChannel | StageChannel;
	public lastRespond: any;
	public isPlaying: boolean;
	public resource: AudioResource<Track>;
	public playingInfo = true;
	public textChannel: any;
	public mode: string = "default";
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;
	public checkInterval: any;


	public constructor(voiceConnection: VoiceConnection, interaction: ExtendedInteraction) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.songs = [];
		this.isPlaying = false;
		this.textChannel = interaction.channel
		this.guildId = interaction.guildId
		this.voiceChannel = interaction.member.voice.channel
		this.lastRespond = interaction

		this.audioPlayer.on('stateChange', async (oldState, newState) => {
			console.log(
				`Audio player transitioned ${oldState.status} to ${newState.status}`
			);

			if (newState.status === "idle" && oldState.status !== "idle") {
				this.isPlaying = false;


				if (this.songs[1]) {
					if (this.mode === "default") {
						this.songs.shift();
						return this.processQueue()
					}
				}

				if (this.mode === "looptrack") {
					return this.processQueue()
				}
				return removeAndClear(this.guildId)
			}
		});

		this.voiceConnection.on('stateChange', async (oldState, newState) => {
			if (newState.status === "disconnected" && oldState.status !== "disconnected") {
				if (this.isPlaying === true) {
					clearInterval(this.checkInterval)

					return removeAndClear(this.guildId)
				} else {
					return removeAndClear(this.guildId)
				}
			}
		})

		if (this.voiceChannel.type === 'GUILD_STAGE_VOICE') {
			interaction.guild.me.voice.setSuppressed(false).catch(err => {

				const embed = new Discord.MessageEmbed()
					.setAuthor(interaction.member.user.tag, interaction.member.displayAvatarURL({ dynamic: true }))
					.setDescription(`lechsbott is currently an audience member, make it speaker to listen the music`)
					.setColor('RED')
				return interaction.channel.send({ embeds: [embed] })
			})
		}

		const checkmembers = setInterval(() => {

			console.log('checking the members')
			if(this?.voiceChannel.members.size === 1){
				clearAndStopPlayer(this?.guildId)

				return removeAndClear(this.guildId, true)
			} else {
				return
			}

		}, 1000*60*2)
		this.checkInterval = checkmembers

		voiceConnection.subscribe(this.audioPlayer);
	}

	public enqueue(track: Track) {
		this.songs.push(track);
		void this.processQueue(track);
	}

	public stop() {
		this.audioPlayer.stop(true);
	}

	private async processQueue(track?: Track): Promise<void> {

		if (this.songs[1] && track) {
			let memberavatar = defineAuthor(this.lastRespond, 'displayAvatarURL')
			let queueInfo = new Discord.MessageEmbed()
				.setColor(roleColor(this.lastRespond))
				.setAuthor(`Added to queue`, `${memberavatar}`)
				.setTitle(`${track.title}`)
				.setURL(`${track.customurl}`)
				.setTimestamp()
				.setFooter(`${track.addedby.user.username}`);

			return this.lastRespond.followUp({ embeds: [queueInfo] }, this.lastRespond).then((message) => {
				message.react('👍');
			})
		}

		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.songs.length === 0) {
			if (this.mode !== "default") {

			} else return;
		}
		//Locks the queue for any enqueue problems
		this.queueLock = true;

		// Selects first track
		const nextTrack = this.songs[0];

		try {
			if (nextTrack.streamType === "YouTube") {
				// Converts Track into an AudioResource
				const resource = await nextTrack.createAudioResource();
				this.audioPlayer.play(resource);
				this.isPlaying = true;
				this.resource = resource;
			}

			if (this.playingInfo === true && this.mode === "default") {
				let playing = new Discord.MessageEmbed()
					.setColor(roleColor(this.lastRespond))
					.setAuthor(`Now playing`, `${defineAuthor(this.lastRespond, 'displayAvatarURL')}`)
					.setTitle(`${nextTrack.title}`)
					.setURL(`${nextTrack.customurl}`)
					.setFooter(`${nextTrack.addedby.user.username}`)
					.setTimestamp();

				this.textChannel.send({ embeds: [playing] })
			}

			this.queueLock = false;
		} catch (error) {
			console.log(error)
			this.queueLock = false;
		}
	}


}