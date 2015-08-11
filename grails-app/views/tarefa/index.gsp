<!DOCTYPE html> 
<html lang="en"> 
<head> 
<meta charset="utf-8"> 
<title>Tarefas</title> 
<link rel="stylesheet" type="text/css" href="<g:createLinkTo dir='css' file='02-tasks.css'/>" 
media="screen" /> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='jquery.js'/>"></script> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='date.js'/>"></script> 

<g:set var="entityName" value="${message(code: 'tarefa.label', default: 'Tarefa')}" />
<title><g:message code="default.create.label" args="[entityName]" /></title>

</head> 
<body> 
	<header> 
		<span>Lista de Tarefas</span> 
	</header> 
	<main id="taskPage"> 
		<section id="taskCreation">
			
			<g:hasErrors bean="${tarefaInstance}">
			<ul class="errors" role="alert">
				<g:eachError bean="${tarefaInstance}" var="error">
				<li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
				</g:eachError>
			</ul>
			</g:hasErrors>
			 
			<g:form action="save" class="taskForm">
				<div> 
					<label>Tarefa</label> 
					<g:textField name="nome" required="required" value="${tarefaInstance?.nome}"
					lass="large" placeholder="Estudar e programar" 
					maxlength="200"/>
				</div> 
				<div> 
					<label>Finalizar até</label> 
					<g:datePicker name="deadline" precision="day"  value="${tarefaInstance?.deadline}"  />
				</div> 

				<div> 
					<label>Categoria</label> 
					<g:select id="categoria" name="categoria.id" from="${tasks.Categoria.list()}" optionKey="id" required="" value="${tarefaInstance?.categoria?.id}" class="many-to-one"/> 
					<a href="javascript:abrir('/tasks/categoria/create');">
						<img src="<g:createLinkTo dir='images' file='plus.png'/>" height="20" width="20">
						Adicionar Categoria
					</a>
				</div> 
				<nav>
					<g:submitButton value="Salvar Tarefa" name="save"/>
					<a href="#" id="clearTask">Limpar</a>
				</nav>
			</g:form>

		</section> 
		<section> 
			<table id="tblTasks"> 
				<colgroup> 
					<col width="35%"> 
					<col width="11%"> 
					<col width="14%"> 
					<col width="40%"> 
				</colgroup> 
				<thead> 
					<tr> 
						<th>Nome</th> 
						<th>Deadline</th> 
						<th>Categoria</th> 
						<th>Ações</th> 
					</tr> 
				</thead> 
				<tbody> 
					 <g:each in="${tarefaInstanceList}" status="i" var="tarefaInstance">
						<tr>
							<td <g:if test="${tarefaInstance.completada}">class="taskCompleted"</g:if>>
								${fieldValue(bean: tarefaInstance, field: "nome")}
							</td>
							<td <g:if test="${tarefaInstance.completada}">class="taskCompleted"</g:if>>
								<g:formatDate date="${tarefaInstance.deadline}" format="dd/MM/yyyy"/>
							</td>

							<td <g:if test="${tarefaInstance.completada}">class="taskCompleted"</g:if>>
								${fieldValue(bean: tarefaInstance, field: "categoria")}
							</td>
							<td>
								<nav>
									
									<g:if test="${!tarefaInstance.completada}">
										<g:link class="editRow" action="edit" resource="${tarefaInstance}">Editar</g:link>
										
										<g:link class="completeRow" action="complete" resource="${tarefaInstance}" method="PUT">Completar</g:link>
									</g:if>	
										<g:form url="[resource:tarefaInstance, action:'delete']" method="DELETE" class="delete">
										     <g:actionSubmit id="deleteRow" action="delete" value="Deletar" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />	
										</g:form>

								</nav>
							</td>
						</tr>
					</g:each>
				</tbody> 
			</table> 
		</section> 
	</main> 
	<footer>Você tem ${tasks.Tarefa.count} tarefas</footer> 
	
</body>
<script type="text/javascript">
	$(document).ready(function() {
		$(taskPage).find('#clearTask').click(function(){
			$(".taskForm")[0].reset(); 
		});
	}); 

	function abrir(URL) {
 
	  var width = 600;
	  var height = 400;
	 
	  var left = 450;
	  var top = 100;
	 
	  window.open(URL,'janela', 'width='+width+', height='+height+', top='+top+', left='+left+', scrollbars=yes, status=no, toolbar=no, location=no, directories=no, menubar=no, resizable=no, fullscreen=no');
	}
</script>
</html>