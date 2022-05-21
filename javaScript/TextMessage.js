<<<<<<< HEAD
class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {

        // creating the element
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        //creating Inner div for Text
        this.element.innerHTML = (`
            <p class="TextMessage_p" >${this.text}</p>
            <button class="TextMessage_button">Next</button> `)
    }

    main(container) {
        this.createElement();
        container.appendChild(this.element)
    }

=======
class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {

        // creating the element
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        //creating Inner div for Text
        this.element.innerHTML = (`
            <p class="TextMessage_p" >${this.text}</p>
            <button class="TextMessage_button">Next</button> `)
    }

    main(container) {
        this.createElement();
        container.appendChild(this.element)
    }

>>>>>>> 4fed23dfe4298a5a8a86e542e20805c97a23173f
}