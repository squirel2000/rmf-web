/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Description of a place that the robot can go to
 */
export type PlaceDescription =
  | Waypoint
  | {
      waypoint: Waypoint;
      orientation?: number;
      [k: string]: unknown;
    };
export type Waypoint = string | number;
