import { Config, NormalizedConfig } from './../types/index';

const DefaultConfig: Config = {
  container: '#container',
  items: [],
  onSwap: () => {}
}
export function normalizeConfig (config: Config = DefaultConfig) {
  if (typeof config.container === 'string') {
    config.container = document.querySelector(config.container) as HTMLElement;
  }  
  return config as NormalizedConfig
}