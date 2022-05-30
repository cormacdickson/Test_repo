/*

	RDK plugin for JsPsych
	----------------------

	This code was created in the Consciousness and Metacognition Lab at UCLA,
	under the supervision of Brian Odegaard and Hakwan Lau

	We would appreciate it if you cited this paper when you use the RDK:
	Rajananda, S., Lau, H. & Odegaard, B., (2018). A Random-Dot Kinematogram for Web-Based Vision Research. Journal of Open Research Software. 6(1), p.6. DOI: [http://doi.org/10.5334/jors.194]

	----------------------

	Copyright (C) 2017  Sivananda Rajananda

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/


jsPsych.plugins["preparing-schedules"] = (function() {

	var plugin = {};

	plugin.info = {
	    name: "preparing-schedules",
	    parameters: {

		    trial_duration: {
		      type: jsPsych.plugins.parameterType.INT,
		      pretty_name: "Trial duration",
		      default: 500,
		      description: "The length of stimulus presentation"
		    },
		    response_ends_trial: {
		      type: jsPsych.plugins.parameterType.BOOL,
		      pretty_name: "Response ends trial",
		      default: true,
		      description: "If true, then any valid key will end the trial"
		    },

		    background_color: {
		      type: jsPsych.plugins.parameterType.STRING,
		      pretty_name: "Background color",
		      default: "black",
		      description: "The background of the stimulus"
		    }
	    }
	 }


	//BEGINNING OF TRIAL
	plugin.trial = function(display_element, trial) {

		//--------------------------------------
		//---------SET PARAMETERS BEGIN---------
		//--------------------------------------


		//Note on '||' logical operator: If the first option is 'undefined', it evalutes to 'false' and the second option is returned as the assignment



		//Convert the parameter variables to those that the code below can use
		var backgroundColor = trial.background_color; //Color of the background
		var progress = 0;
		var progress_step_dur = 300; //in milliseconds
		var progress_bar_width = 200;
		var progress_step_size = 5;
		var num_steps =  progress_bar_width/progress_step_size;
		var intervalID;
		var timerID;
		//--------------------------------------
		//----------SET PARAMETERS END----------
		//--------------------------------------

		//--------Set up Canvas begin-------

		//Create a canvas element and append it to the DOM
		var canvas = document.createElement("canvas");
		display_element.appendChild(canvas);


		//The document body IS 'display_element' (i.e. <body class="jspsych-display-element"> .... </body> )
		var body = document.getElementsByClassName("jspsych-display-element")[0];

		//Save the current settings to be restored later
		var originalMargin = body.style.margin;
		var originalPadding = body.style.padding;
		var originalBackgroundColor = body.style.backgroundColor;

		//Remove the margins and paddings of the display_element
		body.style.margin = 0;
		body.style.padding = 0;
		body.style.backgroundColor = backgroundColor; //Match the background of the display element to the background color of the canvas so that the removal of the canvas at the end of the trial is not noticed

		//Remove the margins and padding of the canvas
		canvas.style.margin = 0;
		canvas.style.padding = 0;
		// use absolute positioning in top left corner to get rid of scroll bars
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;

		//Get the context of the canvas so that it can be painted on.
		var ctx = canvas.getContext("2d");

		//Declare variables for width and height, and also set the canvas width and height to the window width and height
		var canvasWidth =     canvas.width = window.innerWidth;
		var canvasHeight = canvas.height = window.innerHeight;

		//Set the canvas background color
		canvas.style.backgroundColor = backgroundColor;

		//--------Set up Canvas end-------



		//--------RDK variables and function calls begin--------

		//This is the main part of the trial that makes everything run

		Draw();


		//--------RDK variables and function calls end--------



		//-------------------------------------
		//-----------FUNCTIONS BEGIN-----------
		//-------------------------------------

		//----JsPsych Functions Begin----


		//Function to end the trial proper
		function end_trial() {
		window.clearTimeout(timerID)
		 var trial_data = {

		 }
					//Remove the canvas as the child of the display_element element
			display_element.innerHTML='';

			//Restore the settings to JsPsych defaults
			body.style.margin = originalMargin;
			body.style.padding = originalPadding;
			body.style.backgroundColor = originalBackgroundColor

			//End this trial and move on to the next trial
			jsPsych.finishTrial(trial_data);

		} //End of end_trial



		//Function to update all the dots all the apertures and then draw them
		function Draw(){
			drawtext();
			drawprogressbar();
		}


		function drawprogressbar() {
        		ctx.fillStyle = 'white';
        		ctx.beginPath();
        		ctx.rect((window.innerWidth/2)-101, (window.innerHeight/2)-10, 201,15);
        		ctx.fill();


	        	intervalID = window.setInterval(update_progress,300);

		}//End of draw

		function update_progress() {
        		ctx.fillStyle = 'red';
        		ctx.beginPath();
        		ctx.rect((window.innerWidth/2)-(progress_bar_width/2), (window.innerHeight/2)-7,progress,7);
        		ctx.fill();

						progress= progress+progress_step_size;

						if (progress==progress_bar_width){
							window.clearInterval(intervalID);
							ctx.fillStyle = 'white';
							ctx.textAlign = "center";
							ctx.font = '30px sans-serif';
							ctx.fillText('Pairing complete', window.innerWidth/2, 3*(window.innerHeight/4));

							timerID = window.setTimeout(end_trial,1200);
						}
		}


		//End of draw

		function drawtext(){

						ctx.fillStyle = 'white';
						ctx.textAlign = "center";
						ctx.font = '35px sans-serif';
						ctx.fillText('Well done for completing the individual performance assessment!', window.innerWidth/2, window.innerHeight/4);
						ctx.fillText('Part 2 – the group competition task – starts shortly.', window.innerWidth/2, window.innerHeight/4 +35);

						ctx.font = '20px sans-serif';
						ctx.fillText('You are being paired with three other players: your partner (Pa), and two opponents (O1, O2).', window.innerWidth/2, window.innerHeight/2+60);
		}


}; // END OF TRIAL

//Return the plugin object which contains the trial
return plugin;
})();
