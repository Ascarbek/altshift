import { writable } from 'svelte/store';
import type { AudioFile, RecordPart } from './types';

export let showLogo = writable<boolean>(true);
export let AudioFiles = writable<AudioFile[]>([]);
export let CurrentParts = writable<RecordPart[]>([]);

