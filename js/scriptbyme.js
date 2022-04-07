const ThemeSwitchBtn = document.getElementById("theme-switcher");
const body = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const addInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter")
const clearCompletedBtn = document.getElementById("clear-completed");

// #region main
function main() {
    // Theme Swithcher
    ThemeSwitchBtn.addEventListener('click', () => {
        body.classList.toggle("light");
        const iconImg = ThemeSwitchBtn.children[0];
        iconImg.setAttribute("src",
            iconImg.getAttribute("src") === "./assets/images/icon-sun.svg" ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg"
        )
    });

    // Create Element
    makeTodoElement(JSON.parse(localStorage.getItem("todos")));

    // create Drag Option
    ul.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.classList.contains("card") && !e.target.classList.contains("dragging")) {
            const draggingCard = document.querySelector(".dragging");
            const cards = [...ul.querySelectorAll(".card")];
            const currentPos = cards.indexOf(draggingCard);
            const newPos = cards.indexOf(e.target);
            if (currentPos > newPos) {
                ul.insertBefore(draggingCard, e.target);
            } else {
                ul.insertBefore(draggingCard, e.target.nextSibling);
            }
            const todos = JSON.parse(localStorage.getItem("todos"));
            const removed = todos.splice(currentPos, 1);
            todos.splice(newPos, 0, removed[0]);
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    })

    // Add ToDO to localStorage
    addBtn.addEventListener("click", () => {
        const input = addInput.value.trim();
        if (input) {
            addInput.value = "";
            const todos = !localStorage.getItem("todos") ? [] : JSON.parse(localStorage.getItem("todos"))
            let currentTodo = {
                item: input,
                isCompleted: false
            }
            todos.push(currentTodo);
            localStorage.setItem("todos", JSON.stringify(todos));
        } else {
            alert("لطفا فیلد را پر کنید.")
        }
        location.reload();
    })

    // Add Element When Press Enter On KeyBoard
    addInput.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            addBtn.click();
        }
    })

    // Sort By Category
    filter.addEventListener('click', (e) => {
        const Id = e.target.id;
        if (Id) {
            document.querySelector(".on").classList.remove("on");
            document.getElementById(Id).classList.add("on");
            ul.className = `todos ${Id}`;
        }
    })

    // remove All Checked To DOs lements
    clearCompletedBtn.addEventListener('click', () => {
        var deletedIndexes = [];
        document.querySelectorAll(".card.checked").forEach((item) => {
            deletedIndexes.push([...ul.querySelectorAll(".card")].indexOf(item));
            item.classList.add("fall");
        item.addEventListener('animationend', () => {
            item.remove();
        });
        });
        removeAllCheckedToDOs(deletedIndexes);
    })
}
// #endregion

// #region makeTodoElement
function makeTodoElement(todoArray) {
    if (!todoArray) {
        return null;
    }

    const itemsLeft = document.getElementById("items-left");

    todoArray.forEach((todoObject) => {
        //Create Html Elements Of Todo
        const card = document.createElement("li");
        const cbContainer = document.createElement("div");
        const cbInput = document.createElement("input");
        const checkSpan = document.createElement("span");
        const item = document.createElement("p");
        const clearBtn = document.createElement("button");
        const img = document.createElement("img");

        //Add Classes
        card.classList.add("card");
        cbContainer.classList.add("cb-container");
        cbInput.classList.add("cb-input", "cursor");
        checkSpan.classList.add("check");
        item.classList.add("item");
        clearBtn.classList.add("clear");
        //Add Attributes
        card.setAttribute("draggable", true);
        cbInput.setAttribute("type", "checkbox");
        img.setAttribute("src", "./assets/images/icon-cross.svg");
        img.setAttribute("alt", "Clear It");
        item.textContent = todoObject.item;

        if (todoObject.isCompleted) {
            card.classList.add("checked");
            cbInput.setAttribute("checked", "checked");
        }

        //Add EventListener
        card.addEventListener('dragstart', () => {
            card.classList.add("dragging");
        });

        card.addEventListener('dragend', () => {
            card.classList.remove("dragging");
        });

        clearBtn.addEventListener('click', (e) => {
            const currentCard = clearBtn.parentElement;
            currentCard.classList.add("fall");
            const indexOfCurrentCard = [...ul.querySelectorAll(".card")].indexOf(currentCard);
            removeToDoElement(indexOfCurrentCard);

            currentCard.addEventListener('animationend', () => {

                setTimeout(() => {
                    currentCard.remove();
                    itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
                }, 100);
            })
        });

        cbInput.addEventListener('click', () => {
            const currentCard = cbInput.parentElement.parentElement;
            const check = cbInput.checked;
            const indexOfCurrentCard = [...ul.querySelectorAll(".card")].indexOf(currentCard);
            stateTODo(indexOfCurrentCard, check);

            check ? currentCard.classList.add("checked") : currentCard.classList.remove("checked")
            itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
        })

        //Set Element by Parent Child
        clearBtn.appendChild(img);
        cbContainer.appendChild(cbInput);
        cbContainer.appendChild(checkSpan);
        card.appendChild(cbContainer);
        card.appendChild(item);
        card.appendChild(clearBtn);
        document.querySelector(".todos").appendChild(card);
    });
    itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
}
// #endregion

function removeToDoElement(index) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeAllCheckedToDOs(indexes) {
    var todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter((item, index) => {
        return !indexes.includes(index);
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

function stateTODo(index, isComplete) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].isCompleted = isComplete;
    localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', main);