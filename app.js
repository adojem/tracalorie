// Storage Controller
const StorageCtrl = (function() {
   return {
      storeItem: function(item) {
         let items;
         // Check if any items in ls
         if (localStorage.getItem('items') === null) {
            items = [];
            items.push(item);
            // Set ls
            localStorage.setItem('items', JSON.stringify(items));
         } else {
            items = JSON.parse(localStorage.getItem('items'));
            items.push(item);
            // Re set ls
            localStorage.setItem('items', JSON.stringify(items));
         }
      },

      getItemsFromStorage: function() {
         let items = [];
         if (localStorage.getItem('items') === null) {
            items = [];
         } else {
            items = JSON.parse(localStorage.getItem('items'));
         }
         return items;
      },

      updateItemStorage: function(updatedItem) {
         let items = JSON.parse(localStorage.getItem('items'));
         items.forEach(function(item, index) {
            if (updatedItem.id === item.id) {
               items.splice(index, 1, updatedItem);
            }
         });
         localStorage.setItem('items', JSON.stringify(items));
      },

      deleteItemFromStorage: function(id) {
         let items = JSON.parse(localStorage.getItem('items'));
         items.forEach(function(item, index) {
            if (id === item.id) {
               items.splice(index, 1);
            }
         });
         localStorage.setItem('items', JSON.stringify(items));
      },

      clarItemsFromStorage: function() {
         localStorage.removeItem('items');
      }
   };
})();

// Item Controller
const ItemCtrl = (function() {
   // Item Constructor
   const Item = function(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
   };

   // Data Structure / State
   const data = {
      items: StorageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0
   };

   return {
      getItems: function() {
         return data.items;
      },

      addItem: function(name, calories) {
         let ID;
         // Create ID
         if (data.items.length > 0) {
            ID = data.items[data.items.length - 1].id + 1;
         } else {
            ID = 0;
         }
         // Calories to number
         calories = parseInt(calories);
         // Create new item
         const newItem = new Item(ID, name, calories);
         // Add to items array
         data.items.push(newItem);

         return newItem;
      },

      getItemById: function(id) {
         let found = null;
         // Loop through items
         data.items.forEach(function(item) {
            if (item.id == id) {
               found = item;
            }
         });
         return found;
      },

      updateItem: function(name, calories) {
         calories = parseInt(calories);

         let found = null;
         data.items.forEach(function(item) {
            if (item.id === data.currentItem.id) {
               item.name = name;
               item.calories = calories;
               found = item;
            }
         });

         return found;
      },

      setCurrentItem: function(item) {
         console.log(item);
         data.currentItem = item;
      },

      deleteItem: function(id) {
         ids = data.items.map(function(item) {
            return item.id;
         });

         const index = ids.indexOf(id);
         data.items.splice(index, 1);
      },

      clearAllItems: function() {
         data.items = [];
      },

      getCurrentItem: function() {
         return data.currentItem;
      },

      getTotalCalories: function() {
         let total = 0;
         data.items.forEach(item => {
            total += item.calories;
         });

         data.totalCalories = total;

         return data.totalCalories;
      },

      logData: function() {
         return data;
      }
   };
})();

