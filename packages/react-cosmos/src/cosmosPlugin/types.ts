import { Express } from 'express';
import http from 'http';
import { CosmosMode, MessageType } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';

export type CosmosPlatform = 'web' | 'native';

export type CosmosConfigPluginArgs = {
  config: CosmosConfig;
  mode: CosmosMode;
  platform: CosmosPlatform;
};

export type CosmosConfigPlugin = (
  args: CosmosConfigPluginArgs
) => Promise<CosmosConfig> | CosmosConfig;

export type DevServerPluginArgs = {
  config: CosmosConfig;
  platform: CosmosPlatform;
  httpServer: http.Server;
  app: Express;
  sendMessage(msg: MessageType): unknown;
};

export type DevServerPluginCleanupCallback = () => unknown;

export type DevServerPluginReturnValue =
  void | null | DevServerPluginCleanupCallback;

export type DevServerPluginReturn =
  | DevServerPluginReturnValue
  | Promise<DevServerPluginReturnValue>;

export type DevServerPlugin = (
  args: DevServerPluginArgs
) => DevServerPluginReturn;

export type ExportPluginArgs = {
  config: CosmosConfig;
};

export type ExportPlugin = (args: ExportPluginArgs) => unknown;

export type CosmosServerPlugin = {
  name: string;
  config?: CosmosConfigPlugin;
  devServer?: DevServerPlugin;
  export?: ExportPlugin;
};
