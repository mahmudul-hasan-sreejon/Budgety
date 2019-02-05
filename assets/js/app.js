
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

            if(data.allItems[type].length === 0) id = 0;
            else id = data.allItems[type][data.allItems[type].length - 1].id + 1;

            if(type === 'exp') {
                newItem = new Expense(id, description, value);
            }
            else if(type === 'inc') {
                newItem = new Income(id, description, value);
            }
            
            data.allItems[type].push(newItem);

            return newItem;
        }
    };

})();


// UI Controller
let UIController = (function() {

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
                value: document.querySelector(DOMstrings.inputValue).value
            };
            
        },

        addListItem: function(obj, type) {
            let page, element;

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

            page = page.replace('%id%', obj.id);
            page = page.replace('%description%', obj.description);
            page = page.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', page);

            // return 'return something';
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// Global App Controller
let controller = (function(budgetCtrl, UICtrl) {

    let ctrtAddItem = function() {
        let input, newItem, listItem;
        
        input = UICtrl.getInput();

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        listItem = UICtrl.addListItem(newItem, input.type);

        // console.log(listItem);
    };

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrtAddItem();
            }
        });
    
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);
    }

    return {
        init: function() {
            console.log('Application has started...');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
