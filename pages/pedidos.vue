<template>
  <v-layout 
    column 
    justify-center 
    align-center>
    <v-flex 
      xs12 
      sm8 
      md6>
      <v-form 
        ref="form" 
        v-model="calculo" 
        lazy-validation>
        <v-select 
          v-model="pedido" 
          :items="pedidos" 
          label="Pedidos" 
        />
        <v-btn 
          @click="update">
          Concultar
        </v-btn>
        <v-btn 
          @click="clear">
          Limpar
        </v-btn>
      </v-form>
    </v-flex>
    <v-flex
      xs12
      sm6        
      md4>
      <v-card v-if="exibir_pedido">
        <v-card-title><h4>{{ produto }}</h4></v-card-title>
        <v-divider/>
        <v-list dense>
          <v-list-tile 
            v-for="material in materiais" 
            :key="material.material">
            <v-list-tile-content>{{ material.material }}:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ material.quantidade }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from "axios";
  export default {
    asyncData(context) {
      return context.$axios.get('/pedidos')
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.error(error)
          return []
        })
        .then(records => {
          var result = {
            produtos: records
          }
          return result
        })
    },
    data: () => ({
      calculo: true,
      exibir_pedido:false,
      materiais: "",
      quantidade: "",
      quantidadeRules: [
        v => !!v || "Quantidade deve ser selecionada",
        v => v > 0 || "Informe a quantidade"
      ],
      produto: "",
      pedidos:["pedido1", "pedido2"],
      produtoRules: [v => !!v || "Produto deve ser selecionado"],
    }),
    methods: {
      update() {
        this.$axios.get('/pedidos/'+ this.pedido)
          .then(result => {
            console.log(result)
            this.materiais = result.data
            this.exibir_pedido = true
          })
      },
      clear() {
        this.exibir_pedido = false
        this.$refs.form.reset();
        this.materiais = []
      }
    }
  };
</script>
