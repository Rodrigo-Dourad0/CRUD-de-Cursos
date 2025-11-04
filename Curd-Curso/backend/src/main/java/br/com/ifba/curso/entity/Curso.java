/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package br.com.ifba.curso.entity;

import br.com.ifba.infrastructure.entity.PersistenceEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 *
 * @author almei
 */

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
public class Curso extends PersistenceEntity implements Serializable {
        
    
    @Column (name= "nome", nullable = false)
    private String nome;
    
    @Column (name= "codigo_curso", nullable = false)
    private String codigo;
    
    @Column (name= "carga_horaria", nullable = false)
    private int cargaHoraria;
    
    @Column (name= "ativo")
    private boolean ativo;


}

