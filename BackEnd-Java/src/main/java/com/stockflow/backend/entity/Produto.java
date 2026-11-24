package com.stockflow.backend.entity;
import jakarta.persistence.*;
@Entity
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false)
    public String nome;
    @Column(length = 2000)
    public String descricao;
    @Column(nullable = false)
    public String categoria;
    @Column(nullable = false)
    public Integer quantidade;
    @Column(nullable = false)
    public Integer estoqueMinimo;
    @Transient
    public boolean isEstoqueBaixo() {
        return quantidade != null && estoqueMinimo != null && quantidade <= estoqueMinimo;
    }
}
