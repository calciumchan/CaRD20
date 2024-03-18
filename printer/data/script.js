/*----------------------------------------------------------------------------------------------------

	TEMPLATE CONSTRUCTORS

----------------------------------------------------------------------------------------------------*/

function create_element_from_template(id){

	//CREATES AN ELEMENT BASED ON THE TEMPLATE DATA IN THE HTML DOCUMENT
	const template = document.getElementById(id);
	return template.content.cloneNode(true);
}

//const ele = create_element_from_template("template_menu_base");

//document.body.appendChild(ele);

function construct_template(id){
	let data = templatedata[id];

	//CREATE ELEMENT
	let element = create_element_from_template(data.template);
	

	let wrapper = undefined;
	if(data.wrapper != undefined){
		//CREATE WRAPPER
		if(data.wrapper.id != undefined){
			//FROM TEMPLATE ID
			wrapper = construct_template(data.wrapper.id);
		}else if(data.wrapper.template != undefined){
			//FROM HTML TEMPLATE
			wrapper = create_element_from_template(data.wrapper.template);
		}
	}

	//ADD PARTS
	if(data.parts != undefined){
		for(let i = 0; i < data.parts.length; i++){
			//CREATE PART
			let part = undefined;
			if(data.parts[i].id != undefined){
				//FROM TEMPLATEID
				part = construct_template(data.parts[i].id);
			}else if(data.parts[i].template != undefined){
				//FROM HTML TEMPLATE
				part = create_element_from_template(data.parts[i].template);
			}

			//ADD TO ELEMENT IF NOT UNDEFINED
			if(data.parts[i].addto != undefined){
				element.getElementById(data.parts[i].addto).appendChild(part);
			}else{
				element.appendChild(part);
			}
		}
	}

	//RETURNS
	if(wrapper != undefined){
		console.log(wrapper)
		//ADD TO WRAPPER
		if(data.wrapper.addto != undefined){
			//ADD TO ELEMENT IF NOT UNDEFINED
			wrapper.getElementById(data.wrapper.addto).appendChild(element);
		}else{
			wrapper.appendChild(element);
		}

		//RETURN WRAPPER
		return wrapper;
	}

	//RETURN ELEMENT IF NO WRAPPER EXISTS
	return element;
}

/*----------------------------------------------------------------------------------------------------

	MENUS

----------------------------------------------------------------------------------------------------*/

let active_menus = [];

function menu_open(type){
	//CONSTRUCT THE MENU
	let menu = construct_template(type);

	//ADD TO LIST
	active_menus.push(menu.getElementById("slot_menu_holder"));

	//ADD TO DOM
	document.getElementById("menus").appendChild(menu)

	return active_menus[active_menus.length -1];

}

function menu_close(){
	active_menus.pop().remove();
}

function menu_close_all(){
	while(active_menus.length > 0){
		menu_close();
	}
}

/*----------------------------------------------------------------------------------------------------

	IMPORTERS

----------------------------------------------------------------------------------------------------*/
function import_files(){
	//CREATE INPUT
	let input = document.createElement("input");
	input.type = "file";
	input.multiple = true;
	input.accept = "image/jpeg, image/png, image/jpg, image/gif";

	input.onchange = e => import_files_after(e);


	input.click();

	
}

function import_files_after(e){

	//LOOP THROUGH FILES
	for(let i = 0; i < e.target.files.length; i++){
		var fr = new FileReader(); 
		fr.readAsDataURL(e.target.files[i]);
		fr.addEventListener("load",function(){
			add_card(this.result);
		})
	}

	//CLEAR MEMORY ?
	e.target.remove();

	//close menus
	if(e.target.files.length > 0){
		menu_close_all();
	}
}

function import_files_url(elementid){
	let text = document.getElementById(elementid).value;

	if(text != undefined){
		//MAKE SURE TEXT EXISTS AND THEN SEPARATE INTO A LIST
		let list = text.split("\n");
		for(let i = 0; i < list.length; i++){
			if(list[i] != ""){
				add_card(list[i]);
			}
		}
	}

	menu_close_all();
}

/*----------------------------------------------------------------------------------------------------

	CARD LOADING

----------------------------------------------------------------------------------------------------*/

let card_list = [];

let card_number = 0;

