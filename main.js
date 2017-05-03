'use strict';

/*
	Utilities
*/
const showRangeValue = () => {
	const elements = Array.from(document.querySelectorAll('input[type="range"]'));
	if (!elements) return;

	const displayValue = (element) => {
		const parser = new DOMParser();
		const value = element.value;
		const label = document.querySelector(`label[for="${element.getAttribute('id')}"]`);
		label.innerHTML = `<span class="js-range-value"></span>`;
		const valueLabel = document.querySelector('.js-range-value');
		valueLabel.textContent = element.value;
	};

	elements.forEach(element => {
		displayValue(element);
		element.addEventListener('change', function() {
			displayValue(element);
		});
	});

};

/* TODO:

	show/hide on load
	check form submits with required fields hidden/disabled

*/

const getInputType = (input) => (input.getAttribute('type') || input.nodeName).toLowerCase();
const hiddenClass = 'hidden';

const setState = (element, show) => {

	const method = show? 'remove' : 'add';
	element.classList[method](hiddenClass);

	// Disable hidden form elements
	const formElements = Array.from(element.querySelectorAll('input'));
	if (formElements) formElements.forEach(formElement => show ? formElement.removeAttribute('disabled') : formElement.setAttribute('disabled', 'true'));

};

const checkCondition = (input, element, showIf) => {

	const type = getInputType(input);
	let show;

	if (type === 'radio') show = input.checked && showIf.indexOf(input.value) > -1;
	if (type === 'select') show = showIf.indexOf(input.options[input.selectedIndex].value) > -1;
	if (type === 'range') {
		const value = parseInt(input.value, 10);
		show = (value > parseInt(showIf[0], 10) && value < parseInt(showIf[1], 10));
	}

	setState(element, show);

};

const handle = (control) => {
	const elements = Array.from(document.querySelectorAll(`[data-controlled-by="${control.dataset.controls}"]`)) || null;
	if (!elements) return;
	elements.forEach(element => {
		const showIf = element.dataset.showIf.split(',');
		checkCondition(control, element, showIf);
	});
};

const dynamicForm = () => {
	const controls = Array.from(document.querySelectorAll('[data-controls]')) || null;
	if (!controls) return;

	controls.forEach(control => {
		handle(control);
		control.addEventListener('change', function() {
			handle(control);
		});
	});

};
showRangeValue();
dynamicForm();
