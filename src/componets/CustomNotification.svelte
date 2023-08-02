<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();
</script>

<button
  on:click={() => addNotification({
    text: 'Error al qlear masizo',
    position: "top-right",
    removeAfter: 4000,
    type: "error",
  })}
>
  Add notification
</button>