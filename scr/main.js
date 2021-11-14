var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var MAIN = {
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
        this.$list = document.querySelector("#list");
        this.$removeButtons = document.querySelectorAll(".btn-remove"); //(cria-se um array de tags)
    },
    //função que é responsável por gerar as interações de eventos
    bindEvents: function () {
        var SELF = this;
        this.$checkButtons.forEach(function (button) {
            button.addEventListener("click", SELF.Events.checkButtonClick);
        });
        this.$inputTask.addEventListener("keypress", SELF.Events.inputTaskEnter.bind(this));
        this.$removeButtons.forEach(function (button) {
            button.addEventListener("click", SELF.Events.removeTaskClick.bind(SELF));
        });
    },
    //função responsável por buscar os valores salvos no LocalStorage, a partir do "inputTaskEnter" linha 75
    getLocalStorage: function () {
        var TASKSSTORAGED = localStorage.getItem("tasks");
        this.tasksList = JSON.parse(TASKSSTORAGED);
    },
    //função responsável por criar a lista de tarefas a partir dos dados inseridos no array 'tasksList' (linha 02),que foi gerado através do "getLocalStorage" linha 39
    buildTaskList: function () {
        var html = "";
        this.tasksList.forEach(function (listItem) {
            html += "\n        <li>\n          <div class=\"check\"></div>\n          <label for=\"\" class=\"task\">" + listItem.taskName + "</label>\n          <button class=\"btn-remove\" data-task=\"" + listItem.taskName + "\"><i class=\"fas fa-trash-alt\"></i></button>\n        </li>\n       ";
        });
        this.$list.innerHTML = html;
        this.domSelectors();
        this.bindEvents();
    },
    //seção responsável por armazenar todas as funções de eventos isolados
    Events: {
        checkButtonClick: function (e) {
            var LI = e.target.parentNode;
            var ISDONE = LI.classList.contains("done");
            //transforma o botão em toogle on-off pra classe 'done' => caso exista ele remove, caso não exista ele adiciona
            ISDONE ? LI.classList.remove("done") : LI.classList.add("done");
        },
        inputTaskEnter: function (e) {
            var KEY = e.key;
            var input = e.target;
            var task = input.value;
            if (KEY === "Enter" && task.length > 0) {
                this.$list.innerHTML += "\n            <li>\n              <div class=\"check\"></div>\n              <label for=\"\" class=\"task\">" + task + "</label>\n              <button class=\"btn-remove\" data-task=\"" + task + "\"><i class=\"fas fa-trash-alt\"></i></button>\n            </li>\n         ";
                input.value = "";
                this.domSelectors();
                this.bindEvents();
                var SAVEDTASKS = localStorage.getItem("tasks");
                var SAVEDTASKSOBJ = JSON.parse(SAVEDTASKS);
                var TASKOBJ = __spreadArray([{ taskName: task }], SAVEDTASKSOBJ, true);
                localStorage.setItem("tasks", JSON.stringify(TASKOBJ));
            }
        },
        removeTaskClick: function (e) {
            var LI = e.target.parentElement.parentElement;
            var TASKTOBEREMOVED = e.target.parentElement.dataset["task"];
            var NEWTASKSLIST = this.tasksList.filter(function (item) { return item.taskName !== TASKTOBEREMOVED; });
            localStorage.setItem("tasks", JSON.stringify(NEWTASKSLIST));
            LI.classList.add("removed");
            setTimeout(function () {
                LI.classList.add("hidden");
            }, 500);
        },
    },
};
MAIN.init();
