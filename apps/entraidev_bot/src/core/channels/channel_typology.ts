import type { AnyThreadChannel, Channel, PrivateThreadChannel, PublicThreadChannel } from 'discord.js';
import {
	CategoryChannel,
	ChannelType,
	DMChannel,
	ForumChannel,
	NewsChannel,
	StageChannel,
	TextChannel,
	VoiceChannel,
} from 'discord.js';

export function isTextChannel(channel: Channel): channel is TextChannel {
	return channel instanceof TextChannel;
}

export function isCategoryChannel(channel: Channel): channel is CategoryChannel {
	return channel instanceof CategoryChannel;
}

export function isVoiceChannel(channel: Channel): channel is VoiceChannel {
	return channel.isVoiceBased();
}

export function isForumChannel(channel: Channel): channel is ForumChannel {
	return channel instanceof ForumChannel;
}

export function isAnnouncementChannel(channel: Channel): channel is NewsChannel {
	return channel instanceof NewsChannel;
}

export function isStageChannel(channel: Channel): channel is StageChannel {
	return channel instanceof StageChannel;
}

export function isThreadChannel(channel: Channel): channel is AnyThreadChannel {
	return channel.isThread();
}

export function isPublicThreadChannel(channel: Channel): channel is PublicThreadChannel {
	return channel.isThread() && (
		channel.type === ChannelType.PublicThread ||
		channel.type === ChannelType.AnnouncementThread
	);
}

export function isPrivateThreadChannel(channel: Channel): channel is PrivateThreadChannel {
	return channel.isThread() && channel.type === ChannelType.PrivateThread;
}

export function isDMChannel(channel: Channel): channel is DMChannel {
	return channel.isDMBased();
}
