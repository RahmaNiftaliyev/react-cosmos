import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';

type GetPluginConfigArgs = {
  config: CosmosConfig;
  relativePaths: boolean;
};
export async function getPluginConfigs({
  config,
  relativePaths,
}: GetPluginConfigArgs): Promise<CosmosPluginConfig[]> {
  const { rootDir, detectLocalPlugins, disablePlugins, plugins, exportPath } =
    config;

  if (disablePlugins) return [];

  const moduleConfigs = await Promise.all(
    plugins.map(configPath =>
      readCosmosPluginConfig({ rootDir, configPath, relativePaths })
    )
  );

  if (!detectLocalPlugins) return moduleConfigs;

  const localConfigs = await findCosmosPluginConfigs({
    rootDir,
    ignore: ['**/node_modules/**', `${exportPath}/**`],
    relativePaths,
  });

  return [...moduleConfigs, ...localConfigs];
}
