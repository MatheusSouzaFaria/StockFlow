package com.stockflow.backend.dto;
import jakarta.validation.constraints.*;
public record MovimentacaoRequest(
    @NotBlank(message="Tipo obrigatório") @Pattern(regexp="ENTRADA|SAIDA", message="Tipo deve ser ENTRADA ou SAIDA") String tipo,
    @NotNull(message="Quantidade obrigatória") @Positive(message="Quantidade deve ser positiva") Integer quantidade
) {}
