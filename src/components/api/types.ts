export const enum DisplayStates {
  NOT_FOUND,
  HOME,
  MENU,
  LOGO,
  // AUDIO_DELAY,
  // VOLUME,
  UPLOAD_PROGRESS,
  RECORDER,
}

export const enum RecordingStates {
  ALLOW_MESSAGE,
  DECLINED_MESSAGE,
  FIRST_MESSAGE,
  SAVING_PROGRESS,
  ACTIVE_RECORDING,
  PAUSE_MESSAGE,
  SAVE_MENU,
  LOADING,
}

export interface IAudioFile {
  name?: string;
  path?: string;
  tags?: string[];
  lang?: string;
}

export interface FRecording {
  id: string;
  created: number;
  authorId: string;
  projectId: string;
  voiceName: string;
  start: number;
  end: number;
  peaks: number[];
  path: string;
}

export interface IRecordPart {
  id: string;
  voiceName: string;
  created: number;
  start: number;
  end: number;
  peaks: number[];
  path: string;
}

export interface IVoice {
  name: string;
}

export interface IVoiceOverPlacement {
  time: number;
  duration: number;
  id: string;
}

export interface IProject {
  id: string;
  authorId: string;
  videoId: string;
  videoType: string;
  voices?: IVoice[];
}

export interface IAuthor {
  token?: string;
  uid?: string;
  email?: string;
  defaultProjectName?: string;
}
