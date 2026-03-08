const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['crop', 'material', 'tool', 'gift', 'craftable'],
        required: true },
    season: { type: String }, // only for crops
    growthTime: { type: Number }, // days to grow (if crop)
    sellPrice: { type: Number, required: true },
    craftingRecipe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],  
});

module.exports = mongoose.model('Item', ItemSchema);