<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { debugMode, debugLog } from "./lib/debugStore";
    import "./app.css";
    import Rack from "./Rack.svelte";
    import DevicePalette from "./DevicePalette.svelte";

    // --- STATE MANAGEMENT ---
    // Centralized state for the entire application.

    // 1. Devices available in the palette
    // A helper function to create switch configurations to keep the code DRY.
    function createSwitch(portCount) {
        const name = `1U ${portCount}-Port Switch`;
        const rackName = `1U ${portCount}P`;
        let getPortRow;

        if (portCount === 48) {
            // Special case for 48-port switch: 4 rows of 12
            getPortRow = (i) => Math.floor(i / 12);
        } else if (portCount === 12) {
            // Special case for 12-port switch: 2 rows of 6
            getPortRow = (i) => (i < 6 ? 0 : 1);
        } else if (portCount === 8) {
            // Single row for 8-port switch
            getPortRow = () => 0;
        } else {
            // Two rows for other switches (24)
            getPortRow = (i) => (i < portCount / 2 ? 0 : 1);
        }

        return {
            id: `p-sw-${portCount}`,
            name: name,
            rackName: rackName, // New property for rack display
            type: "switch",
            ports: Array.from({ length: portCount }, (_, i) => ({
                portRow: getPortRow(i),
                id: `p${i + 1}`,
                type: "ethernet",
            })),
        };
    }

    function createRouter(portCount) {
        const name = `1U ${portCount}-Port Router`;
        const rackName = `1U ${portCount}P`;
        let getPortRow;

        if (portCount === 24) {
            // Two rows of 12
            getPortRow = (i) => (i < 12 ? 0 : 1);
        } else if (portCount === 16) {
            // Two rows of 8
            getPortRow = (i) => (i < 8 ? 0 : 1);
        } else if (portCount === 12) {
            // Two rows of 6
            getPortRow = (i) => (i < 6 ? 0 : 1);
        } else {
            // Single row for 8-port
            getPortRow = () => 0;
        }

        return {
            id: `p-rtr-${portCount}`,
            name: name,
            rackName: rackName,
            type: "router",
            ports: Array.from({ length: portCount }, (_, i) => ({
                portRow: getPortRow(i),
                id: `p${i + 1}`,
                type: "ethernet",
            })),
        };
    }

    // 1. Devices available in the palette
    let paletteDevices = [
        createSwitch(8),
        createSwitch(16),
        createSwitch(24),
        createSwitch(48),
        createRouter(8),
        createRouter(12),
        createRouter(16),
        createRouter(24),
    ];

    // 2. Devices placed in the rack
    let placedDevices = [];

    // 3. Logical cable connections
    let cables = []; // Array of { from: { deviceId, portId }, to: { deviceId, portId } }

    // 4. State for the active cable drawing operation
    let drawingCable = false;
    let startPortInfo = null; // { deviceId, portId }
    let startPortCoords = { x: 0, y: 0 };
    let currentEndPoint = { x: 0, y: 0 };

    // --- CABLE RENDERING ---
    let svgElement;
    let renderedCables = []; // The view model for cables: { from: {x, y}, to: {x, y} }

    // Helper to get coordinates relative to the SVG container
    function getSvgCoordinates(clientX, clientY) {
        if (!svgElement) {
            debugLog(
                "App:SVG",
                "SVG element not available for coordinate calculation.",
            );
            return { x: 0, y: 0 };
        }
        const svgRect = svgElement.getBoundingClientRect();
        return {
            x: clientX - svgRect.left,
            y: clientY - svgRect.top,
        };
    }

    // Calculate statistics
    $: totalDevicesInRack = placedDevices.length;
    $: totalCables = cables.length;
    $: totalPorts = placedDevices.reduce(
        (sum, device) => sum + (device.ports?.length || 0),
        0,
    );
    $: usedPorts = cables.length * 2; // Each cable uses 2 ports
    $: availablePorts = totalPorts - usedPorts;
    $: rackUtilization = ((totalDevicesInRack / 48) * 100).toFixed(1); // 48U total capacity

    // Group devices by row for statistics
    $: devicesPerRow = [0, 1].map(
        (row) => placedDevices.filter((d) => d.row === row).length,
    );

    // This function runs after the DOM updates.
    // It finds the port elements and calculates their positions to render cables.
    $: {
        const newRenderedCables = [];
        for (const cable of cables) {
            const fromEl = document.querySelector(
                `[data-device-id="${cable.from.deviceId}"][data-port-id="${cable.from.portId}"]`,
            );
            const toEl = document.querySelector(
                `[data-device-id="${cable.to.deviceId}"][data-port-id="${cable.to.portId}"]`,
            );

            if (fromEl && toEl) {
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();

                newRenderedCables.push({
                    from: getSvgCoordinates(
                        fromRect.left + fromRect.width / 2,
                        fromRect.top + fromRect.height / 2,
                    ),
                    to: getSvgCoordinates(
                        toRect.left + toRect.width / 2,
                        toRect.top + toRect.height / 2,
                    ),
                });
            }
        }
        renderedCables = newRenderedCables;
        debugLog(
            "App:CableRender",
            "Updated rendered cables:",
            newRenderedCables.length,
            "from cables:",
            cables.length,
        );
    }

    // --- EVENT HANDLERS ---

    // A device has been dropped onto the rack
    function handleDeviceDrop(event) {
        const { row, stack, unit, droppedDevice } = event.detail;
        const isOccupied = placedDevices.some(
            (d) => d.row === row && d.stack === stack && d.unit === unit,
        );
        debugLog(
            "App:DeviceDrop",
            "Attempting to drop device:",
            droppedDevice,
            "at R:",
            row,
            "S:",
            stack,
            "U:",
            unit,
        );

        if (!isOccupied) {
            const newDeviceId = `r-sw-${Math.random().toString(36).substring(2, 9)}`;
            placedDevices = [
                ...placedDevices,
                {
                    ...droppedDevice,
                    id: newDeviceId, // Assign a new rack-specific ID
                    row,
                    stack,
                    unit,
                },
            ];
            debugLog(
                "App:DeviceDrop",
                "Device dropped successfully. New placedDevices:",
                placedDevices,
            );
        } else {
            debugLog(
                "App:DeviceDrop",
                `Unit R:${row} S:${stack} U:${unit} already occupied.`,
            );
        }
    }

    function handleDeviceRemove(event) {
        const deviceData = event.dataTransfer.getData("device");
        debugLog(
            "App:DeviceRemove",
            "Attempting to remove device. Data:",
            deviceData,
        );
        if (deviceData) {
            const droppedDevice = JSON.parse(deviceData);
            // Only remove if it's a device that was actually on the rack (it will have row/stack/unit properties)
            if (droppedDevice && droppedDevice.id && "row" in droppedDevice) {
                placedDevices = placedDevices.filter(
                    (d) => d.id !== droppedDevice.id,
                );
                // Also remove any cables connected to this device
                cables = cables.filter(
                    (c) =>
                        c.from.deviceId !== droppedDevice.id &&
                        c.to.deviceId !== droppedDevice.id,
                );
                debugLog(
                    "App:DeviceRemove",
                    "Device and associated cables removed. New placedDevices:",
                    placedDevices,
                );
            } else {
                debugLog(
                    "App:DeviceRemove",
                    "Dropped device is not a placed rack device or has no ID.",
                );
            }
        } else {
            debugLog(
                "App:DeviceRemove",
                "No device data found in dataTransfer.",
            );
        }
    }

    // User starts drawing a cable from a port
    function handlePortMouseDown(event) {
        event.preventDefault();
        const { deviceId, portId, x, y } = event.detail;
        drawingCable = true;
        startPortInfo = { deviceId, portId };
        startPortCoords = getSvgCoordinates(x, y);
        currentEndPoint = { ...startPortCoords };
        debugLog("App:CableDraw", "Cable drawing started:", {
            deviceId,
            portId,
            x,
            y,
            startCoords: startPortCoords,
        });
    }

    // Handle removing the last cable (keyboard shortcut)
    function handleRemoveLastCable(event) {
        debugLog(
            "App:CableRemove",
            "handleRemoveLastCable called. Event key:",
            event?.key,
            "Current cables:",
            cables.length,
        );
        if (cables.length > 0) {
            cables = cables.slice(0, -1);
            debugLog(
                "App:CableRemove",
                "Removed last cable. Remaining:",
                cables.length,
            );
            // Force update of rendered cables
            tick().then(() => {
                debugLog(
                    "App:CableRemove",
                    "After tick - cables:",
                    cables.length,
                    "renderedCables:",
                    renderedCables.length,
                );
            });
        }
    }

    // Handle keyboard shortcuts
    function handleKeyDown(event) {
        debugLog(
            "App:Keyboard",
            "Key pressed:",
            event.key,
            "Drawing cable:",
            drawingCable,
            "Target:",
            event.target,
        );
        // Delete or Backspace key removes the last cable
        // Only process if we're not currently drawing a cable
        if (
            !drawingCable &&
            (event.key === "Delete" || event.key === "Backspace") &&
            !event.target.matches("input")
        ) {
            event.preventDefault();
            handleRemoveLastCable(event);
        }
    }

    // Update the "rubber band" line as the user moves the mouse
    function handleGlobalMouseMove(event) {
        if (drawingCable) {
            currentEndPoint = getSvgCoordinates(event.clientX, event.clientY);
            // debugLog("App:CableDraw", "Mouse moved, currentEndPoint:", currentEndPoint); // Log less frequently if too noisy
        }
    }

    // User finishes drawing a cable
    function handleGlobalMouseUp(event) {
        debugLog(
            "App:CableDraw",
            "Mouse Up event detected. drawingCable:",
            drawingCable,
            "Event target:",
            event.target,
            "Event clientX/Y:",
            event.clientX,
            event.clientY,
        );
        if (!drawingCable) {
            debugLog("App:CableDraw", "Not drawing cable, ignoring mouseup.");
            return;
        }

        // Temporarily disable pointer events on SVG to find the element underneath
        if (svgElement) {
            svgElement.style.pointerEvents = "none";
        }

        // Now find the actual port element under the mouse
        const elementUnderMouse = document.elementFromPoint(
            event.clientX,
            event.clientY,
        );

        debugLog(
            "App:CableDraw",
            "Element under mouse with SVG disabled:",
            elementUnderMouse,
        );

        const endPortEl = elementUnderMouse
            ? elementUnderMouse.closest(".port")
            : null;

        // Re-enable pointer events on SVG - but first ensure drawingCable is false
        drawingCable = false;
        if (svgElement) {
            svgElement.style.pointerEvents = "none";
        }

        debugLog("App:CableDraw", "End port element detected:", endPortEl);

        if (endPortEl) {
            const endDeviceId = endPortEl.dataset.deviceId;
            const endPortId = endPortEl.dataset.portId;
            debugLog("App:CableDraw", "Cable ended on port:", {
                endDeviceId,
                endPortId,
                startPortInfo,
            });

            const isSamePort =
                startPortInfo.deviceId === endDeviceId &&
                startPortInfo.portId === endPortId;

            debugLog("App:CableDraw", "Same port check:", {
                isSamePort,
                startDevice: startPortInfo.deviceId,
                endDevice: endDeviceId,
                startPort: startPortInfo.portId,
                endPort: endPortId,
            });

            // Check if a cable already exists
            const cableExists = cables.some(
                (c) =>
                    (c.from.deviceId === startPortInfo.deviceId &&
                        c.from.portId === startPortInfo.portId &&
                        c.to.deviceId === endDeviceId &&
                        c.to.portId === endPortId) ||
                    (c.to.deviceId === startPortInfo.deviceId &&
                        c.to.portId === startPortInfo.portId &&
                        c.from.deviceId === endDeviceId &&
                        c.from.portId === endPortId),
            );

            debugLog("App:CableDraw", "Cable exists check:", {
                cableExists,
                existingCables: cables,
            });

            if (!isSamePort && !cableExists) {
                cables = [
                    ...cables,
                    {
                        from: startPortInfo,
                        to: { deviceId: endDeviceId, portId: endPortId },
                    },
                ];
                debugLog(
                    "App:CableDraw",
                    "Cable added successfully:",
                    cables[cables.length - 1],
                    "Total cables now:",
                    cables.length,
                );
            } else if (isSamePort) {
                debugLog("App:CableDraw", "Cannot connect port to itself.");
            } else if (cableExists) {
                debugLog(
                    "App:CableDraw",
                    "Cable already exists between these ports.",
                );
            }
        } else {
            debugLog(
                "App:CableDraw",
                "Cable not ended on a port, cancelling draw. Element under mouse:",
                document.elementFromPoint(event.clientX, event.clientY),
            );
        }

        // Reset drawing state (already set to false earlier)
        startPortInfo = null;
        debugLog(
            "App:CableDraw",
            "Drawing state reset. drawingCable:",
            drawingCable,
        );
    }

    onMount(() => {
        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("keydown", handleKeyDown);
        debugLog(
            "App:Lifecycle",
            "App mounted. Global mouse listeners and keyboard listeners attached.",
        );
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("keydown", handleKeyDown);
        debugLog(
            "App:Lifecycle",
            "App destroyed. Global mouse listeners and keyboard listeners removed.",
        );
    });
