/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * (Optional) A place that the robot will end up after the action. Default to last known location
 */
export type PlaceDescription =
  | (string | number)
  | {
      waypoint: string | number;
      orientation?: number;
      [k: string]: unknown;
    };

/**
 * Description schema for the perform_action category
 */
export interface PerformActionEventDescription {
  /**
   * A string that describes the nature of this action. It should match that passed into FleetUpdateHandle::add_performable_action()
   */
  category: string;
  /**
   * Additional information that will be passed along to the action executor.
   */
  description: {
    [k: string]: unknown;
  };
  /**
   * (Recommended) The estimated duration for this action
   */
  unix_millis_action_duration_estimate?: number;
  /**
   * (Optional) Whether the tool on the robot will be powered during the action. Default to false
   */
  use_tool_sink?: boolean;
  expected_finish_location?: PlaceDescription;
  [k: string]: unknown;
}
