<script lang='ts'>
  import { signIn } from './api/firebase-app';
  import { fade } from 'svelte/transition';
  import { currentUser, supabase } from './api/svelte-stores';
  import { getDefaultProjectName } from './api/supabase-app';

  export let onClose: () => void;
  let email;
  let password;
  const onOkClick = async () => {
    const { user, session, error } = await $supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      console.error(error);
    } else {
      $currentUser = {
        email,
        uid: user.id,
        defaultProjectName: await getDefaultProjectName(user.id, $supabase),
      };

      onClose();
    }
  };
</script>

<div class='backdrop' transition:fade></div>

<div class='form' transition:fade>
  <div class='icon-part'>
    <i class='fas fa-microphone-alt'></i>
  </div>

  <div class='fields-part'>
    <button class='cancel-button' on:click={() => onClose()}><i class='fas fa-times'></i></button>

    <div class='form-title'>
      Welcome!
    </div>
    <div class='message'>
      to alpha version of AltShift
    </div>

    <div class='field-group'>
      <div class='field'>
        <label>
          Email
        </label>
        <input bind:value={email}>
      </div>
      <div class='field'>
        <label>
          Password
        </label>
        <input bind:value={password} type='password'>
      </div>
    </div>
    <div class='button-group'>
      <button class='ok-button' on:click={() => onOkClick()}>
        <span style='margin-right: 10px; font-size: 18px'>Sign in</span>
        <i class='fas fa-long-arrow-alt-right'></i>
      </button>

      <a href='https://www.altshift.cc/request-login' target='_blank'>submit for alpha test</a>
    </div>
  </div>

</div>

<style>
  .backdrop {
    position: fixed;
    z-index: 10000;
    background: #000000;
    opacity: 0.9;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }

  .form {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 600px;
    height: 400px;
    background: white;
    margin: auto;
    z-index: 10000;
    border-radius: 6px;
    display: flex;
    overflow: hidden;
  }

  .icon-part {
    background: #D1FAE5;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #ffffff;
    font-size: 80px;
    overflow: hidden;
  }

  .fields-part {
    flex: 1;
    padding: 10px;
    position: relative;
  }

  .field-group {
    padding: 0 20px;
    margin-bottom: 30px;
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .field label {
    color: #6B7280;
    padding-left: 7px;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: normal;
  }

  .field input {
    border: #D1D5DB solid 1px;
    border-radius: 8px;
    padding: 7px;
  }

  .cancel-button {
    position: absolute;
    background: #f0f0f0;
    color: #464c4b;
    border-radius: 6px;
    width: 30px;
    height: 30px;
    right: 5px;
    top: 5px;
    border: none;
    padding: 0;
    margin: 0;
    outline: 0;
    cursor: pointer;
  }

  .ok-button {
    background: #10B981;
    color: #ffffff;
    border: none;
    padding: 0;
    outline: 0;
    cursor: pointer;
    width: 150px;
    border-radius: 8px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 20px;
  }

  .form-title {
    color: #10B981;
    font-size: 40px;
    text-align: center;
    margin-bottom: 10px;
  }

  .message {
    text-align: center;
    margin-bottom: 20px;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-group a {
    color: #10B981;
    text-decoration: none;
    font-weight: lighter;
  }

  input {
    outline: 0;
  }
</style>
