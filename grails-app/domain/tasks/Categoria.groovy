package tasks

class Categoria {
	String descricao

    static constraints = {
    	descricao(blank: false, unique: true)
    }
    String toString(){
    	return descricao
    }
}
