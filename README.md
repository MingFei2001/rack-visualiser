# Rack Visualizer

## 1. Project Overview

This project is a web-based application designed to help visualize network rack layouts before physical deployment. It is intended for system integrators and network engineers who need to plan temporary or permanent equipment installations. The initial use case is for planning deployments in a 2-row horizontal storage shelf system at WWT.

## 2. Core Features

The application currently allows users to:

-   **Visualize a Rack:** Displays a specific 2-row rack configuration, where each row can hold 4 stacks of 6 1U devices (total 48U capacity).
-   **Device Palette:** Provides a list of available network devices (initially 1U switches) that can be used.
-   **Drag and Drop:** Users can drag devices from the palette and drop them into valid slots on the rack. Devices can also be dragged off the rack and back to the palette to remove them.
-   **Cable Plotting:** Users can draw virtual cables between device ports to plan connectivity.

## 3. Technology Stack

-   **Framework:** Svelte
-   **Build Tool:** Vite
-   **Styling:** Bootstrap (for rapid UI development)
-   **Graphics:** SVG for rendering racks, devices, and cables.

## 4. High-Level Component Structure

The application is built using a component-based architecture:

-   `App.svelte`: The main application component and entry point.
-   `RackView.svelte`: Renders the main 2-row rack structure and handles interactions within the rack.
-   `DevicePalette.svelte`: A sidebar component containing the list of draggable devices.
-   `Device.svelte`: Represents a single, draggable network device.
-   `Cable.svelte`: Represents a cable drawn between two devices.

## 5. Getting Started (Development)

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## 6. Future Enhancements (Roadmap)

-   [ ] Support for multiple and configurable rack types.
-   [ ] Save and load rack configurations to a local file or browser storage.
-   [ ] Add a wider variety of device types (e.g., routers, patch panels, different U sizes).
-   [ ] Export rack layout to an image (PNG/JPG) or PDF document.
-   [ ] A simple inventory management system for devices.
-   [ ] Cable removal functionality.
-   [ ] Improved error handling and user feedback.