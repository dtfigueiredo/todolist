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
        const SELF = this;
        this.$checkButtons.forEach(function (button) {
            button.addEventListener("click", SELF.Events.checkButtonClick);
        });
        this.$inputTask.addEventListener("keypress", SELF.Events.inputTaskEnter.bind(this));
        this.$removeButtons.forEach(function (button) {
            button.addEventListener("click", SELF.Events.removeTaskClick.bind(SELF));
        });
    },
    //função responsável por buscar os valores salvos no LocalStorage, a partir do "inputTaskEnter" linha 54
    getLocalStorage: function () {
        const TASKSSTORAGED = localStorage.getItem("tasks");
        this.tasksList = JSON.parse(TASKSSTORAGED);
    },
    //função responsável por criar a lista de tarefas a partir dos dados inseridos no array 'tasksList' (linha 02),que foi gerado através do "getLocalStorage" linha38
    buildTaskList: function () {
        let html = "";
        this.tasksList.forEach((listItem) => {
            html += `
        <li>
          <div class="check"></div>
          <label for="" class="task">${listItem.taskName}</label>
          <button class="btn-remove" data-task="${listItem.taskName}"><i class="fas fa-trash-alt"></i></button>
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
            const LI = e.target.parentNode;
            const ISDONE = LI.classList.contains("done");
            //transforma o botão em toogle on-off pra classe 'done' => caso exista ele remove, caso não exista ele adiciona
            ISDONE ? LI.classList.remove("done") : LI.classList.add("done");
        },
        inputTaskEnter: function (e) {
            const KEY = e.key;
            let input = e.target;
            let task = input.value;
            if (KEY === "Enter" && task.length > 0) {
                this.$list.innerHTML += `
            <li>
              <div class="check"></div>
              <label for="" class="task">${task}</label>
              <button class="btn-remove" data-task="${task}"><i class="fas fa-trash-alt"></i></button>
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
        },
        removeTaskClick: function (e) {
            const LI = e.target.parentElement.parentElement;
            const TASKTOBEREMOVED = e.target.parentElement.dataset["task"];
            const NEWTASKSLIST = this.tasksList.filter((item) => item.taskName !== TASKTOBEREMOVED);
            localStorage.setItem("tasks", JSON.stringify(NEWTASKSLIST));
            LI.classList.add("removed");
            setTimeout(() => {
                LI.classList.add("hidden");
            }, 500);
        },
    },
};
MAIN.init();
