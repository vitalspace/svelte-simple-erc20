<script lang="ts">
  import { App } from "./lib/app";
  import Notifications from "svelte-notifications";
  import CustomNotification from "./componets/CustomNotification.svelte";


  import {
    isLoggedin,
    userId,
    currentMessage,
    isApprove,
    errorMessage,
    showErr,
  } from "./stores/stores";
  const app = new App();
  let newMessage: string;
</script>

<Notifications>

<CustomNotification/>
  
  <!-- {#if showErr} -->
    <!-- (() => {addNotification({
      text: "Notification",
      position: "bottom-center",
    })}) -->
  <!-- {/if} -->

  <!-- <main class="flex justify-center items-center h-screen bg-black text-white">
    {#if !$isLoggedin}
      <section
        class="text-center border-2 w-full mx-4 sm:w-1/2 py-4 space-y-4 rounded-sm"
      >
        <h1 class="text-4xl">Simple DApp</h1>
        <p>Hello please login with metamask</p>
        <button
          on:click={() => app.login()}
          class="bg-orange-400 w-full py-2 text-lg hover:bg-orange-500 transition-all"
          >Login</button
        >
      </section>
    {:else}
      <section
        class="text-center border-2 w-full mx-4 sm:w-1/2 py-4 space-y-4 rounded-sm"
      >
        <h1 class="text-4xl">Simple App</h1>
        <p>Hello welcome back friend: {$userId.slice(0, 20)}</p>
        <p>Current Message: {$currentMessage}</p>
        <div class="flex justify-center space-x-2">
          <input
            bind:value={newMessage}
            class="pl-2 text-black"
            type="text"
            placeholder="Change Message"
          />

          {#if !$isApprove}
            <button
              on:click={() => app.approveContract()}
              class="bg-orange-400 px-2 hover:bg-orange-500 transition-all"
            >
              Approve
            </button>
          {:else}
            <button
              on:click={() => {
                app.changeMessage(newMessage);
                newMessage = "";
              }}
              class="bg-green-400 px-2 hover:bg-green-500 transition-all"
            >
              Submit
            </button>
          {/if}
        </div>
      </section>
    {/if}
  </main> -->
</Notifications>
