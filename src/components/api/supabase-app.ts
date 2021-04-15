import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AudioFiles, showLogo, supabase } from './svelte-stores';
import type { IAudioFile } from './types';


export const initialize = () => {
// Create a single supabase client for interacting with your database
  return createClient('https://yyircgyncjnyymfkcsvz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODQ2OTAzNSwiZXhwIjoxOTM0MDQ1MDM1fQ.BZY72_nhzIVhhqg6OuEhTvHsLSvqRqfDveUyYdOkJ8g');
};

export const updateList = async (videoType: string, videoId: string, supabase: SupabaseClient) => {
  showLogo.set(true);
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

export const getDefaultProjectName = async (id: string, supabase: SupabaseClient): Promise<string> => {
  const { data, error } = await supabase.from('author').select()
    .filter('id', 'eq', id);

  if (error) {
    console.error(error);
  }
  if (!data.length) {
    console.error('author not found');
  }
  return data[0]['project_name'];
};
