var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var main = {
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
        var _this = this;
        var self = this;
        this.$checkButtons.forEach(function (button) {
            button.addEventListener("click", _this.Events.checkButtonClick);
        });
        this.$inputTask.addEventListener("keypress", self.Events.inputTaskEnter.bind(this));
        this.$btnSubmit.addEventListener("click", self.Events.inputTaskClick.bind(this));
        this.$removeButtons.forEach(function (button) {
            button.addEventListener("click", self.Events.removeTaskClick.bind(self));
        });
    },
    //função responsável por buscar os valores salvos no LocalStorage, a partir do "inputTaskEnter" linha 75
    getLocalStorage: function () {
        var tasksStoraged = JSON.parse(localStorage.getItem("tasks"));
        this.tasksList = tasksStoraged || [];
    },
    buildHtmlLi: function (inputedTask) {
        return "\n          <li>\n            <div class=\"check\"></div>\n            <label for=\"\" class=\"task\">" + inputedTask + "</label>\n            <button class=\"btn-remove\" data-task=\"" + inputedTask + "\"><i class=\"fas fa-trash-alt\"></i></button>\n          </li>\n       ";
    },
    //função responsável por criar a lista de tarefas a partir dos dados inseridos no array 'tasksList' (linha 02),que foi gerado através do "getLocalStorage" linha 39
    buildTaskList: function () {
        var _this = this;
        var html = "";
        this.tasksList.forEach(function (listItem) {
            html += _this.buildHtmlLi(listItem.taskName);
        });
        this.$list.innerHTML = html;
        this.domSelectors();
        this.bindEvents();
    },
    //seção responsável por armazenar todas as funções de eventos isolados
    Events: {
        checkButtonClick: function (e) {
            var liElement = e.target.parentNode;
            var isDone = liElement.classList.contains("done");
            //transforma o botão em toogle on-off pra classe 'done' => caso exista ele remove, caso não exista ele adiciona
            isDone
                ? liElement.classList.remove("done")
                : liElement.classList.add("done");
        },
        inputTaskEnter: function (e) {
            var inputKey = e.key;
            var input = e.target;
            var task = input.value;
            if (inputKey === "Enter" && (task === null || task === void 0 ? void 0 : task.length) > 0) {
                this.buildHtmlLi(task);
                location.reload();
                input.value = "";
                this.domSelectors();
                this.bindEvents();
                var savedTasks = localStorage.getItem("tasks") || "{}";
                var savedTasksObj = JSON.parse(savedTasks);
                var taskObj = __spreadArray([{ taskName: task }], savedTasksObj, true);
                localStorage.setItem("tasks", JSON.stringify(taskObj));
            }
        },
        inputTaskClick: function (e) {
            var input = e.target.previousElementSibling;
            var task = input.value;
            if ((task === null || task === void 0 ? void 0 : task.length) > 0) {
                this.buildHtmlLi(task);
                location.reload();
                input.value = "";
                this.domSelectors();
                this.bindEvents();
                var savedTasks = localStorage.getItem("tasks") || "{}";
                var savedTasksObj = JSON.parse(savedTasks);
                var taskObj = __spreadArray([{ taskName: task }], savedTasksObj, true);
                localStorage.setItem("tasks", JSON.stringify(taskObj));
            }
        },
        removeTaskClick: function (e) {
            var liElement = e.target.parentElement.parentElement;
            var taskToBeRemoved = e.target.parentElement.dataset["task"];
            var newTasksList = this.tasksList.filter(function (item) { return item.taskName !== taskToBeRemoved; });
            localStorage.setItem("tasks", JSON.stringify(newTasksList));
            liElement.classList.add("removed");
            setTimeout(function () {
                liElement.classList.add("hidden");
            }, 500);
        },
    },
};
main.init();
