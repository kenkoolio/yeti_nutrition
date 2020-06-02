$(()=>{

  // TODO: This is not working yet since specific .handlebars views need to use handlebars loops, and that doesn't work in .js

  // dynamic ingredient lists general setup
  var ingredients = [];
  var one_ingredient;
  var ing_count;
  let ing_container = $('.ingredients_list').first();
  let add_ing_button = $('#add_ing_to_form_button');
  add_ing_button.click(add_ing_to_form);

  // page specific initializations
  if (window.location.href.indexOf("/admin/recipes/actions") > -1) {
    // edit recipe page
    ing_count = 0;

    // create list of all ingredients to add dynamic ingredients to recipes form
    // example: [{"id": 1, "name": "green onions"}, {"id": 2, "name": "pizza"}, {"id": 3, "name": "pepper"}];
    one_ingredient = {};
    {{#each all_ingredients}}
      one_ingredient = {};
      one_ingredient.id = "{{this.ingredient_id}}";
      one_ingredient.name = "{{this.ingredient_name}}";
      ingredients.push(one_ingredient);
    {{/each}}

    // populate recipe ingredient form with current list of its ingredients
    let existing_ingredient;
    {{#each recipe_ingredients}}
      existing_ingredient = {};
      existing_ingredient.id = "{{this.ingredient_id}}";
      existing_ingredient.name = "{{this.ingredient_name}}";
      existing_ingredient.quantity = "{{this.quantity}}";
      existing_ingredient.metric = "{{this.metric}}";
      add_ing_to_form(null, existing_ingredient);
    {{/each}}

  } else {
    // main admin page
    ing_count = 1;

    // to add dynamic ingredients to recipes form
    // example: [{"id": 1, "name": "green onions"}, {"id": 2, "name": "pizza"}, {"id": 3, "name": "pepper"}];
    one_ingredient = {};
    {{#each ingredients}}
      one_ingredient = {};
      one_ingredient.id = "{{this.ingredient_id}}";
      one_ingredient.name = "{{this.ingredient_name}}";
      ingredients.push(one_ingredient);
    {{/each}}
  }

  /** main Admin page **/
  // add new ingredient
  $('#submit_new_ingredient').click(create_new_ingredient);
  function create_new_ingredient(e) {
    e.preventDefault();

    let form = $('#new_ingredient_form');
    let route = form.attr('action');
    let ingredient_name = form.find('[name="ingredient_name"]').val();

    // check for empty input
    if (ingredient_name.length == 0) {
      alert("Ingredient name cannot be empty");
      return;
    }

    // send data
    sendJSONData(route, "POST", {ingredient_name});

  }

  // add new recipe
  $('#submit_new_recipe').click(create_new_recipe);
  function create_new_recipe(e) {
    e.preventDefault();

    let form = $('#new_recipe_form');
    let route = form.attr('action');

    let recipe_name = form.find('[name="recipe_name"]').val();
    let img_url = form.find('[name="recipe_img"]').val();       // optional
    let calories = form.find('[name="recipe_calories"]').val();
    let instructions = form.find('[name="recipe_instructions"]').val();

    // check for empty recipe inputs
    if (!recipe_name || !instructions || !calories || calories <= 0) {
      alert("New recipe form missing required fields");
      return;
    }

    // fill out recipes data
    let recipes_submission = {
      recipe_name,
      img_url,
      calories,
      instructions
    };

    // get ingredients data
    let [ingredients_valid, ingredients_submission] = extract_ingredient_data(form);

    // if ingredients are invalid, exit function
    if (!ingredients_valid) {
      alert("Missing information in ingredients");
      return;
    }

    // attach ingredients to recipes submission
    recipes_submission.ingredients = ingredients_submission;

    // send data
    sendJSONData(route, "POST", recipes_submission);
  }

  /** recipe **/
  // edit recipe
  $('#submit_edit_recipe').click(submit_edit_recipe);
  function submit_edit_recipe(e) {
    e.preventDefault();

    let form = $('#edit_recipe_form');
    let route = form.attr('action');

    let recipe_id = $('[name="rep_id"]').val();
    let recipe_name = $('[name="rep_name"]').val();
    let recipe_image = $('[name="rep_img"]').val();
    let recipe_calories = $('[name="rep_total_calories"]').val();
    let recipe_instructions = $('[name="rep_instructions"]').val();

    // check if any required recipes fields empty
    if (!recipe_name || !recipe_instructions || !recipe_calories || recipe_calories <= 0 ) {
      window.alert("Recipe form missing required fields");
      return;
    }

    // make payload
    let recipes_submission = {
      recipe_id,
      recipe_name,
      recipe_image,
      recipe_calories,
      recipe_instructions
    };

    // get ingredients data
    let [ingredients_valid, ingredients_submissions] = extract_ingredient_data(form);

    // if ingredients are invalid, exit function
    if (!ingredients_valid) {
      alert("Missing information in ingredients");
      return;
    }

    // attach ingredients to recipes submission
    recipes_submission.ingredients = ingredients_submissions;

    // send data
    sendJSONData(route, "PATCH", recipes_submission);
  }

  // delete recipe
  $('#submit_delete_recipe').click(submit_delete_recipe);
  function submit_delete_recipe(e) {
    e.preventDefault();

    if (!window.confirm("Do you really want to delete this recipe?")) {
      return;
    }

    let route = $('#edit_recipe_form').attr('action');
    let recipe_id = $('[name="rep_id"]').val();

    sendJSONData(route, "DELETE", {recipe_id}, back_to_admin_page);
  }


  /** ingredient **/
  // update ingredient
  $('#submit_edit_ingredient').click(submit_edit_ingredient);
  function submit_edit_ingredient(e) {
    e.preventDefault();

    let route = $('#edit_ingredient_form').attr('action');
    let ingredient_id = $('[name="ingredient_id"]').val();
    let ingredient_name = $('[name="ingredient_name"]').val();

    // check if empty
    if (!ingredient_name) {
      window.alert("Required form fields cannot be empty.");
      return;
    }

    sendJSONData(route, "PATCH", {ingredient_id, ingredient_name});
  }

  // delete ingredient
  $('#submit_delete_ingredient').click(submit_delete_ingredient);
  function submit_delete_ingredient(e) {
    e.preventDefault();

    if (!window.confirm("Do you really want to delete this ingredient?")) {
      return;
    }

    let route = $('#edit_ingredient_form').attr('action');
    let ingredient_id = $('[name="ingredient_id"]').val();

    sendJSONData(route, "DELETE", {ingredient_id}, back_to_admin_page);
  }


  // add ingredient to form function
  // two different ways to use:
  //  1) to load all existing ingredients of a recipe
  //  2) to add a new ingredient via button click
  function add_ing_to_form(e, existing_ingredient) {
    // increment ingredient count
    ing_count++;

    // create container div
    let ing_div = $('<div/>', {class: 'ing_div_' + ing_count});

    // create select ingredient //
    // create label
    let ing_label = $('<label/>', {for: 'ing_' + ing_count});
    ing_label.append(document.createTextNode('Ingredient #' + ing_count));  // label text
    // create select
    let ing_select = $('<select/>', {name: 'ing_' + ing_count, id: 'ing_' + ing_count});
    // create options
    ingredients.map((ingredient) => {
      ing_select.append($('<option/>', {value: ingredient.id}).append(document.createTextNode(ingredient.name)));
    })
    // add select inside label
    ing_label.append(ing_select);

    // create quantity input //
    // create label
    let qty_label = $('<label/>', {for: 'ing_qty_' + ing_count});
    qty_label.append(document.createTextNode('Quantity: '));  // label text
    // create input
    qty_label.append($('<input/>',
      {type: 'number',
      name: 'ing_qty_' + ing_count,
      id: 'ing_qty_' + ing_count,
      step: '0.01',
      value: '0.00',
      placeholder: '0.00'}));

    // create units input//
    // create label
    let unit_label = $('<label/>', {for: 'ing_metric_' + ing_count});
    unit_label.append(document.createTextNode('Units: '));
    // create input
    unit_label.append($('<input/>', {type: 'text', name: 'ing_metric_' + ing_count, id: 'ing_metric_' + ing_count}));

    // create remove button //
    let remove_button = $('<button/>', {class: 'remove_ing btn btn-sm btn-outline-danger'});
    remove_button.append(document.createTextNode('X'));
    // bind remove event
    remove_button.click(remove_ing_from_from);

    // if populating the recipe edit form,
    // insert existing ingredient information
    if (existing_ingredient && !$.isEmptyObject(existing_ingredient)) {
      // select the ingredient
      ing_select.find("[value="+ existing_ingredient.id +"]").prop("selected", true);
      // set the quantity
      qty_label.find("input").val(existing_ingredient.quantity);
      // set the metrics/units
      unit_label.find("input").val(existing_ingredient.metric);
    }

    // add ingredient select, quantity, units, and remove button to ingredient div
    ing_div.append(ing_label);
    ing_div.append(qty_label);
    ing_div.append(unit_label);
    ing_div.append(remove_button);

    // add new ingredient div to ingredients container
    ing_container.append(ing_div);

    if (e) {
      e.preventDefault();
    }
  }

  // remove ingredient from form function
  function remove_ing_from_from(e) {
    e.preventDefault();

    // this ingredient div
    let this_ing_div = $(this).parent();

    // remove this div from ingredient container
    this_ing_div.remove();
  }

  // extracts recipe ingredients list data
  function extract_ingredient_data(form) {
    // parse ingredients
    let ingredients_list_div = form.find('.ingredients_list').first();
    let ingredients_list = ingredients_list_div.children();

    // variables for data submission
    let ingredients_valid = true;  // flag to denote if ingredient form filled out properly
    let ingredients_submission = [];
    let ing_row = {};
    let ing_item;
    let ing_qty;
    let ing_metric;

    ingredients_list.each((i, ingredient_item) => {
      ingredient_item = $(ingredient_item);

      // get ingredient choice, quantity, and metric from user input
      ing_item = ingredient_item.find('select').val();
      ing_qty = ingredient_item.find(':input[type="number"]').val();
      ing_metric = ingredient_item.find(':input[type="text"]').val();

      // missing ingredient information
      if (!ing_item || !ing_qty || !ing_metric || ing_qty <= 0) {
        ingredients_valid = false;
        return;
      }

      // otherwise, ingredient forms are properly filled out, create dictionary to submit
      ing_row = {};
      ing_row.ingredient_id = ing_item;
      ing_row.quantity = ing_qty;
      ing_row.metric = ing_metric;
      ingredients_submission.push(ing_row);
    });

    // check for empty ingredients list
    if (!ingredients_submission.length) {
      ingredients_valid = false;
    }

    return [ingredients_valid, ingredients_submission];
  }

  function sendJSONData(route, method, data, on_success) {
    $.ajax({
      method: method,
      url: route,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data)
    })
    .done((msg) => {
      // inform user of success
      alert(msg);

      // success callback
      if (on_success && typeof on_success === "function") {
        on_success();
      } else {
        // default behavior: reload page
        window.location.reload(true);
      }

    })
    .fail((msg) => {
      // inform user of failed attempt
      if (msg.status >= 500) {
        // 500 error
        alert('Error 500: Oops! Something went wrong.');
      } else {
        // 400 error
        alert(msg.responseJSON);
      }
    })
  }

  function back_to_admin_page() {
    window.location.href = ("/admin");
  }
});
