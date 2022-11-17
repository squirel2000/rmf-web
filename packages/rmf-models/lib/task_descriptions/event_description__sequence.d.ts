/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A sequence of activities
 */
export type ActivitySequence =
  | ActivityArray
  | {
      activities: ActivityArray;
      /**
       * Customize the category display for this sequence
       */
      category?: string;
      /**
       * Customize the detail display for this sequence
       */
      detail?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
export type ActivityArray = {
  /**
   * The category of the activity
   */
  category: string;
  /**
   * A description of the activity. This must match a schema supported by a fleet for the activity category.
   */
  description: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}[];
