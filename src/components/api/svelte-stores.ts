import { writable } from 'svelte/store';
import type { AudioFile } from './types';

export let showLogo = writable<boolean>(true);
export let AudioFiles = writable<AudioFile[]>([]);


