/*----------------------------------------------------------------------------------------------------

	VARIABLES

----------------------------------------------------------------------------------------------------*/
var cardnum = 0;

/*----------------------------------------------------------------------------------------------------

	CARD LOADERS

----------------------------------------------------------------------------------------------------*/
//LOADS CARD, TAKES SRC AS INPUT
function loadcard(src){
	//GET PREVIEW BAY
	const previews = document.getElementById("previewbay");
	if(src != ""){
		//CREATE IMAGE
		let img = document.createElement("img");
		img.src = src;
		img.classList.add("previewcard");

		img.id = "card_image" + cardnum;

		//CREATE HOLDER
		let holder = document.createElement("div");
		holder.classList.add("cardholder")
		holder.appendChild(img);

		//ADD CONTROLS
		holder.appendChild(create_controls(cardnum));

		//SET ID1

		holder.id = "card_holder" + cardnum;
		cardnum++;

		//ADD TO DOM
		previews.appendChild(holder);
	}
}

/*----------------------------------------------------------------------------------------------------

	CARD CONTROLS

----------------------------------------------------------------------------------------------------*/
//CREATES CARD CONTROLS
function create_controls(number){
	//CONTROLS
	let control_holder = document.createElement("div");

	//CREATE CARD SELECTION BUTTON
	let button_select = document.createElement("input");
	button_select.type = "checkbox"

	control_holder.appendChild(button_select);

	//CREATE DELETION BUTTON
	let button_delete = document.createElement("input");
	button_delete.type = "button";
	button_delete.value = "DELETE";
	button_delete.onclick = function(){delete_card("card_holder" + number);};

	control_holder.appendChild(button_delete);

	control_holder.appendChild(document.createElement("br"));

	//CREATE CARD COUNT BUTTONS
	let button_count = document.createElement("input");
	button_count.type = "number"
	button_count.value = 1;
	button_count.style.width = "3rem"
	button_count.id = "card_counter" + number

	control_holder.appendChild(button_count);
	
	return control_holder;
}

//DELETE CARD
function delete_card(id){
	console.log("TEST");
	document.getElementById(id).remove();
}

/*----------------------------------------------------------------------------------------------------

	LOAD FILES

----------------------------------------------------------------------------------------------------*/
//GRABS FILES FROM INPUT
function loadfrominput(inputid){
	//GET INPUT
	const input = document.getElementById(inputid);
	if(input.value != ""){
		//LOOP THROUGH CARDS
		const list = input.value.split("\n");
		for(let i = 0; i< list.length; i++){
			loadcard(list[i]);
		}
		//loadcard(input.value);
		input.value = "";
	}
}

/*----------------------------------------------------------------------------------------------------

	CARD PRINTING

----------------------------------------------------------------------------------------------------*/
function printcards(){
	//GET THE LIST OF CARDS
	let cardstoprint = document.body.getElementsByClassName("previewcard");

	//GET PRINTBAY
	const printbay = document.getElementById("printbay");

	//CLONE ALL THE CARDS THAT ARE LOADED
	for(let i = 0; i < cardstoprint.length; i++){

		//GET NUMBER OF COPIES TO PRINT
		let amount = document.getElementById("card_counter" + cardstoprint[i].id.split("card_image")[1]).value;
		
		for(let j = 0; j < amount; j++){
			//CREATE CLONE
			let clone = cardstoprint[i].cloneNode(true);

			//SET CLONES CLASS
			clone.classList.replace("previewcard","printcard");

			//ADD CLONES TO PRINTBAY
			printbay.appendChild(clone);
		}
	}

	//PRINT
	window.print();

	//CLEAR PRINTBAY
	printbay.innerHTML = "";
}

for(let i = 0; i < 18 * 2; i++){
	//loadcard("https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/WXDi-D04-014[EN].jpg");
}





function loadfiles(){
	let input = document.getElementById("fileinput");
	for(let i = 0; i < input.files.length; i++){
		console.log(input.files[i]);

		var fr = new FileReader(); 
		fr.readAsDataURL(input.files[i]);
		fr.addEventListener("load",function(){
			loadcard(this.result);
		})
	}
}


/*----------------------------------------------------------------------------------------------------

	FLOATERS

----------------------------------------------------------------------------------------------------*/
function show_floater(id){
	document.getElementById("floater_holder").style.display = "grid";
	document.getElementById(id).style.display = "block";
}

function close_floaters(){
	document.getElementById("floater_holder").style.display = "none";
	let elements = document.getElementsByClassName("control_floating");
	for(let i = 0; i < elements.length; i++){
		elements[i].style.display = "none";
	}
}



function testsave(){
	let file = new Blob(["help","me","please"],{type:"text"})
	let url = URL.createObjectURL(file);

	let a = document.createElement("a");
	a.href = url;
	a.download = "test"
	document.body.appendChild(a);
	a.click();
}


/*----------------------------------------------------------------------------------------------------

	SAVE OUT TO JSON

----------------------------------------------------------------------------------------------------*/
function save_json(){
	//LOOP THROUGH CARDS
	let data = [];
	let cardstosave = document.body.getElementsByClassName("previewcard");
	for(let i = 0; i < cardstosave.length; i++){
		//CONSTRUCT DATA
		let inputdata = {};
		inputdata["src"] = cardstosave[i].src;
		
		//LOAD INTO OUR OUTPUT DATA
		data.push(inputdata);
	}

	//TEST
	console.log(data);

	//SAVE OUT
	let file = new Blob([JSON.stringify(data,null,4)],{type:"text/plain"});
	let url = URL.createObjectURL(file);
	let a = document.createElement("a");
	a.href = url;
	a.download = "cards.txt";
	//document.body.appendChild(a);
	a.click();
}