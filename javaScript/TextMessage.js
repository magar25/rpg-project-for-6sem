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

        //adding event listener to the mouse button so we can click it 
        this.element.querySelector("button").addEventListener("click", () => {
            //close the text message
            this.done();
        });

        //adding event listener to the enter key 
        this.actionListener = new keyPressListener("Enter", () => {
            this.actionListener.unbind();
            this.done();
        })
    }

    //method for done
    done() {
        this.element.remove();
        this.onComplete();
    }

    main(container) {
        this.createElement();
        container.appendChild(this.element)
    }

}