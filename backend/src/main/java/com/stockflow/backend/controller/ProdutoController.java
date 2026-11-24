package com.stockflow.backend.controller;
import com.stockflow.backend.dto.*;
import com.stockflow.backend.entity.Produto;
import com.stockflow.backend.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoService service;
    public ProdutoController(ProdutoService service) { this.service = service; }
    @GetMapping
    public List<Produto> listar() { return service.listar(); }
    @GetMapping("/{id}")
    public Produto buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody ProdutoRequest d) { return service.criar(d); }
    @PutMapping("/{id}")
    public Produto editar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest d) { return service.editar(id, d); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { service.excluir(id); }
    @PatchMapping("/{id}/movimentacao")
    public Produto movimentar(@PathVariable Long id, @Valid @RequestBody MovimentacaoRequest d) { return service.movimentar(id, d); }
}
