<script lang="ts">
  import { App } from "./lib/app";

  import Notifications from "./componets/notifications.svelte";

  import {
    isLoggedin,
    userId,
    currentMessage,
    isApprove,
    userBalance,
    tokenSymbol
  } from "./stores/stores";
  const app = new App();
  let newMessage: string;
</script>

<Notifications />

<main class="flex h-screen items-center justify-center bg-slate-400">
  {#if !$isLoggedin}
    <section
      class="w-full space-y-4 rounded-md bg-white p-4 shadow-lg sm:w-4/5 md:w-2/4 xl:w-1/4 text-center"
    >
      <h1 class="text-4xl">Simple DApp</h1>
      <p>Hello please login with metamask</p>
      <button
        on:click={() => app.login()}
        class="bg-orange-400 w-full py-2 text-lg hover:bg-orange-500 transition-all text-white"
        >Login</button
      >
    </section>
  {:else}
    <section
      class="w-full space-y-4 rounded-md bg-white p-4 shadow-lg sm:w-4/5 md:w-2/4 xl:w-1/4"
    >
      <header class="flex items-center justify-between">
        <div class="border-2 text-center">
          <img
            class="h-20 w-20"
            src="https://www.svgrepo.com/show/434029/cat.svg"
            alt=""
          />
          <p class="font-bold text-gray-500">{$userId.slice(0, 8)}</p>
        </div>
        <p class="text-gray-500">Balance: <b>${$userBalance}</b> <b>{$tokenSymbol}</b></p>
      </header>
      <main class="space-y-2 border-2 py-2 text-center">
        <h2 class="text-gray-500">Current Message: <b>{$currentMessage}</b></h2>
        <div class="flex mx-4 space-x-2">
          <input
            bind:value={newMessage}
            class="rounded-sm bg-slate-50 py-2 pl-2 w-full"
            type="text"
            placeholder="Change message price $2 TKN"
          />
          {#if !$isApprove}
            <button
              on:click={() => app.approveContract()}
              class="bg-orange-400 px-2 py-2 text-white hover:bg-orange-500 transition-all rounded-sm"
            >
              Approve
            </button>
          {:else}
            <button
              on:click={() => {
                app.changeMessage(newMessage);
                newMessage = "";
              }}
              class="bg-green-400 px-2 py-2 text-white hover:bg-green-500 transition-all rounded-sm"
            >
              Submit
            </button>
          {/if}
        </div>
      </main>
    </section>
  {/if}
</main>
