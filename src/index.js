document.addEventListener("DOMContentLoaded", function() {
    const quoteList = document.getElementById("quote-list");
    const quoteForm = document.getElementById("new-quote-form");

    function fetchQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
            .then(response => response.json())
            .then(quotes => {
                quoteList.innerHTML = ""; 
                quotes.forEach(quote => renderQuote(quote));
            });
    }

    function renderQuote(quote) {
        const li = document.createElement("li");
        li.classList.add("quote-card");

        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `;

        const likeButton = li.querySelector(".btn-success");
        likeButton.addEventListener("click", () => likeQuote(quote, likeButton));

        const deleteButton = li.querySelector(".btn-danger");
        deleteButton.addEventListener("click", () => deleteQuote(quote.id, li));

        quoteList.appendChild(li);
    }

    fetchQuotes(); 

    quoteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newQuote = document.getElementById("new-quote").value;
        const author = document.getElementById("author").value;

        const quoteData = { quote: newQuote, author: author, likes: [] };

        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quoteData)
        })
        .then(response => response.json())
        .then(newQuote => {
            renderQuote(newQuote);
            quoteForm.reset();
        });
    });

    function likeQuote(quote, likeButton) {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quoteId: quote.id })
        })
        .then(response => response.json())
        .then(() => {
            let likesCount = parseInt(likeButton.querySelector("span").textContent);
            likeButton.querySelector("span").textContent = likesCount + 1;
        });
    }

    function deleteQuote(quoteId, quoteElement) {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE"
        })
        .then(() => quoteElement.remove());
    }
});