// UI Controller
const UICtrl = (function() {
   const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
   };

   return {
      populateItemList: function(items) {
         let html = '';

         items.forEach(function(item) {
            html += `<li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}: </strong> <em>${
               item.calories
            } Calories</em>
                  <a href="#" class="secondary-content">
                     <i class="edit-item fa fa-pencil"></i>
                  </a>
               </li>`;
         });

         // Insert list item
         document.querySelector(UISelectors.itemList).innerHTML = html;
      },

      getItemInput: function() {
         return {
            name: document.querySelector(UISelectors.itemNameInput).value,
            calories: document.querySelector(UISelectors.itemCaloriesInput)
               .value
         };
      },

      addListItem: function(item) {
         document.querySelector(UISelectors.itemList).style.display = 'block';

         const li = document.createElement('li');
         li.className = 'collection-item';
         li.id = `item-${item.id}`;
         li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
               <i class="edit-item fa fa-pencil"></i>
            </a>`;
         document
            .querySelector(UISelectors.itemList)
            .insertAdjacentElement('beforeend', li);
      },

      updateListItem: function(item) {
         let listItems = document.querySelectorAll(UISelectors.listItems);

         listItems = Array.from(listItems);
         listItems.forEach(function(listItem) {
            const itemID = listItem.getAttribute('id');
            if (itemID === `item-${item.id}`) {
               document.querySelector(`#${itemID}`).innerHTML = `<strong>${
                  item.name
               }: </strong> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                  </a>`;
            }
         });
      },

      deleteListItem: function(id) {
         const itemID = `#item-${id}`;
         const item = document.querySelector(itemID);
         item.remove();
      },

      clearInput: function() {
         document.querySelector(UISelectors.itemNameInput).value = '';
         document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },

      addItemToForm: function() {
         document.querySelector(
            UISelectors.itemNameInput
         ).value = ItemCtrl.getCurrentItem().name;
         document.querySelector(
            UISelectors.itemCaloriesInput
         ).value = ItemCtrl.getCurrentItem().calories;
         UICtrl.showEditState();
      },

      removeItems: function() {
         let listItems = document.querySelector(UISelectors.listItems);

         listItems = Array.from(listItems);
         listItems.forEach(function(item) {
            item.remove();
         });
      },

      hideList: function() {
         document.querySelector(UISelectors.itemList).style.display = 'none';
      },

      showTotalCalories: function(totalCalories) {
         document.querySelector(
            UISelectors.totalCalories
         ).textContent = totalCalories;
      },

      clearEditState: function() {
         UICtrl.clearInput();
         document.querySelector(UISelectors.updateBtn).style.display = 'none';
         document.querySelector(UISelectors.deleteBtn).style.display = 'none';
         document.querySelector(UISelectors.backBtn).style.display = 'none';
         document.querySelector(UISelectors.addBtn).style.display = 'inline';
      },

      showEditState: function() {
         document.querySelector(UISelectors.updateBtn).style.display = 'inline';
         document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
         document.querySelector(UISelectors.backBtn).style.display = 'inline';
         document.querySelector(UISelectors.addBtn).style.display = 'none';
      },

      getSelectors: function() {
         return UISelectors;
      }
   };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
   // Load event listeners
   const loadEventListeners = function() {
      const UISelectors = UICtrl.getSelectors();

      // Add item event
      document
         .querySelector(UISelectors.addBtn)
         .addEventListener('click', itemAddSubmit);
      // Disable submit on enter
      document.addEventListener('keypress', function(e) {
         if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            return false;
         }
      });
      // Edit icon click event
      document
         .querySelector(UISelectors.itemList)
         .addEventListener('click', itemEditClick);
      // Update item event
      document
         .querySelector(UISelectors.updateBtn)
         .addEventListener('click', itemUpdateSubmit);
      // Delete item event
      document
         .querySelector(UISelectors.deleteBtn)
         .addEventListener('click', itemDeleteSubmit);
      // Back button event
      document
         .querySelector(UISelectors.backBtn)
         .addEventListener('click', UICtrl.clearEditState);
      // Clear item event
      document
         .querySelector(UISelectors.clearBtn)
         .addEventListener('click', clearAllItemsClick);
   };

   const itemAddSubmit = function(e) {
      e.preventDefault();
      // Get form input from UI Controller
      const input = UICtrl.getItemInput();
      if (input.name !== '' && input.calories !== '') {
         const newItem = ItemCtrl.addItem(input.name, input.calories);
         UICtrl.addListItem(newItem);
         const totalCalories = ItemCtrl.getTotalCalories();
         UICtrl.showTotalCalories(totalCalories);
         // Store in Local storage
         StorageCtrl.storeItem(newItem);
         UICtrl.clearInput();
      }
   };

   // Update item submit
   const itemEditClick = function(e) {
      e.preventDefault();

      if (e.target.classList.contains('edit-item')) {
         // Get list item id
         const listId = e.target.parentNode.parentNode.id;
         const listIdArr = listId.split('-');
         const id = parseInt(listIdArr[1]);
         const itemToEdit = ItemCtrl.getItemById(id);
         ItemCtrl.setCurrentItem(itemToEdit);
         UICtrl.addItemToForm();
      }
   };

   const itemUpdateSubmit = function(e) {
      e.preventDefault();

      const input = UICtrl.getItemInput();
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      // Update UI
      UICtrl.updateListItem(updatedItem);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      // Update local storage
      StorageCtrl.updateItemStorage(updatedItem);

      UICtrl.clearEditState();
   };

   // Delete button event
   const itemDeleteSubmit = function(e) {
      e.preventDefault();

      const currentItem = ItemCtrl.getCurrentItem();
      ItemCtrl.deleteItem(currentItem.id);
      UICtrl.deleteListItem(currentItem.id);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      StorageCtrl.deleteItemFromStorage(currentItem.id);

      UICtrl.clearEditState();
   };

   // Clear items event
   clearAllItemsClick = function() {
      // Delete all items from data structures
      ItemCtrl.clearAllItems();

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Remove from UI
      UICtrl.removeItems();
      // Clear from local storage
      StorageCtrl.clarItemsFromStorage();
      // Hide UI
      UICtrl.hideList();
   };

   return {
      init: function() {
         // Clear edit state / set initial set
         UICtrl.clearEditState();
         // Fetch items from data structure
         const items = ItemCtrl.getItems();
         // Check if any items
         if (items.length === 0) {
            UICtrl.hideList();
         } else {
            // Populate list with items
            UICtrl.populateItemList(items);
         }
         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         UICtrl.showTotalCalories(totalCalories);
         // Load event listenerrs
         loadEventListeners();
      }
   };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
