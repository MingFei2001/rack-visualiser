<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let device;

    function handleDragStart(event) {
        event.dataTransfer.setData("device", JSON.stringify(device));
    }
</script>

<div
    class="device"
    draggable="true"
    on:dragstart={handleDragStart}
    role="button"
    tabindex="0"
>
    <span class="device-name">{device.name}</span>
    {#if device.ports && device.ports.length > 0}
        <div class="ports-container">
            {#each device.ports as port (port.id)}
                <div
                    class="port"
                    data-device-id={device.id}
                    data-port-id={port.id}
                    title={port.id}
                    on:mousedown={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        dispatch("portmousedown", {
                            deviceId: device.id,
                            portId: port.id,
                            x,
                            y,
                        });
                    }}
                >
                    <!-- Port visual indicator -->
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .device {
        height: 100%;
        padding: 0 0.5rem;
        border: 1px solid #181a1f;
        background-color: #34495e;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        color: #ecf0f1;
        box-sizing: border-box;
        transition: all 0.2s ease;
    }

    .device:hover {
        background-color: #4a627d;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .device-name {
        flex-grow: 1;
        text-align: left;
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 0.5rem;
        color: #abb2bf;
    }

    .ports-container {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
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
