const MAIN = {
  tasksList: [],

  //função que irá executar todas os outros métodos do objeto
  init: function () {
    this.domSelectors();
    this.bindEvents();
    this.getLocalStorage();
    this.buildTaskList();
  },

  //função que é responsável por buscar os elementos na DOM
  domSelectors: function () {
    this.$checkButtons = document.querySelectorAll(".check"); //(cria-se um array de tags)
    this.$inputTask = document.querySelector("#inputTask");
    this.$spanError = document.querySelector("#error");
    this.$list = document.querySelector("#list");
    this.$removeButtons = document.querySelectorAll(".btn-remove"); //(cria-se um array de tags)
  },

  //função que é responsável por gerar as interações de eventos
  bindEvents: function () {
    const self = this;

    this.$checkButtons.forEach(function (button) {
      button.addEventListener("click", self.Events.checkButtonClick);
    });

    this.$inputTask.onkeypress = self.Events.inputTaskEnter.bind(this);

    this.$removeButtons.forEach(function (button) {
      button.addEventListener("click", self.Events.removeTaskClick);
    });
  },

  //função responsável por buscar os valores salvos no LocalStorage, a partir do "inputTaskEnter" linha 54
  getLocalStorage: function () {
    const tasksStoraged = localStorage.getItem("tasks");

    this.tasksList = JSON.parse(tasksStoraged);
  },

  //função responsável por criar a lista de tarefas a partir dos dados inseridos no array 'tasksList' (linha 02),que foi gerado através do "getLocalStorage" linha38
  buildTaskList: function () {
    let html = "";

    this.tasksList.forEach((listItem) => {
      html += `
        <li>
          <div class="check"></div>
          <label for="" class="task">${listItem.taskName}</label>
          <button class="btn-remove"><i class="fas fa-trash-alt"></i></button>
        </li>
       `;
    });

    this.$list.innerHTML = html;

    this.domSelectors();
    this.bindEvents();
  },

  //seção responsável por armazenar todas as funções de eventos isolados
  Events: {
    checkButtonClick: function (e) {
      const li = e.target.parentNode;
      const isDone = li.classList.contains("done");

      //transforma o botão em toogle on-off pra classe 'done' => caso exista ele remove, caso não exista ele adiciona
      isDone ? li.classList.remove("done") : li.classList.add("done");
    },

    inputTaskEnter: function (e) {
      const key = e.key;
      let input = e.target;
      let task = input.value;

      if (key === "Enter" && task.length > 0) {
        this.$spanError.innerText = "";

        this.$list.innerHTML += `
            <li>
              <div class="check"></div>
              <label for="" class="task">${task}</label>
              <button class="btn-remove"><i class="fas fa-trash-alt"></i></button>
            </li>
         `;

        input.value = "";

        this.domSelectors();
        this.bindEvents();

        const SAVEDTASKS = localStorage.getItem("tasks");
        const SAVEDTASKSOBJ = JSON.parse(SAVEDTASKS);

        const TASKOBJ = [{ taskName: task }, ...SAVEDTASKSOBJ];
        localStorage.setItem("tasks", JSON.stringify(TASKOBJ));
      }

      if (!task.length && key === "Enter") {
        this.$spanError.innerHTML = `<i class="fas fa-exclamation-circle"></i> Preencha a próxima tarefa corretamente.`;
      }
    },

    removeTaskClick: function (e) {
      console.log(e.target.parentElement.parentElement);
      const li = e.target.parentElement.parentElement;

      li.classList.add("removed");

      setTimeout(() => {
        li.classList.add("hidden");
      }, 500);
    },
  },
};

MAIN.init();
