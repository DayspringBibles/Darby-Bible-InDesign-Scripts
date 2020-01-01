﻿function placeText(myFiles, size) {	/*		1. get text		2. insert all reference material		3. flow all pages		4. process reference material		5. remove extra pages		Text needs to all flow before processing references material		as in some cases when ID recalculates text position when adding new frames		things can shift by a few words and make items out of place.	*/	var i,currentPage = myDocument.pages[0],prevFrame,footnote_frame_col_1,myFrame;		f2 = f1 = f2_1 = f1_1 = 1;	for (i = 0; i < myFiles.length; i++) {		myq = 1;		lastdate = '';		lastChapter = '';		lastNote = '';		//$.writeln("starting file " + myFiles[i].name)		//$.writeln("on page: " + currentPage.name + " at: " + end())		// get file		myFile = myFiles[i];		// set var		var chapter_number = last_chapter_number = currentDate = "";		// if not first file add new page		currentPage = i > 0 ? timeit(create_page,[myDocument.pages[-1]]) : currentPage = timeit(create_page);		myFrame = currentPage.textFrames.itemByName('frame1');		// place text		myFrame.place(myFile, false);		// get book name and remove from text		book_name = timeit(get_book_name,[myFrame]);		// remove page # on first page		size === "small" && currentPage.itemByName('page-number').remove();		heading = timeit(get_content_array,['heading']);		cross = timeit(get_content_array,['cross']);		note = timeit(get_content_array,['note']);		date = timeit(get_content_array,['date']);		//note = note.reverse()		$.writeln(note)		timeit(format_text,[myFrame]);		firstFrame = myFrame;		// if size is large, add next text frame, then move to next page.		size === "large" && myFrame = myFrame.nextTextFrame;		// flow text		f=0;		while (myFrame.overflows) {			// add next page			currentPage = timeit(create_page,[currentPage]);			// if this is the first page of the book then we can add the			// book name box and delete the page #.. for small size.			f === 0 && size === "small" && currentPage.itemByName('page-number').remove();			// if size is large, add next text frame, then move to next page.			myFrame = size === "large" ? currentPage.textFrames.itemByName('frame2') : myFrame = currentPage.textFrames.itemByName('frame1');			//if (f == '0'){break}			f++;		}		// put reference material in the correct place		myFrame = firstFrame;		//break;		while (myFrame && myFrame.contents.length > 0){			timeit(new_foot,[myFrame]);			timeit(twoColMetricalFix,[myFrame]);			// sometimes when adding footnotes the last frame will overflow.			// if it does add a new page after. only if it is a full page and not a			// modified last page with "balance frames" function. this is not implemented yet...			// need to find it in action :)            if (myFrame.name == 'frame1' && myFrame.parentPage.textFrames.itemByName('frame2').overflows && !myFrame.parentPage.textFrames.itemByName('frame2').nextTextFrame) {            	//$.writeln(currentPage.textFrames.itemByName('frame2').geometricBounds)				nextCurrentPage = timeit(create_page,[myFrame.parentPage]);			}			// // balance frames when finished footnotes			 try{                if (!myFrame.nextTextFrame.nextTextFrame) {                	// if the frame overflows, there are too many footnotes.                    // balance frames when finished footnotes                    timeit(balanceFrames,[myFrame.nextTextFrame]);                    // move up foot frame on last page is needed.         	    	timeit(adjustFootFrame);                }	          } catch(e){}			// if(myFrame.parentPage.name ==1){asdfasd;}            // add references & section markers & verse numbers and all the cool stuff			timeit(new_ref,[myFrame]);			(myFrame.name == 'frame2' || (size=="small" && myFrame.parentPage.side == PageSideOptions.RIGHT_HAND)) && timeit(change_style_on_headings_in_col_2,[myFrame]);			myq !== 1 && timeit(create_page_heading,[myq, myFrame]);			timeit(release_anchored_objects);			// insert a soft line break at the end of each text frame to help smooth			// out text flow issues. somehow ID reflows text when stuff later on changes.			// addin this in will help to minimize it.			// if statement - only add the line break if there is not a paragraph end.			app.findGrepPreferences = app.changeGrepPreferences = null;			app.findGrepPreferences.findWhat = "\\r";			try{				me = myFrame.lines[-1].findGrep();			}			catch(e){me='asdf';}			app.findGrepPreferences.findWhat = "$";			try{				me = myFrame.lines[-1].findGrep();			}			catch(e){}			if(me.length==0){				// if the last letter is not a space then add a hyphen.				if(myFrame.lines[-1].characters[-1].contents != " " && myFrame.lines[-1].characters[-1].contents != SpecialCharacters.DISCRETIONARY_LINE_BREAK){					myFrame.lines[-1].characters[-1].insertionPoints[-1].contents ='-';				}				myFrame.lines[-1].characters[-1].insertionPoints[-1].contents = SpecialCharacters.FORCED_LINE_BREAK;			}			if (size == 'large' && myFrame.name == 'frame2'){				myq++;			}			else if (size == 'small'){myq++;}			// set last chapter number			if(myFrame.name=='frame2' || size=="small"){				lastChapter = chapter;			}			myFrame = myFrame.nextTextFrame;	//		if (myq == '12'){break}		}	}}function SaveExportClose(myFileName){	location = File($.fileName).fsName.split(slash);	location.splice(-2,4);	var pdfFolder = File(location.join(slash) + slash + 'pdf' );	var idFolder = File(location.join(slash) + slash + 'id' );	var date = new Date();	dateString = parseInt(date.getMonth())+parseInt(1) + '-' + date.getDate() + '-' +  date.getFullYear() + '_at_' + date.getHours()+ '-' + date.getMinutes();	//$.writeln(dateString)	var pdfFile = File( pdfFolder + slash + myFileName + "_" + dateString + "."+"pdf" );	var idFile = File( idFolder + slash + myFileName + "_" + dateString + "."+"indd" );	// save indesign	myDocument.save (idFile);	// save pdf	myDocument.exportFile( ExportFormat.pdfType , pdfFile , false );	myDocument.close(SaveOptions.NO);}function get_last_date(myFrame) {	try{		app.findGrepPreferences = app.changeGrepPreferences = null;		app.findGrepPreferences.findWhat = "^(?:\\d+\\s\\K)?(?:.+?)\\d+(?:.+?)?BC$";		myFinds = myFrame.findGrep();		if (myFinds) {			return "00 " + myFinds[myFinds.length - 1].contents.concat(String.fromCharCode(13));		} else {			return "";		}	} catch(e){		app.findGrepPreferences = app.changeGrepPreferences = null;		app.findGrepPreferences.findWhat = "^(?:\\d+\\s\\K)?(?:.+?)?(AD)(?:.+?)?\\d+(?:.+?)?$";		myFinds = myFrame.findGrep();		if (myFinds) {			return "00 " + myFinds[myFinds.length - 1].contents.concat(String.fromCharCode(13));		} else {			return "";		}	}}function increment(value) {	return String.fromCharCode(value.charCodeAt(0) + 1);}function RoundNumbers(doc) {	var theParas;	try {		theParas = doc.stories.everyItem().paragraphs.everyItem().getElements().slice(0);	} catch (err) {		theParas = [];	}	for (var i = 0; i < theParas.length; i++) {		try {			var theText = theParas[i];			theText.leftIndent = Math.round(theText.leftIndent * 10) / 10;		} catch (e) {}	}}function myFindFile(myFilePath) {	var myScriptFile = myGetScriptPath();	myScriptFile = File(myScriptFile);	var myScriptFolder = myScriptFile.path;	myFilePath = myScriptFolder + myFilePath;	if (File(myFilePath).exists == false) {		//Display a dialog.		myFilePath = File.openDialog("Choose the file containing your find/change list");	}	return myFilePath;}function myGetScriptPath() {	try {		myFile = app.activeScript;	} catch (myError) {		myFile = myError.fileName;	}	return myFile;}function get_content_array(file){	//$.writeln(slash)	me = File($.fileName).fsName.split(slash);	me.splice(-2,3);	file = File(me.join(slash) + slash + 'content' + slash + file + '.txt');	file.open("r");	array = [];	do {		line = file.readln().split("\t");		if (line[0].toUpperCase() == book_name.toUpperCase()) {			array.push(line);		}	} while (file.eof == false);	return array;}function get_book_name(myFrame) {	app.findGrepPreferences = app.changeGrepPreferences = null;	app.findGrepPreferences.findWhat = "<<.*?>>~b";	me = myDocument.findGrep();	if (me[0].contents) {		book_name = me[0].contents.substring(2, me[0].contents.length - 3);		app.changeGrepPreferences.changeTo = "";		myDocument.changeGrep();		return book_name;	}}