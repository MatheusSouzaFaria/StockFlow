package com.stockflow.backend.service;
// Regra pura: fácil de testar sem Spring ou banco de dados.
public final class RegraEstoque {
    private RegraEstoque() {}
    public static int calcular(int atual, String tipo, int quantidade) {
        if (atual < 0 || quantidade <= 0) throw new IllegalArgumentException("Quantidade inválida");
        if (!"ENTRADA".equals(tipo) && !"SAIDA".equals(tipo))
            throw new IllegalArgumentException("Tipo deve ser ENTRADA ou SAIDA");
        long saldo = "ENTRADA".equals(tipo) ? (long) atual + quantidade : (long) atual - quantidade;
        if (saldo < 0) throw new IllegalArgumentException("Estoque insuficiente");
        if (saldo > Integer.MAX_VALUE) throw new IllegalArgumentException("Saldo excede limite");
        return (int) saldo;
    }
}
