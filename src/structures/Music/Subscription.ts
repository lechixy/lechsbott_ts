import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	entersState,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import Discord, { TextChannel, VoiceChannel } from 'discord.js';
import { roleColor } from '../../util/lechsFunctions';
import { defineAuthor, removeAndClear } from './functions/all';
import { Track } from './Track';

export class lechs_Subscription {

	public guildId: any;
	public songs: Track[];
	public queueLock = false;
	public readyLock = false;
	public voiceChannel: VoiceChannel;
	public lastRespond: any;
	public resource: AudioResource<Track>;
	public playingInfo = true;
	public textChannel: any;
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;


	public constructor(voiceConnection: VoiceConnection, message: any) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.songs = [];
		this.textChannel = message.channel
		this.guildId = message.guildId
		this.voiceChannel = message.member.voice.channel
		this.lastRespond = message

		this.audioPlayer.on('stateChange', async (oldState, newState) => {
			console.log(
				`Audio player transitioned ${oldState.status} to ${newState.status}`
			);

			if (newState.status === "idle" && oldState.status !== "idle") {
				if (this.songs[1]) {
					this.songs.shift();
					return
				}

				return removeAndClear(this.guildId)
			}
		});

		this.voiceConnection.on('stateChange', async (oldState, newState) => {
			if (newState.status === "disconnected" && oldState.status !== "disconnected") {
				return removeAndClear(this.guildId)
			}
		})

		voiceConnection.subscribe(this.audioPlayer);
	}

	public enqueue(track: Track) {
		this.songs.push(track);
		void this.processQueue();
	}

	public stop() {
		this.audioPlayer.stop(true);
	}

	private async processQueue(): Promise<void> {
		// If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.songs.length === 0) {
			return;
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
				this.resource = resource;
			}

			if (this.playingInfo === true) {
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