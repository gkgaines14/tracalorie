//Storage Controller
const StorageCtrl = (function(){
    
    
    //Public Methods
    
    return {
        storeItem: function(item){
            let items;

            // Check if any items in local storage
            if(localStorage.getItem('items')===null){
                items = [];
                //Push new item
                items.push(item)
                //set local storage
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'))

                //Push new item
                items.push(item)

                //Reset local storage
                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items')===null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items

          },

          updateItemStorage: function(updatedItem){
              let items = JSON.parse(localStorage.getItem('items'));

              items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem)
                }
              });
              localStorage.setItem('items',JSON.stringify(items));
          },

          deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

              items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index,1)
                }
              });
              localStorage.setItem('items',JSON.stringify(items));
          },

          clearItemsFromStorage: function(){
              localStorage.removeItem('items');
          }
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories){
        this.id= id
        this.name = name
        this.calories = calories
    }

    //Data Structure / State
    const data = {
        // items: [
        //     // {id:0,name:'Steak Dinner',calories:1200},
        //     // {id:1,name:'cookie',calories:400},
        //     // {id:2,name:'eggs',calories:300}
            
        // ],

        items:StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }



    //Public methods
    return {
        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            let ID;
            //create ID
            if(data.items.length>0){
                ID = data.items[data.items.length-1].id+1
            }else{
                ID = 0
            }

            //calories to number
            calories = parseInt(calories)

            //create new item
            newItem = new Item(ID,name,calories)

            //add to items array
            data.items.push(newItem)

            return newItem

        },

        getItemById: function(id){
            let found = null;

            //loop through the items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })

            return found;
        },

        updateItem(name, calories){
            //calories to number
            calories = parseInt(calories)

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found
        },

        deleteItem: function(id){
            //Get IDs
            ids = data.items.map(function(item){
                return item.id
            })

            
            // //Get the index
            const index = ids.indexOf(id);
            
            // // remove items
            data.items.splice(index,1);
            // console.log('hi')

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            console.log(totalCalories)

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();

            //Delete from UI -Greg version
            // UICtrl.populateItemList(data.items)

        },

        clearAllItems: function(){
            data.items = []
            data.totalCalories = 0
            data.currentItem = null
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem
        },

        getTotalCalories: function(){
            let total = 0;

            //loop through and sum item calories
            data.items.forEach(function(item){
                total+=item.calories;
            })

            //set total cal in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },


        logData: function(){
            return data;
        }

    }


})();

//UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn:'.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'

    }



    //Public methods
    return {
        populateItemList(items){
            let html=''
            items.forEach(function(item){
                html+=`<li id ="item-${item.id}" class="collection-item"> <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`
            })
            
            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = "collection-item";
            //add ID
            li.id = `item-${item.id}`;
            //add HTML
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            console.log(listItems);

            //Turn Node list into an array
            listItems = Array.from(listItems);
            console.log(listItems)

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    console.log(itemID)
                    document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                }
            })


        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })

        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(cal){
            document.querySelector(UISelectors.totalCalories).innerHTML = cal;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        getSelectors: function(){
            return UISelectors;
        }

    }

})();

//App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl){
    
    //Load event listners
    const loadEventListners = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
    
        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which ===13){
                e.preventDefault();
                return false
            }
        });
    
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click',backButton);
        
        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

    }



    //Add item submit
    const itemAddSubmit = function(e){
       //Get form input from UI Controller
       const input = UICtrl.getItemInput();
       //Check for valid entries
       if(input.name !==''&& input.calories !==''){
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem)
            // console.log('this')
            // StorageCtrl.storeItem(newItem)

            //clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    
    //Click item to edit
    const itemEditClick = function(e){
        
        if(e.target.classList.contains('edit-item')){
            //Get list item id (item-0, item-1, etc)
            const listId = e.target.parentNode.parentNode.id;
            
            //Break into array

            const listIdArray = listId.split('-');
            const id = parseInt(listIdArray[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set to current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add edit item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //Update item Submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem)

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();

    }

    //Delete Button
    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete item
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        e.preventDefault();
    }

    //Clear Items event
    const clearAllItemsClick = function(){
        //Delete all items from the data structure
        ItemCtrl.clearAllItems();

        //Remove from UI
        UICtrl.removeItems();

        //Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        //Hide the UL
        UICtrl.hideList();
    }

    //Back Button
    const backButton = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }
    
    //Public methods
    return {
        init:function(){
            //clear edit state / set initial state
            UICtrl.clearEditState();

            console.log('Inititalizing App...');
            
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //populate list with items
                UICtrl.populateItemList(items);
            }
            
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event Listeners
            loadEventListners();

        }
    }

})(ItemCtrl,StorageCtrl, UICtrl);


App.init();
