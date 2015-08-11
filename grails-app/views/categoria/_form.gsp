<%@ page import="tasks.Categoria" %>



<div class="fieldcontain ${hasErrors(bean: categoriaInstance, field: 'descricao', 'error')} required">
	<label for="descricao">
		<g:message code="categoria.descricao.label" default="Descricao" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="descricao" required="" value="${categoriaInstance?.descricao}"/>

</div>

