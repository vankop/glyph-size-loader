import { LoaderOptions } from './types';

export default function processOptions(options: Partial<LoaderOptions> | null): LoaderOptions {
  return { ranges: [[0, 0x110000]], ...options };
}
