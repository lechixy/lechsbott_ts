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
import { removeAndClear, findTypeAndSend, clearAndStopPlayer } from './functions/all';
import { Track } from './Track';
import { client } from '../../';

export class lechs_Subscription {

	public guildId: any;
	public songs: Track[];
	public status: string = "default";
	public queueLock = false;
	public readyLock = false;
	public voiceChannel: VoiceChannel | StageChannel;
	public lastRespond: ExtendedInteraction;
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

			if(newState.status === "playing") {
				this.isPlaying = true;
			}

			if (newState.status === "idle" && oldState.status !== "idle") {

				this.isPlaying = false;
				if(this.status === "seeking"){
					return this.processQueue()
				}

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

		if (this.voiceChannel.type === Discord.ChannelType.GuildStageVoice) {
			interaction.guild.me.voice.setSuppressed(false).catch(err => {

				const embed = new Discord.Embed()
					.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.displayAvatarURL() })
					.setDescription(`lechsbott is currently an audience member, make it speaker to listen the music`)
					.setColor(Discord.Util.resolveColor('Red'))
				return interaction.channel.send({ embeds: [embed] })
			})
		}

		const checkmembers = setInterval(() => {

			if (this?.voiceChannel.members.size === 1 && this?.voiceChannel.members.first().id === client.user.id) {
				clearAndStopPlayer(this?.guildId)

				return removeAndClear(this.guildId, true)
			} else {
				return
			}

		}, 1000 * 60 * 2)
		this.checkInterval = checkmembers

		voiceConnection.subscribe(this.audioPlayer);
	}

	public enqueue(track: Track) {
		this.songs.push(track);
		void this.processQueue(track);
	}

	public first(){
		return this.songs[0] ? this.songs[0] : null;
	}

	public stop() {
		this.audioPlayer.stop(true);
	}

	private async processQueue(track?: Track): Promise<void> {

		if (this.songs[1] && track) {
			let memberavatar = this.lastRespond.user.displayAvatarURL()
			let queueInfo = new Discord.Embed()
				.setColor(Discord.Util.resolveColor(roleColor(this.lastRespond)))
				.setAuthor({ name: `Added to queue`, iconURL: `${memberavatar}` })
				.setTitle(`${track.title}`)
				.setURL(`${track.customurl}`)
				.setTimestamp()
				.setFooter({ text: `${track.addedby.user.username}` });

			return this.lastRespond.followUp({ embeds: [queueInfo] }).then((message: any) => {
				message.react('👍');
			})
		}

		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.songs.length === 0) {
			if(this.songs.length === 0){
				return removeAndClear(this.guildId)
			}
			return
		}
		//Locks the queue for any enqueue problems
		this.queueLock = true;

		// Selects first track
		const nextTrack = this.songs[0];

		try {
			if (nextTrack.streamType === "YouTube") {
				// Converts Track into an AudioResource
				const resource = await nextTrack?.createAudioResource();

				if (!resource) {
					//Removes track from queue
					this.songs.shift()

					let infotext: string
					//Checks next song
					if(this.songs[0]){
						infotext = `next track available at queue and player is skipping to it!`
					} else {
						infotext = `no track is available so clearing the queue!`
					}

					this.processQueue()
					let playing = new Discord.Embed()
						.setColor(Discord.Util.resolveColor('Red'))
						.setAuthor({ name: `An error occurred while playing track`, iconURL: this.lastRespond.user.displayAvatarURL() })
						.setDescription(`We can't play this track, ${infotext}`)
						.setTimestamp();

					this.textChannel.send({ embeds: [playing] })
					return
				}

				this.audioPlayer.play(resource);
				this.isPlaying = true;
				this.resource = resource;
				this.status = "default";
			}

			if (this.playingInfo === true && this.mode === "default" && this.status === "default") {
				let playing = new Discord.Embed()
					.setColor(Discord.Util.resolveColor(roleColor(this.lastRespond)))
					.setAuthor({ name: `Now playing`, iconURL: this.lastRespond.user.displayAvatarURL() })
					.setTitle(`${nextTrack.title}`)
					.setURL(`${nextTrack.customurl}`)
					.setFooter({ text: `${nextTrack.addedby.user.username}` })
					.setTimestamp();

				this.textChannel.send({ embeds: [playing] })
			}

			this.status === "default";
			this.queueLock = false;
		} catch (error) {
			console.log(error)
			this.status === "default";
			this.isPlaying = false;
			this.queueLock = false;
		}
	}


}