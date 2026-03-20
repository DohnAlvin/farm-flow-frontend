export const FieldEntity = {
    name: "Field",
    
    // Statuses for the field lifecycle
    statuses: [
        { value: "fallow", label: "Fallow" },
        { value: "preparing", label: "Preparing" },
        { value: "planted", label: "Planted" },
        { value: "growing", label: "Growing" },
        { value: "harvesting", label: "Harvesting" }
    ],

    // Common soil classifications
    soilTypes: [
        { value: "clay", label: "Clay" },
        { value: "sandy", label: "Sandy" },
        { value: "loam", label: "Loam" },
        { value: "silt", label: "Silt" },
        { value: "peat", label: "Peat" }
    ],

    // Default object for field-related forms
    defaults: {
        name: "",
        size_acres: "", // Changed to empty string for easier input handling
        crop: "",
        status: "fallow",
        planting_date: "", // Expected: YYYY-MM-DD
        expected_harvest_date: "", // Expected: YYYY-MM-DD
        soil_type: "loam",
        notes: ""
    }
};