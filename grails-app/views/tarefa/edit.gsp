<!DOCTYPE html> 
<html lang="en"> 
<head> 
<meta charset="utf-8"> 
<title>Tarefas</title> 
<link rel="stylesheet" type="text/css" href="<g:createLinkTo dir='css' file='02-tasks.css'/>" 
media="screen" /> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='jquery.js'/>"></script> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='jquery-tmpl.js'/>"></script> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='jquery-serialization.js'/>"></script> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='tasks-controller.js'/>"></script> 
<script type="text/javascript" src= "<g:createLinkTo dir='js' file='jquery.validate.js'/>"></script> 
<script type="text/javascript" src="<g:createLinkTo dir='js' file='date.js'/>"></script> 

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
			
			<g:form url="[resource:tarefaInstance, action:'update']" method="PUT" >
				<g:hiddenField name="version" value="${tarefaInstance?.version}" />

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
				</div> 
				<nav>
					<fieldset class="buttons">
						<g:submitButton value="Salvar Tarefa" name="update"/>
					</fieldset>
				</nav>
			</g:form>
		</section> 
		
	</main> 
</body> 
</html>
