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
      .run(`match(pedido:Pedido {name:{id_pedido}})-[possui:POSSUI]->(produto:Produto)-[feito:FEITODE]->(materia:MateriaPrima) 
              WITH produto ,  possui, materia , sum(possui.quantidade)*sum(feito.quantidade) as quantidade_materia 
              WITH { produto : produto.name , quantidade : toInteger(possui.quantidade) , materiais : collect({material : materia.name, quantidade : toInteger(quantidade_materia)})} as prod
              return collect(prod)`,
              {
              id_pedido:id
              } 
      )
      .then(result => {
        return result.records[0]._fields[0]
      })
      .catch(function (error) {
        console.log('Error creating node:', error)
        return []
      })
      .finally(function() { session.close(); });
  },
  setup(app, path) {
    feathersApp = app
  }
}