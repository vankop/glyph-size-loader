import { LoaderOptions } from './types';

export default function processOptions(options: Partial<LoaderOptions> | null) {
  return { ranges: [[0, 0x100000]], ...options };
}
