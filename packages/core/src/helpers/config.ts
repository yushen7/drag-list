import { Config, NormalizedConfig } from "../types/index";
import { noop } from "../utils";

const DefaultConfig: Config = {
  container: "#container",
  items: [],
  onSwap: noop,
  onSwapEnd: noop,
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
