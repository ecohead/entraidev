import type {
	AnyThreadChannel, CategoryChannel,
	Channel, DMChannel, ForumChannel,
	NewsChannel,
	PrivateThreadChannel,
	PublicThreadChannel,
	Snowflake,
	StageChannel,
	VoiceChannel,
} from 'discord.js';
import { BaseChannel, ChannelType, TextChannel } from 'discord.js';

import Discord from '../client.js';
import {
	isAnnouncementChannel, isCategoryChannel, isDMChannel, isForumChannel,
	isPrivateThreadChannel,
	isPublicThreadChannel,
	isStageChannel,
	isTextChannel, isThreadChannel,
	isVoiceChannel,
} from './channel_typology.js';
import Logger from '../logger.js';

type AuthorizedChannelTypesForSearch =
	| ChannelType.GuildText
	| ChannelType.DM
	| ChannelType.GuildVoice
	| ChannelType.GroupDM
	| ChannelType.GuildCategory
	| ChannelType.GuildAnnouncement
	| ChannelType.AnnouncementThread
	| ChannelType.PublicThread
	| ChannelType.PrivateThread
	| ChannelType.GuildStageVoice
	| ChannelType.GuildDirectory
	| ChannelType.GuildForum;

export function findTextChannel(channelId: Snowflake) {
	const finder = findChannel<TextChannel>(
		(channel, key) => isTextChannel(channel) && key === channelId,
		ChannelType.GuildText
	);

	return finder(channelId);
}

export function findCategoryChannel(channelId: Snowflake) {
	const finder = findChannel<CategoryChannel>(
		(channel, key) => isCategoryChannel(channel) && key === channelId,
		ChannelType.GuildCategory
	);

	return finder(channelId);
}

export function findVoiceChannel(channelId: Snowflake) {
	const finder = findChannel<VoiceChannel>(
		(channel, key) => isVoiceChannel(channel) && key === channelId,
		ChannelType.GuildVoice
	);

	return finder(channelId);
}

export function findStageChannel(channelId: Snowflake) {
	const finder = findChannel<StageChannel>(
		(channel, key) => isStageChannel(channel) && key === channelId,
		ChannelType.GuildStageVoice
	);

	return finder(channelId);
}

export function findAnnouncementChannel(channelId: Snowflake) {
	const finder = findChannel<NewsChannel>(
		(channel, key) => isAnnouncementChannel(channel) && key === channelId,
		ChannelType.AnnouncementThread
	);

	return finder(channelId);
}

export function findForumChannel(channelId: Snowflake) {
	const finder = findChannel<ForumChannel>(
		(channel, key) => isForumChannel(channel) && key === channelId,
		ChannelType.GuildForum
	);

	return finder(channelId);
}

export function findPrivateThreadChannel(channelId: Snowflake) {
	const finder = findChannel<PrivateThreadChannel>(
		(channel, key) => isPrivateThreadChannel(channel) && key === channelId,
		ChannelType.PrivateThread
	);

	return finder(channelId);
}

export function findPublicThreadChannel(channelId: Snowflake) {
	const finder = findChannel<PublicThreadChannel>(
		(channel, key) => isPublicThreadChannel(channel) && key === channelId,
		ChannelType.PublicThread
	);

	return finder(channelId);
}

export function findThreadChannel(channelId: Snowflake) {
	const finder = findChannel<AnyThreadChannel>(
		(channel, key) => isThreadChannel(channel) && key === channelId,
		[ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread]
	);

	return finder(channelId);
}

export function findDMChannel(channelId: Snowflake) {
	const finder = findChannel<DMChannel>(
		(channel, key) => isDMChannel(channel) && key === channelId,
		[ChannelType.DM, ChannelType.GroupDM]
	);

	return finder(channelId);
}

export function findSimpleDMChannel(channelId: Snowflake) {
	const finder = findChannel<DMChannel>(
		(channel, key) => isDMChannel(channel) && key === channelId,
		ChannelType.DM
	);

	return finder(channelId);
}

export function findGroupDMChannel(channelId: Snowflake) {
	const finder = findChannel<DMChannel>(
		(channel, key) => isDMChannel(channel) && key === channelId,
		ChannelType.GroupDM
	);

	return finder(channelId);
}

/**
 * HOF which handle retrieval in channels cache manager and
 * process the resulting channel (if found) to ensure that
 * the object is the one we expected.
 */
function findChannel<ChannelClass extends Channel>(
	condition: (channel: Channel, key: Snowflake) => boolean,
	expectedChannelTypes: AuthorizedChannelTypesForSearch | Array<AuthorizedChannelTypesForSearch>
) {
	return (channelId: Snowflake): ChannelClass | undefined => {
		try {
			const channelFound = Discord.client.channels.cache.find((channel, key) => condition(channel, key));

			if (!channelFound) {
				Logger.instance.error((`found no channel with ID ${channelId}`));

				return undefined;
			}

			if (!(channelFound instanceof BaseChannel)) {
				Logger.instance.error((`channel with ID #${channelId} is not an instance of a channel`));

				return undefined;
			}

			if (Array.isArray(expectedChannelTypes) && !expectedChannelTypes.includes(channelFound.type)) {
				Logger.instance.error((`channel with ID #${channelId} is not of the expected types ${expectedChannelTypes.join('|')}`));

				return undefined;
			}

			if (channelFound.type !== expectedChannelTypes) {
				Logger.instance.error((`channel with ID #${channelId} is not of the expected type ${expectedChannelTypes}`));

				return undefined;
			}

			return channelFound as ChannelClass;
		} catch (error) {
			Logger.instance.error(error);
		}
	}
}
