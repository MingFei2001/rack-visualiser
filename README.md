# Rack Visualizer: Intuitive Network Rack Layout Planning

**Plan your network rack deployments with ease and precision before ever touching a physical device.**

The Rack Visualizer is a modern web-based application meticulously crafted for **system integrators** and **network engineers**. It offers an intuitive, interactive platform to design, visualize, and plan complex network rack layouts, optimizing **equipment placement**, ensuring **efficient space utilization**, and streamlining the entire **installation process** for both temporary and permanent setups.

Our initial focus is on supporting deployments within a **2-row horizontal storage shelf system**, a common configuration found in various professional environments, including those at WWT.

---

## ✨ Key Features

The application currently empowers you with a robust set of functionalities:

*   **Interactive Rack Visualization** 🖥️
    *   Effortlessly view and interact with a simulated 2-row rack configuration.
    *   Each row is designed to accommodate 4 stacks of 6 1U devices, offering a substantial **48U total capacity** for comprehensive planning.

*   **Dynamic Device Palette** 📦
    *   Access a readily available palette of common network devices.
    *   Currently includes **1U switches with 24 ports**, intelligently arranged in two rows of 12 for clear visibility. This palette is easily expandable for future device types.

*   **Intuitive Drag-and-Drop Functionality** 🖱️
    *   Seamlessly drag devices from the palette and precisely position them into any valid slot on the rack.
    *   Devices can be easily removed from the rack by dragging them back to the palette, allowing for flexible reconfigurations.

*   **Virtual Cable Management** 🔗
    *   Plan intricate network connectivity by drawing virtual cables between the ports of different devices directly on your rack layout.
    *   This feature aids in visualizing cable routing, managing port utilization, and preventing connectivity errors during physical deployment.

---

## 🚀 How to Use

Get started with your rack planning in just a few steps:

1.  **Adding Devices**:
    *   Select a device from the **Device Palette** on the left sidebar.
    *   Drag and drop the device into an available slot on the **Rack View** area.
2.  **Removing Devices**:
    *   To remove an existing device from the **Rack View**, simply drag it back to the **Device Palette**.
3.  **Connecting Devices with Cables**:
    *   Click on a port on the first device you wish to connect.
    *   Then, click on a port on the second device. A virtual cable will be drawn between the two selected ports, visualizing your connection.
    *   *(Note: Cable removal functionality is planned for a future update.)*

---

## 🛠️ Technology Stack

Built with cutting-edge web technologies to ensure a smooth, reactive, and efficient user experience:

*   **Frontend Framework**: **[Svelte](https://svelte.dev/)**
    *   A radical new approach to building user interfaces that compiles your components into highly efficient vanilla JavaScript, resulting in blazing-fast applications.
*   **Build Tool**: **[Vite](https://vitejs.dev/)**
    *   A next-generation frontend tooling that provides an extremely fast development server and optimized build process.
*   **Styling**: **[Bootstrap](https://getbootstrap.com/)**
    *   Utilized for rapid and consistent UI development, ensuring a clean, responsive, and functional interface.
*   **Graphics Rendering**: **SVG (Scalable Vector Graphics)**
    *   Used for rendering all rack elements, network devices, and cable connections, ensuring crisp, interactive, and responsive visuals across all display sizes and resolutions.

---

## 🏗️ High-Level Component Architecture

The application is structured around a clear, modular, and maintainable component-based architecture:

*   `App.svelte`: The central application component, serving as the primary entry point and orchestrating the overall layout and state management.
*   `RackView.svelte`: Manages the rendering of the 2-row rack structure and handles all user interactions within the rack space, including device placement and cable drawing.
*   `DevicePalette.svelte`: A dedicated sidebar component that displays and manages the collection of draggable network devices available for placement.
*   `Device.svelte`: Represents an individual network device, encapsulating its visual representation, drag behavior, and port information.
*   `Cable.svelte`: Renders the visual representation of a virtual cable connection between two device ports, handling its path, styling, and basic interactions.

---

## 🏁 Getting Started (Development)

To set up and run the project locally for development, follow these simple steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/MingFei2001/rack_visualizer.git
    cd rack_visualizer
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    The application will typically be accessible in your browser at `http://localhost:5173/` (or another port if 5173 is already in use).

---

## 🔮 Future Enhancements (Roadmap)

We are continuously working to improve and expand the capabilities of the Rack Visualizer. Here are some key features planned for future releases:

*   [ ] **Support for Diverse Rack Types**: Expand functionality to include various rack sizes, orientations (e.g., vertical racks), and fully customizable configurations.
*   [ ] **Persistence (Save/Load Configurations)**: Implement the ability to save current rack layouts and load previously designed configurations from local files or browser storage.
*   [ ] **Expanded Device Library**: Introduce a broader range of network device types, including routers, patch panels, servers, different U sizes, and custom device definitions.
*   [ ] **Export Functionality**: Enable users to export their finalized rack layouts as high-quality images (PNG/JPG) or professional PDF documents for documentation and sharing.
*   [ ] **Basic Inventory Management**: Integrate a simple system for managing device inventory, allowing users to track available equipment and its status.
*   [ ] **Cable Removal Functionality**: Provide an intuitive method for users to selectively remove individual cables from the rack.
*   [ ] **Enhanced User Feedback & Error Handling**: Implement more robust error handling and provide clearer, more informative feedback to the user during all interactions.
*   [ ] **Port-to-Port Connectivity Rules**: Introduce intelligent rules for valid cable connections based on port types, device compatibility, and network topology.
*   [ ] **Enhanced Visual Feedback**: Improve visual cues for drag-and-drop operations (e.g., ghosting, drop indicators), active ports, and cable drawing states.
*   [ ] **Editable Device Properties**: Allow users to edit device attributes (e.g., name, port labels, IP addresses, serial numbers) directly on the rack for more detailed planning.

---

## 🤝 Contributing

We welcome and appreciate contributions to the Rack Visualizer project! If you're interested in improving this tool or adding new features, please feel free to:

*   Fork the repository.
*   Create a new branch for your features or bug fixes.
*   Submit a pull request with your changes.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

**[Explore the Rack Visualizer on GitHub](https://github.com/MingFei2001/rack_visualizer)**