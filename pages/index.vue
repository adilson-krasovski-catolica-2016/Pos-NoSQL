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
          :items="produtos" 
          :rules="produtoRules" 
          label="Produto" 
        />
        <v-text-field 
          v-model="quantidade" 
          :rules="quantidadeRules" 
          type="number" 
          label="Quantidade" 
          required 
        />
        <v-btn 
          :disabled="!calculo" 
          @click="submit">
          Calcular
        </v-btn>
        <v-btn 
          @click="clear">
          Limpar
        </v-btn>
      </v-form>
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
      quantidade: "",
      quantidadeRules: [
        v => !!v || "Quantidade deve ser selecionada",
        v => v < 1 || "Informe a quantidade"
      ],
      produto: "",
      produtoRules: [v => !!v || "Produto deve ser selecionado"],
    }),
    computed: {
      produtos_disponiveis: function () {
        if(!this.produtos) {
          return this.produtos
        }
        return available
      }
    },

      methods: {
          submit() {
              if (this.$refs.form.validate()) {
                  axios.post("/api/submit", {
                      produto: this.produto,
                      quantidade: this.quantidade
                  });
              }
          },
          clear() {
              this.$refs.form.reset();
          }
      }
  };
</script>
