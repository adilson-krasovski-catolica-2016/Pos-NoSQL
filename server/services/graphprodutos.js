var feathersApp = null;

module.exports = {
  async find(params) {
    var session = neo4jDriver.session();
    return session
      .run(`match(pr:Produto {name:{produto}})-[b:FEITODE]->(c:MateriaPrima) 
            return c.name as material, sum(b.quantidade)*{quantidade} as quantidade`, 
      {
        produto: params.query.produto,
        quantidade: parseInt(params.query.quantidade)
      })
      .then(result => {
        session.close();
        var materiais = []
        result.records.forEach(c => {
          var material = {}
          for(var item = 0; item < c.length; item++) {
            material[c.keys[item]] = c._fields[item]
          }
          materiais.push(material)
          })
        return materiais
      })
      .catch(function (error) {
        console.log('Error creating node:', error)
        return []
      });
  },
  setup(app, path) {
    feathersApp = app
  }
}