function add_card(src, count = 1){
	//CREATE CARD HOLDER
	let element = create_element_from_template("template_card_holder")

	//SET IMAGE SOURCE
	element.getElementById("card_image").src = src;

	//GRAB THE CARD HOLDER
	let holder = element.getElementById("card_holder");

	//SET CARD COUNT
	holder.getElementsByClassName("input_card_count")[0].value = count;

	//SET ANIMATION SPEED
	holder.style.animationDuration = (0.25 + (Math.random() * .5)) + "s";

	//SET ID
	holder.id = "card_holder_" + card_number;
	card_number++;

	//SET DELETE FUNCTION
	holder.getElementsByClassName("card_button_delete")[0].onclick = function(){
		remove_card(holder.id);
	}
	
	//PUSH TO ARRAY
	card_list.push(holder);

	document.getElementById("main_previewbay").appendChild(element);
	update_card_preview_scale(document.getElementById("card_preview_scale_slider"));
}

function remove_card(id){
	//REMOVE FROM ARRAY
	for(let i = 0; i < card_list.length; i++){
		if(card_list[i].id == id){
			card_list.splice(i,1)
		}
	}

	//REMOVE FROM DOM
	document.getElementById(id).remove();
}

/*----------------------------------------------------------------------------------------------------

	CARD PRINTING

----------------------------------------------------------------------------------------------------*/

function print_cards(){
	//CREATE PRINTBAY
	let printbay = document.createElement("div");
	printbay.id = "printbay";
	let onlyselected = false;
	onlyselected = active_menus.at(-1).getElementsByClassName("button_onlyselected")[0].checked;

	//ADD CARDS TO PRINTBAY
	for(let i = 0; i < card_list.length; i++){
		let selected = card_list[i].getElementsByClassName("is_card_selected")[0].checked;

		if(onlyselected == false || selected == true){
			let card = card_list[i].getElementsByClassName("card_preview")[0];

			let amount = card_list[i].getElementsByClassName("input_card_count")[0].value;

			for(let j = 0; j < amount; j++){
				let clone = card.cloneNode(true);

				clone.id = "";
				clone.className = "printcard";
		
				printbay.appendChild(clone );
			}
		}
		
	}

	//ADD PRINT BAY TO DOM
	document.body.appendChild(printbay);

	//PRINT
	window.print();

	//REMOVE PRINT BAY AND CLOSE MENUS
	printbay.remove();
	menu_close_all();
}
/*----------------------------------------------------------------------------------------------------

	EXPORT CARD LIST

----------------------------------------------------------------------------------------------------*/

function export_cards_json(){

	//add selection later
	
	let data = [];

	for(let i = 0; i < card_list.length; i++){
		let carddata = {}

		//get quantity
		carddata.count = card_list[i].getElementsByClassName("input_card_count")[0].value;

		//get source
		carddata.src = card_list[i].getElementsByClassName("card_preview")[0].src;

		//push
		data.push(carddata);
	}

	//download
	download_file("cards.json",JSON.stringify(data),"text/plain");
}

function download_file(filename, data, contenttype){
	let a = document.createElement("a");

	let file = new Blob([data],{type:contenttype})
	
	a.href = URL.createObjectURL(file);
	a.download = filename;
	a.click();
	a.remove();
}

/*----------------------------------------------------------------------------------------------------

	CONNECTION DATA

----------------------------------------------------------------------------------------------------*/

const templatedata = {
	menu_holder:{
		template:""
	},
	menu_base:{
		template:"template_menu_base",
		wrapper:{
			template:"template_menu_holder",
			addto:"slot_menu_holder"
		}
	},
	menu_import:{
		template:"template_menu_import",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		},
		parts:[
		]
	},
	menu_import_urls:{
		template:"template_menu_import_urls",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		},
	},
	menu_import_files:{
		template:"template_menu_import_files",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		},
	},
	menu_export:{
		template:"template_menu_export",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		},
		parts:[
		]
	},
	menu_print:{
		template:"template_menu_print",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		},
		parts:[
		]
	},
	menu_examine_card:{
		template:"template_menu_examine_card",
		wrapper:{
			id:"menu_base",
			addto:"slot_menu_main"
		}
	}
}

/*----------------------------------------------------------------------------------------------------

	CONTROLS

----------------------------------------------------------------------------------------------------*/

function update_card_preview_scale(button){
	const value = button.value;
	document.documentElement.style.setProperty("--card-preview-scale",value);
}

function examine_card(element){
	let menu = menu_open("menu_examine_card");

	let img = menu.getElementsByClassName("menu_examine_card_image");

	img[0].src = element.src
}