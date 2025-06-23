import { Model } from "objection";

/**
 * Helper function for checking if results from the database are defined
 * @param obj 
 * @returns {boolean}
 */
export const isTrueModel = (obj: any): boolean => obj instanceof Model && obj !== undefined;