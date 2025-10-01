# Rack Visualizer: Mobile Rack Layout Planning Tool

## Project Overview

The Rack Visualizer is a web-based application meticulously designed for system integrators and network engineers. It provides an intuitive platform to accurately visualize and plan network rack layouts *before* physical deployment. This tool is particularly useful for optimizing equipment placement, ensuring efficient space utilization, and streamlining the installation process for both temporary and permanent setups. Our initial focus is on facilitating deployments within a 2-row horizontal storage shelf system, commonly found in environments like WWT.

## Key Features

The application currently empowers users to:

*   **Interactive Rack Visualization**: Effortlessly view and interact with a simulated 2-row rack configuration. Each row is designed to accommodate 4 stacks of 6 1U devices, offering a substantial 48U total capacity for comprehensive planning.
*   **Dynamic Device Palette**: Access a readily available palette of network devices, now including 1U switches with **24 ports (arranged in two rows of 12)**. This palette will be expanded in future releases to include a wider array of equipment.
*   **Intuitive Drag-and-Drop Functionality**: Seamlessly drag devices from the palette and precisely position them into any valid slot on the rack. Devices can also be easily removed from the rack by dragging them back to the palette, allowing for flexible reconfigurations.
*   **Virtual Cable Management**: Plan intricate network connectivity by drawing virtual cables between the ports of different devices on the rack. This feature aids in visualizing cable routing and port utilization.

## How to Use

Once the application is running (or deployed), you can:

1.  **Adding Devices**:
    *   Drag a device from the `Device Palette` on the left sidebar.
    *   Drop the device into an available slot on the `Rack View`.
2.  **Removing Devices**:
    *   Drag an existing device from the `Rack View`.
    *   Drop the device back onto the `Device Palette` to remove it from the rack.
3.  **Connecting Devices with Cables**:
    *   Click on a port on the first device you wish to connect.
    *   Click on a port on the second device. A virtual cable will be drawn between the two selected ports.
    *   (Future: Cable removal functionality will be added.)

## Technology Stack

Built with modern web technologies for a smooth and responsive user experience:

*   **Framework**: [Svelte](https://svelte.dev/) - A powerful and reactive framework that compiles your components into highly efficient vanilla JavaScript.
*   **Build Tool**: [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
*   **Styling**: [Bootstrap](https://getbootstrap.com/) - Utilized for rapid and responsive UI development.
*   **Graphics**: SVG - Scalable Vector Graphics are used for rendering all rack elements, devices, and cables, ensuring crisp and responsive visuals across all display sizes.

## High-Level Component Architecture

The application is structured around a clear and modular component-based architecture:

*   `App.svelte`: The central application component, serving as the primary entry point and orchestrating the overall layout.
*   `RackView.svelte`: Manages the rendering of the 2-row rack structure and handles all user interactions within the rack space, including device placement and cable drawing.
*   `DevicePalette.svelte`: A dedicated sidebar component that displays and manages the collection of draggable network devices available for placement.
*   `Device.svelte`: Represents an individual network device, encapsulating its visual representation, drag behavior, and port information.
*   `Cable.svelte`: Renders the visual representation of a virtual cable connecting two device ports, including its path, styling, and interactions.

## Getting Started (Development)

To set up and run the project locally for development:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/MingFei2001/rack_visualizer.git
    cd rack_visualizer
    ```
    (Replace `YOUR_USERNAME` with your GitHub username if you have already pushed it, otherwise it will be the default remote URL you will set up later)
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will start a local development server, typically accessible at `http://localhost:5173/`.

## Future Enhancements (Roadmap)

We are continuously working to improve the Rack Visualizer. Here are some key features planned for future releases:

*   **Support for Diverse Rack Types**: Expand functionality to include various rack sizes, orientations, and customizable configurations.
*   **Persistence (Save/Load Configurations)**: Implement the ability to save current rack layouts and load previously saved configurations from local files or browser storage.
*   **Expanded Device Library**: Introduce a broader range of network device types, including routers, patch panels, servers, and devices with different U sizes.
*   **Export Functionality**: Enable users to export their finalized rack layouts as high-quality images (PNG/JPG) or PDF documents for documentation and sharing.
*   **Basic Inventory Management**: Integrate a simple system for managing device inventory, allowing users to track available equipment.
*   **Cable Removal Functionality**: Provide an intuitive method for users to remove individual cables from the rack.
*   **Enhanced User Feedback & Error Handling**: Implement more robust error handling and provide clearer, more informative feedback to the user during interactions.
*   **Port-to-Port Connectivity Rules**: Introduce intelligent rules for valid cable connections based on port types and device compatibility.
*   **Enhanced Visual Feedback**: Improve visual cues for drag-and-drop operations, active ports, and cable drawing states.
*   **Editable Device Properties**: Allow users to edit device attributes (e.g., name, port labels, IP addresses) directly on the rack for more detailed planning.

## Contributing

We welcome contributions to the Rack Visualizer project! If you're interested in improving this tool, please feel free to:

*   Fork the repository.
*   Create a new branch for your features or bug fixes.
*   Submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

**[Rack Visualizer](https://github.com/YOUR_USERNAME/rack_visualizer)**
