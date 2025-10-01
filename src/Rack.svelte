<script>
    import { createEventDispatcher } from "svelte";
    import Device from "./Device.svelte";

    const dispatch = createEventDispatcher();

    export let devices = []; // Receive placed devices as a prop

    const rackConfig = {
        rows: 2,
        stacksPerRow: 4,
        unitsPerStack: 6,
    };

    function handleDrop(event, row, stack, unit) {
        event.preventDefault();
        const deviceData = event.dataTransfer.getData("device");
        if (deviceData) {
            const droppedDevice = JSON.parse(deviceData);
            // Emit an event to the parent (`App.svelte`) to handle the state change.
            dispatch("devicedrop", {
                row,
                stack,
                unit,
                droppedDevice,
            });
        }
    }

    function handleDragOver(event) {
        event.preventDefault(); // Allow drop
    }
</script>

<div class="rack-container">
    {#each Array(rackConfig.rows) as _, row (row)}
        <div
            class="rack-row"
            style="--stacks-per-row: {rackConfig.stacksPerRow}"
        >
            {#each Array(rackConfig.stacksPerRow) as _, stack (stack)}
                <div class="rack-stack">
                    <div class="stack-label">
                        Stack {row * rackConfig.stacksPerRow + stack + 1}
                    </div>
                    <!-- Render units from top to bottom (U6, U5, ...) -->
                    {#each Array(rackConfig.unitsPerStack)
                        .fill(0)
                        .map((_, i) => rackConfig.unitsPerStack - i) as unit (unit)}
                        {@const deviceInUnit = devices.find(
                            (d) =>
                                d.row === row &&
                                d.stack === stack &&
                                d.unit === unit,
                        )}
                        <div
                            class="rack-unit"
                            title="Row {row + 1}, Stack {stack +
                                1}, Unit {unit}"
                            on:dragover={handleDragOver}
                            on:drop={(e) => handleDrop(e, row, stack, unit)}
                        >
                            {#if deviceInUnit}
                                <Device
                                    device={deviceInUnit}
                                    on:portmousedown={(e) =>
                                        dispatch("portmousedown", e.detail)}
                                />
                            {:else}
                                <span>U{unit}</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .rack-container {
        flex: 1;
        background-color: #21252b;
        border: 1px solid #181a1f;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .rack-row {
        display: grid;
        grid-template-columns: repeat(var(--stacks-per-row), 1fr);
        gap: 1rem;
        border: 1px solid #3e4451;
        padding: 1rem;
        border-radius: 6px;
        background-color: #2c323c;
    }

    .rack-stack {
        border: 1px solid #3e4451;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        background-color: #282c34;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .stack-label {
        text-align: center;
        font-weight: 600;
        padding: 0.4rem;
        background-color: #21252b;
        border-bottom: 1px solid #181a1f;
        font-size: 0.75rem;
        color: #e5c07b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .rack-unit {
        height: 35px;
        border-top: 1px solid #3e4451;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        color: #5c6370;
        background-color: #1e2227;
        transition: background-color 0.2s;
    }

    .rack-unit:hover {
        background-color: #2c323c;
    }

    .rack-unit:first-of-type {
        border-top: none;
    }
</style>
