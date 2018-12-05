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
          v-model="produto" 
          :items="produtos.map(d => d.name)" 
          :rules="produtoRules" 
          label="Produto" 
        />
        <v-text-field 
          v-model="quantidade" 
          :rules="quantidadeRules" 
          type="number" 
          label="Quantidade" 
          required 
          @change="update()" 
        />
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
      <v-card v-if="exibir_lista_materiais">
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
     asyncData(app) {
      return app.$axios.get('/produtos')
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
      exibir_lista_materiais:false,
      materiais: "",
      quantidade: "",
      quantidadeRules: [
        v => !!v || "Quantidade deve ser selecionada",
        v => v > 0 || "Informe a quantidade"
      ],
      produto: "",
      produtoRules: [v => !!v || "Produto deve ser selecionado"],
    }),
    methods: {
      update() {
        if (this.$refs.form.validate()) {
          this.$axios.get('/graphprodutos?produto=' + this.produto +'&quantidade='+this.quantidade )
          .then(result => {
            this.materiais = result.data
            this.exibir_lista_materiais = true
          })
        }else{
          this.materiais = []
          this.exibir_lista_materiais = false
        }
      },
      clear() {
        this.exibir_lista_materiais = false
        this.$refs.form.reset();
        this.materiais = []
      }
    }
  };
</script>
