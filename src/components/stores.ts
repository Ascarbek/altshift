import { writable } from 'svelte/store';
import type { AudioFile } from './types';

export let AudioFiles = writable<AudioFile[]>([]);
