
// Budget Controller
let budgetController = (function() {

    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = -1;
    };

    Expense.prototype.gerPercentage = function() {
        return this.percentage;
    };

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
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id) {
            let index;

            // find the index of the delete item from data storage
            index = -1;
            for(let i = 0; i < data.allItems[type].length; ++i) {
                if(data.allItems[type][i].id === id) {
                    index = i;
                    break;
                }
            }

            // delete item if found
            if(index !== -1) data.allItems[type].splice(index, 1);
        },

        calculateBudget: function() {
            // calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the % of income that we spent
            if(data.totals.inc > 0) data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.percentage = -1;
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(current => {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            let percentages;

            // store all the percentages
            percentages = data.allItems.exp.map(current => {
                return current.gerPercentage();
            });
            
            return percentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        budgetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLable: '.budget__title--month'
    };

    let formatNumber = function(num, type) {
        let sign;

        num = Math.abs(num);

        // add 2 decimal points
        num = num.toFixed(2);

        // add comma separators
        num = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        // let numSplit = num.toLocaleString();

        // add + or - sign before num
        sign = (type === 'exp') ? '-' : '+';
        
        return (sign + ' ' + num);
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
                `<div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }
            else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                page =
                `<div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
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
            page = page.replace('%value%', formatNumber(obj.value, type));

            // insert page as the last element
            document.querySelector(element).insertAdjacentHTML('beforeend', page);
        },

        deleteListItem: function(selectorId) {
            let element;

            // remove the child element
            element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
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

        displayBudget: function(obj) {
            let type;

            type = obj.budget > 0 ? 'inc' : 'exp';

            // update total budget
            document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLable).textContent = formatNumber(obj.totalExp, 'exp');

            // update object percentage if any
            if(obj.percentage > 0) document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + "%";
            else document.querySelector(DOMstrings.percentageLable).textContent = '---';
        },

        displayPercentages: function(percentages) {
            let fields;
            
            // select DOMs with 'item__percentage' field
            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            // convert `fields` list to an array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach((current, index) => {
                // update percentage if any
                if(percentages[index] > 0) current.textContent = percentages[index] + '%';
                else current.textContent = '---';
            });

            // convert `fields` node list to an array
            // let nodeListForEach = function(nodeList, callback) {
            //     for(let i = 0; i < nodeList.length; ++i) {
            //         callback(nodeList[i], i);
            //     }
            // };

            // nodeListForEach(fields, (current, index) => {
            //     if(percentages[index] > 0) current.textContent = percentages[index] + '%';
            //     else current.textContent = '---';
            // });
        },

        displayMonth: function() {
            let now, month, months, year;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ', ' + year;
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
        let budget = budgetCtrl.getBudget();

        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function() {
        // calculate percentages
        budgetCtrl.calculatePercentages();

        // read percentages from budget controller
        let percentages = budgetCtrl.getPercentages();

        // update percentages from budget and UI
        UICtrl.displayPercentages(percentages);
    };

    let ctrtAddItem = function() {
        let input, newItem;
        
        // get the field input data
        input = UICtrl.getInput();

        // validate then process the data
        if(input.description && input.value) {
            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function(e) {
        let itemId, type, id, temp;

        // find target element's parent element
        itemId = e.target.parentNode.parentNode.parentNode.id;

        if(itemId) {
            // split element name into sub string
            temp = itemId.split('-');

            type = temp[0];
            id = parseInt(temp[1]);

            // delete the item from data storage
            budgetCtrl.deleteItem(type, id);

            // delete the item from the UI
            UICtrl.deleteListItem(itemId);

            // update and show the new budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    };

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        // event listener for adding items
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrtAddItem();
            }
        });
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);

        // event listener for deleting items
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    return {
        init: function() {
            console.log('Application started successfully...');

            // reset data
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            UICtrl.displayMonth();

            setupEventListeners();
        }
    };

})(budgetController, UIController);

// start app
controller.init();
