export const TransactionEntity = {
    name: "Transaction",
    
    // Core financial direction
    types: [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" }
    ],

    // Budgeting categories
    categories: [
        { value: "seeds", label: "Seeds" },
        { value: "fertilizer", label: "Fertilizer" },
        { value: "pesticides", label: "Pesticides" },
        { value: "labor", label: "Labor" },
        { value: "equipment", label: "Equipment" },
        { value: "veterinary", label: "Veterinary" },
        { value: "feed", label: "Feed" },
        { value: "transport", label: "Transport" },
        { value: "crop_sale", label: "Crop Sale" },
        { value: "livestock_sale", label: "Livestock Sale" },
        { value: "milk_sale", label: "Milk Sale" },
        { value: "other", label: "Other" }
    ],

    paymentMethods: [
        { value: "cash", label: "Cash" },
        { value: "mpesa", label: "M-Pesa" },
        { value: "bank_transfer", label: "Bank Transfer" },
        { value: "cheque", label: "Cheque" }
    ],

    // Default object for financial records
    defaults: {
        type: "expense",
        category: "other",
        amount: "", // Set to empty string for cleaner input handling in React
        description: "",
        payment_method: "cash",
        mpesa_reference: "", // Optional, only used for M-Pesa payments
        date: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD
    }
};