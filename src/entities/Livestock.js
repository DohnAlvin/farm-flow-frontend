export const LivestockEntity = {
    name: "Livestock",
    
    // Animal types for categorization
    types: [
        { value: "cattle", label: "Cattle" },
        { value: "goats", label: "Goats" },
        { value: "sheep", label: "Sheep" },
        { value: "poultry", label: "Poultry" },
        { value: "pigs", label: "Pigs" },
        { value: "rabbits", label: "Rabbits" },
        { value: "donkeys", label: "Donkeys" },
        { value: "other", label: "Other" }
    ],

    genders: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" }
    ],

    // Critical for "Smart" monitoring
    healthStatuses: [
        { value: "healthy", label: "Healthy" },
        { value: "sick", label: "Sick" },
        { value: "under_treatment", label: "Under Treatment" },
        { value: "quarantined", label: "Quarantined" }
    ],

    // Default object for livestock records
    defaults: {
        animal_type: "cattle",
        tag_id: "", // Unique identifier (RFID/Ear tag)
        name: "",
        breed: "",
        gender: "female",
        date_of_birth: "", // Expected: YYYY-MM-DD
        health_status: "healthy",
        weight_kg: "", // Empty string for cleaner numeric inputs
        notes: ""
    }
};