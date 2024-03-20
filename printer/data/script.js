/*----------------------------------------------------------------------------------------------------

	TEMPLATE CONSTRUCTORS

----------------------------------------------------------------------------------------------------*/

function create_element_from_template(id){

	//CREATES AN ELEMENT BASED ON THE TEMPLATE DATA IN THE HTML DOCUMENT
	const template = document.getElementById(id);
	return template.content.cloneNode(true);
}

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

	SPECIAL GETTERS

----------------------------------------------------------------------------------------------------*/

function get_menu_value(elementclass, value = "value"){
	return active_menus.at(-1).getElementsByClassName(elementclass)[0][value];
}

function get_card_value(number, elementclass, value = "value"){
	let card = card_list[number];

	return card.getElementsByClassName(elementclass)[0][value];
}

function get_card_image(number){
	return card_list[number].getElementsByClassName("card_preview")[0];
}

/*----------------------------------------------------------------------------------------------------

	IMPORTERS

----------------------------------------------------------------------------------------------------*/

function parse_card_images(e){
	//LOOP THROUGH FILES
	for(let i = 0; i < e.target.files.length; i++){
		//SEND TO PREVIEWBAY
		read_file_data(e.target.files[i],onload_cardimage);
	}

	//close menus
	if(e.target.files.length > 0){
		menu_close_all();
	}

	//CLEAR MEMORY ?
	e.target.remove();
}

function onload_cardimage(){
	//CALLED BY THE FILE READER TO LOAD THE CARD DATA INTO CARD PREVIEWS
	add_card(this.result);
}

function import_files_url(elementid){
	//THIS SERIOUSLY NEEDS TO BE REPLACED WITH THE MENU GETTER FUNCTION I MADE THE OTHER DAY FRFR
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

function parse_card_json(e){
	console.log(e.target.files[0]);
	//LOOP THROUGH FILES
	for(let i = 0; i < e.target.files.length; i++){
		read_file_text(e.target.files[i], import_from_json)
	}

	//CLOSE MENUS
	if(e.target.files.length > 0){
		menu_close_all();
	}
}

function import_from_json(){
	let data = JSON.parse(this.result);
	for(let i = 0; i < data.length; i++){
		add_card(data[i].src,data[i].count);
	}
}

/*----------------------------------------------------------------------------------------------------

	FILE READER

----------------------------------------------------------------------------------------------------*/

function user_load_files(functioncatch, multiple = false, accept = "image/jpeg, image/png, image/jpg, image/gif"){
	//ASKS FOR FILE INPUT FROM USER

	//CREATE INPUT
	let input = document.createElement("input");
	input.type = "file";

	//SET FLAGS
	input.multiple = multiple;
	input.accept = accept;

	//SET AFTER FUNCTION
	input.onchange = e => window[functioncatch](e);//import_files_after(e)

	//SEND IT
	input.click();

	//CLEAR MEMORY?
	input.remove();
}

function read_file_data(data, onload){
	//READS DATA AND SENDS IT TO A FUNCTION
	var fr = new FileReader();
	fr.onload = onload;
	fr.readAsDataURL(data);
}

function read_file_text(data, onload){
	//READS DATA AS TEXT AND SENDS IT TO ONLOAD FUNCTION
	var fr = new FileReader();
	fr.onload = onload;
	fr.readAsText(data);
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

	//UPDATE CARD COUNT
	update_card_count();
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

	//UPDATE COUNTS
	update_card_count();
}

/*----------------------------------------------------------------------------------------------------

	CARD PRINTING

----------------------------------------------------------------------------------------------------*/

function print_cards(){
	//CREATE PRINTBAY
	let printbay = document.createElement("div");
	printbay.id = "printbay";
	let onlyselected = false;
	onlyselected = get_menu_value("button_onlyselected","checked");

	//ADD CARDS TO PRINTBAY
	for(let i = 0; i < card_list.length; i++){
		let selected = get_card_value(i,"is_card_selected","checked")

		if(onlyselected == false || selected == true){
			let card = get_card_image(i);

			let amount = get_card_value(i,"input_card_count")

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
	//CHECK IF THERE ARE EVEN CARDS
	if(card_list.length <= 0){
		return null;
	}

	//CREATE RETURN DATA
	let data = [];

	//CHECK IF ONLY SELECTED
	let onlyselected = false;
	onlyselected = get_menu_value("button_onlyselected","checked");


	for(let i = 0; i < card_list.length; i++){

		let selected = get_card_value(i,"is_card_selected","checked");

		if(onlyselected == false || selected == true){
			let carddata = {}

			//get quantity
			carddata.count = get_card_value(i,"input_card_count");
	
			//get source
			carddata.src = get_card_image(i).src;
	
			//push
			data.push(carddata);
		}
	}

	//download
	user_download_file("cards.json",JSON.stringify(data,undefined,2),"text/plain");

	//close menus
	menu_close_all();
}

function user_download_file(filename, data, contenttype){
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

//i think i have a better way of doing this dumb bullshit.
//this will probably be removed later because its kind of just taking up space for no real reason

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

	INFO TAB

----------------------------------------------------------------------------------------------------*/

function update_card_count(){
	let count = 0;
	let selected = 0

	//GO THROUGH AND ADD UP ALL THE CARD COUNTS
	for(let i = 0; i < card_list.length; i++){
		count += parseInt(get_card_value(i,"input_card_count"));
		if(get_card_value(i,"is_card_selected","checked")){
			selected ++;
		}
	}

	//UPDATE COUNTS
	if(count > 0){
		document.getElementById("info_card_count").style.display = "inline-block"
		document.getElementById("info_page_count").style.display = "inline-block"

		document.getElementById("info_card_count").innerHTML = count + " cards";
		document.getElementById("info_page_count").innerHTML = Math.ceil(count/9) + " pages";
	}else{
		document.getElementById("info_card_count").style.display = "none"
		document.getElementById("info_page_count").style.display = "none"
	}

	if(selected > 0){
		document.getElementById("info_selection_count").style.display = "inline-block"

		document.getElementById("info_selection_count").innerHTML = selected + " selected";
	}else{
		document.getElementById("info_selection_count").style.display = "none"
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