<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let device;
    export let isOnRack = false; // New prop to determine context

    // Dynamically group ports by their 'portRow' property.
    // This creates a data structure that can handle any number of rows.
    $: portRows =
        device.ports?.reduce((acc, port) => {
            const { portRow } = port;
            if (!acc[portRow]) {
                acc[portRow] = [];
            }
            acc[portRow].push(port);
            return acc;
        }, []) || [];

    function handleDragStart(event) {
        event.dataTransfer.setData("device", JSON.stringify(device));
    }

    function handlePortMouseDown(event, portId) {
        const rect = event.target.getBoundingClientRect();
        dispatch("portmousedown", {
            deviceId: device.id,
            portId: portId,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    }
</script>

<div
    class="device"
    class:on-rack={isOnRack}
    draggable="true"
    on:dragstart={handleDragStart}
    role="button"
    tabindex="0"
>
    <!-- Ports are rendered first -->
    {#if device.ports && device.ports.length > 0}
        <div class="ports-container">
            <!-- Dynamically create a row for each group of ports -->
            {#each portRows as row (row[0].portRow)}
                <div class="port-row">
                    {#each row as port (port.id)}
                        <div
                            class="port"
                            data-device-id={device.id}
                            data-port-id={port.id}
                            title={port.id}
                            on:mousedown={(e) =>
                                handlePortMouseDown(e, port.id)}
                        >
                            <!-- Port visual indicator -->
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}

    <!-- Device name is rendered last, so it appears at the bottom -->
    <span class="device-name">{isOnRack ? device.rackName : device.name}</span>
</div>

<style>
    .device {
        height: 100%;
        width: 270px; /* Increased width to accommodate more ports and text */
        padding: 0.25rem;
        border: 1px solid #181a1f;
        background-color: #34495e;
        border-radius: 4px;
        display: flex;
        flex-direction: column; /* Default: Arrange items vertically */
        align-items: center;
        justify-content: center; /* Default: Center content vertically */
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        color: #ecf0f1;
        box-sizing: border-box;
        transition: all 0.2s ease;
        gap: 4px; /* Add space between ports and name */
        cursor: grab;
    }

    .device:hover {
        background-color: #4a627d;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .device-name {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        color: #abb2bf;
    }

    /* Styles specifically for devices on the rack */
    .device.on-rack {
        flex-direction: row; /* Arrange items horizontally */
        align-items: center; /* Vertically center items */
        justify-content: space-between; /* Push name to left, ports to right */
        padding: 0.25rem 0.5rem; /* Maintain horizontal padding */
        gap: 0.5rem; /* Space between ports and name */
    }

    .device.on-rack .device-name {
        text-align: left; /* Align text to the left */
        font-size: 0.7rem; /* Slightly smaller font for rack display */
        flex-grow: 1; /* Allow name to take up available space */
        width: auto; /* Allow width to be determined by content */
        flex-shrink: 0; /* Prevent shrinking */
        order: 0; /* Place name first in the flex order */
    }

    .ports-container {
        display: flex;
        flex-direction: column; /* Stack rows vertically */
        gap: 2px; /* Gap between the two rows */
        flex-shrink: 0;
        order: 1; /* Place ports second in the flex order */
    }

    .port-row {
        display: flex;
        flex-wrap: wrap; /* Allow ports to wrap if they don't fit */
        justify-content: flex-start; /* Align ports to the left */
        gap: 3px; /* Gap between individual ports in a row */
    }

    .port {
        width: 12px;
        height: 12px;
        background-color: #4b5263;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: crosshair;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
        border: 1px solid #3e4451;
    }

    .port:hover {
        background-color: #98c379;
        box-shadow: 0 0 6px rgba(152, 195, 121, 0.5);
        border-color: #7cb461;
    }
</style>
