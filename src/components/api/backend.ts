import { backend } from '../../config.json';
import axios from 'axios';
import type { IAuthor, IProject } from './types';
import { currentUser } from './svelte-stores';

const authStorageKey = 'altshift_authorization';

export const init = async () => {
  let authorization = localStorage.getItem(authStorageKey) as string;
  if (authorization?.length) {
    const resp = await axios.get(`${backend}/check-token`, {
      params: {
        token: authorization,
      },
    });
    if (!resp.data.is_valid) {
      localStorage.removeItem(authStorageKey);
      authorization = null;
    }
  }

  if (!authorization) {
    const resp = await axios.post(`${backend}/new-anon`, {});
    authorization = resp.data.token;
    localStorage.setItem(authStorageKey, authorization);
  }

  const resp = await axios.get(`${backend}/author`, {
    headers: {
      authorization,
    },
  });
  const { id, email, project_name } = resp.data;

  currentUser.set({
    token: authorization,
    uid: id,
    email: email,
    defaultProjectName: project_name,
  });
};

export const getAudioFiles = async (video_type: string, video_id: string): Promise<any> => {
  const authorization = localStorage.getItem(authStorageKey) as string;
  const resp = await axios.get(`${backend}/audio-files`, {
    headers: {
      authorization,
    },
    params: {
      video_type,
      video_id,
    },
  });
  return resp.data;
};

export const signIn = async (email: string, password: string): Promise<IAuthor> => {
  const resp = await axios.post(`${backend}/authenticate`, {
    email,
    password,
  });

  const { token, author_id, project_name } = resp.data;
  localStorage.setItem(authStorageKey, token);

  return {
    token,
    uid: author_id,
    email,
    defaultProjectName: project_name,
  };
};

export const getOrCreateProject = async (
  video_type: string,
  video_id: string
): Promise<{ project_id: string; parts: any[] }> => {
  const authorization = localStorage.getItem(authStorageKey) as string;
  const resp = await axios.get(`${backend}/project`, {
    headers: {
      authorization,
    },
    params: {
      video_type,
      video_id,
    },
  });
  const { project_id, parts } = resp.data;
  return {
    project_id,
    parts,
  };
};

export const uploadPart = async (
  file: File,
  project_id: string,
  start: number,
  end: number,
  peaks: number[]
): Promise<any> => {
  const authorization = localStorage.getItem(authStorageKey) as string;
  const formData = new FormData();
  formData.append('partFile', file);

  formData.append('project_id', project_id);
  formData.append('start', start.toString());
  formData.append('end', end.toString());
  formData.append('peaks', JSON.stringify(peaks));

  const resp = await axios.put(`${backend}/recording-part`, formData, {
    headers: {
      authorization,
      'Content-Type': 'multipart/form-data',
    },
  });

  return resp.data;
};

export const deleteRecordingPart = async (recording_part_id: string) => {
  const authorization = localStorage.getItem(authStorageKey) as string;
  await axios.delete(`${backend}/recording-part`, {
    headers: {
      authorization,
    },
    data: {
      recording_part_id,
    },
  });
};

export const mixProject = async (project_id: string) => {
  const authorization = localStorage.getItem(authStorageKey) as string;
  await axios.post(
    `${backend}/mix-project`,
    {
      project_id,
    },
    {
      headers: {
        authorization,
      },
    }
  );
};
