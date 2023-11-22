function FormValidate(form) {
    const SUCCESS_CLASS_NAME = 'success';
    const ERROR_CLASS_NAME = 'error';
    const ERROR_ITEM_CLASS_NAME = 'error__item';
    const FORM_CONTROL_CLASS_NAME = 'form-group';

    this.sended = null;
    this.success = null;
    this.elements = form.elements;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.checkFormElement();
        this.checkForm();
        this.disableForm();
        this.sended = true;
    })

    this.checkFormElement = function () {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            const reqMessage = element.dataset.req;
            const minMessage = element.dataset.min_message;
            const emailMessage = element.dataset.email;
            this.clearError(element);

            if (reqMessage) {
                this.required(element, reqMessage);
            }
            if (minMessage) {
                this.minLength(element, minMessage);
            }
            if (emailMessage) {
                this.email(element, emailMessage);
            }
        }
    }

    this.checkForm = function (element) {
        const errorElements = form.querySelectorAll(`.${ERROR_CLASS_NAME}`);
        this.success = errorElements.length === 0;

        if (this.success) {
            form.classList.add(SUCCESS_CLASS_NAME);
            let formFields = form.querySelectorAll("." + FORM_CONTROL_CLASS_NAME);
            for (let i = 0; i < formFields.length; i++) {
                formFields[i].classList.add(SUCCESS_CLASS_NAME);
            }
            console.log('Form data:', this.getFormData());
            console.log('Method - ', form.method, 'Action - ', form.action);
        }
    }

    this.getFormData = function () {
        const formData = {};
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            formData[element.name] = element.value;
        }
        return formData;
    }

    this.required = function (element, reqMessage) {
        if (element.value.length === 0) {
            this.errorTemplate(element, reqMessage)
        }
    }

    this.minLength = function (element, minMessage) {
        const minLength = element.dataset.min_length;
        if (element.value.length < minLength) {
            this.errorTemplate(element, minMessage);
        }
    }

    this.email = function (element, emailMessage) {
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regEmail.test(element.value)) {
            this.errorTemplate(element, emailMessage);
        }
    }

    this.errorTemplate = function (element, message) {
        const parent = element.closest(`.${FORM_CONTROL_CLASS_NAME}`);
        if (parent.classList.contains(ERROR_CLASS_NAME) === false) {
            parent.classList.add(ERROR_CLASS_NAME);
            parent.insertAdjacentHTML('beforeend', `<small class = "${ERROR_ITEM_CLASS_NAME}">${message}</small>`)
        }
        //console.log(parent);
    }

    this.clearError = function (element) {
        const parent = element.closest(`.${FORM_CONTROL_CLASS_NAME}`);
        if (parent !== null && parent.classList.contains(ERROR_CLASS_NAME)) {
            parent.classList.remove(ERROR_CLASS_NAME);
            parent.querySelector(`.${ERROR_ITEM_CLASS_NAME}`).remove();
        }
    }

    FormValidate.prototype.disableForm = function () {
        if (this.success) {
            const formFields = form.querySelectorAll("." + FORM_CONTROL_CLASS_NAME);
            for (let i = 0; i < formFields.length; i++) {
                formFields[i].querySelector('input, textarea, select, button').setAttribute('disabled', 'disabled');
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const regForm = new FormValidate(document.querySelector('.js--reg_form'));
    document.querySelector('.js--check').addEventListener('click', function () {
        const result =  {sent: regForm.sended, success: regForm.success};
        console.log(result);
    })
})