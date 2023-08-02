<script lang="ts">
  import { addNotification } from "../stores/stores";
</script>

{#if $addNotification.showNotification}
  {#if $addNotification.type === "error"}
    <div
      class="z-10 absolute p-2 flex space-x-2 flex-wrap w-2/5 right-0 top-0 text-white border-2 bg-red-400"
    >
      <h2 class="font-bold">Notification:</h2>
      <p>{$addNotification.message}</p>
    </div>
  {:else}
    <div
      class="z-10 absolute p-2 flex space-x-2 flex-wrap w-2/5 right-0 top-0 text-white border-2 bg-green-400"
    >
      <h2 class="font-bold">Notification:</h2>
      <p>{$addNotification.message}</p>
    </div>
  {/if}
{/if}
