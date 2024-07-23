import { TabOptions } from ".";

export function changeOption(
  option: TabOptions,
  setOption: (option: TabOptions) => void
) {
  setOption(option);
}
