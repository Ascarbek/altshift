import { get } from 'svelte/store';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AudioFiles, showLogo, supabase as supabaseStore } from './svelte-stores';
import type { IAudioFile, IProject, IRecordPart, FRecording } from './types';
import { v4 } from 'uuid';


export const initialize = () => {
// Create a single supabase client for interacting with your database
  return createClient('https://yyircgyncjnyymfkcsvz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODQ2OTAzNSwiZXhwIjoxOTM0MDQ1MDM1fQ.BZY72_nhzIVhhqg6OuEhTvHsLSvqRqfDveUyYdOkJ8g');
};

export const updateList = async (videoType: string, videoId: string) => {
  showLogo.set(true);
  const supabase: SupabaseClient = get(supabaseStore);
  if (!supabase) return;
  try {
    /*
    const ref = firebase.storage().ref();
    const res = await ref.child(videoId).listAll();
    */

    let audioFiles: IAudioFile[] = [];

    const { data, error } = await supabase.from('audio_file').select()
      .filter('video_type', 'eq', videoType)
      .filter('video_id', 'eq', videoId);
    if (error) {
      console.error(error);
    } else {
      for (const itemRef of data) {
        const newFile: IAudioFile = {
          path: itemRef['path'],
          lang: itemRef['lang'],
          tags: itemRef['tags'],
          name: itemRef['name'],
        };

        audioFiles.push(newFile);
      }
    }

    AudioFiles.set(audioFiles);
  } catch (e) {
    console.log('some problem');
  }
  showLogo.set(false);
};

export const getDefaultProjectName = async (id: string): Promise<string> => {
  const supabase: SupabaseClient = get(supabaseStore);
  const { data, error } = await supabase.from('author').select()
    .filter('id', 'eq', id);

  if (error) {
    console.error(error);
    return;
  }
  if (!data.length) {
    console.error('author not found');
    return;
  }
  return data[0]['project_name'];
};

export const deleteRecording = async (id: string) => {

};

export const getRecordings = async (projectId: string): Promise<IRecordPart[]> => {
  const supabase: SupabaseClient = get(supabaseStore);
  const { data, error } = await supabase.from('recording_part').select()
    .filter('project_id', 'eq', projectId);
  if (error) {
    console.error(error);
    return;
  }
  return data.map<IRecordPart>(item => ({
    id: item.id,
    created: item.created,
    start: item.start,
    end: item.end,
    peaks: item.peaks,
    voiceName: 'male 1',
    path: item.path,
  }));
};

export const getOrCreateProject = async (authorId: string, videoType: string, videoId: string): Promise<IProject> => {
  const supabase: SupabaseClient = get(supabaseStore);
  const { data, error } = await supabase.from('project').select()
    .filter('author_id', 'eq', authorId);
  if (error) {
    console.error(error);
    return;
  }
  if (data.length) {
    const temp = data[0];
    return {
      id: temp.id,
      authorId: temp.authorId,
      videoType,
      videoId,
    };
  } else {
    const { data, error } = await supabase.from('project')
      .insert([{
        id: v4(),
        author_id: authorId,
        video_type: videoType,
        video_id: videoId,
      }], { returning: 'representation' });

    return {
      id: data[0].id,
      authorId: data[0].author_id,
      videoId: data[0].video_id,
      videoType: data[0].video_type,
    };
  }
};


export const newRecording = async (params: FRecording): Promise<IRecordPart> => {
  const supabase: SupabaseClient = get(supabaseStore);
  const { data, error } = await supabase.from('recording_part')
    .insert([{
      id: v4(),
      project_id: params.projectId,
      created: params.created,
      start: params.start,
      end: params.end,
      peaks: params.peaks,
      path: params.path,
    }], { returning: 'representation' });
  if (error) {
    console.error(error);
    return;
  }
  return {
    id: data[0].id,
    created: data[0].created,
    start: data[0].start,
    end: data[0].end,
    peaks: data[0].peaks,
    path: data[0].path,
    voiceName: 'defaultVoice',
  };
};




