export const FarmTaskEntity = {
    name: "FarmTask",
    
    // Enums for dropdowns/select inputs
    // These should match the 'choices' in your Django models.py
    categories: [
        { value: "planting", label: "Planting" },
        { value: "irrigation", label: "Irrigation" },
        { value: "fertilizing", label: "Fertilizing" },
        { value: "pest_control", label: "Pest Control" },
        { value: "harvesting", label: "Harvesting" },
        { value: "feeding", label: "Feeding" },
        { value: "veterinary", label: "Veterinary" },
        { value: "maintenance", label: "Maintenance" },
        { value: "other", label: "Other" }
    ],
    
    priorities: ["low", "medium", "high", "urgent"],
    
    statuses: ["pending", "in_progress", "completed", "cancelled"],
  
    // Default object for forms
    defaults: {
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        status: "pending",
        due_date: "", // Use YYYY-MM-DD format for Django's DateField
        assigned_to: null, // Set to null because Django expects an ID (ForeignKey)
        related_field: null // Set to null because Django expects an ID (ForeignKey)
    }
};