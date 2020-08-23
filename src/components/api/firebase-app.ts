import * as firebase from 'firebase/app';

import 'firebase/storage';
// import "firebase/analytics";
import "firebase/auth";
// import "firebase/firestore";

import firebaseConfig from '../../../firebase.config';

import { AudioFiles } from './svelte-stores';
import type { AudioFile } from './types';

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
  const ref = firebase.storage().ref();

  ref.child(videoId).listAll().then(async res => {
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
  });
}


