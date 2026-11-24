package com.stockflow.backend.service;
import com.stockflow.backend.dto.*;
import com.stockflow.backend.entity.Produto;
import com.stockflow.backend.repository.ProdutoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
public class ProdutoService {
    private final ProdutoRepository repo;
    public ProdutoService(ProdutoRepository repo) { this.repo = repo; }
    public List<Produto> listar() { return repo.findAll(Sort.by("id")); }
    private ResponseStatusException naoEncontrado() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado");
    }
    public Produto buscar(Long id) { return repo.findById(id).orElseThrow(this::naoEncontrado); }
    private Produto buscarParaAlterar(Long id) { return repo.buscarParaAlterar(id).orElseThrow(this::naoEncontrado); }
    private Produto preencher(Produto p, ProdutoRequest d) {
        p.nome = d.nome().trim();
        p.descricao = d.descricao();
        p.categoria = d.categoria().trim();
        p.quantidade = d.quantidade();
        p.estoqueMinimo = d.estoqueMinimo();
        return p;
    }
    public Produto criar(ProdutoRequest d) { return repo.save(preencher(new Produto(), d)); }
    @Transactional
    public Produto editar(Long id, ProdutoRequest d) { return repo.save(preencher(buscarParaAlterar(id), d)); }
    @Transactional
    public void excluir(Long id) { repo.delete(buscarParaAlterar(id)); }
    @Transactional
    public Produto movimentar(Long id, MovimentacaoRequest d) {
        Produto p = buscarParaAlterar(id);
        try { p.quantidade = RegraEstoque.calcular(p.quantidade, d.tipo(), d.quantidade()); }
        catch (IllegalArgumentException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage()); }
        return repo.save(p);
    }
}
