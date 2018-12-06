var feathersApp = null;

module.exports = {
  async find(params) {
    var session = neo4jDriver.session();
    return session
      .run(`match(p:Pedido) return collect(p.name)`)
      .then(result => {
        session.close()
        return result.records._fields
      })
      .catch(function (error) {
        console.log('Error creating node:', error)
        return []
      });
  },
  async get(id,params) {
    var session = neo4jDriver.session();
    return session
      .run(`match(p:Pedido {name:{id_pedido}})-[a:POSSUI]->(pr:Produto)-[b:FEITODE]->(c:MateriaPrima) 
              return c.name as material, sum(a.quantidade * b.quantidade) as quantidade`,
              {
              id_pedido:id
              } 
      )
      .then(result => {
        console.log(result.records)
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