<script>
  import { createEventDispatcher } from 'svelte';

  export let show = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  // Close on escape key
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if show}
<div class="modal-overlay" on:click={close}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Help</h2>
    <ul>
      <li><strong>Add Device:</strong> Drag a device from the palette on the left and drop it onto an empty slot in the rack.</li>
      <li><strong>Connect Ports:</strong> Click on a port on one device, then click on a port on another (or the same) device to create a cable.</li>
      <li><strong>Remove Last Cable:</strong> Press the 'Delete' or 'Backspace' key to remove the most recently added cable.</li>
      <li><strong>Remove Device:</strong> Drag a device from the rack to the palette area to remove it.</li>
    </ul>
    <div class="close-button-container">
        <button on:click={close}>Close</button>
    </div>
  </div>
</div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    border: 1px solid #34495e;
  }

  .modal-content h2 {
    margin-top: 0;
    color: #3498db;
    border-bottom: 1px solid #34495e;
    padding-bottom: 0.5rem;
  }

  .modal-content ul {
    list-style-type: none;
    padding: 0;
    margin: 1.5rem 0;
  }

  .modal-content li {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .modal-content li strong {
      color: #3498db;
  }

  .close-button-container {
      text-align: right;
  }

  .modal-content button {
    padding: 10px 20px;
    border: none;
    background-color: #3498db;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .modal-content button:hover {
    background-color: #2980b9;
  }
</style>
