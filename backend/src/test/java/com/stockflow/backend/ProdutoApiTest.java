package com.stockflow.backend;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.backend.repository.ProdutoRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:stockflowtest;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
class ProdutoApiTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired ProdutoRepository repo;
    static final String API = "/api/produtos";
    static final String PRODUTO = "{\"nome\":\"Caderno\",\"descricao\":\"Pautado\",\"categoria\":\"Papelaria\",\"quantidade\":10,\"estoqueMinimo\":3}";
    @BeforeEach void limpar() { repo.deleteAll(); }
    private String criar() throws Exception {
        var resposta = mvc.perform(post(API).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.estoqueBaixo").value(false)).andReturn();
        return API + "/" + mapper.readTree(resposta.getResponse().getContentAsString()).get("id").asLong();
    }
    private org.springframework.test.web.servlet.ResultActions mover(String rota, String tipo, int quantidade) throws Exception {
        return mvc.perform(patch(rota+"/movimentacao").contentType(MediaType.APPLICATION_JSON)
            .content("{\"tipo\":\""+tipo+"\",\"quantidade\":"+quantidade+"}"));
    }
    @Test void crudEMovimentacoes() throws Exception {
        String rota = criar();
        mvc.perform(get(API)).andExpect(status().isOk()).andExpect(jsonPath("$[0].nome").value("Caderno"));
        mvc.perform(get(rota)).andExpect(status().isOk()).andExpect(jsonPath("$.quantidade").value(10));
        mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(PRODUTO.replace("Pautado","Universitário")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.descricao").value("Universitário"));
        mover(rota,"ENTRADA",2).andExpect(status().isOk()).andExpect(jsonPath("$.quantidade").value(12));
        mover(rota,"SAIDA",2).andExpect(status().isOk()).andExpect(jsonPath("$.quantidade").value(10));
        mover(rota,"SAIDA",8).andExpect(status().isOk()).andExpect(jsonPath("$.quantidade").value(2)).andExpect(jsonPath("$.estoqueBaixo").value(true));
        mover(rota,"SAIDA",3).andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").value("Estoque insuficiente"));
        mvc.perform(get(rota)).andExpect(jsonPath("$.quantidade").value(2));
        mover(rota,"ENTRADA",1).andExpect(jsonPath("$.estoqueBaixo").value(true));
        mover(rota,"SAIDA",3).andExpect(jsonPath("$.quantidade").value(0));
        mvc.perform(delete(rota)).andExpect(status().isNoContent());
        mvc.perform(get(rota)).andExpect(status().isNotFound());
        mover(rota,"ENTRADA",1).andExpect(status().isNotFound());
        mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(PRODUTO)).andExpect(status().isNotFound());
        mvc.perform(delete(rota)).andExpect(status().isNotFound());
    }
    @Test void validacoesECors() throws Exception {
        String rota = criar();
        for (String invalido : new String[]{"{}", PRODUTO.replace("Caderno", " "), PRODUTO.replace("Papelaria", ""), PRODUTO.replace("10", "-1"), PRODUTO.replace("3}", "-1}"), PRODUTO.replace("10", "1.5")}) {
            mvc.perform(post(API).contentType(MediaType.APPLICATION_JSON).content(invalido)).andExpect(status().isBadRequest());
            mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(invalido)).andExpect(status().isBadRequest());
        }
        mover(rota,"ENTRADA",0).andExpect(status().isBadRequest());
        mover(rota,"SAIDA",-1).andExpect(status().isBadRequest());
        mover(rota,"OUTRO",1).andExpect(status().isBadRequest());
        mover(rota,"ENTRADA",Integer.MAX_VALUE).andExpect(status().isBadRequest());
        mvc.perform(patch(rota+"/movimentacao").contentType(MediaType.APPLICATION_JSON).content("{\"tipo\":\"SAIDA\",\"quantidade\":1.5}"))
            .andExpect(status().isBadRequest());
        mvc.perform(get(rota)).andExpect(jsonPath("$.quantidade").value(10));
        mvc.perform(options(rota+"/movimentacao").header("Origin","http://localhost:8081").header("Access-Control-Request-Method","PATCH"))
            .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin","*"));
    }
}
