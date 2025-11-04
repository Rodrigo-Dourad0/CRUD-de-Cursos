/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package br.com.ifba.curso.service;


import br.com.ifba.curso.entity.Curso;
import br.com.ifba.curso.repository.CursoRepository;
import br.com.ifba.infrastructure.util.StringUtil;
import java.util.List;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Service
public class CursoService implements CursoIService {
    
    private final CursoRepository cursoRepository;
    
    private static final Logger log = LoggerFactory.
                                getLogger(CursoService.class);
    
    
    
    public CursoService(CursoRepository cursoRepository){
        this.cursoRepository = cursoRepository;
    }
    
    
    // Salva um novo curso após validações
    @Override
    public Curso save(Curso curso) throws RuntimeException {
        if (curso == null) {
            throw new RuntimeException("Dados do curso não preenchidos.");
        } else if (curso.getId() != null) {
            throw new RuntimeException("Curso já existente no banco de dados.");
        } else if (StringUtil.isEmpty(curso.getNome())) {
            throw new RuntimeException("Nome do curso não pode estar vazio.");
        }
        
        log.info("Salvando o Objeto Curso!");
        return cursoRepository.save(curso);
    }
    
    // Atualiza um curso existente após validar ID
    @Override
    public Curso update(Curso curso) throws RuntimeException {
        if (curso == null || curso.getId() == null) {
            throw new RuntimeException("Curso inválido para atualização.");
        }

        log.info("Objeto Curso atuzlizado!");
        return cursoRepository.save(curso);
    }
    
    // Remove um curso após validar ID
    @Override 
    public void delete(Curso curso) throws RuntimeException {
        if (curso == null || curso.getId() == null) {
            throw new RuntimeException("Curso inválido para exclusão.");
        }
        
        log.info("Objeto Curso deletado!");
        cursoRepository.delete(curso);
    }
    
    // Retorna todos os cursos
    @Override
    public List<Curso> findAll() throws RuntimeException {
        
        log.info("Listando todos os Objetos Curso!");
        return cursoRepository.findAll();
    }
    
    // Busca curso por ID com validação
     @Override
    public Curso findById(Long id) throws RuntimeException {
        if (id == null) {
            throw new RuntimeException("ID inválido.");
        }
        
        log.info("Buscando Curso pelo ID");
        return cursoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Curso não encontrado."));
    }

    // Busca cursos pelo nome com validação
    @Override
    public List<Curso> findByNome(String nome) throws RuntimeException {
        if (StringUtil.isEmpty(nome)) {
            throw new RuntimeException("Nome inválido para busca.");
        }
        
        log.info("Buscando Curso pelo nome");
        return cursoRepository.findByNomeContainingIgnoreCase(nome.trim());
    }
}
