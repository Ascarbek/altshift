<script lang='ts'>
  import { signIn } from './api/firebase-app';

  export let onClose: () => void;
  let email;
  let password;
  const onOkClick = async () => {
    await signIn(email, password);
    onClose()
  }
</script>

<div class='backdrop'></div>
<div class='form'>
  <div class='form-title'>
    Welcome!
  </div>
  <div class='message'>
    Please sign in
  </div>
  <div class='field-group'>
    <div class='field'>
      <label>
        email
      </label>
      <input bind:value={email}>
    </div>
    <div class='field'>
      <label>
        password
      </label>
      <input bind:value={password} type='password'>
    </div>
  </div>
  <div class='button-group'>
    <button on:click={() => onOkClick()}>OK</button>
    <button on:click={() => onClose()}>cancel</button>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    z-index: 20;
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
    width: 500px;
    height: 300px;
    background: white;
    padding: 10px;
    margin: auto;
    z-index: 20;
  }
</style>
