'use strict';

/*
	Utilities
*/
// const showRangeValue = () => {
// 	const elements = Array.from(document.querySelectorAll('input[type="range"]'));
// 	if (!elements) return;
//
// 	const displayValue = (element) => {
// 		const parser = new DOMParser();
// 		const value = element.value;
// 		const label = document.querySelector(`label[for="${element.getAttribute('id')}"]`);
// 		label.innerHTML = `<span class="js-range-value"></span>`;
// 		const valueLabel = document.querySelector('.js-range-value');
// 		valueLabel.textContent = element.value;
// 	};
//
// 	elements.forEach(element => {
// 		displayValue(element);
// 		element.addEventListener('change', function() {
// 			displayValue(element);
// 		});
// 	});
//
// };

const hiddenClass = 'hidden';
const form = document.getElementById('eligibility-form');

const getInputType = (input) => (input.getAttribute('type') || input.nodeName).toLowerCase();

const setState = (element, show) => {

	const method = show ? 'remove' : 'add';
	element.classList[method](hiddenClass);

	// Disable hidden form elements
	const formElements = Array.from(element.querySelectorAll('input'));
	if (formElements) formElements.forEach(formElement => show ? formElement.removeAttribute('disabled') : formElement.setAttribute('disabled', 'true'));

};

const checkCondition = (input, element, showIf) => {

	const inputType = getInputType(input);
	let show;

	if (inputType === 'radio') show = input.checked && showIf.indexOf(input.value) > -1;
	if (inputType === 'select') show = showIf.indexOf(input.options[input.selectedIndex].value) > -1;
	if (inputType === 'range') {
		const value = parseInt(input.value, 10);
		show = (value > parseInt(showIf[0], 10) && value < parseInt(showIf[1], 10));
	}
	if (inputType === 'checkbox') show = input.checked;

	setState(element, show);

};

const handle = (control) => {
	const elements = Array.from(document.querySelectorAll(`[data-controlled-by="${control.dataset.controller}"]`)) || null;
	if (!elements) return;
	elements.forEach(element => {
		const showIf = element.dataset.showIf.split(',');
		checkCondition(control, element, showIf);
	});
};

const dynamicForm = () => {
	const controls = Array.from(document.querySelectorAll('[data-controller]')) || null;
	if (!controls) return;

	controls.forEach(control => {
		handle(control);
		control.addEventListener('change', () => {
			handle(control);
		});
	});

};
// showRangeValue();
dynamicForm();

// form.addEventListener('submit', (e) => {
// 	e.preventDefault();
// 	console.log('submitted!');
// 	const formData = new FormData(form);
// 	for (let pair of formData.entries()) {
// 		console.log(`${pair[0]}: ${pair[1]}`);
// 	}
// });
