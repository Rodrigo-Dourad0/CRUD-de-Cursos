package br.com.ifba.curso.controller;

import br.com.ifba.curso.entity.Curso;
import br.com.ifba.curso.service.CursoIService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author almei
 */
@CrossOrigin //0. Aqui é pra a api receber requisição de qualquer um
@RestController // 1. Mudamos de @Controller para @RestController
@RequestMapping("/api/cursos") // 2. Definimos uma URL base para todos os métodos de curso
public class CursoController { // <-- 3. Removemos o "implements CursoIController"

    @Autowired
    private CursoIService cursoIService;

    @GetMapping
    public List<Curso> findAll() {
        return cursoIService.findAll();
    }

    @GetMapping("/{id}")
    public Curso findById(@PathVariable Long id) { // 4. @PathVariable pega o {id} da URL
        return cursoIService.findById(id);
    }


    @GetMapping("/buscar")
    public List<Curso> findByNome(@RequestParam String nome) { // 5. @RequestParam pega o parâmetro da URL
        return cursoIService.findByNome(nome);
    }


    @PostMapping
    public Curso save(@RequestBody Curso curso) { // 6. @RequestBody converte o JSON em objeto
        return cursoIService.save(curso);
    }


    @PutMapping("/{id}")
    public Curso update(@PathVariable Long id, @RequestBody Curso cursoDetalhes) {

        // 1. Busca o curso existente no banco de dados
        Curso cursoExistente = cursoIService.findById(id);

        // 2. Atualiza TODOS os campos com os dados que vieram do front-end
        cursoExistente.setNome(cursoDetalhes.getNome());
        cursoExistente.setCodigo(cursoDetalhes.getCodigo());
        cursoExistente.setCargaHoraria(cursoDetalhes.getCargaHoraria());
        cursoExistente.setAtivo(cursoDetalhes.isAtivo());

        // 3. Salva o curso agora com TODOS os dados atualizados
        return cursoIService.update(cursoExistente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { // 7. Mudamos o método para ser mais RESTful
        // Para usar o seu service.delete(Curso), precisamos primeiro buscar o curso
        try {
            Curso curso = cursoIService.findById(id);
            if (curso != null) {
                cursoIService.delete(curso);
                return ResponseEntity.ok().build(); // Retorna 200 OK
            } else {
                return ResponseEntity.notFound().build(); // Retorna 404 Não Encontrado
            }
        } catch (RuntimeException ex) {
            // Se findById lança exceção (ex: EntityNotFound),
            // o Spring vai tratar como um erro (o que é bom)
            // Se ele retornar null (como checado acima), tratamos como 404.
            return ResponseEntity.notFound().build();
        }
    }
}
