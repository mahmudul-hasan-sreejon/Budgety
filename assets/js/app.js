
// Budget Controller
let budgetController = (function() {

    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });

        data.totals[type] = sum;
    };

    // storage for current user data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    };

    return {
        addItem: function(type, description, value) {
            let newItem, id;

            // generate transaction id
            if(data.allItems[type].length === 0) id = 0;
            else id = data.allItems[type][data.allItems[type].length - 1].id + 1;

            // create new transaction
            if(type === 'exp') newItem = new Expense(id, description, value);
            else if(type === 'inc') newItem = new Income(id, description, value);
            
            // store new transaction
            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function() {
            // calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expense

            // calculate the % of income that we spent
        }
    };

})();


// UI Controller
let UIController = (function() {

    // storage for class / id names
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let page, element;

            // prepare page html for render
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                page =
                `<div class="item clearfix" id="income-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">+ %value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }
            else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                page =
                `<div class="item clearfix" id="expense-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">- %value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }

            // replace id, description and value from the page
            page = page.replace('%id%', obj.id);
            page = page.replace('%description%', obj.description);
            page = page.replace('%value%', obj.value);

            // insert page as the last element
            document.querySelector(element).insertAdjacentHTML('beforeend', page);
        },

        clearFields: function() {
            let fields, fieldsArr;
            
            // select DOM of input description and value field
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // convert `fields` list to an array
            fieldsArr = Array.prototype.slice.call(fields);

            // clear every input fields
            fieldsArr.forEach(element => {
                element.value = "";
            });

            // focus on the description input field
            fieldsArr[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();



// Global App Controller
let controller = (function(budgetCtrl, UICtrl) {

    let updateBudget = function() {
        // calculate the budget
        budgetCtrl.calculateBudget();
        // return the budget

        // display the budget on the UI
    }

    let ctrtAddItem = function() {
        let input, newItem;
        
        // get the field input data
        input = UICtrl.getInput();

        if(input.description && input.value) {
            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();
        }
        else console.log("Validation error!!!");
    };

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        // event listener for 'return' key press
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrtAddItem();
            }
        });
        
        // event listener for button click
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);
    }

    return {
        init: function() {
            console.log('Application has started...');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// initialize app at startup
controller.init();
