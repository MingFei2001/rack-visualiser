<script>
    import { createEventDispatcher } from "svelte";
    import Device from "./Device.svelte";

    const dispatch = createEventDispatcher();

    export let devices = [];

    let droppable = false; // For visual feedback on drag-over
</script>

<div
    class="palette"
    class:droppable
    role="region"
    aria-label="Device palette - drop zone for removing devices"
    on:dragenter={() => (droppable = true)}
    on:dragleave={() => (droppable = false)}
    on:drop={() => (droppable = false)}
>
    <h2>Devices</h2>
    <section>
        {#each devices as device (device.id)}
            <div class="item-wrapper">
                <Device
                    {device}
                    on:portmousedown={(e) =>
                        dispatch("portmousedown", e.detail)}
                />
            </div>
        {/each}
    </section>
</div>

<style>
    .palette {
        width: 280px;
        border: 1px solid #181a1f;
        border-radius: 8px;
        padding: 1rem;
        background-color: #21252b;
        display: flex;
        flex-direction: column;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .palette.droppable {
        border-color: #98c379;
        box-shadow: 0 0 8px rgba(152, 195, 121, 0.5);
    }

    h2 {
        margin: 0 0 0.75rem 0;
        text-align: center;
        color: #e5c07b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
        font-weight: 600;
    }

    section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center; /* Center devices horizontally */
    }
</style>
