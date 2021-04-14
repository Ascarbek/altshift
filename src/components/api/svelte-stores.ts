import { writable } from 'svelte/store';
import type { IAudioFile, IProject, IRecordPart, IVoice, IAuthor } from './types';

export let showLogo = writable<boolean>(true);
export let AudioFiles = writable<IAudioFile[]>([]);
export let Voices = writable<IVoice[]>([]);
export let CurrentParts = writable<IRecordPart[]>([]);
export let ProjectName = writable<string>('');
export let ProjectId = writable<string>('');
export let currentUser = writable<IAuthor>({});
export let RecordingStart = writable<number>(-1);
