import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './CanvasDrawingModule.scss';
import Pressure from 'pressure';
import RedX from './assets/icons/uxwing_close-icon.svg';
import DrawingMenu from './components/drawing-menu/DrawingMenu';
import { save, search, loadDrawing } from './api/api';

const CanvasDrawingModule = (props) => {
	const { setShowKeyboard, keyboardText, setKeyboardText } = props;

	const [menuOpen, setMenuOpen] = useState(false);
	const [activeDrawing, setActiveDrawing] = useState({
		name: 'Drawing title',
		id: -1,
		tags: '',
	});
	const [color, setColor] = useState('');
	const [colorsVisible, setColorsVisible] = useState(false);
	const [savingState, setSavingState] = useState('not saved'); // saving, saved
	const [triggerSave, setTriggerSave] = useState(false);

	const savingRef = useRef(false);
	const colorRef = useRef('black');
	const penTypeRef = useRef('wacom'); // don't know how to tell this other than knowing ahead of time

	// variant from basic demo here:
	// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
	let canvas = false;
	var ctx = false;
	let flag = false;
	let prevX = 0;
	let currX = 0;
	let prevY = 0;
	let currY = 0;
	var y = 2;

	const colors = [
		'black',
		'white',
		'red',
		'blue',
		'green',
		'gray'
	];

	const toggleColors = () => {
		setColorsVisible(!colorsVisible);
	}

	const initPressure = () => {
		const pressures = [];

		// reducer
		// https://stackoverflow.com/a/41452260
		const average = array => array.reduce((a, b) => a + b) / array.length;

		Pressure.set('#canvas', {
			start: function(event){
				// this is called on force start
			},
			end: function(){
				// this is called on force end
			},
			startDeepPress: function(event){
				// this is called on "force click" / "deep press", aka once the force is greater than 0.5
			},
			endDeepPress: function(){
				// this is called when the "force click" / "deep press" end
			},
			change: function(force, event){
				// this is called every time there is a change in pressure
				// force will always be a value from 0 to 1 on mobile and desktop
				if (pressures.length === 5) {
					pressures.shift();
				}

				pressures.push(Math.floor(force * 5));

				y = average(pressures);
			},
			unsupported: function(){
				// NOTE: this is only called if the polyfill option is disabled!
				// this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
			}
		});
	}

	const getCtx = () => {
		return document.getElementById('canvas').getContext("2d");
	}

	const setCanvasSize = () => {
		canvas = getCanvas();

		const container = document.querySelector('.cpa__app-window');
		const header = document.querySelector('.canvas-drawing-module__header');

		let oldData;

		try {
			oldData = canvas.toDataUrl(); // this keeps throwing an error

			canvas.width = container.clientWidth - 10; // scrollbar
			canvas.height = container.clientHeight - header.offsetHeight - 10;

			let image = new Image();
			
			image.onload = function() {
				canvas.getContext("2d").drawImage(image, 0, 0);
			};

			image.src = oldData;
		} catch (error) {
			console.log('failed to recover canvas data from resize');
			// console.error(error);
		}
	}

	const isCanvasBlank = () => {
		return !getCanvas().getContext('2d')
			.getImageData(0, 0, canvas.width, canvas.height).data
			.some(channel => channel !== 0);
	}

	const init = () => {
		const container = document.querySelector('.cpa__app-window');
		const header = document.querySelector('.canvas-drawing-module__header');

		canvas = getCanvas();
		canvas.width = container.clientWidth - 10; // scrollbar
		canvas.height = container.clientHeight - header.offsetHeight - 10;
		ctx = canvas.getContext("2d");

		const penEventMap = {
			"emr": ['mousemove', 'mousedown', 'mouseup', 'mouseout'],
			"wacom": ['touchmove', 'touchstart', 'touchend', 'touchend']
		};

		console.log(penTypeRef.current);

		canvas.addEventListener(penEventMap[penTypeRef.current][0], function (e) {
			findxy('move', e)
		}, false);

		canvas.addEventListener(penEventMap[penTypeRef.current][1], function (e) {
			findxy('down', e)
		}, false);

		canvas.addEventListener(penEventMap[penTypeRef.current][2], function (e) {
			findxy('up', e)

			if (!isCanvasBlank() && !savingRef.current) { // this is because of stale variables, can use ref forgot
				setTriggerSave(true);
			}
		}, false);

		canvas.addEventListener(penEventMap[penTypeRef.current][3], function (e) {
			findxy('out', e)
		}, false);

		initPressure();
	}
	
	const isWacomPen = penTypeRef.current === 'wacom';

	const draw = () => {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.lineWidth = colorRef.current === 'white' ? 15 : y;
		ctx.stroke();
		ctx.closePath();
	}

	const erase = () => {
		var m = window.confirm("Want to clear");
		if (m) {
			// still referring to init 0 values
			let canvas = document.getElementById('canvas');
			getCtx().clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	const findxy = (res, e) => {
		if (res === 'down') {
			prevX = currX;
			prevY = currY;
			currX = (isWacomPen ? e.touches["0"].clientX : e.clientX) - canvas.offsetLeft - 90;
			currY = (isWacomPen ? e.touches["0"].clientY : e.clientY) - canvas.offsetTop - 10;

			flag = true;
		}

		if (res === 'up' || res === "out") {
			flag = false;
		}

		if (res === 'move') {
			if (flag) {
				prevX = currX;
				prevY = currY;
				currX = (isWacomPen ? e.touches["0"].clientX : e.clientX) - canvas.offsetLeft - 90;
				currY = (isWacomPen ? e.touches["0"].clientY : e.clientY) - canvas.offsetTop - 10;

				// avoid palm jumping (draws giant diagonal line from palm to pen tip)
				// this stops drawing, need to lift up pen/touch down again to continue
				if (currX > 0 && (currX > prevX + 90 || currX < prevX - 90)) {
					currX = prevX;		
					currY = prevY;
				}

				draw();
			}
		}
	}

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	}

	const getCanvas = () => document.getElementById('canvas');

	useEffect(() => {
		if (!menuOpen) {
			setShowKeyboard(false);
		}
	}, [menuOpen]);

	useEffect(() => {
		if (triggerSave && !savingRef.current && activeDrawing.name && activeDrawing.name !== 'Drawing title') {
			savingRef.current = true;
			save(activeDrawing, setSavingState, undefined, getCanvas(), setTriggerSave, undefined, savingRef);
		}
	}, [triggerSave]);

	useEffect(() => {
		if (color) {
			getCtx().strokeStyle = color;
			colorRef.current = color;
			toggleColors();
		}
	}, [color])

	useEffect(() => {
		init();

		window.addEventListener('resize', function(event) {
			// prevent this from throwing an error on resize and drawing app not active
			if (document.getElementById('canvas')) {
				setCanvasSize();
			}
		}, true);

		// disable right click sometimes triggered by palm
		document.getElementById('canvas').addEventListener('contextmenu', event => event.preventDefault());
	}, [])

	return (
		<div className="canvas-drawing-module" id="module--canvas-drawing">
			<div className="canvas-drawing-module__header">
				<button className="canvas-drawing-module__header-toggle-menu-btn" type="button" onClick={() => toggleMenu()}>Menu</button>
				<h2>{activeDrawing.name}</h2>
				<DrawingMenu
					canvas={getCanvas()}
					menuOpen={menuOpen}
					setMenuOpen={setMenuOpen}
					activeDrawing={activeDrawing}
					setActiveDrawing={setActiveDrawing}
					setSavingState={setSavingState}
					erase={erase}
					save={save}
					search={search}
					loadDrawing={loadDrawing}
					triggerSave={triggerSave}
					setTriggerSave={setTriggerSave}
					setShowKeyboard={setShowKeyboard}
					keyboardText={keyboardText}
					setKeyboardText={setKeyboardText}
				/>
			</div>
			<canvas id="canvas"/>
			<button className="canvas-drawing-module__clear-btn" type="button" title="clear drawing" onClick={() => erase()}>
				<img className="canvas-drawing-module__clear-btn-img" src={RedX} alt="clear drawing"/>
			</button>
			<div className={`canvas-drawing-module__active-color ${color} ${colorsVisible ? '' : 'open'}`} onClick={() => toggleColors()} title="click to pick color"></div>
			<div className={`canvas-drawing-module__colors ${colorsVisible ? 'open' : ''}`}>
				<div className="canvas-drawing-module__colors-container">
					{colors.map((color, index) => <div key={index} className={`canvas-drawing-module__color ${color}`} onClick={() => setColor(color)} alt={`${color}`} title={`use ${color}`}></div>)}
				</div>
			</div>
      <div className="DrawingMenu__saving-state">{savingState}</div>
			<select className="canvas-drawing-module__select-pen-type" onChange={(e) => penTypeRef.current = e.target.value}>
				{['wacom', 'emr'].map((type, index) => <option key={index} value={type}>{type}</option>)}
			</select>
		</div>
	)
}

export default CanvasDrawingModule;
