﻿// script helps// http://jongware.mit.edu/idcs6js/size = 'large';if (size == "large"){	meta = {		"gutter": 4.6,		"page_height": 210,		"page_width": 175,		"top_margin": 11.4,		"bottom_margin": 11.4,		"left_margin": 13.6,		"right_margin": 13.6,		"column_width": 48.8*2,		"reference_gutter": 0	};	line_space_adder = 2.82;}else if (size == "small"){	meta = {		"gutter": 3.89,		"page_height": 178,		"page_width": 133.5,		"top_margin": 7.9,		"bottom_margin": 7.9,		"left_margin": 28.87,		"right_margin": 12.65 - 3.89,		"reference_margin":7.9,	};	line_space_adder = 2.82;}// turn off preflight. it stops text reflow from working correctly in scripts.app.preflightOptions.preflightOff = true;var os = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC": "WINDOWS";var slash = os=="WINDOWS"?'\\':'/';var bookName, chNum = '', lastChNum = '', book_name = "";var myFileList = File.openDialog('Select files to place...', undefined, true);#include "includes.jsx";app.scriptPreferences.properties = { 	//This will prevent screen refresh to the condition you… 	enableRedraw:false, 	//…set no interaction as dialogs would refresh teh screen 	userInteractionLevel:UserInteractionLevels.NEVER_INTERACT};// used to time how long entire program runs.mystarttime = new Date();// will create a separate document for each file selected in the file dialog.for (jk = 0; jk < myFileList.length; jk++) {	myDocument = timeit(document_setup,[size]);	timeit(create_paragraph_styles,[]);	timeit(create_character_styles,[]);	timeit(create_object_styles,[]);	// reset clock to time each document run time.	start();	// comment out next line & catch line (72) to ignore errors and continue.	// errors will print on screen.	//	try{	timeit(placeText,[[myFileList[jk]], size]);	//} catch(e){$.writeln(e)}	// will add the "draft" text to each page in current file.	#include "draft_layer.jsx";	// when finished, save the book and export as pdf, then close.	// comment out to leave doc open.	// SaveExportClose(myFileList[jk].name.replace('.rtf',''))}myendTime = new Date();var timeDiff = myendTime - mystarttime; //in ms// strip the mstimeDiff /= 1000;// print run time on screen.$.writeln('completed in ' + timeDiff);// turn preflight back on.app.preflightOptions.preflightOff = false;