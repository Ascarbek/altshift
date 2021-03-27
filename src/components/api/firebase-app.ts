import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from '../../../firebase.config';

import { AudioFiles, showLogo, currentUser } from './svelte-stores';

import type { IAudioFile, IVoice, IRecordPart, FRecording, IProject } from './types';
import { COLLECTION_NAMES } from './constants';

export const DEFAULT_USER_ID = '1yrIkUNKX5QwiHqJBgo7zZOs9vO2';

export const initFirebase = async () => {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user?.uid) {
      currentUser.set({ uid: user.uid });
    } else {
      console.log('logged out');
      firebase.auth().signInWithEmailAndPassword('guest@altshift.cc', '123qwe');
    }
  });
};

export const signIn = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const updateList = async (videoType: string, videoId: string) => {
  showLogo.set(true);

  try {
    const ref = firebase.storage().ref();
    const res = await ref.child(videoId).listAll();
    let audioFiles: IAudioFile[] = [];

    for (const itemRef of res.items) {
      const newFile: IAudioFile = {
        path: await ref.child(itemRef.fullPath).getDownloadURL(),
        lang: '',
        tags: [],
        name: itemRef.name,
      };

      audioFiles.push(newFile);
    }

    AudioFiles.set(audioFiles);
  } catch (e) {
    console.log('some problem');
  }
  showLogo.set(false);
};

export const uploadBlob = (path: string, blob: Blob, progressFn, completeFn) => {
  const ref = firebase.storage().ref();

  const uploadTask = ref.child(path).put(blob);

  uploadTask.on(
    'state_changed',
    function (snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressFn(progress);
    },
    function (error) {
      console.error(error);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        completeFn(downloadURL);
      });
    }
  );
};

export const newProject = async (
  name: string,
  videoType: string,
  videoId: string,
  defaultVoiceName: string
): Promise<IProject> => {
  const db = firebase.firestore();
  const doc = db.collection(COLLECTION_NAMES.PROJECTS).doc();
  await doc.set({
    name,
    videoType,
    videoId,
    voices: [{ name: defaultVoiceName }],
    voiceOvers: [],
  });

  return {
    id: doc.id,
    name,
    videoType,
    videoId,
    voices: [{ name: defaultVoiceName }],
    voiceOvers: [],
  };
};

export const renameProject = async (id, name: string) => {
  const db = firebase.firestore();
  const doc = db.collection(COLLECTION_NAMES.PROJECTS).doc(id);
  await doc.set(
    {
      name,
    },
    { merge: true }
  );
};

export const getProject = async (videoType: string, videoId: string): Promise<IProject | null> => {
  const db = firebase.firestore();
  const doc = await db
    .collection(COLLECTION_NAMES.PROJECTS)
    .where('videoType', '==', videoType)
    .where('videoId', '==', videoId)
    .get();
  if (doc.docs.length) {
    const data = doc.docs[0].data();
    return {
      id: doc.docs[0].id,
      videoType: data.videoType,
      videoId: data.videoId,
      name: data.name,
      voices: data.voices,
      voiceOvers: data.voiceOvers,
    };
  } else {
    return null;
  }
};

export const newRecording = async (params: FRecording): Promise<IRecordPart> => {
  const db = firebase.firestore();
  const doc = db.collection(COLLECTION_NAMES.RECORDINGS).doc();

  await doc.set({
    authorId: params.authorId,
    created: params.created,
    projectId: params.projectId,
    voiceName: params.voiceName,
    start: params.start,
    end: params.end,
    peaks: params.peaks,
  });

  return {
    id: doc.id,
    created: params.created,
    start: params.start,
    end: params.end,
    voiceName: params.voiceName,
    peaks: params.peaks,
  };
};

export const getRecordings = async (projectId: string): Promise<IRecordPart[]> => {
  const db = firebase.firestore();
  const resp = await db.collection(COLLECTION_NAMES.RECORDINGS).where('projectId', '==', projectId).get();

  let res: IRecordPart[] = [];
  for (const doc of resp.docs) {
    const data = doc.data();
    res.push({
      id: doc.id,
      voiceName: data.voiceName,
      created: data.created,
      start: data.start,
      end: data.end,
      peaks: data.peaks,
    });
  }
  return res;
};

export const deleteRecording = async (id: string) => {
  const db = firebase.firestore();
  await db.collection(COLLECTION_NAMES.RECORDINGS).doc(id).delete();
};
