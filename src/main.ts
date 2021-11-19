type task = {
  taskName: string;
};

const main = {
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
    this.$btnSubmit = document.querySelector("#btn-submit");
    this.$list = document.querySelector("#list");
    this.$removeButtons = document.querySelectorAll(".btn-remove"); //(cria-se um array de tags)
  },

  //função que é responsável por gerar as interações de eventos
  bindEvents: function () {
    const self = this;

    this.$checkButtons.forEach((button) => {
      button.addEventListener("click", this.Events.checkButtonClick);
    });

    this.$inputTask.addEventListener(
      "keypress",
      self.Events.inputTaskEnter.bind(this)
    );

    this.$btnSubmit.addEventListener(
      "click",
      self.Events.inputTaskClick.bind(this)
    );

    this.$removeButtons.forEach(function (button) {
      button.addEventListener("click", self.Events.removeTaskClick.bind(self));
    });
  },

  //função responsável por buscar os valores salvos no LocalStorage, a partir do "inputTaskEnter" linha 75
  getLocalStorage: function () {
    const tasksStoraged = JSON.parse(localStorage.getItem("tasks"));
    this.tasksList = tasksStoraged || [];
  },

  buildHtmlLi: function (inputedTask) {
    return `
          <li>
            <div class="check"></div>
            <label for="" class="task">${inputedTask}</label>
            <button class="btn-remove" data-task="${inputedTask}"><i class="fas fa-trash-alt"></i></button>
          </li>
       `;
  },

  //função responsável por criar a lista de tarefas a partir dos dados inseridos no array 'tasksList' (linha 02),que foi gerado através do "getLocalStorage" linha 39
  buildTaskList: function () {
    let html = "";

    this.tasksList.forEach((listItem) => {
      html += this.buildHtmlLi(listItem.taskName);
    });

    this.$list.innerHTML = html;

    this.domSelectors();
    this.bindEvents();
  },

  //seção responsável por armazenar todas as funções de eventos isolados
  Events: {
    checkButtonClick: function (e) {
      const liElement = e.target.parentNode;
      const isDone = liElement.classList.contains("done");

      //transforma o botão em toogle on-off pra classe 'done' => caso exista ele remove, caso não exista ele adiciona
      isDone
        ? liElement.classList.remove("done")
        : liElement.classList.add("done");
    },

    inputTaskEnter: function (e) {
      const inputKey = e.key;
      let input = e.target;
      let task = input.value;

      if (inputKey === "Enter" && task?.length > 0) {
        this.buildHtmlLi(task);
        location.reload();
        input.value = "";

        this.domSelectors();
        this.bindEvents();

        const savedTasks = localStorage.getItem("tasks") || "{}";
        const savedTasksObj = JSON.parse(savedTasks);

        const taskObj: task[] = [{ taskName: task }, ...savedTasksObj];
        localStorage.setItem("tasks", JSON.stringify(taskObj));
      }
    },

    inputTaskClick: function (e) {
      let input = e.target.previousElementSibling;
      let task = input.value;

      if (task?.length > 0) {
        this.buildHtmlLi(task);
        location.reload();
        input.value = "";

        this.domSelectors();
        this.bindEvents();

        const savedTasks = localStorage.getItem("tasks") || "{}";
        const savedTasksObj = JSON.parse(savedTasks);

        const taskObj: task[] = [{ taskName: task }, ...savedTasksObj];
        localStorage.setItem("tasks", JSON.stringify(taskObj));
      }
    },

    removeTaskClick: function (e) {
      const liElement = e.target.parentElement.parentElement;
      const taskToBeRemoved = e.target.parentElement.dataset["task"];

      const newTasksList = this.tasksList.filter(
        (item: task) => item.taskName !== taskToBeRemoved
      );

      localStorage.setItem("tasks", JSON.stringify(newTasksList));

      liElement.classList.add("removed");

      setTimeout(() => {
        liElement.classList.add("hidden");
      }, 500);
    },
  },
};

main.init();
