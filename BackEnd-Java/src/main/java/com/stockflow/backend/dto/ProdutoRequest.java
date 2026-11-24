package com.stockflow.backend.dto;
import jakarta.validation.constraints.*;
public record ProdutoRequest(
    @NotBlank(message="Nome obrigatório") @Size(max=255) String nome,
    @Size(max=2000) String descricao,
    @NotBlank(message="Categoria obrigatória") @Size(max=255) String categoria,
    @NotNull(message="Quantidade obrigatória") @PositiveOrZero(message="Quantidade não pode ser negativa") Integer quantidade,
    @NotNull(message="Estoque mínimo obrigatório") @PositiveOrZero(message="Estoque mínimo não pode ser negativo") Integer estoqueMinimo
) {}
