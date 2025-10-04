<script>
    import { createEventDispatcher } from "svelte";

    export let show = false;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    // Close on escape key
    function handleKeydown(event) {
        if (event.key === "Escape") {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
    <div class="modal-overlay" on:click={close}>
        <div class="modal-content" on:click|stopPropagation>
            <h2>Help</h2>
            <ul>
                <li>
                    <strong>Add Device:</strong> Drag a device from the palette on
                    the left and drop it onto an empty slot in the rack.
                </li>
                <li>
                    <strong>Connect Ports:</strong> Click and hold a port, then drag
                    to another port (or the same device) to create a cable.
                </li>
                <li>
                    <strong>Remove Last Cable:</strong> Press the 'Delete' or 'Backspace'
                    key to remove the most recently added cable.
                </li>
                <li>
                    <strong>Remove Device:</strong> Drag a device from the rack to
                    the palette area to remove it.
                </li>
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
        background-color: rgba(40, 44, 52, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #21252b;
        color: #abb2bf;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
        border: 1px solid #181a1f;
    }

    .modal-content h2 {
        margin-top: 0;
        color: #e5c07b;
        border-bottom: 1px solid #3e4451;
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
        color: #98c379;
    }

    .close-button-container {
        text-align: right;
    }

    .modal-content button {
        padding: 10px 20px;
        border: none;
        background-color: #98c379;
        color: #282c34;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .modal-content button:hover {
        background-color: #7cb461;
    }
</style>
