package tasks

class Tarefa {
	String nome
	Date deadline
	Categoria categoria
	Boolean completada

    static constraints = {
    	nome(blank: false)
    	completada(default: Boolean.FALSE, blank: true, nullable:true)
    }

    static mapping = {
    	categoria lazy: false
    }
}
