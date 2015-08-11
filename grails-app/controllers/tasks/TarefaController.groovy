package tasks



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = false)
class TarefaController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def complete(Tarefa tarefaInstance) {
        def tarefa = tarefaInstance
        tarefa?.completada = Boolean.TRUE
        tarefaInstance.save flush:true
        redirect action:"index", method:"POST"
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Tarefa.list(params), model:[tarefaInstanceCount: Tarefa.count()]
    }

    def show(Tarefa tarefaInstance) {
        respond tarefaInstance
    }

    def create() {
        respond new Tarefa(params)
    }

    @Transactional
    def save(Tarefa tarefaInstance) {
        if (tarefaInstance == null) {
            notFound()
            return
        }

        if (tarefaInstance.hasErrors()) {
            respond tarefaInstance.errors, view:'create'
            return
        }

        tarefaInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'tarefa.label', default: 'Tarefa'), tarefaInstance.id])
                redirect action:"index", method:"GET"
            }
            '*' { respond tarefaInstance, [status: CREATED] }
        }
    }

    def edit(Tarefa tarefaInstance) {
        respond tarefaInstance
    }

    @Transactional
    def update(Tarefa tarefaInstance) {
        if (tarefaInstance == null) {
            notFound()
            return
        }

        if (tarefaInstance.hasErrors()) {
            respond tarefaInstance.errors, view:'edit'
            return
        }

        tarefaInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Tarefa.label', default: 'Tarefa'), tarefaInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ respond tarefaInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Tarefa tarefaInstance) {

        if (tarefaInstance == null) {
            notFound()
            return
        }

        tarefaInstance.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Tarefa.label', default: 'Tarefa'), tarefaInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarefa.label', default: 'Tarefa'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
