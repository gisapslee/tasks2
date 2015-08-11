tasksController = function() {
	var taskPage;
	var initialised = false;	
	
	function errorLogger(errorCode, errorMessage) {
		console.log(errorCode +':'+ errorMessage);
	}
	return {
		init : function(page, retorno) {
			storageEngine.init(function(){
				storageEngine.initObjectStore('task', function() {},errorLogger)
				retorno();	
			}, errorLogger);
			
			if (!initialised) {
				taskPage = page;
				$(taskPage).find('[required="required"]').prev('label').append('<span>*</span>').children('span').addClass('required');
				$(taskPage).find('tbody tr:even').addClass( 'even');
				
				$(taskPage).find('#btnAddTask').click( function(evt) {
					evt.preventDefault();
					$(taskPage ).find('#taskCreation').removeClass('not');
				});
				$(taskPage).find('tbody tr' ).click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ).toggleClass( 'rowHighlight');
				});
				
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete('task', $(evt.target).data().taskId, 
							function() {
								$(evt.target).parents('tr').remove(); 
								tasksController.taskCounter();
							}, errorLogger);
					}
				);				

				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
					function(evt) { 
						$(taskPage).find('#taskCreation').removeClass('not');
						storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
							$(taskPage).find('form').fromObject(task);
						}, errorLogger);
					}
				);
				//TAREFA 2: Ativar o botão de limpar tarefa (simplesmente limpar o conteúdo do formulário)
				$(taskPage).find('#clearTask').click(function(){
					$("#taskForm")[0].reset(); //Seleciona o formulário "taskForm" da árvore DOM e o reseta;
				});
				
				$(taskPage).find('#saveTask').click(function(evt) {
					evt.preventDefault();
					if ($(taskPage).find('form').valid()) {
						var task = $(taskPage).find('form').toObject();		
						storageEngine.save('task', task, function() {
							$(taskPage).find('#tblTasks tbody').empty();
							tasksController.loadTasks();
							tasksController.taskCounter();
							$(':input').val('');
							$(taskPage).find('#taskCreation').addClass('not');
						}, errorLogger);
					}
				});
				//TAREFA 4: Marcar tarefas como completadas (usando strikethrough no texto)
				//Busca a tarefa que foi clicada; 
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', function(evt) { 
					storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
					//seta como completada -  taskCompleted=true;
					task.taskCompleted = true;
					//Salva a tarefa com as alterações realizadas;
					storageEngine.save('task', task, function() {
							//recarrega as tarefas;
							tasksController.loadTasks();							
						},errorLogger);
					}, errorLogger);
				});
				initialised = true;
			}},
			//TAREFA 1: atualizar a contagem no rodapé ao carregar e quando modificar quantidade de tarefas
			taskCounter : function(){
				/*	Para verificar a quantidade de tarefas completadas foi utilizada a quantidade de 
					vezes que a classe "taskCompleted" é aplicada, viu-se que aplica-se em 3 tds 
					logo a quantidade será multiplo de 3, daí para saber o total divide-se essa quantidade por 3;
				*/
				var completado = $(".taskCompleted").length/3; 
				/* Para saber a quantidade total de tarefas ainda não completadas subtrai-se a quantidade 
				total de tarefas do valor encontrado por tarefas completadas;				
				*/
				var contador = $("#tblTasks tbody tr").length-completado;
				/* Exibe o valor das tarefas na tela inicial*/
				$('footer').find('#taskCount').text(contador);
			},
			//TAREFA 3: Destacar tarefas que já passaram do deadline
			deadline:function() {
				// Percorre as linhas da tabela #tblTasks;
				$.each($(taskPage).find('#tblTasks tbody tr'), function(id, linha) {
				// procura o campo [datetime] e atribui o seu valor a variavel dtRow;
				var dtRow = Date.parse($(linha).find('[datetime]').text());
				/* Compara a data verificada com a data atual(hoje) e verifica se já passou, daí aplica-se a casse 'overdue'. 
				   Caso contrário, verifica se a mesma está a ocorrer daqui 4 dias e aplica-se a classe 'warning';
				*/
				if(dtRow.compareTo(Date.today()) < 0) {
					$(linha).addClass("overdue");
				} else if (dtRow.compareTo((4).days().fromNow()) <= 0) {
					$(linha).addClass("warning");
				}});
			},
			//TAREFA 5: Exibir as tarefas ordenadas na aplicação
			ordenador: function(tasks){
				//utiliza o sort ordenar as tarefas comparando as datas encontradas. 
				tasks.sort(function(d1, d2) {
					data1 = Date.parse(d1.requiredBy); //transforma o valor passado em data
					data2 = Date.parse(d2.requiredBy);//transforma o valor passado em data
					return data1.compareTo(data2); //compara as duas datas
				});	
			},
			loadTasks : function() {
				$(taskPage).find('#tblTasks tbody').empty();
				storageEngine.findAll('task', 
					function(tasks) {
						$.each(tasks, function(index, task) {
							if (!task.taskCompleted) {
								task.taskCompleted = false;
							}
							$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));							
						});	
						tasksController.taskCounter();
						tasksController.deadline();						
						tasksController.ordenador(tasks);
					}, 
				errorLogger);				
			}
		}}();