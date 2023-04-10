/**
 * Base class used to implement bot features.
 */
export default class BaseClass {
	/**
	 * Whether the feature is enabled.
	 */
	public static readonly enabled: boolean = false;

	/**
	 * Name of the feature.
	 */
	public static readonly featureName: string = '';

	/**
	 * Description of the feature.
	 */
	public static readonly featureDescription?: string;
}
