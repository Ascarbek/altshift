import * as firebase from 'firebase/app';

import 'firebase/storage';
// import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

import firebaseConfig from '../../../firebase.config';

import { AudioFiles, showLogo } from './svelte-stores';

import type { AudioFile, Recording, Voice, RecordPart } from './types';

const USER_ID = 'ascarbek';

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously();

firebase.auth().onAuthStateChanged(function(user) {
  /* if (user) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const ref = firebase.storage().ref();

    ref.child('uYGj04Iti3E').listAll().then(res => {
      res.items.forEach(async function(itemRef) {
        console.log(await ref.child(itemRef.fullPath).getDownloadURL());

      });
    });
  }
  else {

  } */
});

export const updateList = async (videoType: string, videoId: string) => {
  showLogo.set(true);

  const ref = firebase.storage().ref();

  const res = await ref.child(videoId).listAll();
  let audioFiles: AudioFile[] = [];
  for(const itemRef of res.items) {
    const newFile: AudioFile = {
      path: await ref.child(itemRef.fullPath).getDownloadURL(),
      lang: '',
      tags: [],
      name: itemRef.name
    };

    audioFiles.push(newFile);
  }

  AudioFiles.set(audioFiles);

  showLogo.set(false);
};

export const uploadFile = async(videoType: string, videoId: string, file, progressFn, completeFn) => {
  const ref = firebase.storage().ref();

  const uploadTask = ref.child(videoId).put(file);
    uploadTask.on('state_changed', function(snapshot){
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressFn(progress);
    }, function(error) {
      console.error(error);
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        completeFn(downloadURL);
      });
    });
};

export const uploadBlob = async(videoType: string, videoId: string, blob, progressFn, completeFn) => {
  const ref = firebase.storage().ref();

  const uploadTask = ref.child(videoId).put(blob);
    uploadTask.on('state_changed', function(snapshot){
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressFn(progress);
    }, function(error) {
      console.error(error);
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        completeFn(downloadURL);
      });
    });
};

export const createAuthor = async(): Promise<string> => {
  const db = firebase.firestore();
  const doc = await db.collection("authors").doc(USER_ID);

  return USER_ID;
};

export const newRecording = async(params: Recording): Promise<string> => {
  const db = firebase.firestore();
  const doc = db.collection("authors").doc(USER_ID);
  const newRecRef = doc.collection('recordings').doc();

  await newRecRef.set({
    name: params.name,
    videoId: params.videoId,
    lang: params.lang,
  });

  return newRecRef.id;
};

export const newVoice = async(params: Voice): Promise<string> => {
  const db = firebase.firestore();
  const doc = db.collection("authors").doc(USER_ID);
  const newRecRef = doc.collection('recordings').doc(params.recordingId);
  const newVoiceRef = newRecRef.collection('voices').doc();
  await newVoiceRef.set({
    name: params.name,
  });

  return newVoiceRef.id;
};

export const newPart = async(params: RecordPart): Promise<string> => {
  const db = firebase.firestore();
  const doc = db.collection("authors").doc(USER_ID);
  const newRecRef = doc.collection('recordings').doc(params.recordingId);
  const newVoiceRef = newRecRef.collection('voices').doc(params.voiceId);
  const newPartRef = newVoiceRef.collection('parts').doc();
  await newPartRef.set({
    fileName: `${newPartRef.id}.webm`,
    start: params.start,
    end: params.end,
  });

  return newPartRef.id;
};