</script>

<main>
    <header class="main-header">
        <h1>Rack Visualizer</h1>
        <div class="header-controls">
            <label class="debug-control">
                <input type="checkbox" bind:checked={$debugMode} />
                <span>Debug Mode</span>
            </label>
            <span class="keyboard-hint">
                Press Delete/Backspace to remove cables
            </span>
        </div>
    </header>
    <div class="container">
        <div
            class="device-palette-wrapper"
            on:dragover|preventDefault
            on:drop={handleDeviceRemove}
        >
            <DevicePalette
                devices={paletteDevices}
                on:portmousedown={handlePortMouseDown}
            />
        </div>
        <Rack
            devices={placedDevices}
            on:portmousedown={handlePortMouseDown}
            on:devicedrop={handleDeviceDrop}
        />
    </div>

    <!-- SVG overlay for drawing cables. Renders from the `renderedCables` view model. -->
    <svg
        class="cable-svg"
        bind:this={svgElement}
        style="pointer-events: {drawingCable ? 'auto' : 'none'};"
    >
        <!-- Render existing cables -->
        {#each renderedCables as cable, i (`${cable.from.x}-${cable.from.y}-${cable.to.x}-${cable.to.y}-${i}`)}
            <line
                x1={cable.from.x}
                y1={cable.from.y}
                x2={cable.to.x}
                y2={cable.to.y}
                stroke="#98c379"
                stroke-width="3"
            />
        {/each}

        <!-- Render the cable being drawn (rubber-banding effect) -->
        {#if drawingCable}
            <line
                x1={startPortCoords.x}
                y1={startPortCoords.y}
                x2={currentEndPoint.x}
                y2={currentEndPoint.y}
                stroke="#e06c75"
                stroke-width="2"
                stroke-dasharray="5,5"
                style="pointer-events: none;"
            />
        {/if}
    </svg>

    <!-- Statistics Panel -->
    <div class="stats-panel" style="border-top: 2px solid;">
        <div class="stats-section">
            <h3>Rack Status</h3>
            <div class="stat-item">
                <span class="stat-label">Devices Installed:</span>
                <span class="stat-value">{totalDevicesInRack} / 48U</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Rack Utilization:</span>
                <span class="stat-value">{rackUtilization}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Row Distribution:</span>
                <span class="stat-value"
                    >R1: {devicesPerRow[0]} | R2: {devicesPerRow[1]}</span
                >
            </div>
        </div>

        <div class="stats-section">
            <h3>Connectivity</h3>
            <div class="stat-item">
                <span class="stat-label">Cables Connected:</span>
                <span class="stat-value">{totalCables}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Ports Used:</span>
                <span class="stat-value">{usedPorts} / {totalPorts}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Available Ports:</span>
                <span class="stat-value" class:warning={availablePorts < 10}
                    >{availablePorts}</span
                >
            </div>
        </div>

        <div class="stats-section">
            <h3>Quick Actions</h3>
            <div class="stat-actions">
                <button
                    on:click={() => {
                        if (confirm("Clear all cables?")) {
                            cables = [];
                            debugLog("App:Stats", "All cables cleared");
                        }
                    }}
                    disabled={cables.length === 0}
                >
                    Clear Cables
                </button>
                <button
                    on:click={() => {
                        if (confirm("Clear entire rack?")) {
                            placedDevices = [];
                            cables = [];
                            debugLog("App:Stats", "Rack cleared");
                        }
                    }}
                    disabled={placedDevices.length === 0}
                >
                    Clear Rack
                </button>
                <button
                    on:click={() => {
                        const config = {
                            devices: placedDevices,
                            cables: cables.map((c) => ({
                                from: {
                                    deviceId: c.from.deviceId,
                                    portId: c.from.portId,
                                },
                                to: {
                                    deviceId: c.to.deviceId,
                                    portId: c.to.portId,
                                },
                            })),
                            timestamp: new Date().toISOString(),
                        };
                        const blob = new Blob(
                            [JSON.stringify(config, null, 2)],
                            { type: "application/json" },
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `rack-config-${new Date().getTime()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        debugLog("App:Stats", "Configuration exported");
                    }}
                    disabled={placedDevices.length === 0}
                >
                    Export Config
                </button>
            </div>
        </div>
    </div>
</main>

<style>
    :global(body) {
        display: block;
        min-height: 100vh;
        background-color: #282c34;
        color: #abb2bf;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        margin: 0;
        padding: 0;
    }

    :global(main) {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .main-header {
        background-color: #21252b;
        border-bottom: 1px solid #181a1f;
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .main-header h1 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #e5c07b;
    }

    .header-controls {
        display: flex;
        gap: 2rem;
        align-items: center;
        font-size: 0.875rem;
    }

    .debug-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #abb2bf;
        cursor: pointer;
    }

    .debug-control input[type="checkbox"] {
        cursor: pointer;
    }

    .keyboard-hint {
        color: #5c6370;
    }

    .container {
        display: flex;
        flex: 1;
        gap: 1rem;
        padding: 1rem;
        min-height: 0;
    }

    .cable-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    .stats-panel {
        background-color: #21252b;
        color: #abb2bf;
        padding: 0.75rem 1.125rem;
        display: flex;
        justify-content: space-around;
        gap: 1.5rem;
        flex-shrink: 0;
        border-top: 1px solid #181a1f;
    }

    .stats-section {
        flex: 1;
    }

    .stats-section h3 {
        margin: 0 0 0.5rem 0;
        font-size: 0.6rem;
        font-weight: 600;
        color: #e5c07b;
        text-transform: uppercase;
        letter-spacing: 0.075em;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0;
        font-size: 0.75em;
        border-bottom: 1px solid #3e4451;
    }

    .stat-item:last-child {
        border-bottom: none;
    }

    .stat-label {
        color: #5c6370;
    }

    .stat-value {
        font-weight: bold;
        color: #abb2bf;
    }

    .stat-value.warning {
        color: #e06c75;
    }

    .stat-actions {
        display: flex;
        gap: 0.375rem;
        margin-top: 0.375rem;
    }

    .stat-actions button {
        flex: 1;
        padding: 0.375rem 0.5rem;
        background-color: #98c379;
        color: #282c34;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.7rem;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .stat-actions button:hover:not(:disabled) {
        background-color: #7cb461;
    }

    .stat-actions button:disabled {
        background-color: #4b5263;
        cursor: not-allowed;
        opacity: 0.5;
    }

    .device-palette-wrapper {
        width: 322px; /* Adjust as needed */
        flex-shrink: 0;
        padding: 1rem; /* Consistent padding */
        background-color: #21252b; /* Match existing dark theme */
        border-right: 1px solid #181a1f;
        overflow-y: auto; /* Allow scrolling if palette content overflows */
    }
</style>
