import { useShallowEqualSelector } from '../../../shared/state/hooks'

export const useKeyCodeMap = (): Record<string, string> =>
  useShallowEqualSelector((state) => state.data.keyCodeMap)
