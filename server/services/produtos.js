const mongoose = require('mongoose');
const service = require('feathers-mongoose');

const Schema = mongoose.Schema;
const ProdutoSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
const Model = mongoose.model('Produto', ProdutoSchema);

module.exports = {
  service: service({ Model }),
  Model
}