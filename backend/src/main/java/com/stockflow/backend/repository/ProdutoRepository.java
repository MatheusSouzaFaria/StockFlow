package com.stockflow.backend.repository;
import com.stockflow.backend.entity.Produto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Evita que duas movimentações simultâneas usem o mesmo saldo antigo.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Produto p where p.id = :id")
    Optional<Produto> buscarParaAlterar(@Param("id") Long id);
}
