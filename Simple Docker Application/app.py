from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# In-memory storage for books
books = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        title = request.form.get("title").strip()
        author = request.form.get("author").strip()
        if title and author:
            books.append({"title": title, "author": author, "read": False})
        return redirect(url_for("index"))

    return render_template("index.html", books=books)

@app.route("/toggle_read/<int:book_id>")
def toggle_read(book_id):
    if 0 <= book_id < len(books):
        books[book_id]["read"] = not books[book_id]["read"]
    return redirect(url_for("index"))

@app.route("/delete/<int:book_id>")
def delete(book_id):
    if 0 <= book_id < len(books):
        books.pop(book_id)
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
