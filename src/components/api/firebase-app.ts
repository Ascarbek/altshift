import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from '../../../firebase.config';

import { AudioFiles, showLogo, currentUser } from './svelte-stores';

import type { IAudioFile, IVoice, IRecordPart, FRecording } from './types';

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

export const signInRedirect = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('.../auth/userinfo.email');
  const res = await firebase.auth().signInWithRedirect(provider);
  console.log(res);
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
    showLogo.set(false);
  } catch (e) {
    console.log('some problem');
  }
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

export const newRecording = async (params: FRecording): Promise<IRecordPart> => {
  const db = firebase.firestore();
  const doc = db.collection('recordings').doc();

  await doc.set({
    authorId: params.authorId,
    created: params.created,
    projectId: params.projectId,
    voiceName: params.voiceName,
    start: params.start,
    end: params.end,
  });

  return {
    id: doc.id,
    created: params.created,
    start: params.start,
    end: params.end,
    voiceName: params.voiceName,
  };
};
