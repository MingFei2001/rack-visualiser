import { writable } from 'svelte/store';

// Initialize with debugMode off by default
export const debugMode = writable(false);

// Centralized logging function
export function debugLog(source, ...args) {
    debugMode.subscribe(isDebug => {
        if (isDebug) {
            console.log(`[DEBUG - ${source}]`, ...args);
        }
    })(); // Immediately invoke the subscribe to get current value
}

// Optional: You could add a debug level here if needed for more fine-grained control
// export const debugLevel = writable(0); // 0: off, 1: info, 2: verbose

// export function debugLog(source, level, ...args) {
//     debugLevel.subscribe(currentLevel => {
//         if (currentLevel >= level) {
//             console.log(`[DEBUG - ${source}]`, ...args);
//         }
//     })();
// }
