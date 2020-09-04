export const enum DisplayStates {
  NOT_FOUND,
  HOME,
  MENU,
  LOGO,
  AUDIO_DELAY,
  VOLUME,
  UPLOAD_PROGRESS,
  RECORDER,
}

export const enum RecordingStates {
  ALLOW_MESSAGE,
  DECLINED_MESSAGE,
  FIRST_MESSAGE,
  ACTIVE_RECORDING,
  PAUSE_MESSAGE,
  SAVE_MENU,
}

export interface AudioFile {
  name: string;
  path: string;
  tags: string[];
  lang: string;
}

export interface Recording {
  name: string;
  videoId: string;
  lang: string;
  duration: number;
}

export interface Voice {
  recordingId: string;
  name: string;
}

export interface RecordPart {
  recordingId: string;
  voiceId: string;
  start: number;
  end: number;
}
