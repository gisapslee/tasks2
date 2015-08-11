storageEngine = function() {
  var database;
  var objectStores;
  return {
    init : function(successCallback, errorCallback) {
      if (window.indexedDB) {
        var request = indexedDB.open(window.location.hostname+'DB');
		request.onsuccess = function(event) {
		  database = request.result;
          successCallback(null);
        }
        request.onerror = function(event) {
          errorCallback('storage_nao_inicializado', 'Não foi possível inicializar o storage.');
        }
      } else {
        errorCallback('storage_api_nao_suportada', 'A API web storage não é suportada');
      }     
    },
    initObjectStore  : function(type, successCallback, errorCallback) {
        if (!database) {
        errorCallback('storage_api_nao_inicializada', 'Storage API não inicializada.');
      }
        var existe = false;
        $.each(database.objectStoreNames, function(i, v) {
            if (v == type) {
              existe = true;
            }
        });
        if (existe) {
          successCallback(null);
        } else {
          var version = database.version+1;
          database.close();
          var request = indexedDB.open(window.location.hostname+'DB', version);
        request.onsuccess = function(event) {
          successCallback(null);
        }
        request.onerror = function(event) {
          errorCallback('storage_nao_inicializada', 'Não foi possível inicializar o storage.');
        }
        request.onupgradeneeded = function(event) {
          database = event.target.result;
          var objectStore = database.createObjectStore(type, { keyPath: "id", autoIncrement: true });         
        }
        }
      },
      save : function(type, obj, successCallback, errorCallback) { 
        if (!database) {
			errorCallback('storage_api_nao_inicializada', 'Storage API não inicializada.');          
        }
        if (!obj.id) {
          delete obj.id ;
        } else {
          obj.id = parseInt(obj.id)
        }
        var tx = database.transaction([type], "readwrite");
        tx.oncomplete = function(event) {
          successCallback(obj);
        };
        tx.onerror = function(event) {
          errorCallback('transaction_error', 'Não foi possivel armazenar o objeto.');
        };
        var objectStore = tx.objectStore(type);
        var request = objectStore.put(obj);
        request.onsuccess = function(event) {
          obj.id = event.target.result
        }
        request.onerror = function(event) {
          errorCallback('object_not_stored', 'Não foi possivel armazenar o objeto.');
        };
      },
      findAll : function(type, successCallback, errorCallback) { 
        if (!database) {
			errorCallback('storage_api_nao_inicializada', 'Storage API não inicializada.');             
        }
        var result = [];
        var tx = database.transaction(type);
        var objectStore = tx.objectStore(type);
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            successCallback(result);
          }
        };        
      },
      delete : function(type, id, successCallback, errorCallback) { 
        var obj = {};
        obj.id = id;
        var tx = database.transaction([type], "readwrite");
        tx.oncomplete = function(event) {
          successCallback(id);
        };
        tx.onerror = function(event) {
          console.log(event);
		  errorCallback('transaction_error', 'Não foi possivel armazenar o objeto.');
        };
        var objectStore = tx.objectStore(type);       
        var request = objectStore.delete(id);
        request.onsuccess = function(event) {       
        }
        request.onerror = function(event) {
          errorCallback('object_not_stored', 'Não foi possivel deletar o objeto.');
        };
      },
      findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
        if (!database) {
			errorCallback('storage_api_nao_inicializada', 'Storage API não inicializada.');       		  
        }
        var result = [];
        var tx = database.transaction(type);
        var objectStore = tx.objectStore(type);
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            if (cursor.value[propertyName] == propertyValue) {
              result.push(cursor.value);
            }
            cursor.continue();
          } else {
            successCallback(result);
          }
        };
      },
    findById : function (type, id, successCallback, errorCallback)  {
      if (!database) {
		errorCallback('storage_api_nao_inicializada', 'Storage API não inicializada.');             
      }
      var tx = database.transaction([type]);
      var objectStore = tx.objectStore(type);
      var request = objectStore.get(id);
        request.onsuccess = function(event) {
        successCallback(event.target.result);
      }
      request.onerror = function(event) {
        errorCallback('object_not_stored', 'Não foi possivel localizar o objeto.');
      };        
    }
  }
}();
