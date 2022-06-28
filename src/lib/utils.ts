/**
 * Gets the environmental variable with envName and throws error if not found.
 * @param envName The envinmental varaible to get.
 * @returns The value of the environmental varaible.
 * @throws Error if the environmental variable is not found.
 */
export const getEnv = (envName: string): string => {
  console.log("Wondow", window);
  const variable = process.env[envName];
  console.log(envName, variable);
  if (variable === undefined)
    throw new Error(`Environmental variable ${envName} not found`);
  return variable;
};
