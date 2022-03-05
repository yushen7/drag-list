import { Config, NormalizedConfig } from "./../types/index";

const DefaultConfig: Config = {
  container: "#container",
  items: [],
  onSwap: () => {},
  activeClassName: '',
  activeStyle: '',
};
export function normalizeConfig(config: Config) {
  const merged = {
    ...DefaultConfig,
    ...config
  }
  if (typeof merged.container === "string") {
    merged.container = document.querySelector(merged.container) as HTMLElement;
  }
  if (merged.activeClassName === undefined) {
    merged.activeClassName = '';
  }
  return merged as NormalizedConfig;
}
