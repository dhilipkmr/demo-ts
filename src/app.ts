// import ProjectList from './ProjectList';

interface Validatable {
	value: string | number,
	minLength?: number,
	maxLength?: number,
	required?: boolean,
	min?: number,
	max?: number
}

function validate(validateData: Validatable): boolean {
	let isValid = true;
	const { value, required, minLength, maxLength, min, max } = validateData;
	if (required) {
		isValid = isValid && value.toString().trim().length !== 0;
	}
	if (minLength != null && typeof value === 'string') {
		isValid = isValid && value.length > minLength;
	}
	if (maxLength != null && typeof value === 'string') {
		isValid = isValid && value.length < maxLength;
	}
	if (min != null && typeof value === 'number') {
		isValid = isValid && value > min;
	}
	if (max != null && typeof value === 'number') {
		isValid = isValid && value < max;
	}
	return isValid;
}

function autoBindThis(_: ProjectInput, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
	const fn = descriptor.value;
	return {
		enumerable: false,
		configurable: true,
		get() {
			const boundedFn = fn.bind(this);
			return boundedFn;
		}
	}
}

class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;

	constructor(private type: 'active' | 'finished') {
		this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;
		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;
		this.attach();
		this.renderContent();
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}
}

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLElement;
	formElement: HTMLFormElement;
	titleElement: HTMLInputElement;
	descElement: HTMLTextAreaElement;
	peopleElement: HTMLInputElement;
	// addProjectBtn: HTMLButtonElement;

	constructor() {
		this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;
		const importedNode = document.importNode(this.templateElement.content, true);
		this.formElement = importedNode.firstElementChild as HTMLFormElement;
		this.titleElement = this.formElement.querySelector('#title') as HTMLInputElement;
		this.descElement = this.formElement.querySelector('#description') as HTMLTextAreaElement;
		this.peopleElement = this.formElement.querySelector('#people') as HTMLInputElement;
		// this.addProjectBtn = this.formElement.querySelector('#addProjectBtn') as HTMLButtonElement;
	
		this.formElement.id = "user-input";
		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void{
		const title = this.titleElement.value;
		const desc = this.descElement.value;
		const people = this.peopleElement.value;

		const titleValidatable: Validatable = {
			value: title,
			required: true
		};
		const descValidatable: Validatable = {
			value: desc,
			required: true,
			minLength: 10,
			maxLength: 20
		};
		const peopleValidatable: Validatable = {
			value: people,
			required: true,
			min: 3,
			max: 10
		};
		if (
			!validate(titleValidatable) ||
			!validate(descValidatable) ||
			!validate(peopleValidatable)
		) {	
			alert('Invalid entered values');
			return;
		} else {
			return [title, desc, +people];
		}
	}

	private clearInputContent() {
		this.titleElement.value = '';
		this.descElement.value = '';
		this.peopleElement.value = '';
	}

	@autoBindThis
	private handleSubmit(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			console.log({ title, description, people });
			this.clearInputContent();
		}
	}

	private configure() {
		this.formElement.addEventListener('submit', this.handleSubmit);
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
	}
}

const p = new ProjectInput();
const active = new ProjectList('active');
const finished = new ProjectList('finished');